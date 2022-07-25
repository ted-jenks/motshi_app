/*
Author: Ted Jenks

React-Native component to show rejection animation.
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

class CrossAnimation extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    setTimeout(this.props.handleFinish, 5000);
  }

  render() {
    return (
      <AnimatedLottieView
        source={require('../../../../assets/97562-error.json')}
        autoPlay={true}
        loop={false}
        style={{marginTop: 20, width: '67%'}}
        speed={2}
        onAnimationFinish={this.props.handleFinish}
      />
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default CrossAnimation;
