/*
Author: Ted Jenks

React-Native component to manage certified users.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';

// Third party imports
import {createDrawerNavigator} from '@react-navigation/drawer';

// Local imports
import ProfilePage from './profile/profilePage';
import Verifier from './verifier/verifier';
import MoveAccount from './moveAccount/moveAccount';

// Global constants
const DRAWER_ACTIVE_COLOR = 'rgba(206,132,246,0.44)';
const DRAWER_ACTIVE_TEXT = '#64319b';

//------------------------------------------------------------------------------

/* BODY */

function CertifiedUser(props) {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveBackgroundColor: DRAWER_ACTIVE_COLOR,
        drawerActiveTintColor: DRAWER_ACTIVE_TEXT,
        headerTransparent: true,
        headerTitle: '',
        drawerLabelStyle: {fontSize: 20},
        drawerStyle: {paddingTop: 40},
      }}>
      <Drawer.Screen
        name="Profile"
        component={ProfilePage}
        initialParams={{
          identity: props.identity,
          onDelete: props.onDelete,
        }}
        unmountOnBlur={true}
        options={{unmountOnBlur: true}}
      />
      <Drawer.Screen
        name="Verify"
        component={Verifier}
        initialParams={{web3Adapter: props.web3Adapter}}
        unmountOnBlur={true}
        options={{unmountOnBlur: true}}
      />
      <Drawer.Screen
        name="Move Account"
        component={MoveAccount}
        initialParams={{
          identity: props.identity,
          web3Adapter: props.web3Adapter,
          onDelete: props.onDelete,
        }}
        unmountOnBlur={true}
        options={{unmountOnBlur: true}}
      />
    </Drawer.Navigator>
  );
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default CertifiedUser;
