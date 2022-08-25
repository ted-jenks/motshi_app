/*
Author: Ted Jenks

React-Native component to serve as the navbar for data entry steps
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {Pressable, View} from 'react-native';

// Local imports
import styles, {ICON_DARK} from "../../style/styles";

// Third party packages
import Icon from 'react-native-vector-icons/MaterialIcons';

//------------------------------------------------------------------------------

/* BODY */

class NavBar extends Component<{
  pageCount: number,
  onPress: () => void,
  onPress1: any,
}> {
  render() {
    return (
      <View style={styles.topNavBar}>
        {!(this.props.pageCount === 0) && (
          <Pressable
            style={{padding: 10, paddingBottom: 0}}
            onPress={this.props.onPress}
            android_ripple={{color: '#fff'}}>
            <Icon name="keyboard-arrow-left" size={50} color={ICON_DARK} />
          </Pressable>
        )}
        {this.props.pageCount === 0 && <View style={{width: 10}} />}
        <Pressable
          style={{padding: 10, paddingBottom: 0}}
          onPress={this.props.onPress1}
          onLongPress={this.props.onLongPress}
          android_ripple={{color: '#fff'}}>
          <Icon name="exit-to-app" size={44} color={ICON_DARK} />
        </Pressable>
      </View>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default NavBar;
