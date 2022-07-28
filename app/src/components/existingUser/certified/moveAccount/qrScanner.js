/*
Author: Ted Jenks

React-Native component to act as a qr scanner.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {View} from 'react-native';

// Third party packages
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

// Local imports
import CustomButton from '../../../generic/customButton';
//------------------------------------------------------------------------------

/* BODY */

class QrScanner extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <View style={{flex: 1, paddingTop: 40}}>
        <CustomButton text={'Cancel'} onPress={this.props.onCancel} />
        <QRCodeScanner
          onRead={this.props.onSuccess}
          showMarker={true}
          flashMode={RNCamera.Constants.FlashMode.torch}
        />
      </View>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default QrScanner;
