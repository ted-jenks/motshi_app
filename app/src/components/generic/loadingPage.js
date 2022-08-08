/*
Author: Ted Jenks

React-Native component to show loading page.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';

// Third party packages
import LinearGradient from 'react-native-linear-gradient';

// Global constants
import { LINEAR_GRADIENT } from "../../style/styles";

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
        <LinearGradient colors={LINEAR_GRADIENT}>
          <View style={{height: '100%'}} />
        </LinearGradient>
      </SafeAreaView>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default LoadingPage;
