/*
Author: Ted Jenks

React-Native App.js (entry point of application)
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
const {SafeAreaView, StatusBar, View} = require('react-native');
import {Alert, LogBox, PermissionsAndroid, Pressable, Text} from 'react-native';

// Third party imports
import * as Keychain from 'react-native-keychain';
const Web3 = require('web3');

// Local imports
import ProfilePage from './app/src/components/existingUser/certified/profile/profilePage.js';
import EnterDetails from './app/src/components/enterDetails.js';
import Verifier from './app/src/components/existingUser/certified/verifier/verifier.js';
import {IdentityManager} from './app/src/tools/identityManager';
import Section from './app/src/components/section';
import styles from './app/src/style/styles';
import {initialize} from 'react-native-wifi-p2p';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import MoveAccount from './app/src/components/existingUser/certified/moveAccount/moveAccount';
import ImportAccount from './app/src/components/importAccount';
const {Web3Adapter} = require('./app/src/tools/web3Adapter.js');
import ExistingUser from './app/src/components/existingUser/existingUser';
import NewUser from "./app/src/components/newUser/newUser";

// Global constants
import {BLOCKCHAIN_URL, CONTRACT_ADDRESS} from '@env';
const web3 = new Web3(BLOCKCHAIN_URL);

LogBox.ignoreAllLogs(); //Ignore all log notifications
//------------------------------------------------------------------------------

/* BODY */

//FIXME: Small gap in ID when expanded. Probably need to program that myself

//TODO: Zero knowledge proof to prove deletion?

//TODO: Write card as anim

//TODO: Fix move account functionality
//TODO: Make a tree of components and refactor with proper stuff
//TODO: Add delete account and theft prevention functionality
//TODO: Look at bluetooth react native packages for data sharing
//TODO: Make it possible to select who you send to  maybe and write a module to manage wifi P2P - Add wifi is on check in this

//TODO: Write security protocol for transactions, research message signing and blockchain transactions
//TODO: Put the blockchain on a real network and test it
//TODO: Look at potential forms of attack (man in the middle, replay)]

//TODO: FIX MODEL!!!

class App extends Component {
  state = {
    newUser: false,
  };

  constructor() {
    super();
    this.handleRefresh().catch(e => console.log(e));
  }

  async componentDidMount() {
    try {
      await initialize();
      // since it's required in Android >= 6.0#
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Access to wi-fi P2P mode',
          message: 'ACCESS_FINE_LOCATION',
        },
      );

      console.log(
        granted === PermissionsAndroid.RESULTS.GRANTED
          ? 'You can use the p2p mode'
          : 'Permission denied: p2p mode will not work',
      );
    } catch (e) {
      console.error('P2P error: ', e);
    }
  }

  displayContentOld = () => {
    // logic of what section of the app to display (ID, Data entry, or verification)
    if (this.state.verify) {
      return (
        <View>
          <Pressable
            style={styles.button}
            onPress={this.showProfile}
            android_ripple={{color: '#fff'}}>
            <Text style={styles.text}>Profile</Text>
          </Pressable>
          <Verifier />
        </View>
      );
    } else if (this.state.newUser && !this.state.import) {
      // new users must enter information
      return (
        <View>
          <Pressable
            style={styles.button}
            onPress={this.showImport}
            android_ripple={{color: '#fff'}}>
            <Text style={styles.text}>Import Profile</Text>
          </Pressable>
          <EnterDetails handleSubmit={this.handleSubmit} />
        </View>
      );
    } else if (this.state.newUser && this.state.import) {
      // new users can import information
      return (
        <View>
          <Pressable
            style={styles.button}
            onPress={this.hideImport}
            android_ripple={{color: '#fff'}}>
            <Text style={styles.text}>Back</Text>
          </Pressable>
          <ImportAccount handleSubmit={this.handleSubmit} />
        </View>
      );
    } else if (this.state.certified == null) {
      // loading page
      return <View />;
    } else if (!this.state.certified) {
      // waiting for authentication page
      return (
        <View style={{height: '100%'}}>
          <View style={{height: '85%'}}>
            <Section title={'Awaiting Authentication'}>
              We are checking over your details to make sure they are valid.
              {'\n\n'}
              Check back soon!
            </Section>
          </View>
          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.navButton}
              onPress={this.clearAll}
              android_ripple={{color: '#fff'}}>
              <Text style={styles.text}>Cancel</Text>
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
    } else if (this.state.move) {
      // move account page
      return (
        <View>
          <Pressable
            style={styles.button}
            onPress={this.showProfile}
            android_ripple={{color: '#fff'}}>
            <Text style={styles.text}>Profile</Text>
          </Pressable>
          <MoveAccount handleDelete={this.handleDelete} />
        </View>
      );
    } else {
      // id card page
      return (
        <View>
          <Pressable
            style={styles.button}
            onPress={this.showVerify}
            android_ripple={{color: '#fff'}}>
            <Text style={styles.text}>Verify</Text>
          </Pressable>
          <Pressable
            style={styles.button}
            onPress={this.showMove}
            android_ripple={{color: '#fff'}}>
            <Text style={styles.text}>Move Account</Text>
          </Pressable>
          <ProfilePage handleDelete={this.handleDelete} identity={null} />
        </View>
      );
    }
  };

  handleRefresh = async () => {
    const identityManager = new IdentityManager();
    // check if the user has an existing account set up
    try {
      const queryResult = await identityManager.getID();
      if (!queryResult || this.state.newUser) {
        this.setState({newUser: true});
        return;
      } else {
        return;
      }
    } catch (e) {
      console.log(e);
    }
  };

  handleDelete = async () => {
    this.setState({newUser: true});
    try {
      Keychain.resetGenericPassword(); // clear BC account info
      const identityManger = new IdentityManager(); // clear personal details in Realm
      const queryResult = await identityManger.getID();
      await identityManger.deleteAll();
      await this.handleRefresh();
    } catch (e) {
      console.log(e);
    }
  };

  handleSubmit = () => {
    this.setState({newUser: false});
    this.handleRefresh().catch(e => console.log(e));
  };

  displayContent = () => {
    if (this.state.newUser) {
      return <NewUser onSubmit={this.handleSubmit} />;
    } else {
      return <ExistingUser onDelete={this.handleDelete} />;
    }
  };

  render() {
    return (
      <SafeAreaView style={{backgroundColor: Colors.white}}>
        <StatusBar />
        {this.displayContent()}
      </SafeAreaView>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default App;
