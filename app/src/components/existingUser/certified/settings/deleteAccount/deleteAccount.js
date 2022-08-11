/*
Author: Ted Jenks

React-Native component to act as a settings menu.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {Alert, Pressable, ScrollView, Text, View} from 'react-native';

// Third party imports
import formData from 'form-data';
import fetch from 'node-fetch';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

// Local imports
import Section from '../../../../generic/section';
import CustomButton from '../../../../generic/customButton';
import styles, {ICON_DARK} from '../../../../../style/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconButton from '../../../../generic/iconButton';
import BackArrow from '../backArrow';

// Global constants
import {DELETE_ACCOUNT_URL} from '@env';
console.log(DELETE_ACCOUNT_URL)
//------------------------------------------------------------------------------

/* BODY */

class DeleteAccount extends Component {
  state = {
    identity: null,
    web3Adapter: null,
    onDelete: null,
    checked: false,
  };

  constructor(props) {
    super();
    this.state.identity = props.route.params.identity;
    this.state.web3Adapter = props.route.params.web3Adapter;
    this.state.onDelete = props.route.params.onDelete;
  }

  errorAlert = () =>
    // show alert informing user that they have been rejected
    Alert.alert(
      'ERROR',
      'We ran into an error processing your request. Please try again later',
      [
        {
          text: 'OK',
        },
      ],
    );

  deleteAlert = () => {
    Alert.alert(
      'Delete Information',
      'Do you wish to delete all of your information?\n\n' +
      'This process is NOT REVERSIBLE and you will have to purchase a new ID.',
      [
        {text: 'Yes', onPress: () => this.handleDelete()},
        {
          text: 'No',
          onPress: () => console.log('cancel Pressed'),
        },
      ],
    );
  };

  handleDelete = async () => {
    const url = DELETE_ACCOUNT_URL;
    const headers = {
      Accept: 'application/json',
    };
    // create formData object to send via https
    const form = new formData();
    form.append('Content-Type', 'application/octet-stream');
    form.append('address', this.state.identity.address);
    try {
      const data = await fetch(url, {
        method: 'POST',
        headers: headers,
        body: form,
      });
      if (data.status === 200) {
        this.state.onDelete();
      } else {
        this.errorAlert();
        console.log(data);
      }
    } catch (e) {
      this.errorAlert();
      console.log(e);
    }
  };

  handleCheck = isChecked => {
    this.setState({checked: isChecked});
  };

  displayContent = () => {
    return (
      <View style={{flex: 1, paddingTop:40}}>
        <BackArrow onPress={this.props.navigation.goBack} />
        <Section title={'Delete Account?'}>
          Are you sure you want to delete your account?
          {'\n\n'}
          <Text style={{fontWeight: 'bold'}}>
            This process is irreversible.
          </Text>
        </Section>
        <View
          style={{
            flex: 1,
            flexGrow: 4,
            justifyContent: 'flex-end',
            paddingHorizontal: 17,
          }}>
          <View
            style={{
              alignItems: 'center',
            }}>
            <BouncyCheckbox
              size={25}
              fillColor={ICON_DARK}
              unfillColor="#FFFFFF"
              text="I wish to permanently delete my account."
              iconStyle={{borderColor: ICON_DARK}}
              iconInnerStyle={{borderWidth: 2}}
              textStyle={[
                styles.sectionDescription,
                {margin: 0, paddingTop: 10, textDecorationLine: 'none'},
              ]}
              onPress={this.handleCheck}
            />
          </View>
        </View>
        <IconButton
          onPress={this.deleteAlert}
          iconName={'delete'}
          text={'DELETE ACCOUNT'}
          disabled={!this.state.checked}
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
