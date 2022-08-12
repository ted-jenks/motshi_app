/*
Author: Ted Jenks

React-Native component to show scanning animation.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {Animated, Text, View} from 'react-native';

// Local Imports
import styles from '../../../../style/styles';

//------------------------------------------------------------------------------

/* BODY */

class ScanningAnimation extends Component {
  state = {
    animationOpacity: new Animated.Value(0.1),
    animationSize: new Animated.Value(0),
    go: true,
  };

  constructor() {
    super();
  }

  componentDidMount() {
    this.cycleAnimation();
  }

  cycleAnimation = () => {
    Animated.parallel([
      Animated.timing(this.state.animationOpacity, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.animationSize, {
        toValue: 50,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      this.setState({
        animationOpacity: new Animated.Value(0.1),
        animationSize: new Animated.Value(0),
      });
      this.cycleAnimation();
    });
  };

  showAnimation = () => {
    const bubble = {
      transform: [{scale: this.state.animationSize}],
    };

    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Animated.View
          style={[
            {
              width: 10,
              height: 10,
              borderRadius: 100,
              backgroundColor: '#6135bb',
              position: 'absolute',
              alignSelf: 'center',
              bottom: 270,
              opacity: this.state.animationOpacity,
            },
            bubble,
          ]}
        />
        <Text style={[styles.scanningText]}> {'\n\n\n\n\n\n\n\n\n'}Scanning</Text>
      </View>
    );
  };

  render() {
    return <View>{this.showAnimation()}</View>;
  }

  // render() {
  //   return (
  //     <View
  //       style={{
  //         flex:1,
  //         alignItems: 'center',
  //         justifyContent: 'flex-end',
  //       }}>
  //       <AnimatedLottieView source={SCAN_ANIMATION} autoPlay loop />
  //       <Text style={[styles.scanningText]}> {'\n'}SCANNING</Text>
  //     </View>
  //   );
  // }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default ScanningAnimation;
