import React, { Component } from "react";
import { Button, ScrollView, TextInput, View } from "react-native";
import styles from "../style/styles";
import { IdentityManager } from "../tools/identityManager";

class EnterDetails extends Component {
  state = {
    fields: ["Name", "Date of Birth","Sex", "Nationality", "Place of Birth", "House", "Street", "City", "Postcode" , "Expiry"],
    data: ["","","","","","","","","",""],
  };

  _submitData = () => {
    for (const prop in this.state) {
      if (this.state[prop] == null) {
        return;
      }
    }
    this._writeData();
  };

  _autofill = () => {
    this.setState({data:
      ["Edward Jenks",
      "2000-06-01",
      "Male",
      "United Kingdom",
      "London",
      "22a",
      "Greswell Street",
      "London",
      "SW6 6PP",
     "2028-01-01"]
    });
  };

  _writeData = () => {
    const identityManager = new IdentityManager();
    identityManager.storeID(
      this.state.data[0],
      this.state.data[1],
      this.state.data[4],
      this.state.data[9],
      this.state.data[5],
      this.state.data[6],
      this.state.data[7],
      this.state.data[8],
      this.state.data[2],
      this.state.data[3])
      .then(this.props.handleSubmit())
      .catch(e => console.log(e));
  };

  render() {
    return (
      <ScrollView contentContainerStyle={{ paddingBottom: 70 }}>
        {this.state.data.map((value, key) =>
          <TextInput style={styles.input}
                     key={key}
                     label={this.state.fields[key]}
                     mode="outlined"
                     placeholder={this.state.fields[key]}
                     value={value}
                     onChangeText={(res) => {
                       let newData = this.state.data;
                       newData[key] = res;
                       this.setState({ data: newData });
                     }}
                     ref={input => {
                       this.name = input;
                     }}
          />)}
        <View style={{ padding: 10 }}>
          <Button onPress={this._autofill} title="Autofill" />
        </View>
        <View style={{ padding: 10 }}>
          <Button onPress={this._submitData} title="Submit" />
        </View>
      </ScrollView>
    );
  }
}

export default EnterDetails;
