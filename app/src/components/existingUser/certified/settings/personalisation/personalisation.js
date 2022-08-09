/*
Author: Ted Jenks

React-Native component to act as a personalisation settings.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {Pressable, ScrollView, View} from 'react-native';

// Third party imports

// Local imports
import SettingsTitle from '../settingsTitle';
import ColourPicker from './colourPicker';
import BackArrow from '../backArrow';
import IdCard from '../../profile/idCard/idCard';
import { identity } from "react-native-svg/lib/typescript/lib/Matrix2D";

// Global Constants
const colours = ['#6135bb', '#33c07c', '#242550']

//------------------------------------------------------------------------------

/* BODY */

class Personalisation extends Component {
  state = {
    identity: null,
    checked: null,
  };
  constructor(props) {
    super();
    this.state.identity = props.identity;
    const current = props.identity.linearGrad2;
    for( let i =0; i<colours.length; i++ ){
      if(colours[i] === current)
        this.state.checked = i
    }
  }

  isChecked = id => {
    if (id === this.state.checked) {
      return true;
    }
    return false;
  };

  handleColorChange = (color1, color2, id) => {
    let identity = this.state.identity;
    identity.linearGrad1 = color1;
    identity.linearGrad2 = color2;
    this.setState({identity, checked: id});
    this.props.onColorChange(color1, color2);
  };

  render() {
    return (
      <View style={{flex: 1}}>
        <BackArrow onPress={this.props.onBack} />
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
            color={colours[0]}
            onColorChange={this.handleColorChange}
            isChecked={this.isChecked(0)}
            id={0}
          />
          <ColourPicker
            color={colours[1]}
            onColorChange={this.handleColorChange}
            isChecked={this.isChecked(1)}
            id={1}
          />
          <ColourPicker
            color={colours[2]}
            onColorChange={this.handleColorChange}
            isChecked={this.isChecked(2)}
            id={2}
          />
        </View>
      </View>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default Personalisation;
