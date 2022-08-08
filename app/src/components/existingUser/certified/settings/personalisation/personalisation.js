/*
Author: Ted Jenks

React-Native component to act as a personalisation settings.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {Pressable, ScrollView, View} from 'react-native';
import SettingsTitle from '../settingsTitle';
import ColourPicker from './colourPicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BackArrow from '../backArrow';
import IdCard from '../../profile/idCard/idCard';

// Third party imports

// Local imports

//------------------------------------------------------------------------------

/* BODY */

class Personalisation extends Component {
  state = {
    identity: null,
  };
  constructor(props) {
    super();
    this.state.identity = props.identity;
  }

  handleColorChange = (color1, color2) => {
    let identity = this.state.identity;
    identity.linearGrad1 = color1;
    identity.linearGrad2 = color2;
    this.setState({identity});
    this.props.onColorChange(color1, color2);
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <SettingsTitle text={'Select a Card Colour'} />
        <View style={{padding: 40}}>
          <IdCard identity={this.state.identity} disabled={true} />
        </View>
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 30,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ColourPicker
            color={'#6135bb'}
            onColorChange={this.handleColorChange}
          />
          <ColourPicker
            color={'#3574bb'}
            onColorChange={this.handleColorChange}
          />
          <ColourPicker
            color={'#0c8c81'}
            onColorChange={this.handleColorChange}
          />
        </View>
        <BackArrow onPress={this.props.onBack} />
      </View>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default Personalisation;
