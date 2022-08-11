/*
Author: Ted Jenks

React-Native component to act as a settings title.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {Pressable, Text} from 'react-native';
import styles from "../../../../../style/styles";

// Third party imports

// Local imports

//------------------------------------------------------------------------------

/* BODY */

class SettingsTitle extends Component {
  constructor(props) {
    super();
  }

  render() {
    return (
        <Text style={styles.settingsTitle}>{this.props.text}</Text>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default SettingsTitle;
