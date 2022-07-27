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
import LinearGradient from "react-native-linear-gradient";

// Local imports

//------------------------------------------------------------------------------

/* BODY */

class LoadingPage extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <SafeAreaView style={{backgroundColor: '#802ca6'}}>
        <StatusBar />
        <LinearGradient colors={['#e5b2fa', '#b66dde', '#4b1675']}>
          <View style={{height: '100%'}} /></LinearGradient>
      </SafeAreaView>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default LoadingPage;
