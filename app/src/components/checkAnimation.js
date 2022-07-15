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
    setTimeout(this.props.handleFinish, 5000);
  }

  render() {
    return (
      <AnimatedLottieView
        source={require('../assets/97556-check.json')}
        autoPlay={true}
        loop={false}
        style={{marginTop: 60}}
        speed={2}
        onAnimationFinish={this.props.handleFinish}
      />
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default CheckAnimation;
