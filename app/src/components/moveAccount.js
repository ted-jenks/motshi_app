/*
Author: Ted Jenks

React-Native component to show handle the transfer of accounts to new devices.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component, useRef} from 'react';
import {receiveMessage} from 'react-native-wifi-p2p';

// Third party packages
import Keychain from 'react-native-keychain';

// Local imports
const Web3 = require('web3');
import IdentityManager from '../tools/identityManager';
import Section from './section';
import { View } from "react-native";
const {Web3Adapter} = require('../tools/web3Adapter.js');

// Global constants
const NETWORK_URL = process.env.BLOCKCHAIN_URL;
const web3 = new Web3(NETWORK_URL);
const contractAddress = process.env.CONTRACT_ADDRESS;

//------------------------------------------------------------------------------

/* BODY */

class MoveAccount extends Component {
  state = {
    mounted: true,
    identity: null,
    web3Adapter: null,
    newAddress: null,
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

  componentDidMount() {
    receiveMessage().then(message => {
      if (this.state.mounted) {
        this.setState({newAddress: message});
      }
    });
    console.log('Receive Message Called');
  }

  componentWillUnmount() {
    this.setState({mounted: false});
  }

  performTransfer = () => {
    this.state.web3Adapter.moveAccount(this.state.newAddress);
  };

  renderMoveAccount = () => {
    if (this.state.newAddress === null) {
      return (
        <Section title={'Move Account to a New Device'}>
          To begin the account transfer process, please select 'Import Account'
          on the new device. Then start the transfer with 'Begin Transfer'.
        </Section>
      );
    } else {
      this.performTransfer();
      return (
        <Section title={'Account Transfer in Progress'}>
          Please wait as the account transfer processes. This may take a few
          minutes.
        </Section>
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
