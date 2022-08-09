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
import styles, {ICON_DARK} from '../../../../style/styles';

// Local imports

//------------------------------------------------------------------------------

/* BODY */

class BackArrow extends Component {
  constructor(props) {
    super();
  }

  render() {
    return (
      <Pressable
        style={{
          paddingTop:10,
          paddingHorizontal: 8,
          flexDirection: 'row',
          alignItems:'center',
          justifyContent:'flex-start',
        }}
        onPress={this.props.onPress}
        android_ripple={{color: '#fff'}}>
        <Icon name="keyboard-arrow-left" size={35} color={ICON_DARK} />
        <Text style={[styles.clickableText, {color: ICON_DARK, padding:0}]}>back</Text>
      </Pressable>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default BackArrow;
