/*
Author: Ted Jenks

React-Native component to act as a settings menu.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import Section from '../../../../generic/section';
import CustomButton from '../../../../generic/customButton';
import styles from '../../../../../style/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconButton from '../../../../generic/iconButton';

// Third party imports

// Local imports

//------------------------------------------------------------------------------

/* BODY */

class DeleteAccount extends Component {
  state = {
    identity: null,
    web3Adapter: null,
    onDelete: null,
  };

  constructor(props) {
    super();
    this.state.identity = props.identity;
    this.state.web3Adapter = props.web3Adapter;
    this.state.onDelete = props.onDelete;
  }

  handleDelete = () => {
    this.state.web3Adapter
      .deleteMyAccount()
      .then(receipt => {
        if (!receipt.status) {
          return;
        }
        this.state.onDelete();
      })
      .catch(e => console.log(e));
  };

  displayContent = () => {
    return (
      <View style={{flex: 1}}>
        <Section title={'Delete Account?'}>
          Are you sure you want to delete your account?
          {'\n\n'}
          <Text style={{fontWeight: 'bold'}}>
            This process is irreversible.
          </Text>
        </Section>
        <Pressable onPress={this.handleDelete} android_ripple={{color: '#fff'}}>
          <Text style={[styles.clickableText, {paddingTop:10}]}>
            I confirm that I wish to permanently delete my account.
          </Text>
        </Pressable>
        <IconButton
          onPress={this.props.onBack}
          iconName={'cancel'}
          text={'CANCEL'}
        />
      </View>
    );
  };

  render() {
    return <View style={{height: '100%'}}>{this.displayContent()}</View>;
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default DeleteAccount;
