/*
Author: Ted Jenks

React-Native component to show handle the transfer of accounts to new devices.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {Alert, Pressable, Text, View} from 'react-native';

// Third party imports
import formData from 'form-data';
import fetch from 'node-fetch';

// Local imports
import Section from '../../../../generic/section';
import QrScanner from './qrScanner';
import {WifiP2pHandler} from '../../../../../tools/wifiP2pHandler';
import LoadingPage from '../../../../generic/loadingPage';
import BackArrow from '../backArrow';
import IconButton from '../../../../generic/iconButton';

// Global constants
import {MOVE_ACCOUNT_URL} from '@env';

//------------------------------------------------------------------------------

/* BODY */

class MoveAccount extends Component {
  state = {
    mounted: true,
    identity: null,
    web3Adapter: null,
    wifiP2pHandler: null,
    newAddress: null,
    qr: false,
  };
  constructor(props) {
    super();
    this.state.identity = props.identity;
    this.state.web3Adapter = props.web3Adapter;
    this.state.wifiP2pHandler = new WifiP2pHandler();
  }

  componentWillUnmount() {
    this.setState({mounted: false});
    this.state.wifiP2pHandler.remove();
  }

  errorAlert = () => {
    Alert.alert(
      'Transfer Failed',
      'Account transfer failed, please try again. You may need to cancel the' +
        ' process on your other device.',
      [{text: 'Ok', onPress: () => this.setState({newAddress: null})}],
    );
  };

  performBlockchainTransfer = async () => {
    const url = MOVE_ACCOUNT_URL;
    const headers = {
      Accept: 'application/json',
    };
    // create formData object to send via https
    const form = new formData();
    form.append('Content-Type', 'application/octet-stream');
    form.append('old_address', this.state.identity.address);
    form.append('new_address', this.state.newAddress);
    try {
      const data = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: form,
      });
      console.log(data);
      if (data.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  handleShareData = async () => {
    try {
      const status = await this.state.wifiP2pHandler.sendData(
        this.state.identity,
      );
      if (status) {
        await this.handleShareDataSuccess();
      } else {
        this.handleShareDataFail();
      }
    } catch (e) {
      console.log('Unhandled Exception while sharing data: ', e);
    }
  };

  handleShareDataSuccess = async () => {
    console.log('Data sent successfully');
    const status = await this.performBlockchainTransfer();
    if (status) {
      this.props.onDelete();
    } else {
      this.errorAlert();
    }
  };

  handleShareDataFail = () => {
    this.errorAlert();
  };

  handleSuccess = res => {
    this.setState({newAddress: res.data});
    this.setState({qr: false});
    console.log('QR scanned: ', res.data);
    this.handleShareData().catch(e =>
      console.log('Unhandled exception sending data: ', e),
    );
  };

  handleCancel = () => {
    this.setState({qr: false});
  };

  handleOpenCamera = () => {
    this.setState({qr: true});
  };

  displayContent = () => {
    if (this.state.newAddress) {
      return <LoadingPage />;
    } else if (!this.state.qr) {
      return (
        <View style={{flex: 1}}>
          <BackArrow onPress={this.props.onBack} />
          <Section title={'Move Account to a New Device'}>
            To begin the account transfer process, please select 'Import
            Account' on the new device. Then scan the QR code on the screen.
          </Section>
          <IconButton
            onPress={this.handleOpenCamera}
            iconName={'camera-alt'}
            text={'OPEN CAMERA'}
          />
        </View>
      );
    } else if (this.state.qr) {
      return (
        <QrScanner
          onCancel={this.handleCancel}
          onSuccess={this.handleSuccess}
        />
      );
    }
  };

  render() {
    return <View style={{height: '100%'}}>{this.displayContent()}</View>;
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default MoveAccount;
