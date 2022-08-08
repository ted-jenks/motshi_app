/*
Author: Ted Jenks

React-Native component to act as a colour picker in personalisation settings.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {Pressable, View} from 'react-native';
import SettingsTitle from '../settingsTitle';

// Third party imports

// Local imports

//------------------------------------------------------------------------------

/* BODY */

class ColourPicker extends Component {
  constructor(props) {
    super();
  }

  handlePress = () => {
    //TODO set colour to this.props.color
  };

  render() {
    return (
      <Pressable
        style={{
          borderRadius: 100,
          backgroundColor: this.props.color,
          height: 90,
          width: 90,
          margin: 30,
        }}
        onPress={this.handlePress}
      />
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default ColourPicker;
