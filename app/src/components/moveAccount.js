/*
Author: Ted Jenks

React-Native component to show handle the transfer of accounts to new devices.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component, useRef} from 'react';
import {Pressable, Text, View} from 'react-native';

// Third party packages
import Keychain from 'react-native-keychain';
import {
  cancelConnect,
  connect,
  getConnectionInfo,
  receiveMessage,
  sendMessage,
  startDiscoveringPeers,
  subscribeOnPeersUpdates,
  unsubscribeFromPeersUpdates,
} from 'react-native-wifi-p2p';

// Local imports
const Web3 = require('web3');
import {IdentityManager} from '../tools/identityManager';
import Section from './section';
import styles from '../style/styles';
const {Web3Adapter} = require('../tools/web3Adapter.js');

// Global constants
import {BLOCKCHAIN_URL, CONTRACT_ADDRESS} from '@env';
const web3 = new Web3(BLOCKCHAIN_URL);

//------------------------------------------------------------------------------

/* BODY */

class MoveAccount extends Component {
  state = {
    mounted: true,
    identity: null,
    web3Adapter: null,
    newAddress: null,
    fail: false,
    success: true,
    devices: [],
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
    try {
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
        } else {
          // failure to find BC account information
          console.log('No credentials stored');
        }
      });
    } catch (error) {
      console.log("Keychain couldn't be accessed!", error);
    }
  }

  componentDidMount() {
    try {
      subscribeOnPeersUpdates(this.handleNewPeers);
      const status = startDiscoveringPeers();
    } catch (e) {
      console.error('Error: ', e);
    }
    receiveMessage().then(message => {
      if (this.state.mounted) {
        this.setState({newAddress: message});
      }
    });
    console.log('Receive Message Called');
  }

  componentWillUnmount() {
    this.setState({mounted: false});
    unsubscribeFromPeersUpdates(this.handleNewPeers);
  }

  handleNewPeers = ({devices}) => {
    console.log('OnPeersUpdated', devices);
    this.setState({devices: devices});
  };

  performTransfer = () => {
    this.state.web3Adapter.moveAccount(this.state.newAddress).then(r => {
      if (r.data === 'Invalid Address' || !r.status) {
        this.setState({fail: true});
      } else {
        this.setState({success: true});
      }
    });
  };

  sendData = async () => {
    const connectionInfo = await getConnectionInfo();
    if (connectionInfo.groupFormed) {
      console.log('Already connected to: ', connectionInfo);
      // If connected
      await sendMessage(JSON.stringify(this.state.identity)).catch(e => {
        console.log('Error in sendMessage: ', e);
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
            await sendMessage(JSON.stringify(this.state.identity)).catch(e => {
              console.log('Error in sendMessage: ', e);
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
    console.log('No valid receiving devices detected:\n', this.state.devices);
  };

  renderMoveAccount = () => {
    if (this.state.newAddress === null) {
      return (
        <Section title={'Move Account to a New Device'}>
          To begin the account transfer process, please select 'Import Account'
          on the new device. Then start the transfer with 'Begin Transfer'.
        </Section>
      );
    } else if (!this.state.fail && !this.state.success) {
      this.performTransfer();
      return (
        <Section title={'Account Transfer in Progress'}>
          Please wait as the account transfer processes. This may take a few
          minutes.
        </Section>
      );
    } else if (this.state.fail && !this.state.success) {
      return (
        <Section title={'Failure'}>
          A fatal error has occurred, transfer unsuccessful.
        </Section>
      );
    } else if (!this.state.fail && this.state.success) {
      return (
        <View>
          <Section title={'Success!'}>
            Blockchain account transfer complete
          </Section>
          <Pressable
            style={styles.button}
            onPress={this.sendData}
            android_ripple={{color: '#fff'}}>
            <Text style={styles.text}>Transfer ID Info</Text>
          </Pressable>
        </View>
      );
    }
  };

  render() {
    return <View>{this.renderMoveAccount()}</View>;
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default MoveAccount;
