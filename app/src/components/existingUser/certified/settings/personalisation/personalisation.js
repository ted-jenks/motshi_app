/*
Author: Ted Jenks

React-Native component to act as a personalisation settings.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {View} from 'react-native';

// Local imports
import SettingsTitle from '../menu/settingsTitle';
import ColourPicker from './colourPicker';
import BackArrow from '../backArrow';
import IdCard from '../../profile/idCard/idCard';
import { THEME_COLORS } from "../../../../../style/styles";

// Global Constants
const colours = THEME_COLORS;

//------------------------------------------------------------------------------

/* BODY */

class Personalisation extends Component {
  state = {
    identity: null,
    checked: null,
  };
  constructor(props) {
    super();
    this.state.identity = props.route.params.identity;
    const current = this.state.identity.linearGrad2;
    for (let i = 0; i < colours.length; i++) {
      if (colours[i] === current) {
        this.state.checked = i;
      }
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
    this.props.route.params.onColorChange(color1, color2);
  };

  render() {
    return (
      <View style={{flex: 1, paddingTop:40}}>
        <BackArrow onPress={this.props.navigation.goBack} />
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
            color1={colours[0][0]}
            color2={colours[0][1]}
            onColorChange={this.handleColorChange}
            isChecked={this.isChecked(0)}
            id={0}
          />
          <ColourPicker
            color1={colours[1][0]}
            color2={colours[1][1]}
            onColorChange={this.handleColorChange}
            isChecked={this.isChecked(1)}
            id={1}
          />
          <ColourPicker
            color1={colours[2][0]}
            color2={colours[2][1]}
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
