import React, {Component} from 'react';
import {Button, Text, TextInput, View} from 'react-native';
import styles from '../style/styles';
import { IdentityManager } from '../tools/identityManager.js';

const Realm = require('realm');

const Web3 = require('web3');
const {Web3Adapter} = require('../tools/web3Adapter.js');

const NETWORK_URL = 'http://10.0.2.2:7545';
const web3 = new Web3(NETWORK_URL);

const contractAddress = '0x54D3C1718339d4fff06D8Ff81985EFD524e9eA1E';

class Verifier extends Component {
  state = {
    inputText: '',
    placeHolder: 'Address',
    web3Adapter: null,
  };

  constructor() {
    super();
    const identityManager = new IdentityManager();
    identityManager
      .getID()
      .then(identity => {
        const account = {
          address: identity.address,
          privateKey: identity.key,
        };
        this.setState({
          web3Adapter: new Web3Adapter(web3, contractAddress, account),
        });
      })
      .catch(e => console.log(e));

  }

  checkUser = () => {
    this.state.web3Adapter.getCertificate(this.state.inputText).then(result => {
      console.log(result);
      if (result.data == '') {
        this.setState({inputText: '', placeHolder: 'User Not Verified'});
      } else if (result.data == 'Invalid Address') {
        this.setState({inputText: '', placeHolder: 'User Not Verified'});
      } else {
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

export default Verifier;
