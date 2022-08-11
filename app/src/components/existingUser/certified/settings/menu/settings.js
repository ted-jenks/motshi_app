/*
Author: Ted Jenks

React-Native component to act as a settings menu.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {ScrollView, Text, View} from 'react-native';

// Third party imports

// Local imports
import SettingsItem from './settingsItem';
import SettingsTitle from './settingsTitle';
import Personalisation from '../personalisation/personalisation';
import styles from '../../../../../style/styles';
import {useNavigation} from '@react-navigation/native';

//------------------------------------------------------------------------------

/* BODY */

class Settings extends Component {
  state = {
    moveAccount: false,
    identity: null,
    web3Adapter: null,
    onDelete: null,
    onColorChange: null,
    deleteAccount: false,
    personalisation: false,
  };

  constructor(props) {
    super();
    this.state.identity = props.route.params.identity;
    this.state.web3Adapter = props.route.params.web3Adapter;
    this.state.onDelete = props.route.params.onDelete;
    this.state.onColorChange = props.route.params.onColorChange;
  }

  handleDelete = () => {
    this.props.navigation.navigate('Delete Account');
  };

  handlePersonalisation = () => {
    this.props.navigation.navigate('Personalisation');
  };

  handleMove = () => {
    this.props.navigation.navigate('Move Account');
  };

  displayContent = () => {
    return (
      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        <Text style={styles.settingsHeading}>Settings</Text>
        <SettingsTitle text={'App Settings'} />
        <SettingsItem
          text={'Personalisation'}
          onPress={this.handlePersonalisation}
          iconName={'brush'}
        />
        <SettingsTitle text={'Account Management'} />
        <SettingsItem
          text={'Move Account To A New Device'}
          iconName={'import-export'}
          onPress={this.handleMove}
        />
        <SettingsItem
          iconName={'delete'}
          text={'Delete Account'}
          onPress={this.handleDelete}
        />
      </ScrollView>
    );
  };

  render() {
    return (
      <View style={{height: '100%', paddingTop: 40}}>
        {this.displayContent()}
      </View>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default Settings;
