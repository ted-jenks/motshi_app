/*
Author: Ted Jenks

React-Native component to serve as the profile page for the application.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {Image, Pressable, Text, View} from 'react-native';

// Third party packages
import Accordion from 'react-native-collapsible/Accordion';
import * as Keychain from 'react-native-keychain';
const Realm = require('realm');
import HCESession, {NFCContentType, NFCTagType4} from 'react-native-hce';
import AnimatedLottieView from 'lottie-react-native';

// Local imports
import {IdentityManager} from '../tools/identityManager';
import styles from '../style/styles';
import IdCard from './idCard';

//------------------------------------------------------------------------------

/* BODY */

class ProfilePage extends Component {
  state = {
    identity: null,
    simulation: null,
  };

  constructor() {
    super();
    const identityManager = new IdentityManager();
    // load personal data
    identityManager
      .getID()
      .then(identity => {
        this.setState({identity});
      })
      .catch(e => console.log(e));
  }

  componentWillUnmount() {
    this._stopNFC();
  }

  _deleteInfo = () => {
    // dev tool to delete all information and reset the app
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
  };

  _startNFC = () => {
    const tag = new NFCTagType4(
      NFCContentType.Text,
      JSON.stringify(this.state.identity),
    );
    new HCESession(tag).start().then(simulation => {
      this.setState({simulation});
      console.log(
        'NFC Card Simulation Started\n' +
          'Data sent: \n' +
          JSON.stringify(this.state.identity).substring(0, 500) +
          '...}',
      );
    });
  };

  _stopNFC = () => {
    if (this.state.simulation != null) {
      this.state.simulation
        .terminate()
        .then(r => console.log('NFC Card Simulation Terminated'));
    }
    this.setState({simulation: null});
  };

  _nfcManager = () => {
    if (this.state.simulation == null) {
      return (
        <Pressable style={styles.button} onPress={this._startNFC}>
          <Text style={styles.text}>Share Data</Text>
        </Pressable>
      );
    } else {
      return (
        <Pressable style={styles.button} onPress={this._stopNFC}>
          <Text style={styles.text}>Stop Sharing</Text>
        </Pressable>
      );
    }
  };

  _sharingAnimation = () => {
    return this.state.simulation ? (
      <AnimatedLottieView
        source={require('../assets/75577-scan-pulse (1).json')}
        autoPlay
        loop
      />
    ) : null;
  };

  render() {
    return this.state.identity ? (
      <View>
        <View style={{height: '77%', justifyContent: 'center'}}>
          {/* set height to 85.5% without dev tool in */}
          <Text> </Text>
          {this._sharingAnimation()}
          <IdCard identity={this.state.identity} />
        </View>
        {this._nfcManager()}
        {/* DEV TOOL */}
        <Pressable
          style={[styles.button, {backgroundColor: 'green'}]}
          onPress={this._deleteInfo}>
          <Text style={styles.text}>Delete Info</Text>
        </Pressable>
        {/* --------- */}
      </View>
    ) : (
      <View />
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default ProfilePage;
