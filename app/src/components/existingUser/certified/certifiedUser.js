/*
Author: Ted Jenks

React-Native component to show display for a certified user.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import * as React from 'react';
import {Component, useRef} from 'react';
import {View} from 'react-native';

// Local imports
import ProfilePage from './profile/profilePage';
import Verifier from './verifier/verifier';
import MoveAccount from './moveAccount/moveAccount';
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from '@react-navigation/native';

//------------------------------------------------------------------------------

/* BODY */

// const Drawer = createDrawerNavigator();
//
// function MyDrawer() {
//   return (
//     <Drawer.Navigator>
//       <Drawer.Screen name="Profile" component={ProfilePage} />
//       <Drawer.Screen name="Verify" component={Verifier} />
//     </Drawer.Navigator>
//   );
// }

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
          web3Adapter={props.web3Adapter}
          onMoveAccountPress={this.handleMoveAccountPress}
          onProfilePress={this.handleProfilePress}
        />
      ),
      moveAccount: (
        <MoveAccount
          web3Adapter={props.web3Adapter}
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
        <NavigationContainer>
          {/*<MyDrawer />*/}
        </NavigationContainer>
      </View>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default CertifiedUser;
