/*
Author: Ted Jenks

React-Native component to serve as a verification tool for blockchain users by
checking if they have a valid certification issued.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {Button, TextInput, View} from 'react-native';
import styles from '../style/styles';

// Third party packages
const Realm = require('realm');
import * as Keychain from 'react-native-keychain';

// Local imports
const Web3 = require('web3');
const {Web3Adapter} = require('../tools/web3Adapter.js');

// Global constants
const NETWORK_URL = 'http://10.0.2.2:7545';
const web3 = new Web3(NETWORK_URL);
const contractAddress = '0x54D3C1718339d4fff06D8Ff81985EFD524e9eA1E';

//------------------------------------------------------------------------------

/* BODY */

class Verifier extends Component {
  state = {
    inputText: '', // text received in address field
    placeHolder: 'Address', // placeholder test in address field
    web3Adapter: null,
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

  checkUser = () => {
    // request the certificate from the blockchain
    this.state.web3Adapter.getCertificate(this.state.inputText).then(result => {
      console.log(result);
      if (
        result.data_hash_1 ===
        '0x0000000000000000000000000000000000000000000000000000000000000000'
      ) {
        // accounts that have not been issued certificates will return this
        this.setState({inputText: '', placeHolder: 'User Not Verified'});
      } else if (result.data == 'Invalid Address') {
        // accounts that don't exist will end up here
        this.setState({inputText: '', placeHolder: 'User Not Verified'});
      } else {
        // accounts with a valid certificate
        //TODO: check that hashes match
        this.setState({inputText: '', placeHolder: 'User Verified'});
      }
    });
  };

  render() {
    return (
      <View>
        <TextInput
          style={styles.input}
          label="Address"
          mode="outlined"
          placeholder={this.state.placeHolder}
          value={this.state.inputText}
          onChangeText={inputText => this.setState({inputText})}
          ref={input => {
            this.textInput = input;
          }}
        />
        <View style={{padding: 10}}>
          <Button onPress={this.checkUser} title="Verify User" />
        </View>
      </View>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default Verifier;
