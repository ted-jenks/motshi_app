/*
Author: Ted Jenks

React-Native App.js (entry point of application)
 */

import 'react-native-gesture-handler';
//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import ReactNative, { Alert, LogBox, PermissionsAndroid } from "react-native";

// Third party imports
import * as Keychain from 'react-native-keychain';
import {NavigationContainer} from '@react-navigation/native';
import {initialize} from 'react-native-wifi-p2p';
import NetInfo from "@react-native-community/netinfo";

// Local imports
import {IdentityManager} from './app/src/tools/identityManager';
import ExistingUser from './app/src/components/existingUser/existingUser';
import NewUser from './app/src/components/newUser/newUser';
import LoadingPage from './app/src/components/generic/loadingPage';
 //,
LogBox.ignoreAllLogs(); //Ignore all logs

//------------------------------------------------------------------------------

/* BODY */

class App extends Component {
  state = {
    newUser: null,
    failConnect:false,
  };

  constructor() {
    super();
    this.handleRefresh().catch(e => console.log(e));
    const unsubscribe = NetInfo.addEventListener(state => {
      if(!state.isConnected){
        this.noConnectionAlert();
        this.setState({failConnect: true});
      }
    });
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


  noConnectionAlert = () =>
    Alert.alert(
      'NO INTERNET CONNECTION',
      'This app requires an internet connection. Please connect to the internet and restart app to continue.',
      [],
    );


  handleRefresh = async () => {
    const identityManager = new IdentityManager();
    // check if the user has an existing account set up
    try {
      const identity = await identityManager.getID();
      console.log(
        'Identity information found in App.js: ',
        JSON.stringify(identity).substring(0, 300),
      );
      if (identity == null) {
        setTimeout(() => this.setState({newUser: true}), 750);
        return;
      } else {
        setTimeout(() => this.setState({newUser: false}), 750);
        return;
      }
    } catch (e) {
      console.log(e);
    }
  };

  handleDelete = async () => {
    await this.setState({newUser: true});
    setTimeout(async () => {
      // wait for navigation to unmount
      try {
        let identityManger = new IdentityManager(); // clear personal details in Realm
        const queryResult = await identityManger.getID();
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

  displayContent = () => {
    if (this.state.newUser && !this.state.failConnect) {
      return (
        <NewUser onSubmit={this.handleSubmit} onRefresh={this.handleRefresh} onDelete={this.handleDelete}/>
      );
    } else if (this.state.newUser === false && !this.state.failConnect) {
      return <ExistingUser onDelete={this.handleDelete} />;
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
