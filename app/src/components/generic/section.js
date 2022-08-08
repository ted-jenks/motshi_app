/*
Author: Ted Jenks

React-Native component to serve as an extensible text section within the
application.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React from 'react';
import {Text, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

// Local imports
import styles from '../../style/styles.js';

//------------------------------------------------------------------------------

/* BODY */

const Section = ({children, title}): Node => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle]}>{title}</Text>
      <Text style={[styles.sectionDescription]}>{children}</Text>
    </View>
  );
};

//------------------------------------------------------------------------------

/* EXPORTS */

export default Section;
