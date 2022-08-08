/*
Author: Ted Jenks

React-Native component to act as a personalisation settings.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import { Pressable, ScrollView, View } from "react-native";
import SettingsTitle from '../settingsTitle';
import ColourPicker from './colourPicker';
import Icon from "react-native-vector-icons/MaterialIcons";
import BackArrow from "../backArrow";

// Third party imports

// Local imports

//------------------------------------------------------------------------------

/* BODY */

class Personalisation extends Component {
  constructor(props) {
    super();
  }

  render() {
    return (
      <ScrollView>
        <SettingsTitle text={'Select a Colour'} />
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 30,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ColourPicker color={'#6135bb'} />
          <ColourPicker color={'#2fadad'} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 30,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ColourPicker color={'#f67878'} />
          <ColourPicker color={'#27bb30'} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 30,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ColourPicker color={'#e7da3c'} />
          <ColourPicker color={'#000000'} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 30,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ColourPicker color={'#f80000'} />
          <ColourPicker color={'#9105bb'} />
        </View>

        <BackArrow onPress={this.props.onBack}/>
      </ScrollView>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default Personalisation;
