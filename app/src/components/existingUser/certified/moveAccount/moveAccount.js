/*
Author: Ted Jenks

React-Native component to show handle the transfer of accounts to new devices.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component, useRef} from 'react';
import {Alert, TextInput, View} from 'react-native';

// Third party packages
const Web3 = require('web3');

// Local imports
import {IdentityManager} from '../../../../tools/identityManager';
import Section from '../../../generic/section';
import CustomButton from '../../../generic/customButton';
import QrScanner from './qrScanner';

// Global constants
import {WifiP2pHandler} from '../../../../tools/wifiP2pHandler';
import LoadingPage from '../../../generic/loadingPage';

//------------------------------------------------------------------------------

/* BODY */

class MoveAccount extends Component {
  state = {
    mounted: true,
    identity: null,
    web3Adapter: null,
    newAddress: null,
    qr: false,
  };
  constructor(props) {
    super();
    const identityManager = new IdentityManager();
    // load personal data
    identityManager
      .getID()
      .then(identity => {
        this.setState({identity});
      })
      .catch(e => console.log(e));
    this.state.web3Adapter = props.web3Adapter;
  }

  componentDidMount() {
    this.setState({
      wifiP2pHandler: new WifiP2pHandler(),
    });
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
    const r = await this.state.web3Adapter.moveAccount(this.state.newAddress);
    if (r.data === 'Invalid Address' || !r.status) {
      return false;
    } else {
      return true;
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
      this.this.props.onDelete();
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
        <View>
          <CustomButton text={'Profile'} onPress={this.props.onProfilePress} />
          <CustomButton text={'Verify'} onPress={this.props.onVerifierPress} />
          <Section title={'Move Account to a New Device'}>
            To begin the account transfer process, please select 'Import
            Account' on the new device. Then scan the QR code on the screen.
          </Section>
          <CustomButton
            text={'Open Camera'}
            onPress={this.handleOpenCamera}
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
