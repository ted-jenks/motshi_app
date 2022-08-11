/*
Author: Ted Jenks

React-Native component to show scanning animation.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {Text, View} from 'react-native';

// Third party packages
import AnimatedLottieView from 'lottie-react-native';

// Local Imports
import styles, {SCAN_ANIMATION} from '../../../../style/styles';

//------------------------------------------------------------------------------

/* BODY */

class ScanningAnimation extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <View
        style={{
          flex:1,
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>
        <AnimatedLottieView source={SCAN_ANIMATION} autoPlay loop />
        <Text style={[styles.scanningText]}> {'\n'}SCANNING</Text>
      </View>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default ScanningAnimation;
