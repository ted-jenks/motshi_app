/*
Author: Ted Jenks

React-Native component to act as a qr scanner.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import { Pressable, View } from "react-native";

// Third party packages
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

// Local imports
import CustomButton from '../../../../generic/customButton';
import Icon from "react-native-vector-icons/MaterialIcons";
import BackArrow from "../backArrow";
//------------------------------------------------------------------------------

/* BODY */

class QrScanner extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <View style={{flex: 1, paddingTop: 150, alignItems: 'flex-start', justifyContent:'flex-end'}}>
        <QRCodeScanner
          onRead={this.props.onSuccess}
          showMarker={true}
          flashMode={RNCamera.Constants.FlashMode.torch}
        />
        <BackArrow onPress={this.props.onCancel}/>
      </View>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default QrScanner;
