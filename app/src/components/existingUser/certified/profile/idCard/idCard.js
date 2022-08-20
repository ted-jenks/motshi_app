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
import LinearGradient from 'react-native-linear-gradient';

// Local imports
import IdentityAttribute from './identityAttribute';
import styles from '../../../../../style/styles';

//------------------------------------------------------------------------------

/* BODY */

class IdCard extends Component {
  state = {
    activeSections: [],
    identity: null,
    photoSectionStyle: styles.photoSectionClicked,
    attributeSectionShadow: {},
  };

  constructor() {
    super();
  }

  componentDidMount() {
    this.setState({identity: this.props.identity});
    if (!this.props.disabled) {
      this.setState({activeSections: [0]});
    } else {
      this.setState({photoSectionStyle: styles.photoSection});
    }
  }

  /* -------------------------- ACCORDION STUFF ----------------------------- */

  _getSections = () => {
    // sections for accordion object divided into title and content
    return [
      {
        title: (
          <View style={styles.photoSectionFlexContainer}>
            <Image
              source={require('../../../../../assets/logo/White_Both.png')}
              style={{
                position: 'absolute',
                top: 10,
                alignSelf: 'center',
                height: 20,
                width: 100,
              }}
            />
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
                  <Text
                    style={{
                      fontSize: 45,
                      color: '#ffffff',
                      textShadowColor: 'rgba(0, 0, 0, 0.4)',
                      textShadowOffset: {width: 0, height: 1},
                      textShadowRadius: 10,
                      fontFamily: 'IBMPlexMono-Medium',
                    }}>
                    {this._calculateAge().toString()}
                  </Text>
                </View>
                <View style={styles.yearsOldBox}>
                  <Text
                    style={{
                      fontSize: 18,
                      color: 'white',
                      textShadowColor: 'rgba(0, 0, 0, 0.4)',
                      textShadowOffset: {width: 0, height: 1},
                      textShadowRadius: 10,
                      fontFamily: 'IBMPlexMono-Medium',
                    }}>
                    Years Old
                  </Text>
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
          colors={[
            this.state.identity.linearGrad1,
            this.state.identity.linearGrad2,
          ]}
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
          colors={[
            this.state.identity.linearGrad1,
            this.state.identity.linearGrad2,
          ]}
          style={[styles.attributeSection, this.state.attributeSectionShadow]}>
          {section.content}
        </LinearGradient>
      </View>
    );
  };

  _updateSections = activeSections => {
    // update sections function for accordion object, runs on click
    // changes style of top part of ID to remove rounded corners
    this.setState({activeSections, attributeSectionShadow: styles.shadow});
    // let simulation = this.state.simulation;
    if (activeSections.length == 0) {
      setTimeout(
        () => this.setState({photoSectionStyle: styles.photoSection}),
        270,
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
        <IdentityAttribute heading="DoB">
          {this.state.identity.dob.getDate().toString().padStart(2, '0')}-
          {(this.state.identity.dob.getMonth() + 1).toString().padStart(2, '0')}
          -{this.state.identity.dob.getFullYear()}
        </IdentityAttribute>
        <IdentityAttribute heading="Sex">
          {this.state.identity.sex}{' '}
        </IdentityAttribute>
        <IdentityAttribute heading="PoB">
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
        <IdentityAttribute heading="Address">
          {this.state.identity.house}, {this.state.identity.street},{' '}
          {this.state.identity.city}, {this.state.identity.postcode}
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
          expanded={1}
          disabled={this.props.disabled || false}
          disableGutters={true}
          underlayColor={'rgba(255,255,255,100)'}
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
