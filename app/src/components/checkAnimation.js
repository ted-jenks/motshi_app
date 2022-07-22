/*
Author: Ted Jenks

React-Native component to show confirmation animation.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component, useRef} from 'react';

// Third party packages
import AnimatedLottieView from 'lottie-react-native';

// Local imports
const Web3 = require('web3');

//------------------------------------------------------------------------------

/* BODY */

class CheckAnimation extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    // Sometimes the animation doesn't show
    setTimeout(this.props.handleFinish, 3000);
  }

  render() {
    return (
      <AnimatedLottieView
        source={require('../assets/97556-check.json')}
        autoPlay={true}
        loop={false}
        style={{marginTop: 0}}
        speed={3}
        onAnimationFinish={this.props.handleFinish}
      />
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default CheckAnimation;
