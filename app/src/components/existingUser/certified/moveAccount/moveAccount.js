/*
Author: Ted Jenks

React-Native component to show handle the transfer of accounts to new devices.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component, useRef} from 'react';
import {Pressable, Text, TextInput, View} from 'react-native';

// Third party packages
import Keychain from 'react-native-keychain';
import {
  cancelConnect,
  connect,
  getConnectionInfo,
  receiveMessage,
  sendMessage,
  startDiscoveringPeers,
  subscribeOnPeersUpdates,
  unsubscribeFromPeersUpdates,
} from 'react-native-wifi-p2p';

// Local imports
const Web3 = require('web3');
import {IdentityManager} from '../../../../tools/identityManager';
import Section from '../../../section';
import styles from '../../../../style/styles';
const {Web3Adapter} = require('../../../../tools/web3Adapter.js');

// Global constants
import {BLOCKCHAIN_URL, CONTRACT_ADDRESS} from '@env';
import {Colors} from 'react-native/Libraries/NewAppScreen';
const web3 = new Web3(BLOCKCHAIN_URL);

//------------------------------------------------------------------------------

/* BODY */

class MoveAccount extends Component {
  state = {
    mounted: true,
    identity: null,
    web3Adapter: null,
    newAddress: '',
    fail: false,
    success: false,
    devices: [],
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
    try {
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
            web3Adapter: new Web3Adapter(web3, CONTRACT_ADDRESS, account),
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

  componentDidMount() {
    try {
      subscribeOnPeersUpdates(this.handleNewPeers);
      startDiscoveringPeers().catch(e =>
        console.warn('Failed to start discovering Peers: ', e),
      );
    } catch (e) {
      console.error('Error: ', e);
    }
  }

  componentWillUnmount() {
    this.setState({mounted: false});
    unsubscribeFromPeersUpdates(this.handleNewPeers);
  }

  handleNewPeers = ({devices}) => {
    console.log('OnPeersUpdated', devices);
    this.setState({devices: devices});
  };

  sendData = async () => {
    const connectionInfo = await getConnectionInfo();
    if (connectionInfo.groupFormed) {
      try {
        console.log('Already connected to: ', connectionInfo);
        // If connected
        await sendMessage(JSON.stringify(this.state.identity));
        await cancelConnect().catch(e =>
          console.log('Error in cancelConnect: ', e),
        );
        return true;
      } catch (e) {
        console.log('Error in sendMessage: ', e);
        return false;
      }
    } else {
      for (const device of this.state.devices) {
        if (device.primaryDeviceType === '10-0050F204-5') {
          console.log('Connecting to: ', device);
          try {
            await connect(device.deviceAddress).catch(e =>
              console.log('Error in connect: ', e),
            );
            await getConnectionInfo();
            await sendMessage(JSON.stringify(this.state.identity));
            await cancelConnect().catch(e =>
              console.log('Error in cancelConnect: ', e),
            );
            return true;
          } catch (e) {
            console.log('Error in sendMessage: ', e);
            return false;
          }
        }
      }
    }
    console.log('No valid receiving devices detected:\n', this.state.devices);
  };

  performTransfer = async () => {
    const r = await this.state.web3Adapter.moveAccount(this.state.newAddress);
    if (r.data === 'Invalid Address' || !r.status) {
      //TODO: create error message here
      return false;
    } else {
      return true;
    }
  };

  onSubmitAddress = async () => {
    //TODO: CHECK ADDRESS VALID OR SOMETHING
    //TODO: make this function deal with failure properly
    let status = await this.sendData();
    if (status) {
      status = await this.performTransfer();
      if (status) {
        this.deleteInfo();
      }
    }
  };

  deleteInfo = () => {
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

  renderMoveAccount = () => {
    return (
      <View>
        <Section title={'Move Account to a New Device'}>
          To begin the account transfer process, please select 'Import Account'
          on the new device. Then enter the address given on screen.
        </Section>
        <TextInput
          style={styles.input}
          label={'Address'}
          mode="outlined"
          placeholder={'Address'}
          placeholderTextColor={Colors.dark}
          onChangeText={res => {
            this.setState({newAddress: res});
          }}
          ref={input => {
            this.name = input;
          }}
        />
        <Pressable
          style={styles.button}
          onPress={this.onSubmitAddress}
          android_ripple={{color: '#fff'}}>
          <Text style={styles.text}>Submit</Text>
        </Pressable>
      </View>
    );
  };

  render() {
    return <View style={{height: '100%'}}>{this.renderMoveAccount()}</View>;
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default MoveAccount;
