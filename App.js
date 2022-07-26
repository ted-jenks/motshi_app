/*
Author: Ted Jenks

React-Native App.js (entry point of application)
 */

import 'react-native-gesture-handler';
//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
const {SafeAreaView, StatusBar, View} = require('react-native');
import {LogBox, PermissionsAndroid, Pressable, Text} from 'react-native';

// Third party imports
import * as Keychain from 'react-native-keychain';
const Web3 = require('web3');

// Local imports
import {IdentityManager} from './app/src/tools/identityManager';
import {initialize} from 'react-native-wifi-p2p';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import ExistingUser from './app/src/components/existingUser/existingUser';
import NewUser from './app/src/components/newUser/newUser';
import LoadingPage from './app/src/components/generic/loadingPage';

// Global constants
import {BLOCKCHAIN_URL, CONTRACT_ADDRESS} from '@env';
const web3 = new Web3(BLOCKCHAIN_URL);

LogBox.ignoreAllLogs(); //Ignore all log notifications
//------------------------------------------------------------------------------

/* BODY */

//TODO: Zero knowledge proof to prove deletion?

//TODO: Write card as anim

//TODO: Fix move account functionality
//TODO: Add delete account and theft prevention functionality
//TODO: Look at bluetooth react native packages for data sharing
//TODO: Add expiry functionality

//TODO: Write security protocol for transactions, research message signing and blockchain transactions
//TODO: Put the blockchain on a real network and test it
//TODO: Look at potential forms of attack (man in the middle, replay)]

//TODO: FIX MODEL!!!

import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import ProfilePage from './app/src/components/existingUser/certified/profile/profilePage';
import Verifier from './app/src/components/existingUser/certified/verifier/verifier';
import MoveAccount from './app/src/components/existingUser/certified/moveAccount/moveAccount';

//------------------------------------------------------------------------------

/* BODY */

class App extends Component {
  state = {
    newUser: null,
    certified: null,
    web3Adapter: null,
    identity: null,
  };

  constructor() {
    super();
    this.setState({newUser: null, certified: null});
    setTimeout(() => this.handleRefresh().catch(e => console.log(e)), 2000);
  }

  async componentDidMount() {
    // this.handleRefresh().catch(e => console.log(e));
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

  MyDrawer = () => {
    const Drawer = createDrawerNavigator();
    return (
      <Drawer.Navigator>
        <Drawer.Screen
          name="Profile"
          component={ProfilePage}
          initialParams={{
            identity: this.state.identity,
            onDelete: this.handleDelete,
          }}
        />
        <Drawer.Screen
          name="Verify"
          component={Verifier}
          initialParams={{web3Adapter: this.state.web3Adapter}}
        />
        <Drawer.Screen
          name="Move Account"
          component={MoveAccount}
          initialParams={{
            identity: this.state.identity,
            web3Adapter: this.state.web3Adapter,
            onDelete: this.handleDelete,
          }}
        />
      </Drawer.Navigator>
    );
  };

  handleRefresh = async () => {
    const identityManager = new IdentityManager();
    // check if the user has an existing account set up
    try {
      const identity = await identityManager.getID();
      console.log(
        'Identity information found in App.js: ',
        JSON.stringify(identity).substring(0, 300),
      );
      this.setState({identity});
      if (identity == null) {
        setTimeout(() => this.setState({newUser: true}), 1000);
        return;
      } else {
        setTimeout(() => this.setState({newUser: false}), 1000);
        return;
      }
    } catch (e) {
      console.log(e);
    }
  };

  handleDelete = async () => {
    await this.setState({newUser: true, certified: false});
    setTimeout(async () => {
      // wait for navigation to unmount
      try {
        let identityManger = new IdentityManager(); // clear personal details in Realm
        const queryResult = await identityManger.getID();
        console.log('final: ', queryResult);
        await identityManger.deleteAll();
        Keychain.resetGenericPassword(); // clear BC account info
      } catch (e) {
        console.log(e);
      }
    }, 2000);
  };

  handleSubmit = () => {
    this.setState({newUser: false});
    this.handleRefresh().catch(e => console.log(e));
  };

  handleCertified = web3Adapter => {
    this.setState({certified: true, web3Adapter: web3Adapter});
  };

  displayContent = () => {
    if (this.state.newUser) {
      return (
        <NewUser onSubmit={this.handleSubmit} onRefresh={this.handleRefresh} />
      );
    } else if (this.state.certified) {
      return this.MyDrawer();
    } else if (this.state.newUser === false) {
      return (
        <ExistingUser
          onDelete={this.handleDelete}
          onCertified={this.handleCertified}
        />
      );
    } else {
      return <LoadingPage />;
    }
  };

  render() {
    return <NavigationContainer>{this.displayContent()}</NavigationContainer>;
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default App;
