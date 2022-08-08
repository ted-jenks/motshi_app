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

  style = () => {
    if (this.props.pressable) {
      return styles.navButton;
    } else {
      return [styles.navButton, {backgroundColor: 'grey'}];
    }
  };

  render() {
    return (
      <Pressable
        style={this.style()}
        onPress={this.props.onPress}
        onLongPress={this.props.onLongPress}
        android_ripple={{color: '#fff'}}
        disabled={!this.props.pressable}>
        <Text style={styles.navButtonText}>{this.props.text}</Text>
      </Pressable>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default NavButton;
