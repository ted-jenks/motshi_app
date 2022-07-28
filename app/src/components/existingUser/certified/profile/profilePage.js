/*
Author: Ted Jenks

React-Native component to serve as the profile page for the application.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {Alert, View} from 'react-native';

// Local imports
import styles from '../../../../style/styles';
import IdCard from './idCard/idCard';
import CustomButton from '../../../generic/customButton';
import FailAnimation from './failAnimation';
import SuccessAnimation from './successAnimation';
import {WifiP2pHandler} from '../../../../tools/wifiP2pHandler';

//------------------------------------------------------------------------------

/* BODY */

class ProfilePage extends Component {
  state = {
    identity: null,
    wifiP2pHandler: null,
    shareDataSuccess: false,
    shareDataFailed: false,
  };

  constructor(props) {
    super();
    this.state.identity = props.route.params.identity;
    this.state.wifiP2pHandler = new WifiP2pHandler();
  }

  componentWillUnmount() {
    this.state.wifiP2pHandler.remove();
  }

  deleteAlert = () => {
    Alert.alert(
      'Delete Information',
      'Do you wish to delete all of your information?',
      [
        {text: 'Yes', onPress: () => this.props.route.params.onDelete()},
        {
          text: 'No',
          onPress: () => console.log('cancel Pressed'),
        },
      ],
    );
  };

  handleShareData = async () => {
    try {
      const status = await this.state.wifiP2pHandler.sendData(
        this.state.identity,
      );
      if (status) {
        this.handleShareDataSuccess();
      } else {
        this.handleShareDataFail();
      }
    } catch (e) {
      console.log('Unhandled Exception while sharing data: ', e);
    }
  };

  handleShareDataSuccess = () => {
    this.setState({shareDataSuccess: true});
  };

  handleShareDataFail = () => {
    this.setState({shareDataFailed: true});
  };

  handleAnimationFinish = () => {
    this.setState({shareDataFailed: false, shareDataSuccess: false});
  };

  render() {
    return (
      <View style={{height: '100%', paddingTop: 60}}>
        <View style={styles.IDCardContainer}>
          <IdCard identity={this.state.identity} />
        </View>
        <View style={styles.sendAnimationContainer}>
          {this.state.shareDataSuccess && (
            <SuccessAnimation onAnimationFinish={this.handleAnimationFinish} />
          )}
          {this.state.shareDataFailed && (
            <FailAnimation onAnimationFinish={this.handleAnimationFinish} />
          )}
        </View>
        <View style={styles.buttonContainer}>
          <CustomButton
            text={'Share Data'}
            onPress={this.handleShareData}
            onLongPress={this.deleteAlert}
          />
        </View>
      </View>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default ProfilePage;
