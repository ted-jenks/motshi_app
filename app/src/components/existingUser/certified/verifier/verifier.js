/*
Author: Ted Jenks

React-Native component to serve as a verification tool for blockchain users by
checking if they have a valid certification issued.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import ReactNative, {Alert, NativeEventEmitter, Text, View} from 'react-native';

// Third party packages
import {receiveMessage} from 'react-native-wifi-p2p';

// Local imports
import {DataHasher} from '../../../../tools/dataHasher';
import CheckAnimation from './checkAnimation';
import CrossAnimation from './crossAnimation';
import CustomButton from '../../../generic/customButton';
import ScanningAnimation from './scanningAnimation';
import VerificationStatus from './verificationStatus';
import styles from '../../../../style/styles';
import QRCode from 'react-native-qrcode-svg';
import {getDeviceNameSync} from 'react-native-device-info';
import QrScanner from '../settings/moveAccount/qrScanner';
import IconButton from '../../../generic/iconButton';
import Section from '../../../generic/section';

const {NearbyMessages} = ReactNative.NativeModules;

//------------------------------------------------------------------------------

/* BODY */

class Verifier extends Component {
  state = {
    posStatus: null,
    negStatus: null,
    web3Adapter: null,
    identity: null,
    animationDone: false,
    messagesReceivied: [],
    qrVis: true,
  };

  constructor(props) {
    super();
    this.mounted = true;
  }

  async componentDidMount() {
    this.mounted = true;

    // Subscribe to nearby messages
    NearbyMessages.subscribe(res => console.log(res));
    // Add a listener to detect published messages
    const eventEmitter = new NativeEventEmitter(NearbyMessages);
    this.eventListener = eventEmitter.addListener('MessageReceived', event => {
      let messagesReceived = this.state.messagesReceivied;
      messagesReceived.push(JSON.parse(event.data));
      console.log('Messages Received Updates: ');
      for (const item of messagesReceived) {
        console.log(JSON.stringify(item).substring(0, 500));
      }
      this.setState({messagesReceived});
    });

    this.setState({
      web3Adapter: this.props.route.params.web3Adapter,
    });
  }

  componentWillUnmount() {
    this.mounted = false;
    NearbyMessages.unsubscribe();
    this.eventListener.remove();
  }

  notDetectedAlert = () => {
    this.setState({qrVis: false});
    Alert.alert(
      'No Nearby Devices Detected',
      'No nearby devices are sharing their data right now. Please try again.',
      [
        {
          text: 'Ok',
          onPress: () => {
            this.setState({qrVis: true});
          },
        },
      ],
    );
  };

  checkForMatch = result => {
    let inputData = this.state.identity;
    let scope = this;
    const dataHasher = new DataHasher(inputData);
    const dataHash = dataHasher.getDataHash();
    if (
      result.data_hash_1 === dataHash[0] &&
      result.data_hash_2 === dataHash[1]
    ) {
      return true;
    }
    return false;
  };

  isCertified = () => {
    // request the certificate from the blockchain
    try {
      this.state.web3Adapter
        .getCertificate(this.state.identity.address)
        .then(result => {
          const expiry = new Date(result.expiry * 1000);
          console.log(expiry);
          if (expiry - Date.now() < 0) {
            // Expired card
            this.setState({negStatus: true});
          } else if (
            result.data_hash_1 ===
            '0x0000000000000000000000000000000000000000000000000000000000000000'
          ) {
            // accounts that have not been issued certificates will return this
            this.setState({negStatus: true});
          } else if (result.data == 'Invalid Address') {
            // accounts that don't exist will end up here
            this.setState({negStatus: true});
          } else {
            // accounts with a valid certificate
            if (this.checkForMatch(result)) {
              this.setState({posStatus: true});
            } else {
              this.setState({negStatus: true});
            }
          }
        });
    } catch {}
  };

  showVerificationStatus = () => {
    return (
      <VerificationStatus
        identity={this.state.identity}
        posStatus={this.state.posStatus}
      />
    );
  };

  showVerifierScanner = () => {
    return (
      <View style={{flex:1, width:'100%'}}>
        <Section title={'Verify'}>
          Select <Text style={{fontWeight: 'bold'}}> 'SHARE DATA' </Text> on the
          user's device and scan the QR code.
        </Section>
        {this.state.qrVis && (
          <QrScanner
            onCancel={false}
            onSuccess={this.handleQrComplete}
            active={true}
          />
        )}
      </View>
    );
  };

  showClear = () => {
    if (this.state.animationDone) {
      return (
        <IconButton
          text={'CLEAR'}
          iconName={'cancel'}
          onPress={this.handleClear}
        />
      );
    }
    return null;
  };

  handleClear = () => {
    this.setState({
      identity: null,
      posStatus: null,
      negStatus: null,
      animationDone: false,
    });
  };

  handleAnimationFinish = () => {
    this.setState({animationDone: true});
  };

  handleQrComplete = res => {
    for (const message of this.state.messagesReceivied) {
      if (message.identity.address === res.data) {
        this.handleReceiveMessage(message).catch(e => console.log(e));
        return;
      }
    }
    this.notDetectedAlert();
  };

  handleReceiveMessage = async data => {
    let identity = data.identity;
    let signature = data.signature;
    console.log('Signature: ', signature);
    const signer = await this.state.web3Adapter.validate(identity, signature);
    const expiry = new Date(identity.expiry);
    const dob = new Date(identity.dob);
    identity.expiry = expiry;
    identity.dob = dob;
    // identity.name = 'bob';
    this.setState({identity: identity});
    if (signer.toLowerCase() === identity.address.toLowerCase()) {
      this.isCertified();
    } else {
      this.setState({negStatus: true});
    }
  };

  displayContent = () => {
    if (this.state.animationDone) {
      // User ID ready to show
      return this.showVerificationStatus();
    } else if (!this.state.posStatus && !this.state.negStatus) {
      // No data available
      return this.showVerifierScanner();
    }
    //Playing verification animation
    return null;
  };

  render() {
    return (
      <View
        style={{
          height: '100%',
        }}>
        <View style={styles.IDCardContainer}>
          {(this.state.posStatus && !this.state.animationDone && (
            <CheckAnimation handleFinish={this.handleAnimationFinish} />
          )) ||
            (this.state.negStatus && !this.state.animationDone && (
              <CrossAnimation handleFinish={this.handleAnimationFinish} />
            ))}
          {this.displayContent()}
        </View>
        <View style={styles.buttonContainer}>{this.showClear()}</View>
      </View>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default Verifier;
