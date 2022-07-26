/*
Author: Ted Jenks

React-Native component to show loading page.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component, useRef} from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';

// Third party packages

// Local imports

//------------------------------------------------------------------------------

/* BODY */

class LoadingPage extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <SafeAreaView style={{backgroundColor: 'white'}}>
        <StatusBar />
        <View style={{height: '100%', backgroundColor: 'pink'}} />
      </SafeAreaView>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default LoadingPage;
