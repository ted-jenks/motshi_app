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
import MoveAccount from './moveAccount/moveAccount';
import SettingsItem from './settingsItem';
import SettingsTitle from './settingsTitle';
import DeleteAccount from './deleteAccount/deleteAccount';
import Personalisation from './personalisation/personalisation';
import styles from '../../../../style/styles';

//------------------------------------------------------------------------------

/* BODY */

class Settings extends Component {
  state = {
    moveAccount: false,
    identity: null,
    web3Adapter: null,
    onDelete: null,
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
    this.setState({deleteAccount: true});
  };

  handlePersonalisation = () => {
    this.setState({personalisation: true});
  };

  handleMove = () => {
    this.setState({moveAccount: true});
  };

  handleBack = () => {
    this.setState({
      moveAccount: false,
      deleteAccount: false,
      personalisation: false,
    });
  };

  displayContent = () => {
    if (this.state.moveAccount) {
      return (
        <MoveAccount
          onDelete={this.state.onDelete}
          identity={this.state.identity}
          web3Adapter={this.state.web3Adapter}
          onBack={this.handleBack}
        />
      );
    } else if (this.state.deleteAccount) {
      return (
        <DeleteAccount
          onDelete={this.state.onDelete}
          identity={this.state.identity}
          web3Adapter={this.state.web3Adapter}
          onBack={this.handleBack}
        />
      );
    } else if (this.state.personalisation) {
      return (
        <Personalisation
          onBack={this.handleBack}
          identity={this.state.identity}
          onColorChange={this.state.onColorChange}
        />
      );
    } else {
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
    }
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
