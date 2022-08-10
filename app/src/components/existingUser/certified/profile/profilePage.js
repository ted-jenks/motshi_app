/*
Author: Ted Jenks

React-Native component to serve as the profile page for the application.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import ReactNative, {Alert, View} from 'react-native';

// Local imports
import styles from '../../../../style/styles';
import IdCard from './idCard/idCard';
import FailAnimation from './failAnimation';
import SuccessAnimation from './successAnimation';
import {WifiP2pHandler} from '../../../../tools/wifiP2pHandler';
import IconButton from '../../../generic/iconButton';
import QrScanner from '../settings/moveAccount/qrScanner';
import {getDeviceNameSync} from 'react-native-device-info';

const {NearbyMessages} = ReactNative.NativeModules;

//------------------------------------------------------------------------------

/* BODY */

class ProfilePage extends Component {
  state = {
    identity: null,
    wifiP2pHandler: null,
    shareDataSuccess: false,
    shareDataFailed: false,
    web3Adapter: null,
    qr: false,
  };

  constructor(props) {
    super();
    this.state.identity = props.route.params.identity;
    this.state.web3Adapter = props.route.params.web3Adapter;
    this.state.wifiP2pHandler = new WifiP2pHandler();
  }

  componentWillUnmount() {
    this.state.wifiP2pHandler.remove();
    NearbyMessages.unpublish();
  }

  deleteAlert = () => {
    Alert.alert(
      'Delete Information',
      'Do you wish to delete all of your information?',
      [
        {text: 'Yes', onPress: () => this.props.route.params.onDelete()},
        {
          text: 'No',
          onPress: () => console.log('cancel Pressed'),
        },
      ],
    );
  };

  handleShareData = async () => {
    // this.setState({qr: true});
    const name = getDeviceNameSync();
    console.log(name);
    NearbyMessages.publish(name, res => console.log(res));
  };

  handleQrCancel = () => {
    this.setState({qr: false});
    console.log(9);
  };

  handleQrComplete = async res => {
    console.log('Name: ', res);
    this.setState({qr: false});
    try {
      const signature = await this.state.web3Adapter.sign(this.state.identity);
      const status = await this.state.wifiP2pHandler.sendData(
        {
          identity: this.state.identity,
          signature: signature,
        },
        res.data,
      );
      if (status) {
        this.handleShareDataSuccess();
      } else {
        this.handleShareDataFail();
      }
    } catch (e) {
      console.log('Unhandled Exception while sharing data: ', e);
    }
  };

  handleShareDataSuccess = () => {
    this.setState({shareDataSuccess: true});
  };

  handleShareDataFail = () => {
    this.setState({shareDataFailed: true});
  };

  handleAnimationFinish = () => {
    this.setState({shareDataFailed: false, shareDataSuccess: false});
  };

  render() {
    if (this.state.qr === false) {
      return (
        <View style={{flex: 1}}>
          <View style={styles.IDCardContainer}>
            <IdCard identity={this.state.identity} />
          </View>
          <View style={styles.sendAnimationContainer}>
            {this.state.shareDataSuccess && (
              <SuccessAnimation
                onAnimationFinish={this.handleAnimationFinish}
              />
            )}
            {this.state.shareDataFailed && (
              <FailAnimation onAnimationFinish={this.handleAnimationFinish} />
            )}
          </View>
          <IconButton
            onPress={this.handleShareData}
            iconName={'wifi-tethering'}
            text={'SHARE DATA'}
          />
        </View>
      );
    } else {
      return (
        <View style={{height: '100%', paddingTop: 40}}>
          <QrScanner
            onCancel={this.handleQrCancel}
            onSuccess={this.handleQrComplete}
          />
        </View>
      );
    }
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default ProfilePage;
