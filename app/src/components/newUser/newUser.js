/*
Author: Ted Jenks

React-Native component to handle a new user to the system.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {SafeAreaView, StatusBar} from 'react-native';

// Local imports
import EnterDetails from './enterDetails/enterDetails';
import ImportAccount from './importAccount/importAccount';
import SignUpSelection from './signUpSelection/signUpSelection';
import StolenAccount from "./stolenAccount/stolenAccount";

// Global Constants
import {SIGN_UP_URL} from '@env'; //updater
console.log('newUser: ', SIGN_UP_URL)
//------------------------------------------------------------------------------

/* BODY */

class NewUser extends Component {
  state = {
    register: false,
    import: false,
    stolen: false,
  };

  constructor() {
    super();
  }

  handleRegister = () => {
    this.setState({register: true});
  };

  handleImport = () => {
    this.setState({import: true});
  };

  handleStolen = () => {
    this.setState({stolen: true});
  };

  handleBack = () => {
    this.setState({import: false, register: false, stolen: false});
  };

  displayContent = () => {
    if (this.state.register) {
      return (
        <EnterDetails onSubmit={this.props.onSubmit} onBack={this.handleBack} url={SIGN_UP_URL} />
      );
    } else if (this.state.import) {
      return (
        <ImportAccount
          onSubmit={this.props.onSubmit}
          onBack={this.handleBack}
          onRefresh={this.props.onRefresh}
        />
      );
    } else if (this.state.stolen) {
      return (
        <StolenAccount
          onBack={this.handleBack}
          onRefresh={this.props.onRefresh}
          onDelete={this.props.onDelete}
        />
      );
    } else {
      return (
        <SignUpSelection
          onRegister={this.handleRegister}
          onImport={this.handleImport}
          onStolen={this.handleStolen}
          onDelete={this.props.onDelete}
        />
      );
    }
  };

  render() {
    return (
      <SafeAreaView style={{backgroundColor: 'white'}}>
        <StatusBar />
        {this.displayContent()}
      </SafeAreaView>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default NewUser;
