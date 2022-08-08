/*
Author: Ted Jenks

React-Native component to give the user a choice of sign up options.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {Pressable, Text, View} from 'react-native';

// Local imports
import styles from '../../../style/styles';

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
          justifyContent: 'flex-end',
          paddingBottom: 10,
        }}>
        <Pressable
          style={styles.signUpSelectionButton}
          onPress={this.props.onRegister}
          android_ripple={{color: '#fff'}}>
          <Text style={styles.signUpSelectionText}>{'REGISTER'}</Text>
        </Pressable>
        <Pressable
          style={styles.signUpSelectionButton}
          onPress={this.props.onImport}
          android_ripple={{color: '#fff'}}>
          <Text style={styles.signUpSelectionText}>{'IMPORT ACCOUNT'}</Text>
        </Pressable>
        <View
          style={{
            alignItems: 'center',
          }}>
          <Pressable
            onPress={this.props.onStolen}
            android_ripple={{color: '#fff'}}>
            <Text style={[styles.clickableText, {padding:10}]}>
              REPORT ACCOUNT STOLEN OR LOST
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default SignUpSelection;
