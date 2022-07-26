/*
Author: Ted Jenks

React-Native component to show scanning animation.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component, useRef} from 'react';
import {Text, View} from 'react-native';

// Third party packages
import AnimatedLottieView from 'lottie-react-native';

// Local Imports
import styles from '../../../../style/styles';

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
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>
        <AnimatedLottieView
          source={require('../../../../assets/75577-scan-pulse (1).json')}
          autoPlay
          loop
        />
        <Text style={styles.textBlack}> {'\n'}SCANNING</Text>
      </View>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default ScanningAnimation;
