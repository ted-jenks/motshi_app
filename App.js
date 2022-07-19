/*
Author: Ted Jenks

React-Native App.js (entry point of application)
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
const {SafeAreaView, StatusBar, View} = require('react-native');

// Third party imports
import * as Keychain from 'react-native-keychain';

// Local imports
import ProfilePage from './app/src/components/profilePage.js';
import EnterDetails from './app/src/components/enterDetails.js';
import Verifier from './app/src/components/verifier.js';
import {IdentityManager} from './app/src/tools/identityManager';
import Section from './app/src/components/section';
import {Alert, PermissionsAndroid, Pressable, Text} from 'react-native';
import styles from './app/src/style/styles';
import {initialize} from 'react-native-wifi-p2p';
const Web3 = require('web3');
const {Web3Adapter} = require('./app/src/tools/web3Adapter.js');

// Global constants
const NETWORK_URL = 'http://46.208.6.22:7545';
const web3 = new Web3(NETWORK_URL);
const contractAddress = '0xc47da351b3d579C608cB316D9e1Bd852C2ec2f4D';
//------------------------------------------------------------------------------

/* BODY */

//FIXME: Small gap in ID when expanded. Probably need to program that myself

class App extends Component {
  state = {
    newUser: false,
    verify: false,
    certified: null,
    web3Adapter: null,
    address: null,
  };

  constructor() {
    super();
    this.rerender().catch(e => console.log(e));
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

  rerender = () => {
    return new Promise((resolve, reject) => {
      const identityManager = new IdentityManager();
      // check if the user has an existing account set up
      identityManager
        .getID()
        .then(res => {
          if (!res || this.state.newUser) {
            this.setState({newUser: true});
            resolve();
          } else {
            // set up connection to BC network
            Keychain.getGenericPassword()
              .then(credentials => {
                const account = {
                  address: credentials.username,
                  privateKey: credentials.password,
                };
                const web3Adapter = new Web3Adapter(
                  web3,
                  contractAddress,
                  account,
                );
                this.setState({address: account.address});
                this.setState({web3Adapter: web3Adapter});
                // check if user is certified yet
                this.refresh()
                  .then(resolve())
                  .catch(e => console.log(e));
              })
              .catch(e => reject(e));
          }
        })
        .catch(e => reject(e));
    });
  };

  displayContent = () => {
    // logic of what section of the app to display (ID, Data entry, or verification)
    if (this.state.verify) {
      return (
        <View>
          <Pressable style={styles.button} onPress={this.showProfile}>
            <Text style={styles.text}>Profile</Text>
          </Pressable>
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
          <View style={{height: '91.55%'}}>
            <Section title={'Awaiting Authentication'}>
              We are checking over your details to make sure they are valid.
              {'\n\n'}
              Check back soon!
            </Section>
          </View>
          <Pressable style={styles.button} onPress={this.refresh}>
            <Text style={styles.text}>Refresh</Text>
          </Pressable>
        </View>
      );
    } else {
      // id card page
      return (
        <View>
          <Pressable style={styles.button} onPress={this.showVerify}>
            <Text style={styles.text}>Verify</Text>
          </Pressable>
          <ProfilePage handleDelete={this.handleDelete} identity={null} />
        </View>
      );
    }
  };

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
          onPress: () => this.setState({certified: false, newUser: true}),
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
          onPress: () => {
            this.setState({certified: false, newUser: true, address: null});
            Keychain.resetGenericPassword(); // clear BC account info
            const identityManger = new IdentityManager(); // clear personal details in Realm
            identityManger
              .getID()
              .then(res => {
                identityManger
                  .deleteAll()
                  .then(this.props.handleDelete)
                  .catch(e => console.log(e));
              })
              .catch(e => console.log(e));
          },
        },
      ],
    );

  certified = () => {
    return new Promise((resolve, reject) => {
      this.state.web3Adapter
        .getCertificate(this.state.address)
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
            this.errorAlert();
          } else {
            resolve(true);
          }
        })
        .catch(e => {
          console.log(e);
          resolve(false);
        });
    });
  };

  handleSubmit = () => {
    this.setState({newUser: false, certified: false});
    this.rerender().catch(e => console.log(e));
  };

  handleDelete = () => {
    this.setState({newUser: true, certified: false, address: null});
    this.rerender().catch(e => console.log(e));
  };

  showVerify = () => {
    this.setState({verify: true});
  };

  showProfile = () => {
    this.setState({verify: false});
  };

  refresh = async () => {
    this.certified().then(certified => {
      this.setState({certified});
      if (certified) {
        return;
      }
      this.state.web3Adapter.isRejected(this.state.address).then(rejected => {
        if (rejected) {
          this.rejectAlert();
        }
      });
    });
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
