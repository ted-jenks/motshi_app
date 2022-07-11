import React from "react";
import { Text, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import styles from "../style/styles.js";

const Section = ({ children, title }): Node => {
  return (<View style={styles.sectionContainer}>
    <Text
      style={[styles.sectionTitle, {
        color: Colors.black,
      }]}>
      {title}
    </Text>
    <Text
      style={[styles.sectionDescription, {
        color: Colors.dark,
      }]}>
      {children}
    </Text>
  </View>);
};

export default Section;
