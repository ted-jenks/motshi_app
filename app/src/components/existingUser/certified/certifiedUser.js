/*
Author: Ted Jenks

React-Native component to show display for a certified user.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component, useRef} from 'react';
import {View} from 'react-native';

// Local imports
import ProfilePage from './profile/profilePage';
import Verifier from './verifier/verifier';
import MoveAccount from './moveAccount/moveAccount';

//------------------------------------------------------------------------------

/* BODY */

class CertifiedUser extends Component {
  state = {
    page: 'profilePage',
  };

  pages: {
    verifier: JSX.Element,
    moveAccount: JSX.Element,
    profilePage: JSX.Element,
  };

  constructor(props) {
    super();
    this.pages = {
      profilePage: (
        <ProfilePage
          onDelete={props.onDelete}
          onVerifierPress={this.handleVerifierPress}
          onMoveAccountPress={this.handleMoveAccountPress}
        />
      ),
      verifier: (
        <Verifier
          onMoveAccountPress={this.handleMoveAccountPress}
          onProfilePress={this.handleProfilePress}
        />
      ),
      moveAccount: (
        <MoveAccount
          onDelete={props.onDelete}
          onVerifierPress={this.handleVerifierPress}
          onProfilePress={this.handleProfilePress}
        />
      ),
    };
  }

  handleVerifierPress = () => {
    this.setState({page: 'verifier'});
  };

  handleProfilePress = () => {
    this.setState({page: 'profilePage'});
  };

  handleMoveAccountPress = () => {
    this.setState({page: 'moveAccount'});
  };

  displayContent = () => {
    return this.pages[this.state.page];
  };

  render() {
    return (
      <View>
        {this.displayContent()}
      </View>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default CertifiedUser;
