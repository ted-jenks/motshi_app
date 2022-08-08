/*
Author: Ted Jenks

React-Native component to serve as the ID card display for the application.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {Image, Text, View} from 'react-native';

// Third party packages
import Accordion from 'react-native-collapsible/Accordion';

// Local imports
import IdentityAttribute from './identityAttribute';
import styles from '../../../../../style/styles';
import LinearGradient from 'react-native-linear-gradient';

// Global constants
import { LINEAR_GRADIENT } from "../../../../../style/styles";

//------------------------------------------------------------------------------

/* BODY */

class IdCard extends Component {
  state = {
    activeSections: [],
    identity: null,
    photoSectionStyle: styles.photoSection,
  };

  constructor() {
    super();
  }

  componentDidMount() {
    this.setState({identity: this.props.identity});
  }

  /* -------------------------- ACCORDION STUFF ----------------------------- */

  _getSections = () => {
    // sections for accordion object divided into title and content
    return [
      {
        title: (
          <View style={styles.photoSectionFlexContainer}>
            <View style={styles.photoFlex}>
              <Image
                source={{
                  uri:
                    'data:image/jpeg;base64,' + this.state.identity.photoData,
                }}
                style={styles.photo}
              />
            </View>
            {!(this.state.identity.expiry - Date.now() < 0) && (
              <View style={styles.currentAge}>
                <View style={styles.ageBox}>
                  <Text style={{fontSize: 60, color: '#ffffff'}}>
                    {' '}
                    {this._calculateAge()}{' '}
                  </Text>
                </View>
                <View style={styles.yearsOldBox}>
                  <Text style={{fontSize: 20, color: 'white'}}>Years Old</Text>
                </View>
              </View>
            )}
            {this.state.identity.expiry - Date.now() < 0 && (
              <View style={styles.currentAge}>
                <Text style={styles.expiredAccountText}>EXPIRED</Text>
              </View>
            )}
          </View>
        ),
        content: <View>{this._getAttributes()}</View>,
      },
    ];
  };

  _renderHeader = section => {
    // render header function for accordion object, brings up top part of ID
    return (
      <View style={styles.container}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={LINEAR_GRADIENT}
          style={[this.state.photoSectionStyle, styles.shadow]}>
          {section.title}
        </LinearGradient>
      </View>
    );
  };

  _renderContent = section => {
    // render content function for accordion object, brings up bottom part of ID
    return (
      <View style={styles.container}>
        <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={LINEAR_GRADIENT}
          style={[styles.attributeSection, styles.shadow]}>
          {section.content}
        </LinearGradient>
      </View>
    );
  };

  _updateSections = activeSections => {
    // update sections function for accordion object, runs on click
    // changes style of top part of ID to remove rounded corners
    this.setState({activeSections});
    // let simulation = this.state.simulation;
    if (activeSections.length == 0) {
      setTimeout(
        () => this.setState({photoSectionStyle: styles.photoSection}),
        280,
      );
    } else {
      this.setState({photoSectionStyle: styles.photoSectionClicked});
    }
  };

  /* ----------------------- END OF ACCORDION STUFF ------------------------- */

  _getAttributes = () => {
    // generate bottom part of ID with all relevant information
    if (this.state.identity.expiry - Date.now() < 0) {
      return (
        <View
          style={{
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={styles.expiredAccountSubtext}>Apply for a new ID</Text>
        </View>
      );
    }
    return (
      <View>
        <IdentityAttribute heading="Name">
          {this.state.identity.name}{' '}
        </IdentityAttribute>
        <IdentityAttribute heading="Date of Birth">
          {this.state.identity.dob.getDate().toString().padStart(2, '0')}-
          {(this.state.identity.dob.getMonth() + 1).toString().padStart(2, '0')}
          -{this.state.identity.dob.getFullYear()}
        </IdentityAttribute>
        <IdentityAttribute heading="Sex">
          {this.state.identity.sex}{' '}
        </IdentityAttribute>
        <IdentityAttribute heading="Address">
          {this.state.identity.house}, {this.state.identity.street},{' '}
          {this.state.identity.city}, {this.state.identity.postcode}
        </IdentityAttribute>
        <IdentityAttribute heading="Place of Birth">
          {this.state.identity.pob}{' '}
        </IdentityAttribute>
        <IdentityAttribute heading="Nationality">
          {this.state.identity.nationality}{' '}
        </IdentityAttribute>
        <IdentityAttribute heading="Expiry">
          {this.state.identity.expiry.getDate().toString().padStart(2, '0')}-
          {(this.state.identity.expiry.getMonth() + 1)
            .toString()
            .padStart(2, '0')}
          -{this.state.identity.expiry.getFullYear()}
        </IdentityAttribute>
      </View>
    );
  };

  _calculateAge = () => {
    let ageDifMs = Date.now() - this.state.identity.dob;
    let ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  render() {
    if (this.state.identity != null) {
      return (
        <Accordion
          style={{paddingBottom: 40}}
          sections={this._getSections()}
          activeSections={this.state.activeSections}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}
          onChange={this._updateSections}
          expanded={0}
          disableGutters={true}
          underlayColor={'rgba(255,255,255,0)'}
        />
      );
    } else {
      return null;
    }
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default IdCard;
