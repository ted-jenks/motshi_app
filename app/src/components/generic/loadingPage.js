/*
Author: Ted Jenks

React-Native component to show loading page.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component, useRef} from 'react';
import {View} from 'react-native';

// Third party packages

// Local imports

//------------------------------------------------------------------------------

/* BODY */

class LoadingPage extends Component {
  constructor() {
    super();
  }

  render() {
    return <View style={{height: '100%', backgroundColor: 'pink'}} />;
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default LoadingPage;
