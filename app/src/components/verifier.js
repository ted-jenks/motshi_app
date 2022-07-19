/*
Author: Ted Jenks

React-Native component to serve as a verification tool for blockchain users by
checking if they have a valid certification issued.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component, useRef} from 'react';
import {
  Button,
  PermissionsAndroid,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import styles from '../style/styles';

// Third party packages
const Realm = require('realm');
import * as Keychain from 'react-native-keychain';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import Lottie from 'lottie-react-native';
import AnimatedLottieView from 'lottie-react-native';
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

// Local imports
const Web3 = require('web3');
const {Web3Adapter} = require('../tools/web3Adapter.js');
import {DataHasher} from '../tools/dataHasher';
import IdCard from './idCard';
import CheckAnimation from './checkAnimation';
import CrossAnimation from './crossAnimation';
import {log} from 'util';

// Global constants
const NETWORK_URL = 'http://46.208.6.22:7545';
const web3 = new Web3(NETWORK_URL);
const contractAddress = '0xc47da351b3d579C608cB316D9e1Bd852C2ec2f4D';

//------------------------------------------------------------------------------

/* BODY */

class Verifier extends Component {
  state = {
    posStatus: null,
    negStatus: null,
    web3Adapter: null,
    identity: null,
    animationDone: false,
    rejectAnimationRef: useRef < Lottie > null,
    confirmAnimationRef: useRef < Lottie > null,
  };

  constructor() {
    super();
    try {
      // Retrieve the credentials
      Keychain.getGenericPassword().then(credentials => {
        if (credentials) {
          // Account information stored on file
          console.log(
            'Credentials successfully loaded for user ' + credentials.username,
          );
          const account = {
            address: credentials.username,
            privateKey: credentials.password,
          };
          this.setState({
            // create web3Adapter option for use in file
            web3Adapter: new Web3Adapter(web3, contractAddress, account),
          });
        } else {
          // failure to find BC account information
          console.log('No credentials stored');
        }
      });
    } catch (error) {
      console.log("Keychain couldn't be accessed!", error);
    }
  }

  async componentDidMount() {
    try {
      // subscribeOnPeersUpdates(this.handleNewPeers);
      // subscribeOnConnectionInfoUpdates(this.handleNewInfo);
      // subscribeOnThisDeviceChanged(this.handleThisDeviceChanged);

      // const status = await startDiscoveringPeers();
      // console.log('startDiscoveringPeers status: ', status);
      removeGroup()
        .then(
          createGroup()
            .then(r => {
              this.listen();
              console.log('there');
            })
            .catch(e => console.log('Group Creation failed1: ', e)),
        )
        .catch(e => {
          console.log('error:',e);
          // createGroup()
          //   .then(r => {
          //     this.listen();
          //     console.log('here');
          //   })
          //   .catch(e => console.log('Group Creation failed2: ', e));
        });
    } catch (e) {
      console.error(e);
    }
  }

  componentWillUnmount() {
    // unsubscribeFromConnectionInfoUpdates(this.handleNewInfo);
    // unsubscribeFromPeersUpdates(this.handleNewPeers);
    // unsubscribeFromThisDeviceChanged(this.handleThisDeviceChanged);
    removeGroup()
      .then(() => console.log("Currently you don't belong to group!"))
      .catch(err => console.error('Something gone wrong. Details: ', err));
  }

  handleNewInfo = info => {
    console.log('OnConnectionInfoUpdated', info);
  };

  handleNewPeers = ({devices}) => {
    console.log('OnPeersUpdated', devices);
    this.setState({devices: devices});
  };

  handleThisDeviceChanged = groupInfo => {
    console.log('THIS_DEVICE_CHANGED_ACTION', groupInfo);
  };

  listen = async () => {
    while (true) {
      if (this.state.identity === null) {
        console.log('Calling receiveMessage');
        const message = await receiveMessage();
        console.log('Message Received: ', message.substring(0, 500) + '..."}');
        this.setState({identity: message});
        this.checkUser();
      }
    }
  };

  checkForMatch = result => {
    let inputData = this.state.identity;
    let scope = this;
    const dataHasher = new DataHasher(inputData);
    const dataHash = dataHasher.getDataHash();
    const imageHash = dataHasher.getImageHash();
    if (
      result.data_hash_1 === dataHash[0] &&
      result.data_hash_2 === dataHash[1] &&
      result.image_hash_1 === imageHash[0] &&
      result.image_hash_2 === imageHash[1]
    ) {
      return true;
    }
    return false;
  };

  checkUser = () => {
    // request the certificate from the blockchain
    try {
      this.state.web3Adapter
        .getCertificate(this.state.identity.address)
        .then(result => {
          console.log(result);
          if (
            result.data_hash_1 ===
            '0x0000000000000000000000000000000000000000000000000000000000000000'
          ) {
            // accounts that have not been issued certificates will return this
            this.setState({negStatus: true});
          } else if (result.data == 'Invalid Address') {
            // accounts that don't exist will end up here
            this.setState({negStatus: true});
          } else {
            // accounts with a valid certificate
            if (this.checkForMatch(result)) {
              this.setState({posStatus: true});
            } else {
              this.setState({negStatus: true});
            }
          }
        });
    } catch {}
  };

  /* DEV TOOL */
  sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

  animationDone = () => {
    this.setState({animationDone: true});
  };

  showCard = () => {
    if (this.state.animationDone) {
      //&& this.state.animationDone
      return (
        <View style={{width: '100%'}}>
          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusBox,
                this.state.posStatus
                  ? {backgroundColor: 'green'}
                  : {backgroundColor: 'red'},
              ]}>
              <Text style={styles.text}>
                {this.state.posStatus ? 'User Verified' : 'User Not Verified'}
              </Text>
            </View>
          </View>
          <IdCard identity={this.state.identity} />
        </View>
      );
    } else if (!this.state.posStatus && !this.state.negStatus) {
      return (
        <View
          style={{
            width: '100%',
            height: '100%',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}>
          <AnimatedLottieView
            source={require('../assets/75577-scan-pulse (1).json')}
            autoPlay
            loop
          />
          <Text style={styles.textBlack}> {'\n'}SCANNING</Text>
        </View>
      );
    }
    return null;
  };

  clear = () => {
    this.setState({
      identity: null,
      posStatus: null,
      negStatus: null,
      animationDone: false,
    });
  };

  showClear = () => {
    if (this.state.animationDone) {
      //&& this.state.animationDone
      return (
        <Pressable style={styles.button} onPress={this.clear}>
          <Text style={styles.text}>Clear</Text>
        </Pressable>
      );
    }
    return;
  };

  render() {
    return (
      <View>
        <View
          style={{
            height: '85.5%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {this.state.posStatus && !this.state.animationDone && (
            <CheckAnimation handleFinish={this.animationDone} />
          )}
          {this.state.negStatus && !this.state.animationDone && (
            <CrossAnimation handleFinish={this.animationDone} />
          )}
          {this.showCard()}
        </View>
        {this.showClear()}
      </View>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default Verifier;
