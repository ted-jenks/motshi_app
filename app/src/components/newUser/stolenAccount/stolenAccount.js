/*
Author: Ted Jenks

React-Native component to let users report stolen accounts.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import Section from '../../generic/section';
import {Text, View} from 'react-native';
import NavBar from '../navBar';
import NavButton from '../../generic/navButton';
import styles from '../../../style/styles';
import EnterDetails from '../enterDetails/enterDetails';

// Local imports

// Global Constants
import {STOLEN_ACCOUNT_URL} from '@env';
console.log('Stolen Account: ', STOLEN_ACCOUNT_URL);
//------------------------------------------------------------------------------

/* BODY */

class StolenAccount extends Component {
  state = {
    enterDetails: false,
    submitted: false,
  };

  constructor() {
    super();
  }

  handleProceed = () => {
    this.setState({enterDetails: true});
  };

  handleSubmit = () => {
    this.setState({submitted: true});
  };

  displayContent = () => {
    if (!this.state.enterDetails) {
      return (
        <View style={{flex: 1}}>
          <NavBar pageCount={0} onPress1={this.props.onBack} />
          <Section title={'Report a Missing Account'}>
            If you have lost a device or it has been stolen we can locate it for
            you and delete it. This will let you set up a new digital ID.
            {'\n\n'}
            <Text style={{fontWeight: 'bold'}}>
              This will delete your old account and is not reversible.
            </Text>
          </Section>
          <View style={styles.buttonContainer}>
            <NavButton
              text={'PROCEED'}
              onPress={this.handleProceed}
              pressable={true}
            />
          </View>
        </View>
      );
    } else if (this.state.submitted) {
      return (
        <View style={{flex: 1}}>
          <NavBar pageCount={0} onPress1={this.props.onBack} />
          <Section title={'Thank You'}>
            Thank you for your report. We'll check it over and see what we can
            do. Try an set up a new account tomorrow and if unsuccessful
            re-report the issue.
          </Section>
        </View>
      );
    } else {
      return (
        <EnterDetails
          onSubmit={this.handleSubmit}
          onBack={this.props.onBack}
          url={STOLEN_ACCOUNT_URL}
        />
      );
    }
  };

  render() {
    return <View style={{height: '100%'}}>{this.displayContent()}</View>;
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default StolenAccount;
