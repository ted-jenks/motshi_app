/*
Author: Ted Jenks

React-Native component to act as a navigation button in the app.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {Pressable, Text} from 'react-native';

// Local imports
import styles from '../../style/styles';

//------------------------------------------------------------------------------

/* BODY */

class NavButton extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Pressable
        style={styles.navButton}
        onPress={this.props.onPress}
        android_ripple={{color: '#fff'}}>
        <Text style={styles.text}>{this.props.text}</Text>
      </Pressable>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default NavButton;
