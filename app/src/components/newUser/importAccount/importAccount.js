/*
Author: Ted Jenks

React-Native component to import an existing account on a new device.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import ReactNative, {NativeEventEmitter, View} from 'react-native';

// Third party packages
import {receiveMessage, startDiscoveringPeers} from 'react-native-wifi-p2p';
import Keychain from 'react-native-keychain';
const Web3 = require('web3');
import QRCode from 'react-native-qrcode-svg';

// Local imports
import {IdentityManager} from '../../../tools/identityManager';
import CustomButton from '../../generic/customButton';
const {Web3Adapter} = require('../../../tools/web3Adapter.js');
import Section from '../../generic/section';
import styles from '../../../style/styles';
const {NearbyMessages} = ReactNative.NativeModules;

// Global constants
import {BLOCKCHAIN_URL, CONTRACT_ADDRESS} from '@env';
import NavBar from '../navBar'; // update
console.log('Import: ', BLOCKCHAIN_URL, CONTRACT_ADDRESS);
const web3 = new Web3(BLOCKCHAIN_URL);

//------------------------------------------------------------------------------

/* BODY */

class ImportAccount extends Component {
  state = {
    identity: null,
    address: 'temp',
    devices: [],
    certified: false,
    web3Adapter: null,
    mounted: true,
  };

  constructor() {
    super();
    this.createAccount()
      .then(account => {
        this.saveAccountToKeychain(account).catch(e => console.log(e)); // save account locally
        this.state.web3Adapter = new Web3Adapter(
          BLOCKCHAIN_URL,
          CONTRACT_ADDRESS,
          account,
        );
        this.setState({address: account.address});
      })
      .catch(e => console.log(e));
  }

  componentDidMount() {
    // Subscribe to nearby messages
    NearbyMessages.subscribe(res => console.log(res));
    // Add a listener to detect published messages
    const eventEmitter = new NativeEventEmitter(NearbyMessages);
    this.eventListener = eventEmitter.addListener('MessageReceived', event => {
      this.handleReceiveMessage(event.data);
    });
  }

  componentWillUnmount() {
    this.setState({mounted: false});
    NearbyMessages.unsubscribe();
    this.eventListener.remove();
  }

  createAccount = async () => {
    // generate account and key on BC
    const modelAccount = web3.eth.accounts.create();
    console.log('Modelling on: ', modelAccount);
    const account = {
      address: modelAccount.address,
      privateKey: modelAccount.privateKey,
    };
    return account;
  };

  saveAccountToKeychain = async account => {
    // save BC account information in keystore
    await Keychain.setGenericPassword(account.address, account.privateKey);
  };

  writeDataToRealm = identity => {
    const identityManager = new IdentityManager(); // open instance of realm to save to
    console.log('writing...');
    identityManager
      .storeID(
        // save data to realm
        identity.name,
        identity.dob,
        identity.pob,
        identity.expiry,
        identity.house,
        identity.street,
        identity.city,
        identity.postcode,
        identity.sex,
        identity.nationality,
        identity.photoData,
        this.state.address,
      )
      .then(r => {
        this.props.onRefresh();
      })
      .catch(e => console.log(e));
  };

  handleReceiveMessage = message => {
    if (message === 'ok') {
      this.writeDataToRealm(this.state.identity);
      return;
    }
    console.log('Message Received: ', message.substring(0, 400) + '..."}');
    let identity = JSON.parse(message);
    const expiry = new Date(identity.expiry);
    const dob = new Date(identity.dob);
    identity.expiry = expiry;
    identity.dob = dob;
    this.setState({identity: identity});
  };

  displayContent = () => {
    return (
      <View style={{flex: 1}}>
        <Section title={'Import Account'}>
          Describe how to do it here.{'\n\n'}
        </Section>
        {this.state.identity && (
          <View style={styles.qrContainer}>
            <QRCode value={this.state.address} size={350} />
          </View>
        )}
      </View>
    );
  };

  render() {
    return (
      <View style={{height: '100%'}}>
        <NavBar pageCount={0} onPress1={this.props.onBack} />
        {this.displayContent()}
      </View>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default ImportAccount;
