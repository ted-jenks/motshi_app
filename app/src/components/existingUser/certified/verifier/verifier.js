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
  Pressable,
  Text,
  View,
} from 'react-native';
import styles from '../../../../style/styles';

// Third party packages
const Realm = require('realm');
import * as Keychain from 'react-native-keychain';
import NfcManager, {NfcTech} from 'react-native-nfc-manager';
import Lottie from 'lottie-react-native';
import AnimatedLottieView from 'lottie-react-native';
import {
  receiveMessage,
} from 'react-native-wifi-p2p';

// Local imports
const Web3 = require('web3');
const {Web3Adapter} = require('../../../../tools/web3Adapter.js');
import {DataHasher} from '../../../../tools/dataHasher';
import IdCard from '../profile/idCard/idCard';
import CheckAnimation from './checkAnimation';
import CrossAnimation from './crossAnimation';

// Global constants
import {BLOCKCHAIN_URL, CONTRACT_ADDRESS} from '@env';
const web3 = new Web3(BLOCKCHAIN_URL);

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
    this.mounted = true;
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
            web3Adapter: new Web3Adapter(web3, CONTRACT_ADDRESS, account),
          });
          this.listen().catch(e => console.log(e));
        } else {
          // failure to find BC account information
          console.log('No credentials stored');
        }
      });
    } catch (error) {
      console.log("Keychain couldn't be accessed!", error);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  listen = async () => {
    console.log('Calling receiveMessage');
    const message = await receiveMessage();
    if (this.mounted) {
      console.log('Message Received: ', message.substring(0, 500) + '..."}');
      let identity = JSON.parse(message);
      const expiry = new Date(identity.expiry);
      const dob = new Date(identity.dob);
      identity.expiry = expiry;
      identity.dob = dob;
      // identity.name = 'bob';
      this.setState({identity: identity});
      this.checkUser();
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

  showUserID = () => {
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
  };

  showScanningAnimation = () => {
    return (
      <View
        style={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>
        <AnimatedLottieView
          source={require('../../../../assets/75577-scan-pulse (1).json')}
          autoPlay
          loop
        />
        <Text style={styles.textBlack}> {'\n'}SCANNING</Text>
      </View>
    );
  };

  mainDisplayLogic = () => {
    if (this.state.animationDone) {
      // User ID ready to show
      return this.showUserID();
    } else if (!this.state.posStatus && !this.state.negStatus) {
      // No data available
      return this.showScanningAnimation();
    }
    //Playing verification animation
    return null;
  };

  clear = () => {
    this.setState({
      identity: null,
      posStatus: null,
      negStatus: null,
      animationDone: false,
    });
    this.listen().catch(e => console.log(e));
  };

  showClear = () => {
    if (this.state.animationDone) {
      return (
        <Pressable style={styles.button} onPress={this.clear}
                   android_ripple={{color: '#fff'}}>
          <Text style={styles.text}>Clear</Text>
        </Pressable>
      );
    }
    return;
  };

  render() {
    return (
      <View
        style={{
          height: '100%',
        }}>
        <View
          style={{
            height: '70%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {(this.state.posStatus && !this.state.animationDone && (
            <CheckAnimation handleFinish={this.animationDone} />) )||
            (this.state.negStatus && !this.state.animationDone && (
            <CrossAnimation handleFinish={this.animationDone} />
          ))}
          {this.mainDisplayLogic()}
        </View>
        {this.showClear()}
      </View>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default Verifier;
