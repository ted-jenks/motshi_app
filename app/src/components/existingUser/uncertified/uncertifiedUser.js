/*
Author: Ted Jenks

React-Native component to show display for an uncertified user.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component, useRef} from 'react';
import {Pressable, Text, View} from 'react-native';

// Local imports
import Section from '../../section';
import styles from '../../../style/styles';
import NavButton from '../../navButton';

//------------------------------------------------------------------------------

/* BODY */

class UncertifiedUser extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <View style={{height: '100%'}}>
        <View style={{height: '85%'}}>
          <Section title={'Awaiting Authentication'}>
            We are checking over your details to make sure they are valid.
            {'\n\n'}
            Check back soon!
          </Section>
        </View>
        <View style={styles.buttonContainer}>
          <NavButton text={'Cancel'} onPress={this.props.onDelete} />
          <NavButton text={'Refresh'} onPress={this.refresh} />
        </View>
      </View>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default UncertifiedUser;
