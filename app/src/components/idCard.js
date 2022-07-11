import React, { Component } from "react";
import { Button, Image, Text, View } from "react-native";
import Accordion from "react-native-collapsible/Accordion";
import styles from "../style/styles";
import IdentityAttribute from "./identityAttribute";
import { IdentityManager } from "../tools/identityManager";

const Realm = require("realm");

class IdCard extends Component {
  state = {
    activeSections: [],
    identity: null,
    photoSectionStyle: styles.photoSection,
  };

  constructor() {
    super()
    const identityManager = new IdentityManager();
    identityManager.getID()
      .then(identity => {
        this.setState({identity});
      })
      .catch(e => console.log(e));
  }

  _getSections = () => {
    return [
      {
        title: (
          <View style={styles.photoFlex}>
            <Image source={require("../assets/profilePicture.jpg")} style={styles.photo} />
            <View style={styles.currentAge}>
              <View style={styles.ageBox}>
                <Text style={{ fontSize: 70 }}> {this._calculateAge()} </Text>
              </View>
              <View style={styles.yearsOldBox}>
                <Text style={{ fontSize: 20 }}>Years Old</Text>
              </View>
            </View>
          </View>
        ),
        content: (
          <View>
            {this._getAttributes()}
          </View>
        ),
      },
    ];
  };

  _renderHeader = (section) => {
    return (
      <View style={styles.container}>
        <View style={[this.state.photoSectionStyle, styles.shadow]}>
          {section.title}
        </View>
      </View>
    );
  };

  _renderContent = (section) => {
    return (
      <View style={styles.container}>
        <View style={[styles.attributeSection, styles.shadow]}>
          {section.content}
        </View>
      </View>
    );
  };

  _updateSections = (activeSections) => {
    this.setState({ activeSections });
    if (activeSections.length == 0) {
      this.setState({ photoSectionStyle: styles.photoSection });
    } else {
      this.setState({ photoSectionStyle: styles.photoSectionClicked });
    }
  };

  _getAttributes = () => {
    // const info = this.state.realm ? console.log(this.state.realm.objects('Identity')) : 'Loading...';
    if (this.state.expiry - Date.now() < 0) {
      return (
        <View style={{ height: "100%", justifyContent: "center", alignItems: "center" }}>
          <Text style={{ color: "red", fontSize: 50 }}>EXPIRED</Text>
        </View>
      );
    }
    return (
      <View>
        <IdentityAttribute heading="Name">{this.state.identity.name} </IdentityAttribute>
        <IdentityAttribute heading="Date of Birth">
          {this.state.identity.dob.getDate().toString().padStart(2, "0")}-
          {(this.state.identity.dob.getMonth() + 1).toString().padStart(2, "0")}-
          {this.state.identity.dob.getFullYear()}
        </IdentityAttribute>
        <IdentityAttribute heading="Sex">{this.state.identity.sex} </IdentityAttribute>
        <IdentityAttribute heading="Address">
          {this.state.identity.house},{" "}
          {this.state.identity.street},{" "}
          {this.state.identity.city},{" "}
          {this.state.identity.postcode}
        </IdentityAttribute>
        <IdentityAttribute heading="Place of Birth">{this.state.identity.pob} </IdentityAttribute>
        <IdentityAttribute heading="Nationality">{this.state.identity.nationality} </IdentityAttribute>
        <IdentityAttribute heading="Expiry">
          {this.state.identity.expiry.getDate().toString().padStart(2, "0")}-
          {(this.state.identity.expiry.getMonth() + 1).toString().padStart(2, "0")}-
          {this.state.identity.expiry.getFullYear()}
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
    const identityManger = new IdentityManager();
    identityManger.getID()
      .then(res => {
        identityManger.deleteAll().then(this.props.handleDelete).catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  };

  render() {
    return (
      this.state.identity ? (
      <View>
        <Button onPress={this._deleteInfo} title="Delete Info" />
        <Text>{" "}</Text>
        <Accordion
          style={{marginTop:0}}
          sections={this._getSections()}
          activeSections={this.state.activeSections}
          renderHeader={this._renderHeader}
          renderContent={this._renderContent}
          onChange={this._updateSections}
          expanded={0}
          disableGutters={true}
          underlayColor={"rgba(255,255,255,0)"}
        />
      </View> ) : <View></View>
    );
  }

}

export default IdCard;
