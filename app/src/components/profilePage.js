/*
Author: Ted Jenks

React-Native component to serve as the profile page for the application.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {Image, PermissionsAndroid, Pressable, Text, View} from 'react-native';

// Third party packages
import * as Keychain from 'react-native-keychain';
const Realm = require('realm');
import {
  initialize,
  startDiscoveringPeers,
  stopDiscoveringPeers,
  unsubscribeFromPeersUpdates,
  unsubscribeFromThisDeviceChanged,
  unsubscribeFromConnectionInfoUpdates,
  subscribeOnConnectionInfoUpdates,
  subscribeOnThisDeviceChanged,
  subscribeOnPeersUpdates,
  connect,
  cancelConnect,
  createGroup,
  removeGroup,
  getAvailablePeers,
  sendFile,
  receiveFile,
  getConnectionInfo,
  getGroupInfo,
  receiveMessage,
  sendMessage,
} from 'react-native-wifi-p2p';
import AnimatedLottieView from 'lottie-react-native';

// Local imports
import {IdentityManager} from '../tools/identityManager';
import styles from '../style/styles';
import IdCard from './idCard';

// Constants
const API_KEY = 'AIzaSyATH-ueG7X9RYzfolOu7cEUmwDPzmUeWm8';

//------------------------------------------------------------------------------

/* BODY */

class ProfilePage extends Component {
  state = {
    identity: null,
    removeListener: null,
    disconnect: null,
    devices: [],
    connect: false,
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
      // subscribeOnConnectionInfoUpdates(this.handleNewInfo);
      // subscribeOnThisDeviceChanged(this.handleThisDeviceChanged);
      const status = startDiscoveringPeers();
    } catch (e) {
      console.error('Error: ', e);
    }
  }

  componentWillUnmount() {
    // unsubscribeFromConnectionInfoUpdates(this.handleNewInfo);
    unsubscribeFromPeersUpdates(this.handleNewPeers);
    // unsubscribeFromThisDeviceChanged(this.handleThisDeviceChanged);
    // stopDiscoveringPeers()
    //   .then(() => console.log('Stopping of discovering was successful'))
    //   .catch(err =>
    //     console.error(
    //       'Something is gone wrong. Maybe your WiFi is disabled? Error details',
    //       err,
    //     ),
    //   );
    // cancelConnect()
    //   .then(() =>
    //     console.log('cancelConnect', 'Connection successfully canceled'),
    //   )
    //   .catch(err => console.log('nothing to cancel'));
  }

  handleNewInfo = info => {
    // console.log('OnConnectionInfoUpdated', info);
  };

  handleNewPeers = ({devices}) => {
    console.log('OnPeersUpdated', devices);
    this.setState({devices: devices});
  };

  handleThisDeviceChanged = groupInfo => {
    // console.log('THIS_DEVICE_CHANGED_ACTION', groupInfo);
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
          .then(this.props.handleDelete)
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  };

  _joinWifiGroup = async () => {
    console.log('Connect to: ', this.state.devices[0]);
    connect(this.state.devices[0].deviceAddress)
      .then(() => console.log('Successfully connected'))
      .catch(err => console.log('Something gone wrong. Details: ', err));
  };

  _connect = () => {
    //TODO: if not in group, try to join or raise an error message
    this._joinWifiGroup()
      .then(r => {
        getConnectionInfo().then(r => {
          console.log('connection info', r);
          this.setState({connect: true});
        });
      })
      .catch(e => console.log(e));
  };

  _sendData = () => {
    sendMessage(JSON.stringify(this.state.identity))
      .then(metaInfo => console.log('Message sent successfully'))
      .catch(err => console.log('Error while message sending', err));
  };

  _disconnect = () => {
    cancelConnect()
      .then(r => {
        this.setState({connect: false});
        console.log('cancelConnect', 'Connection successfully canceled');
      })
      .catch(err =>
        console.log('cancelConnect', 'Something gone wrong. Details: ', err),
      );
  };

  _connectButton = () => {
    if (this.state.connect) {
      return (
        <Pressable style={styles.button} onPress={this._disconnect}>
          <Text style={styles.text}>Disconnect</Text>
        </Pressable>
      );
    } else {
      return (
        <Pressable style={styles.button} onPress={this._connect}>
          <Text style={styles.text}>Connect</Text>
        </Pressable>
      );
    }
  };

  // _sharingAnimation = () => {
  //   return this.state.simulation ? (
  //     <AnimatedLottieView
  //       source={require('../assets/75577-scan-pulse (1).json')}
  //       autoPlay
  //       loop
  //     />
  //   ) : null;
  // };

  render() {
    return this.state.identity ? (
      <View>
        <View style={{height: '77%', justifyContent: 'center'}}>
          {/* set height to 85.5% without dev tool in */}
          <Text> </Text>
          {/*{this._sharingAnimation()}*/}
          <IdCard identity={this.state.identity} />
        </View>
        {this._connectButton()}
        <Pressable style={styles.button} onPress={this._sendData}>
          <Text style={styles.text}>SendData</Text>
        </Pressable>
        {/* DEV TOOL */}
        {/*<Pressable*/}
        {/*  style={[styles.button, {backgroundColor: 'green'}]}*/}
        {/*  onPress={this._deleteInfo}>*/}
        {/*  <Text style={styles.text}>Delete Info</Text>*/}
        {/*</Pressable>*/}
        {/* --------- */}
      </View>
    ) : (
      <View />
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default ProfilePage;
