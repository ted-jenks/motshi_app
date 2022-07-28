/*
Author: Ted Jenks

React-Native component to give the user a choice of sign up options.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {View} from 'react-native';

// Local imports
import CustomButton from '../../generic/customButton';

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
