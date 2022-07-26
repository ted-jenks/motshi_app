/*
Author: Ted Jenks

React-Native component to give the user a choice of sign up options.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component, useRef} from 'react';
import {View} from 'react-native';
import CustomButton from '../../generic/customButton';

// Third party packages

// Local imports

//------------------------------------------------------------------------------

/* BODY */

class SignUpSelection extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <View
        style={{
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <CustomButton text={'Register'} onPress={this.props.onRegister} />
        <CustomButton text={'Import Account'} onPress={this.props.onImport} />
      </View>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default SignUpSelection;
