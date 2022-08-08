/*
Author: Ted Jenks

React-Native component to show fail animation for sharing data.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {Animated, View} from 'react-native';

//------------------------------------------------------------------------------

/* BODY */

class FailAnimation extends Component {
  state = {
    animationOpacity: new Animated.Value(0.5),
    animationSize: new Animated.Value(0),
  };

  constructor() {
    super();
  }

  showAnimation = () => {
    Animated.parallel([
      Animated.timing(this.state.animationOpacity, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.animationSize, {
        toValue: 1000,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      this.setState({
        animationOpacity: new Animated.Value(1),
        animationSize: new Animated.Value(0),
      });
      this.props.onAnimationFinish();
    });

    const bubble = {
      transform: [{scale: this.state.animationSize}],
    };

    return (
      <Animated.View
        style={[
          {
            width: 1,
            height: 1,
            borderRadius: 50,
            backgroundColor: 'rgb(215,82,82)',
            position: 'absolute',
            bottom: -100,
            opacity: this.state.animationOpacity,
          },
          bubble,
        ]}
      />
    );
  };

  render() {
    return <View>{this.showAnimation()}</View>;
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default FailAnimation;
