/*
Author: Ted Jenks

React-Native component to handle a new user to the system.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component, useRef} from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';

// Local imports
import EnterDetails from './enterDetails/enterDetails';
import ImportAccount from './importAccount/importAccount';
import SignUpSelection from './signUpSelection/signUpSelection';

//------------------------------------------------------------------------------

/* BODY */

class NewUser extends Component {
  state = {
    register: false,
    import: false,
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

  handleBack = () => {
    this.setState({import: false, register: false});
  };

  displayContent = () => {
    if (this.state.register) {
      return (
        <EnterDetails onSubmit={this.props.onSubmit} onBack={this.handleBack} />
      );
    } else if (this.state.import) {
      return (
        <ImportAccount
          onSubmit={this.props.onSubmit}
          onBack={this.handleBack}
          onRefresh={this.props.onRefresh}
        />
      );
    } else {
      return (
        <SignUpSelection
          onRegister={this.handleRegister}
          onImport={this.handleImport}
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
