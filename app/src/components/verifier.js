import React, {Component} from 'react';
import {Button, Text, TextInput, View} from 'react-native';
import styles from '../style/styles';

const Web3 = require('web3');
const {Web3Adapter} = require('../tools/web3Adapter.js');

const NETWORK_URL = 'http://10.0.2.2:7545';
const web3 = new Web3(NETWORK_URL);

const contractAddress = '0x54D3C1718339d4fff06D8Ff81985EFD524e9eA1E';
const verifierAddress = '0xF8f97dDA676C59Da1aa781da1cC4DE81d327c21F';
const verifierKey =
  '4fb8a8362c77c8062ebe65c6ebbe9249af179919b353135a38d51479471e77f8';
const account = {
  address: verifierAddress,
  privateKey: verifierKey,
};
const web3Adapter = new Web3Adapter(web3, contractAddress, account);

class Verifier extends Component {
  state = {
    inputText: '',
    placeHolder: 'Address',
  };

  checkUser = () => {
    web3Adapter.getCertificate(this.state.inputText).then(result => {
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
