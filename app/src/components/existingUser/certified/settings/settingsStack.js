/*
Author: Ted Jenks

React-Native component to act as a settings menu.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {View} from 'react-native';

// Third party imports
import {NavigationContainer} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator, HeaderStyleInterpolators,
  TransitionSpecs,
} from "@react-navigation/stack";
import Settings from './menu/settings';
import Personalisation from './personalisation/personalisation';
import MoveAccount from './moveAccount/moveAccount';
import DeleteAccount from './deleteAccount/deleteAccount';

// Local imports

//------------------------------------------------------------------------------

/* BODY */

const Stack = createStackNavigator();

class SettingsStack extends Component {
  state = {
    identity: null,
    web3Adapter: null,
    onDelete: null,
    onColorChange: null,
  };

  constructor(props) {
    super();
    this.state.identity = props.route.params.identity;
    this.state.web3Adapter = props.route.params.web3Adapter;
    this.state.onDelete = props.route.params.onDelete;
    this.state.onColorChange = props.route.params.onColorChange;
  }

  stack = () => {
    return (
      <Stack.Navigator
        initialRouteName={'Menu'}
        detachInactiveScreens={true}
        screenOptions={{
          gestureEnabled: true,
          headerShown: false,
          animationEnabled: true,
          presentation: 'modal',
          gestureDirection: 'horizontal',
          animationTypeForReplace: 'push',
          animation:'slide_from_right',
          cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        }}>
        <Stack.Screen
          name="Menu"
          initialParams={{
            identity: this.state.identity,
            web3Adapter: this.state.web3Adapter,
            onDelete: this.state.onDelete,
            onColorChange: this.state.onColorChange,
          }}
          component={Settings}
        />
        <Stack.Screen
          initialParams={{
            identity: this.state.identity,
            onColorChange: this.state.onColorChange,
          }}
          name="Personalisation"
          component={Personalisation}
        />
        <Stack.Screen
          initialParams={{
            identity: this.state.identity,
            web3Adapter: this.state.web3Adapter,
          }}
          name="Move Account"
          component={MoveAccount}
        />
        <Stack.Screen
          initialParams={{
            identity: this.state.identity,
            web3Adapter: this.state.web3Adapter,
            onDelete: this.state.onDelete,
          }}
          name="Delete Account"
          component={DeleteAccount}
        />
      </Stack.Navigator>
    );
  };

  render() {
    return <View style={{height: '100%'}}>{this.stack()}</View>;
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default SettingsStack;
