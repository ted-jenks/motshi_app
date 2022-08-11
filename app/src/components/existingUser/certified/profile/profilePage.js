/*
Author: Ted Jenks

React-Native component to serve as the profile page for the application.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component, useEffect, useState} from 'react';
import ReactNative, {
  Alert,
  Animated,
  Pressable,
  Text,
  View,
} from 'react-native';
import {
  CardStyleInterpolators,
  createStackNavigator,
  TransitionSpecs,
  useCardAnimation,
} from '@react-navigation/stack';

// Local imports
import styles from '../../../../style/styles';
import IdCard from './idCard/idCard';
import IconButton from '../../../generic/iconButton';
import QRCode from 'react-native-qrcode-svg';
const {NearbyMessages} = ReactNative.NativeModules;

//------------------------------------------------------------------------------

/* BODY */

const Stack = createStackNavigator();

class ProfilePage extends Component {
  state = {
    identity: null,
    web3Adapter: null,
    qr: false,
    sharing: false,
  };

  constructor(props) {
    super();
    this.state.identity = props.route.params.identity;
    this.state.web3Adapter = props.route.params.web3Adapter;
  }

  qrScreen = ({navigation}) => {
    const {current} = useCardAnimation();

    useEffect(() => {
      return () => {
        this.handleStopShare();
      };
    }, []);

    return (
      <View style={{flex: 1}}>
        <Pressable
          style={{height: '100%', width: '100%'}}
          onPress={navigation.goBack}
        />
        <Animated.View
          style={{
            height: 500,
            width: '100%',
            position: 'absolute',
            alignSelf: 'center',
            bottom: -500,
            backgroundColor: 'white',
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            paddingTop: 15,
            transform: [
              {
                translateY: current.progress.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -500],
                  extrapolate: 'clamp',
                }),
              },
            ],
          }}>
          <View
            style={{
              height: 3,
              width: '50%',
              borderRadius: 70,
              backgroundColor: 'rgba(0,0,0,0.5)',
              alignSelf: 'center',
            }}
          />
          <View
            style={{
              flex: 1,
              flexGrow: 4.5,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <QRCode
              value={this.state.identity.address}
              size={300}
              logo={require('../../../../assets/logo/White_Both_Stacked.png')}
              logoMargin={10}
              logoBorderRadius={5}
              logoBackgroundColor={this.state.identity.linearGrad2}
              backgroundColor={'rgba(255,255,255,0)'}
              color={this.state.identity.linearGrad2}
            />
          </View>
          <IconButton
            onPress={() => {
              this.share();
            }}
            iconName={'wifi-tethering'}
            color={this.state.identity.linearGrad2}
            text={'TRY AGAIN'}
          />
        </Animated.View>
      </View>
    );
  };

  idScreen = ({navigation}) => {
    return (
      <View style={{flex: 1}}>
        <View
          style={[
            styles.IDCardContainer,
            {backgroundColor: 'rgba(255,255,255,0)'},
          ]}>
          <IdCard identity={this.state.identity} />
        </View>
        <IconButton
          onPress={() => {
            this.handleShareData();
            navigation.navigate('QR', {
              onGoBack: () => this.handleStopShare(),
            });
          }}
          iconName={'wifi-tethering'}
          color={this.state.identity.linearGrad2}
          text={'SHARE DATA'}
        />
      </View>
    );
  };

  stack = () => {
    return (
      <Stack.Navigator
        initialRouteName={'ID'}
        detachInactiveScreens={false}
        animationTypeForReplace={'push'}
        screenOptions={{
          gestureEnabled: true,
          headerShown: false,
          animationEnabled: true,
          presentation: 'transparentModal',
          gestureResponseDistance: 500,
          useNativeDriver: true,
        }}>
        <Stack.Screen name="ID" component={this.idScreen} />
        <Stack.Screen
          name="QR"
          options={{cardOverlayEnabled: true}}
          component={this.qrScreen}
        />
      </Stack.Navigator>
    );
  };

  componentWillUnmount() {
    this.handleStopShare();
  }

  sleep = ms => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };

  handleShareData = async () => {
    await this.setState({sharing: true});
    while (this.state.sharing) {
      await this.share();
      await this.sleep(5000);
    }
  };

  share = async () => {
    const signature = await this.state.web3Adapter.sign(this.state.identity);
    NearbyMessages.publish(
      JSON.stringify({
        identity: this.state.identity,
        signature: signature,
      }),
      res => {
        console.log("Publish status: ", res);
      },
    );
  }

  handleStopShare = () => {
    this.setState({sharing: false});
    console.log('Unpublish');
    NearbyMessages.unpublish();
  };

  render() {
    return <View style={{flex: 1}}>{this.stack()}</View>;
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default ProfilePage;
