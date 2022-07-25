/*
Author: Ted Jenks

React-Native component to show success animation for sharing data.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component, useRef} from 'react';
import {Animated, View} from 'react-native';

//------------------------------------------------------------------------------

/* BODY */

class SuccessAnimation extends Component {
  state = {
    animationPosition: new Animated.Value(0),
    animationOpacity: new Animated.Value(1),
    animationSize: new Animated.Value(0),
  };

  constructor() {
    super();
  }

  showAnimation = () => {
    Animated.parallel([
      Animated.timing(this.state.animationPosition, {
        toValue: -650,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.animationOpacity, {
        toValue: 0,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(this.state.animationSize, {
        toValue: 25,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start(() => {
      this.setState({
        animationPosition: new Animated.Value(0),
        animationOpacity: new Animated.Value(1),
        animationSize: new Animated.Value(0),
      });
      this.props.onAnimationFinish();
    });

    const bubble = {
      transform: [
        {translateY: this.state.animationPosition},
        {scale: this.state.animationSize},
      ],
    };

    return (
      <Animated.View
        style={[
          {
            width: 100,
            height: 50,
            borderTopRightRadius: 50,
            borderTopLeftRadius: 50,
            backgroundColor: 'rgb(214,245,255)',
            position: 'absolute',
            bottom: -200,
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

export default SuccessAnimation;
