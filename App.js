/*
Author: Ted Jenks

React-Native App.js (entry point of application)
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
const {Button, SafeAreaView, StatusBar, View} = require('react-native');

// Third party imports
import * as Keychain from 'react-native-keychain';

// Local imports
import IdCard from './app/src/components/idCard.js';
import EnterDetails from './app/src/components/enterDetails.js';
import Verifier from './app/src/components/verifier.js';
import {IdentityManager} from './app/src/tools/identityManager';
import Section from './app/src/components/section';
import { Alert } from "react-native";
const Web3 = require('web3');
const {Web3Adapter} = require('./app/src/tools/web3Adapter.js');

// Global constants
const NETWORK_URL = 'http://10.0.2.2:7545';
const web3 = new Web3(NETWORK_URL);
const contractAddress = '0x54D3C1718339d4fff06D8Ff81985EFD524e9eA1E';
//------------------------------------------------------------------------------

/* BODY */

//FIXME: Small gap in ID when expanded. Probably need to program that myself

class App extends Component {
  state = {
    newUser: false,
    verify: false,
    certified: null,
  };

  constructor() {
    super();
    const identityManager = new IdentityManager();
    // check if the user has an existing account set up
    identityManager
      .getID()
      .then(res => {
        if (!res) {
          this.setState({newUser: true});
        }
        // check if user is certified yet
        this.certified().then(certified => {
          this.setState({certified});
        });
      })
      .catch(e => console.log(e));
  }

  displayContent = () => {
    // logic of what section of the app to display (ID, Data entry, or verification)
    if (this.state.verify) {
      return (
        <View>
          <Button onPress={this.showProfile} title="Profile" />
          <Verifier />
        </View>
      );
    } else if (this.state.newUser) {
      // new users must enter information
      return (
        <View>
          <EnterDetails handleSubmit={this.handleSubmit} />
        </View>
      );
    } else if (this.state.certified == null) {
      // loading page
      return <View />;
    } else if (!this.state.certified) {
      // waiting for authentication page
      return (
        <View>
          <Section title={'Awaiting Authentication'}>
            We are checking over your details to make sure they are valid.
            {'\n\n'}
            Check back soon!
          </Section>
          <Button
            onPress={() => {
              this.certified().then(certified => {
                this.setState({certified});
              });
            }}
            title="Refresh"
          />
        </View>
      );
    } else {
      // id card page
      return (
        <View>
          <Button onPress={this.showVerify} title="Verify" />
          <View style={{padding: 10}}>
            <IdCard handleDelete={this.handleDelete} />
          </View>
        </View>
      );
    }
  };

  rejectAlert = () =>
    // show alert informing user that they have been rejected
    Alert.alert(
      'REJECTED',
      'Our system has detected that the information provided does not match your document or a digital identity has already been issued to your document. You are free to try again.',
      [{text: 'OK', onPress: () => this.setState({certified:false, newUser:true})}],
    );

  errorAlert = () =>
    // show alert informing user that they have been rejected
    Alert.alert(
      'ERROR',
      'There has been an error processing your details. You are free to try again.',
      [{text: 'OK', onPress: () => this.setState({certified:false, newUser:true})}],
    );

  certified = () => {
    return new Promise((resolve, reject) => {
      Keychain.getGenericPassword()
        .then(credentials => {
          const account = {
            address: credentials.username,
            privateKey: credentials.password,
          };
          const web3Adapter = new Web3Adapter(web3, contractAddress, account);
          web3Adapter
            .getCertificate(credentials.username)
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
                this.errorAlert;
              } else if (
                result.data_hash_1 ===
                  '0x25cdd2e1f9db91d81d336c3d04b9c8ec2cd73492e9654ff8d3407de6716b4cbb' &&
                result.data_hash_2 ===
                  '0x2a5b2a3ac46004974abb4893816082fea91acc1a7cb139560f09463b3ef4f2f9'
              ) {
                // accounts that have been rejected
                this.rejectAlert();
              } else {
                resolve(true);
              }
            })
            .catch(e => {
              resolve(false);
            });
        })
        .catch(e => reject(e));
    });
  };

  handleSubmit = () => {
    this.setState({newUser: false});
  };

  handleDelete = () => {
    this.setState({newUser: true, certified: false});
  };

  showVerify = () => {
    this.setState({verify: true});
  };

  showProfile = () => {
    this.setState({verify: false});
  };

  render() {
    return (
      <SafeAreaView>
        <StatusBar />
        {this.displayContent()}
      </SafeAreaView>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default App;
