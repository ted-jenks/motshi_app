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
import SettingsTitle from '../menu/settingsTitle';
import {IdentityManager} from '../../../../../tools/identityManager';
import styles, { ICON_DARK } from "../../../../../style/styles";
import BouncyCheckbox from "react-native-bouncy-checkbox";

//------------------------------------------------------------------------------

/* BODY */

class ColourPicker extends Component {
  constructor(props) {
    super();
  }

  handlePress = () => {
    const identityManager = new IdentityManager();
    identityManager
      .changeColors(this.props.color1, this.props.color2)
      .catch(e => console.log(e));
    this.props.onColorChange(this.props.color1, this.props.color2, this.props.id);
  };

  render() {
    return (
      <BouncyCheckbox
        size={50}
        fillColor={this.props.color2}
        unfillColor={this.props.color2}
        disableText={true}
        iconStyle={{borderColor: this.props.color2, margin: 30}}
        iconInnerStyle={{borderWidth: 2}}
        textStyle={[
          styles.sectionDescription,
          {margin: 0, paddingTop: 10, textDecorationLine: 'none'},
        ]}
        onPress={this.handlePress}
        isChecked={this.props.isChecked || false}
        disableBuiltInState={true}
      />
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default ColourPicker;
