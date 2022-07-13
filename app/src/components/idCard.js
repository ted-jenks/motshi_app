/*
Author: Ted Jenks

React-Native component to serve as the ID card display for the application.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {Button, Image, Text, View} from 'react-native';

// Third party packages
import Accordion from 'react-native-collapsible/Accordion';
import * as Keychain from 'react-native-keychain';
const Realm = require('realm');

// Local imports
import IdentityAttribute from './identityAttribute';
import {IdentityManager} from '../tools/identityManager';
import styles from '../style/styles';

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
    const identityManager = new IdentityManager();
    // load personal data
    identityManager
      .getID()
      .then(identity => {
        this.setState({identity});
      })
      .catch(e => console.log(e));
  }

  _getSections = () => {
    // sections for accordion object divided into title and content
    return [
      {
        title: (
          <View style={styles.photoFlex}>
            <Image
              source={{
                uri: 'data:image/jpeg;base64,' + this.state.identity.photoData,
              }}
              style={styles.photo}
            />
            <View style={styles.currentAge}>
              <View style={styles.ageBox}>
                <Text style={{fontSize: 70}}> {this._calculateAge()} </Text>
              </View>
              <View style={styles.yearsOldBox}>
                <Text style={{fontSize: 20}}>Years Old</Text>
              </View>
            </View>
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
        <View style={[this.state.photoSectionStyle, styles.shadow]}>
          {section.title}
        </View>
      </View>
    );
  };

  _renderContent = section => {
    // render content function for accordion object, brings up bottom part of ID
    return (
      <View style={styles.container}>
        <View style={[styles.attributeSection, styles.shadow]}>
          {section.content}
        </View>
      </View>
    );
  };

  _updateSections = activeSections => {
    // update sections function for accordion object, runs on click
    // changes style of top part of ID to remove rounded corners
    this.setState({activeSections});
    if (activeSections.length == 0) {
      this.setState({photoSectionStyle: styles.photoSection});
    } else {
      this.setState({photoSectionStyle: styles.photoSectionClicked});
    }
  };

  _getAttributes = () => {
    // generate bottom part of ID with all relevant information
    // const info = this.state.realm ? console.log(this.state.realm.objects('Identity')) : 'Loading...';
    if (this.state.expiry - Date.now() < 0) {
      return (
        <View
          style={{
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'red', fontSize: 50}}>EXPIRED</Text>
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
          - -{this.state.identity.dob.getFullYear()}
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

  _deleteInfo = () => {
    // dev tool to delete all information and reset the app
    Keychain.resetGenericPassword(); // clear BC account info
    const identityManger = new IdentityManager(); // clear personal details in Realm
    identityManger
      .getID()
      .then(res => {
        identityManger
          .deleteAll()
          .then(this.props.handleDelete)
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  };

  render() {
    return this.state.identity ? (
      <View>
        <Button onPress={this._deleteInfo} title="Delete Info" />
        <Text> </Text>
        <Accordion
          style={{marginTop: 0}}
          sections={this._getSections()}
          activeSections={this.state.activeSections}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}
          onChange={this._updateSections}
          expanded={0}
          disableGutters={true}
          underlayColor={'rgba(255,255,255,0)'}
        />
      </View>
    ) : (
      <View />
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default IdCard;
