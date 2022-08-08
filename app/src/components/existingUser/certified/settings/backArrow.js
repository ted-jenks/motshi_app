/*
Author: Ted Jenks

React-Native component to act as a settings item.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {Pressable, Text, View} from 'react-native';

// Third party imports
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles, { ICON_DARK } from "../../../../style/styles";

// Local imports

//------------------------------------------------------------------------------

/* BODY */

class BackArrow extends Component {
  constructor(props) {
    super();
  }

  render() {
    return (
      <View style={{flex: 1, justifyContent: 'flex-end'}}>
        <Pressable
          style={{padding: 8}}
          onPress={this.props.onPress}
          android_ripple={{color: '#fff'}}>
          <Icon name="keyboard-arrow-left" size={35} color={ICON_DARK} />
        </Pressable>
      </View>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default BackArrow;
