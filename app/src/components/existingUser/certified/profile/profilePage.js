/*
Author: Ted Jenks

React-Native component to serve as the profile page for the application.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component, useEffect} from 'react';
import {
  Alert,
  Animated,
  Image,
  PermissionsAndroid,
  Pressable,
  Text,
  View,
} from 'react-native';

// Third party packages
const Realm = require('realm');
import {
  startDiscoveringPeers,
  unsubscribeFromPeersUpdates,
  subscribeOnPeersUpdates,
  connect,
  cancelConnect,
  sendMessage,
  getConnectionInfo,
} from 'react-native-wifi-p2p';

// Local imports
import {IdentityManager} from '../../../../tools/identityManager';
import styles from '../../../../style/styles';
import IdCard from './idCard/idCard';
import CustomButton from '../../../customButton';
import FailAnimation from './failAnimation';
import SuccessAnimation from "./successAnimation";

//------------------------------------------------------------------------------

/* BODY */

class ProfilePage extends Component {
  state = {
    identity: null,
    removeListener: null,
    disconnect: null,
    devices: [],
    connect: false,

    shareDataSuccess: false,
    shareDataFailed: false,
  };

  constructor() {
    super();
    const identityManager = new IdentityManager();
    // load personal data
    identityManager
      .getID()
      .then(identity => {
        this.setState({identity});
      })
      .catch(e => console.log(e));
  }

  componentDidMount() {
    try {
      subscribeOnPeersUpdates(this.handleNewPeers);
      startDiscoveringPeers().catch(e =>
        console.warn('Failed to start discovering Peers: ', e),
      );
    } catch (e) {
      console.error('Error: ', e);
    }
  }

  componentWillUnmount() {
    unsubscribeFromPeersUpdates(this.handleNewPeers);
  }

  handleNewPeers = ({devices}) => {
    console.log('OnPeersUpdated', devices);
    this.setState({devices: devices});
  };

  _sendData = async () => {
    const connectionInfo = await getConnectionInfo();
    let fail = false;
    if (connectionInfo.groupFormed) {
      console.log('Already connected to: ', connectionInfo);
      // If connected
      await sendMessage(JSON.stringify(this.state.identity))
        .catch(e => {
          console.log('Error in sendMessage: ', e);
          this.handleShareDataFail();
          fail = true;
        })
        .finally(() => {
          if (!fail) {
            this.handleShareDataSuccess();
          }
        });
      await cancelConnect().catch(e =>
        console.log('Error in cancelConnect: ', e),
      );
      return;
    } else {
      for (const device of this.state.devices) {
        if (device.primaryDeviceType === '10-0050F204-5') {
          console.log('Connecting to: ', device);
          try {
            await connect(device.deviceAddress).catch(e =>
              console.log('Error in connect: ', e),
            );
            await getConnectionInfo();
            await sendMessage(JSON.stringify(this.state.identity))
              .catch(e => {
                console.log('Error in sendMessage: ', e);
                this.handleShareDataFail();
                fail = true;
              })
              .finally(() => {
                if (!fail) {
                  this.handleShareDataSuccess();
                }
              });
            await cancelConnect().catch(e =>
              console.log('Error in cancelConnect: ', e),
            );
            return;
          } catch (e) {
            console.log(e);
            return;
          }
        }
      }
    }
    this.handleShareDataFail();
    console.log('No valid receiving devices detected:\n', this.state.devices);
  };

  deleteAlert = () => {
    Alert.alert(
      'Delete Information',
      'Do you wish to delete all of your information?',
      [
        {text: 'Yes', onPress: () => this.props.onDelete()},
        {
          text: 'No',
          onPress: () => console.log('cancel Pressed'),
        },
      ],
    );
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
    return this.state.identity ? (
      <View style={{height: '100%'}}>
        <CustomButton text={'Verify'} onPress={this.props.onVerifierPress} />
        <CustomButton
          text={'Move account'}
          onPress={this.props.onMoveAccountPress}
        />
        <View style={{height: '73%', justifyContent: 'center'}}>
          <IdCard identity={this.state.identity} />
        </View>
        <View style={{width: '100%', alignItems: 'center'}}>
          {this.state.shareDataSuccess && (
            <SuccessAnimation onAnimationFinish={this.handleAnimationFinish} />
          )}
          {this.state.shareDataFailed && (
            <FailAnimation onAnimationFinish={this.handleAnimationFinish} />
          )}
        </View>
        <CustomButton
          text={'Share Data'}
          onPress={this._sendData}
          onLongPress={this.deleteAlert}
        />
      </View>
    ) : (
      <View />
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default ProfilePage;
