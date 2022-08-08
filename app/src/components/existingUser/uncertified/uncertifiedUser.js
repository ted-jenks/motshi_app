/*
Author: Ted Jenks

React-Native component to show display for an uncertified user.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {View} from 'react-native';

// Local imports
import Section from '../../generic/section';
import styles from '../../../style/styles';
import NavButton from '../../generic/navButton';

//------------------------------------------------------------------------------

/* BODY */

class UncertifiedUser extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <View style={{height: '100%', backgroundColor: 'white'}}>
        <View>
          <Section title={'Awaiting Authentication'}>
            We are checking over your details to make sure they are valid.
            {'\n\n'}
            Check back soon!
          </Section>
        </View>
        <View style={styles.buttonContainer}>
          <NavButton text={'REFRESH'} onPress={this.props.onRefresh} onLongPress={this.props.onDelete} pressable={true}/>
        </View>
      </View>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default UncertifiedUser;
