/*
Author: Ted Jenks

React-Native component to serve as a verification tool for blockchain users by
checking if they have a valid certification issued.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {View} from 'react-native';

// Third party packages
import {receiveMessage} from 'react-native-wifi-p2p';

// Local imports
import {DataHasher} from '../../../../tools/dataHasher';
import CheckAnimation from './checkAnimation';
import CrossAnimation from './crossAnimation';
import {WifiP2pHandler} from '../../../../tools/wifiP2pHandler';
import CustomButton from '../../../generic/customButton';
import ScanningAnimation from './scanningAnimation';
import VerificationStatus from './verificationStatus';
import styles from '../../../../style/styles';

//------------------------------------------------------------------------------

/* BODY */

class Verifier extends Component {
  state = {
    posStatus: null,
    negStatus: null,
    web3Adapter: null,
    identity: null,
    animationDone: false,
    wifiP2pHandler: null,
  };

  constructor(props) {
    super();
    this.mounted = true;
  }

  async componentDidMount() {
    this.mounted = true;
    await this.setState({
      web3Adapter: this.props.route.params.web3Adapter,
      wifiP2pHandler: new WifiP2pHandler(),
    });
    this.listen().catch(e => console.log('Error in listen: ', e));
  }

  componentWillUnmount() {
    this.mounted = false;
    this.state.wifiP2pHandler.remove();
  }

  listen = async () => {
    console.log('Calling receiveMessage');
    const message = await receiveMessage();
    if (this.mounted) {
      this.handleReceiveMessage(message);
    }
  };

  checkForMatch = result => {
    let inputData = this.state.identity;
    let scope = this;
    const dataHasher = new DataHasher(inputData);
    const dataHash = dataHasher.getDataHash();
    const imageHash = dataHasher.getImageHash();
    if (
      result.data_hash_1 === dataHash[0] &&
      result.data_hash_2 === dataHash[1] &&
      result.image_hash_1 === imageHash[0] &&
      result.image_hash_2 === imageHash[1]
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

  showScanningAnimation = () => {
    return <ScanningAnimation />;
  };

  showClear = () => {
    if (this.state.animationDone) {
      return <CustomButton text={'Clear'} onPress={this.handleClear} />;
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
    this.listen().catch(e => console.log(e));
  };

  handleAnimationFinish = () => {
    this.setState({animationDone: true});
  };

  handleReceiveMessage = message => {
    console.log('Message Received: ', message.substring(0, 500) + '..."}');
    let identity = JSON.parse(message);
    const expiry = new Date(identity.expiry);
    const dob = new Date(identity.dob);
    identity.expiry = expiry;
    identity.dob = dob;
    // identity.name = 'bob';
    this.setState({identity: identity});
    this.isCertified();
  };

  displayContent = () => {
    if (this.state.animationDone) {
      // User ID ready to show
      return this.showVerificationStatus();
    } else if (!this.state.posStatus && !this.state.negStatus) {
      // No data available
      return this.showScanningAnimation();
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
