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
import Icon from 'react-native-vector-icons/MaterialIcons';

// Local imports
import ProfilePage from './profile/profilePage';
import Verifier from './verifier/verifier';
import Settings from './settings/settings';
import { ICON_DARK } from '../../../style/styles';

// Global constants
const DRAWER_ACTIVE_COLOR = 'rgba(132,138,246,0.37)';
const DRAWER_ACTIVE_TEXT = '#38319b';

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
        headerTintColor: ICON_DARK,
      }}>
      <Drawer.Screen
        name="Profile"
        component={ProfilePage}
        initialParams={{
          identity: props.identity,
          onDelete: props.onDelete,
          web3Adapter: props.web3Adapter,
        }}
        unmountOnBlur={true}
        options={{
          unmountOnBlur: true,
          drawerIcon: ({focused, size}) => (
            <Icon
              name={'badge'}
              size={size}
              color={focused ? DRAWER_ACTIVE_TEXT : '#494949'}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Verify"
        component={Verifier}
        initialParams={{web3Adapter: props.web3Adapter}}
        unmountOnBlur={true}
        options={{
          unmountOnBlur: true,
          drawerIcon: ({focused, size}) => (
            <Icon
              name={'check-circle'}
              size={size}
              color={focused ? DRAWER_ACTIVE_TEXT : '#494949'}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="Settings"
        component={Settings}
        initialParams={{
          identity: props.identity,
          web3Adapter: props.web3Adapter,
          onDelete: props.onDelete,
          onColorChange: props.onColorChange,
        }}
        unmountOnBlur={true}
        options={{
          unmountOnBlur: true,
          drawerIcon: ({focused, size}) => (
            <Icon
              name={'settings'}
              size={size}
              color={focused ? DRAWER_ACTIVE_TEXT : '#494949'}
            />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default CertifiedUser;
