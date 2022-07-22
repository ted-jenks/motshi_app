/*
Author: Ted Jenks

React-Native component to import an existing account on a new device.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component, useRef} from 'react';
import {Pressable, Text, View} from 'react-native';

// Third party packages
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
import Keychain from 'react-native-keychain';
import Section from './section';
import styles from '../style/styles';
const Web3 = require('web3');

// Local imports
import {IdentityManager} from '../tools/identityManager';
const NETWORK_URL = process.env.BLOCKCHAIN_URL;
const web3 = new Web3(NETWORK_URL);
const {Web3Adapter} = require('./app/src/tools/web3Adapter.js');
const contractAddress = process.env.CONTRACT_ADDRESS;

//------------------------------------------------------------------------------

/* BODY */

class ImportAccount extends Component {
  state = {
    identity: null,
    address: null,
    devices: [],
    certified: false,
    web3Adapter: null,
  };

  constructor() {
    super();
    const account = this.createAccount(); // generate account
    console.log(account);
    this.saveToKeychain(account).catch(e => console.log(e)); // save account locally
    this.setState({
      address: account.address,
      web3Adapter: new Web3Adapter(web3, contractAddress, account),
    });
  }

  componentDidMount() {
    try {
      subscribeOnPeersUpdates(this.handleNewPeers);
      const status = startDiscoveringPeers();
    } catch (e) {
      console.error('Error: ', e);
    }
  }

  componentWillUnmount() {
    this.setState({mounted: false});
    unsubscribeFromPeersUpdates(this.handleNewPeers);
    Keychain.resetGenericPassword(); // clear BC account info
  }

  handleNewPeers = ({devices}) => {
    console.log('OnPeersUpdated', devices);
    this.setState({devices: devices});
  };

  createAccount = () => {
    // generate account and key on BC
    return web3.eth.accounts.create();
  };

  saveToKeychain = async account => {
    // save BC account information in keystore
    await Keychain.setGenericPassword(account.address, account.privateKey);
  };

  writeData = () => {
    const identityManager = new IdentityManager(); // open instance of realm to save to
    console.log('writing...');
    identityManager
      .storeID(
        // save data to realm
        this.state.identity.name,
        this.state.identity.dob,
        this.state.identity.pob,
        this.state.identity.expiry,
        this.state.identity.house,
        this.state.identity.street,
        this.state.identity.city,
        this.state.identity.postcode,
        this.state.identity.sex,
        this.state.identity.nationality,
        this.state.identity.photoData,
        this.state.address,
      )
      .then(r => {
        this.props.handleSubmit();
      })
      .catch(e => console.log(e));
  };

  renderImportScreen = () => {
    if (!this.state.certified) {
      return (
        <View>
          <Section title={'Import Account'}>
            To import an account, open the 'Move Account' page on your old
            device, then select 'Begin Transfer'.
          </Section>
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.navButton}
              onPress={this.sendAddress}
              android_ripple={{color: '#fff'}}>
              <Text style={styles.text}>Begin Transfer</Text>
            </Pressable>
            <Pressable
              style={styles.navButton}
              onPress={this.refresh}
              android_ripple={{color: '#fff'}}>
              <Text style={styles.text}>Refresh</Text>
            </Pressable>
          </View>
        </View>
      );
    } else {
      receiveMessage().then(message => {
        this.setState({identity: message});
        this.writeData();
      });
      return (
        <Section title={'Blockchain Transfer Complete!'}>
          Select 'Transfer ID Info' on your old device to continue.
        </Section>
      );
    }
  };

  sendAddress = async () => {
    const connectionInfo = await getConnectionInfo();
    if (connectionInfo.groupFormed) {
      console.log('Already connected to: ', connectionInfo);
      // If connected
      await sendMessage(this.state.address).catch(e => {
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
            await sendMessage(this.state.address).catch(e => {
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

  refresh = () => {
    this.certified().then(certified => {
      this.setState({certified});
    });
  };

  certified = () => {
    return new Promise((resolve, reject) => {
      this.state.web3Adapter
        .getCertificate(this.state.address)
        .then(result => {
          console.log(result);
          if (
            result.data_hash_1 ===
            '0x0000000000000000000000000000000000000000000000000000000000000000'
          ) {
            // accounts that have not been issued certificates will return this
            resolve(false);
          } else if (result.data == 'Invalid Address') {
            // accounts that don't exist will end up here
            resolve(false);
          } else {
            resolve(true);
          }
        })
        .catch(e => {
          console.log(e);
          resolve(false);
        });
    });
  };

  render() {
    return <View>{this.renderImportScreen()}</View>;
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default ImportAccount;
