/*
Author: Ted Jenks

React-Native component to act as a button with an icon.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// Recat Imports
import {Pressable, Text, View} from 'react-native';
import React, {Component} from 'react';

// Third Party Imports
import styles from '../../style/styles';

// Local Imports
import Icon from 'react-native-vector-icons/MaterialIcons';

//------------------------------------------------------------------------------

/* BODY */

class IconButton extends Component<{onPress: () => void}> {
  render() {
    return (
      <View style={styles.buttonContainer}>
        <Pressable
          style={[styles.navButton, {flexDirection: 'row'}]}
          onPress={this.props.onPress}
          android_ripple={{color: '#fff'}}>
          <Icon name={this.props.iconName} size={25} color="#ffffff" />
          <Text style={[styles.navButtonText, {marginLeft: 5}]}>
            {this.props.text}
          </Text>
        </Pressable>
      </View>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default IconButton;
