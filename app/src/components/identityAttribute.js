import React, { Component } from "react";
import { Text, View } from "react-native";
import styles from "../style/styles";
import { Colors } from "react-native/Libraries/NewAppScreen";

class IdentityAttribute extends Component {
  state = {};

  render() {
    return (
      <View style={styles.attributeContainer}>
        <Text
          style={[styles.attributeTitle, {
            color: Colors.black,
            flex: 1,
          }]}>
          {this.props.heading}:
        </Text>
        <View style={[styles.attributeDescription, {
          color: Colors.dark,
          flex: 1,
          flexBasis:"15%",
        }]}>
        <Text
          style={[styles.attributeDescription, {
            color: Colors.dark,
            flexWrap: "wrap",
          }]}>
          {this.props.children}
        </Text>
        </View>
      </View>
    );
  }
}

export default IdentityAttribute;
