/*
Author: Ted Jenks

React-Native component to show rejection animation.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component, useRef} from 'react';
import Keychain from 'react-native-keychain';
import {Web3Adapter} from '../tools/web3Adapter';

// Third party packages

// Local imports
const Web3 = require('web3');
const web3 = new Web3(BLOCKCHAIN_URL);
import {BLOCKCHAIN_URL, CONTRACT_ADDRESS} from '@env';
import {Alert} from 'react-native';
const UNCERTIFIED_DATA_HASH =
  '0x0000000000000000000000000000000000000000000000000000000000000000';

//------------------------------------------------------------------------------

/* BODY */

class ExistingUser extends Component {
  state = {
    address: null,
    web3Adapter: null,
    certified: false,
    rejected: false,
  };

  constructor() {
    super();
    // set up connection to BC network
    Keychain.getGenericPassword()
      .then(credentials => {
        const account = {
          address: credentials.username,
          privateKey: credentials.password,
        };
        const web3Adapter = new Web3Adapter(web3, CONTRACT_ADDRESS, account);
        this.setState({address: account.address});
        this.setState({web3Adapter: web3Adapter});
        // check if user is certified yet
        this.handleRefresh().catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  }

  rejectAlert = () =>
    // show alert informing user that they have been rejected
    Alert.alert(
      'REJECTED',
      'Our system has detected that the information provided does not match ' +
      'your document or a digital identity has already been issued to your ' +
      'document. You are free to try again.',
      [
        {
          text: 'OK',
          onPress: this.props.onDelete,
        },
      ],
    );

  errorAlert = () =>
    // show alert informing user that they have been rejected
    Alert.alert(
      'ERROR',
      'There has been an error processing your details. You are free to try again.',
      [
        {
          text: 'OK',
          onPress: this.props.onDelete,
        },
      ],
    );

  isCertified = async () => {
    try {
      const result = await this.state.web3Adapter.getCertificate(
        this.state.address,
      );
      console.log(result);
      if (result.data_hash_1 === UNCERTIFIED_DATA_HASH) {
        // accounts that have not been issued certificates will return this
        return false;
      } else if (result.data == 'Invalid Address') {
        // accounts that don't exist will end up here
        this.errorAlert();
        return false;
      } else {
        return true;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  handleRefresh = async () => {
    const certified = await this.isCertified();
    this.setState({certified});
    const rejected = await this.state.web3Adapter.isRejected(
      this.state.address,
    );
    this.setState({rejected});
  };

  render() {}
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default ExistingUser;
