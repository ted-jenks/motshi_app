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
import styles, { ICON_DARK } from "../../../../../style/styles";

// Local imports

//------------------------------------------------------------------------------

/* BODY */

class SettingsItem extends Component {
  constructor(props) {
    super();
  }

  render() {
    return (
      <View style={{width: '100%', alignItems: 'center'}}>
        <Pressable style={styles.settingsItem} onPress={this.props.onPress}>
          <View
            style={{
              flexDirection: 'row',
            }}>
            <Icon
              style={{alignSelf: 'center', paddingLeft: 20}}
              name={this.props.iconName}
              size={25}
              color={ICON_DARK}
            />
            <Text
              style={styles.settingsItemText}>
              {this.props.text}
            </Text>
          </View>
          <Icon
            style={{alignSelf: 'center', paddingRight: 10}}
            name="keyboard-arrow-right"
            size={25}
            color={ICON_DARK}
          />
        </Pressable>
      </View>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default SettingsItem;
