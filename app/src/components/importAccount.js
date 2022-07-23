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
import {BLOCKCHAIN_URL, CONTRACT_ADDRESS} from '@env';
import {Colors} from 'react-native/Libraries/NewAppScreen';
const web3 = new Web3(BLOCKCHAIN_URL);
const {Web3Adapter} = require('../tools/web3Adapter.js');
const WORD = 'longer4WordsareBetterfortheEncryption';

//------------------------------------------------------------------------------

/* BODY */

class ImportAccount extends Component {
  state = {
    identity: null,
    address: null,
    devices: [],
    certified: false,
    web3Adapter: null,
    mounted: true,
  };

  constructor() {
    super();
    this.createAccount()
      .then(account => {
        this.saveToKeychain(account).catch(e => console.log(e)); // save account locally
        this.state.web3Adapter = new Web3Adapter(
          web3,
          CONTRACT_ADDRESS,
          account,
        );
        this.setState({address: account.address});
      })
      .catch(e => console.log(e));
  }

  componentDidMount() {
    startDiscoveringPeers().catch(e =>
      console.warn('Failed to start discovering Peers: ', e),
    );
    receiveMessage().then(message => {
      if (this.state.mounted) {
        this.setState({identity: message});
        this.writeData();
      }
    });
  }

  componentWillUnmount() {
    this.setState({mounted: false});
  }

  createAccount = async () => {
    // generate account and key on BC
    const modelAccount = web3.eth.accounts.create();
    const accounts = await web3.eth.personal.getAccounts();
    const address = await web3.eth.personal.newAccount(modelAccount.privateKey);
    const account = {address: address, privateKey: modelAccount.privateKey};
    return account;
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
    return (
      <View style={{height: '100%'}}>
        <View style={{height: '87%'}}>
          <Section title={'Import Account'}>
            Address: {'\n\n'}
            <Text
              style={{
                fontSize: 12,
                alignSelf: 'center',
                color: 'grey',
              }}>
              {this.state.address}
            </Text>
          </Section>
        </View>
      </View>
    );
  };

  render() {
    return <View style={{height: '91.5%'}}>{this.renderImportScreen()}</View>;
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default ImportAccount;
