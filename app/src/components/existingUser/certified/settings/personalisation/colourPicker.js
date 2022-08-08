/*
Author: Ted Jenks

React-Native component to act as a colour picker in personalisation settings.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {Pressable, View} from 'react-native';

// Third party imports

// Local imports
import SettingsTitle from '../settingsTitle';
import {IdentityManager} from '../../../../../tools/identityManager';

//------------------------------------------------------------------------------

/* BODY */

class ColourPicker extends Component {
  constructor(props) {
    super();
  }

  calcNewColorVal = (color, percent) => {
    let val = parseInt((color * (100 + percent)) / 100);
    val = val < 255 ? val : 255;
    return val;
  };

  shadeColor = (color, percent) => {
    let R = parseInt(color.substring(1, 3), 16);
    let G = parseInt(color.substring(3, 5), 16);
    let B = parseInt(color.substring(5, 7), 16);

    R = this.calcNewColorVal(R, percent);
    G = this.calcNewColorVal(G, percent);
    B = this.calcNewColorVal(B, percent);

    let RR = R.toString(16).length == 1 ? '0' + R.toString(16) : R.toString(16);
    let GG = G.toString(16).length == 1 ? '0' + G.toString(16) : G.toString(16);
    let BB = B.toString(16).length == 1 ? '0' + B.toString(16) : B.toString(16);

    return '#' + RR + GG + BB;
  };

  handlePress = () => {
    const newLightColor = this.shadeColor(this.props.color, 60);
    const identityManager = new IdentityManager();
    identityManager
      .changeColors(newLightColor, this.props.color)
      .catch(e => console.log(e));
    this.props.onColorChange(newLightColor, this.props.color);
  };

  render() {
    return (
      <Pressable
        style={{
          borderRadius: 100,
          backgroundColor: this.props.color,
          height: 50,
          width: 50,
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
