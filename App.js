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

import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from '@react-navigation/native';
import ProfilePage from "./app/src/components/existingUser/certified/profile/profilePage";
import Verifier from "./app/src/components/existingUser/certified/verifier/verifier";
import MoveAccount from "./app/src/components/existingUser/certified/moveAccount/moveAccount";

//------------------------------------------------------------------------------

/* BODY */

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Profile" component={ProfilePage} />
      <Drawer.Screen name="Verify" component={Verifier} />
      <Drawer.Screen name="Move Account" component={MoveAccount} />
    </Drawer.Navigator>
  );
}

class App extends Component {
  state = {
    newUser: null,
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

  handleRefresh = async () => {
    const identityManager = new IdentityManager();
    // check if the user has an existing account set up
    try {
      const queryResult = await identityManager.getID();
      if (!queryResult) {
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
      return <NewUser onSubmit={this.handleSubmit} onRefresh={this.handleRefresh}/>;
    } else if (this.state.newUser === false) {
      return <ExistingUser onDelete={this.handleDelete} />;
    } else {
      return <LoadingPage />;
    }
  };

  render() {
    return (
      // <SafeAreaView style={{backgroundColor: Colors.white}}>
      //   <StatusBar />
      //   {this.displayContent()}
      // </SafeAreaView>
      <NavigationContainer>
        <MyDrawer />
      </NavigationContainer>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default App;
