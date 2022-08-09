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
import styles, {ICON_DARK} from '../../../../../style/styles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconButton from '../../../../generic/iconButton';
import BackArrow from '../backArrow';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

// Third party imports

// Local imports

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

  handleCheck = isChecked => {
    this.setState({checked: isChecked});
  };

  displayContent = () => {
    return (
      <View style={{flex: 1}}>
        <BackArrow onPress={this.props.onBack} />
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
          onPress={this.handleDelete}
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
