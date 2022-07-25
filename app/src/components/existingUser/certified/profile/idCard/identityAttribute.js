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
import {Colors} from 'react-native/Libraries/NewAppScreen';

// Local imports
import styles from '../../../../../style/styles';

//------------------------------------------------------------------------------

/* BODY */

class IdentityAttribute extends Component {
  state = {};

  render() {
    return (
      <View style={styles.attributeContainer}>
        <Text
          style={[
            styles.attributeTitle,
            {
              color: Colors.black,
              flex: 1,
            },
          ]}>
          {this.props.heading}:
        </Text>
        <View
          style={[
            styles.attributeDescription,
            {
              color: Colors.dark,
              flex: 1,
              flexBasis: '15%',
            },
          ]}>
          <Text
            style={[
              styles.attributeDescription,
              {
                color: Colors.dark,
                flexWrap: 'wrap',
              },
            ]}>
            {this.props.children}
          </Text>
        </View>
      </View>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default IdentityAttribute;
