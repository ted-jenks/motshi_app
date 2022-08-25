/*
Author: Ted Jenks

React-Native component to handle an existing user.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {Alert, SafeAreaView, StatusBar, View} from 'react-native';

// Third party packages
import Keychain from 'react-native-keychain';

// Local imports
import {Web3Adapter} from '../../tools/web3Adapter';
import UncertifiedUser from './uncertified/uncertifiedUser';
import LoadingPage from '../generic/loadingPage';
import CertifiedUser from './certified/certifiedUser';
import {IdentityManager} from '../../tools/identityManager';

//Global Constants
import {BLOCKCHAIN_URL, CONTRACT_ADDRESS} from '@env'; // updater
console.log('Existing: ', BLOCKCHAIN_URL, CONTRACT_ADDRESS); // i
const UNCERTIFIED_DATA_HASH =
  '0x0000000000000000000000000000000000000000000000000000000000000000'; //

//------------------------------------------------------------------------------

/* BODY */

class ExistingUser extends Component {
  state = {
    address: null,
    web3Adapter: null,
    identity: null,
    certified: null,
    rejected: false,
    errorConnect: false,
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
        const web3Adapter = new Web3Adapter(
          BLOCKCHAIN_URL,
          CONTRACT_ADDRESS,
          account,
        );
        this.state.address = account.address;
        this.state.web3Adapter = web3Adapter;
        // check if user is certified yet
        this.handleRefresh().catch(e => console.log(e));
      })
      .catch(e => console.log(e));
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
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
      'There has been an error connecting to the blockchain, please try again later.',
      [],
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
        this.setState({errorConnect: true});
        return false;
      } else {
        const identityManager = new IdentityManager();
        const identity = await identityManager.getID();
        await this.setState({identity});
        return true;
      }
    } catch (e) {
      console.log(e);
      return false;
    }
  };

  handleRefresh = async () => {
    const certified = await this.isCertified();
    let rejected = await this.state.web3Adapter.isRejected(this.state.address);
    if (rejected !== false && rejected !== true) {
      rejected = false;
    }
    if (this.mounted) {
      console.log('Refreshing...');
      this.setState({rejected, certified});
    }
  };

  handleReject = () => {
    if (this.state.rejected) {
      this.rejectAlert();
    }
  };

  handleColorChange = (color1, color2) => {
    let identity = this.state.identity;
    identity.linearGrad1 = color1;
    identity.linearGrad2 = color2;
    this.setState({identity});
  };

  displayContent = () => {
    if (this.state.certified && !this.state.errorConnect) {
      return (
        <CertifiedUser
          onDelete={this.props.onDelete}
          web3Adapter={this.state.web3Adapter}
          identity={this.state.identity}
          onColorChange={this.handleColorChange}
        />
      );
    } else if (this.state.certified === false && !this.state.errorConnect) {
      return (
        <SafeAreaView style={{backgroundColor: 'white'}}>
          <StatusBar />
          <UncertifiedUser
            onDelete={this.props.onDelete}
            onRefresh={this.handleRefresh}
          />
        </SafeAreaView>
      );
    } else {
      return (
        <SafeAreaView style={{backgroundColor: 'white'}}>
          <StatusBar />
          <LoadingPage />
        </SafeAreaView>
      );
    }
  };

  render() {
    return (
      <View style={{flex: 1}}>
        {this.handleReject()}
        {this.displayContent()}
      </View>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default ExistingUser;
