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
import * as Keychain from 'react-native-keychain';
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
import AnimatedLottieView from 'lottie-react-native';

// Local imports
import {IdentityManager} from '../../../../tools/identityManager';
import styles from '../../../../style/styles';
import IdCard from './idCard/idCard';

//------------------------------------------------------------------------------

/* BODY */

class ProfilePage extends Component {
  state = {
    identity: null,
    removeListener: null,
    disconnect: null,
    devices: [],
    connect: false,

    sendAnimationPosition: new Animated.Value(0),
    sendAnimationOpacity: new Animated.Value(1),
    sendAnimationSize: new Animated.Value(0),
    sent: false,

    failAnimationOpacity: new Animated.Value(1),
    failAnimationSize: new Animated.Value(0),
    failed: false,
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

  _deleteInfo = () => {
    // dev tool to delete all information and reset the app
    Keychain.resetGenericPassword(); // clear BC account info
    const identityManger = new IdentityManager(); // clear personal details in Realm
    identityManger
      .getID()
      .then(res => {
        identityManger
          .deleteAll()
          .then(this.props.onDelete)
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
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
          this._renderFailAnimation();
          fail = true;
        })
        .finally(() => {
          if (!fail) {
            this._renderSendAnimation();
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
                this._renderFailAnimation();
                fail = true;
              })
              .finally(() => {
                if (!fail) {
                  this._renderSendAnimation();
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
    this._renderFailAnimation();
    console.log('No valid receiving devices detected:\n', this.state.devices);
  };

  _deleteAlert = () => {
    Alert.alert(
      'Delete Information',
      'Do you wish to delete all of your information?',
      [
        {text: 'Yes', onPress: () => this._deleteInfo()},
        {
          text: 'No',
          onPress: () => console.log('cancel Pressed'),
        },
      ],
    );
  };

  _renderSendAnimation = () => {
    this.setState({sent: true});
  };

  _sendAnimation = () => {
    Animated.parallel([
      Animated.timing(this.state.sendAnimationPosition, {
        toValue: -650,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.sendAnimationOpacity, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.sendAnimationSize, {
        toValue: 25,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      this.setState({
        sendAnimationPosition: new Animated.Value(0),
        sendAnimationOpacity: new Animated.Value(1),
        sendAnimationSize: new Animated.Value(0),
        sent: false,
      });
    });

    const bubble = {
      transform: [
        {translateY: this.state.sendAnimationPosition},
        {scale: this.state.sendAnimationSize},
      ],
    };

    return (
      <Animated.View
        style={[
          {
            width: 100,
            height: 50,
            borderTopRightRadius: 50,
            borderTopLeftRadius: 50,
            backgroundColor: 'rgb(214,245,255)',
            position: 'absolute',
            bottom: -200,
            opacity: this.state.sendAnimationOpacity,
          },
          bubble,
        ]}
      />
    );
  };

  _renderFailAnimation = () => {
    this.setState({failed: true});
  };

  _failAnimation = () => {
    Animated.parallel([
      Animated.timing(this.state.failAnimationOpacity, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.failAnimationSize, {
        toValue: 500,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      this.setState({
        failAnimationOpacity: new Animated.Value(1),
        failAnimationSize: new Animated.Value(0),
        failed: false,
      });
    });

    const bubble = {
      transform: [{scale: this.state.failAnimationSize}],
    };

    return (
      <Animated.View
        style={[
          {
            width: 1,
            height: 1,
            borderTopRightRadius: 50,
            borderTopLeftRadius: 50,
            backgroundColor: 'rgb(215,82,82)',
            position: 'absolute',
            bottom: -10,
            opacity: this.state.failAnimationOpacity,
          },
          bubble,
        ]}
      />
    );
  };

  render() {
    return this.state.identity ? (
      <View style={{height: '100%'}}>
        <View style={{height: '55%', justifyContent: 'center'}}>
          <Text> </Text>
          <IdCard identity={this.state.identity} />
        </View>
        <View style={{width: '100%', alignItems: 'center'}}>
          {this.state.sent && this._sendAnimation()}
          {this.state.failed && this._failAnimation()}
        </View>
        <Pressable
          style={styles.button}
          onPress={this._sendData}
          onLongPress={this._deleteAlert}
          android_ripple={{color: '#fff'}}
          disabled={this.state.sent || this.state.failed}>
          <Text style={styles.text}>Share Data</Text>
        </Pressable>
      </View>
    ) : (
      <View />
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default ProfilePage;
