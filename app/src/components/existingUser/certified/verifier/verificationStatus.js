/*
Author: Ted Jenks

React-Native component to show the verification status.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {Text, View} from 'react-native';

// Local Imports
import styles from '../../../../style/styles';
import IdCard from '../profile/idCard/idCard';

//------------------------------------------------------------------------------

/* BODY */

class VerificationStatus extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <View>
        <View style={styles.statusContainer}>
          <View
            style={[
              styles.statusBox,
              this.props.posStatus
                ? {backgroundColor: 'green'}
                : {backgroundColor: 'red'},
            ]}>
            <Text style={{color: 'white'}}>
              {this.props.posStatus ? 'User Verified' : 'User Not Verified'}
            </Text>
          </View>
        </View>
        <IdCard identity={this.props.identity} />
      </View>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default VerificationStatus;
