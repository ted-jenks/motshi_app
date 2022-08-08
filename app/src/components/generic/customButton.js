/*
Author: Ted Jenks

React-Native component to act as a button in the app.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component, useRef} from 'react';
import { Pressable, Text } from "react-native";

// Local imports
import styles from "../../style/styles";

//------------------------------------------------------------------------------

/* BODY */

class CustomButton extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <Pressable
        style={styles.navButton}
        onPress={this.props.onPress}
        onLongPress={this.props.onLongPress}
        android_ripple={{color: '#fff'}}>
        <Text style={[styles.navButtonText]}>{this.props.text}</Text>
      </Pressable>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default CustomButton;
