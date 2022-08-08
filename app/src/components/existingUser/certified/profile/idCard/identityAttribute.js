/*
Author: Ted Jenks

React-Native component to serve as an attribute field on the ID card for the
application.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {Text, View} from 'react-native';

// Local imports
import styles from '../../../../../style/styles';

//------------------------------------------------------------------------------

/* BODY */

class IdentityAttribute extends Component {
  state = {};

  render() {
    return (
      <View style={styles.attributeContainer}>
        <Text style={styles.attributeTitle}>{this.props.heading}:</Text>
        <View
          style={{
            flex: 1,
            flexBasis: '15%',
          }}>
          <Text style={styles.attributeDescription}>{this.props.children}</Text>
        </View>
      </View>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default IdentityAttribute;
