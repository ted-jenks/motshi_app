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
import {identity} from 'react-native-svg/lib/typescript/lib/Matrix2D';
import QRCode from 'react-native-qrcode-svg';

const {NearbyMessages} = ReactNative.NativeModules;

//------------------------------------------------------------------------------

/* BODY */

class ProfilePage extends Component {
  state = {
    identity: null,
    web3Adapter: null,
    qr: false,
  };

  constructor(props) {
    super();
    this.state.identity = props.route.params.identity;
    this.state.web3Adapter = props.route.params.web3Adapter;
  }

  componentWillUnmount() {
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
    this.setState({qr: true});
    const signature = await this.state.web3Adapter.sign(this.state.identity);
    NearbyMessages.publish(
      JSON.stringify({
        identity: this.state.identity,
        signature: signature,
      }),
      res => console.log('Publish status: ', res),
    );
  };

  handleStopShare = () => {
    this.setState({qr: false});
  };

  render() {
    if (this.state.qr === false) {
      return (
        <View style={{flex: 1}}>
          <View style={styles.IDCardContainer}>
            <IdCard identity={this.state.identity} />
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
        <View style={{flex: 1}}>
          <View style={styles.IDCardContainer}>
            <QRCode value={this.state.identity.address} size={300} backgroundColor={'rgba(255,255,255,0)'}/>
          </View>
          <IconButton
            onPress={this.handleStopShare}
            iconName={'portable-wifi-off'}
            text={'STOP SHARE'}
          />
        </View>
      );
    }
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default ProfilePage;
