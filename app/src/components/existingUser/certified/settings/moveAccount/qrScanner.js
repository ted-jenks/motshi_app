/*
Author: Ted Jenks

React-Native component to act as a qr scanner.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {Pressable, View} from 'react-native';

// Third party packages
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

// Local imports
import CustomButton from '../../../../generic/customButton';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BackArrow from '../backArrow';
//------------------------------------------------------------------------------

/* BODY */

class QrScanner extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
        }}>
        {this.props.onCancel !== false && (
          <BackArrow onPress={this.props.onCancel} />
        )}
        <QRCodeScanner
          onRead={this.props.onSuccess}
          showMarker={false}
          flashMode={RNCamera.Constants.FlashMode.off}
          cameraContainerStyle={{ width: 275, height:275, borderWidth: 0, borderColor: 'white', alignSelf: 'center', }}
          cameraStyle={{ width: '97%', height:'97%', alignSelf: 'center', }}
          reactivate={this.props.active || false}
        />
      </View>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default QrScanner;
