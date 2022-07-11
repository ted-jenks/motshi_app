import React, {Component} from 'react';
import IdCard from './app/src/components/idCard.js';
import EnterDetails from './app/src/components/enterDetails.js';
import Verifier from './app/src/components/verifier.js';
import {IdentityManager} from './app/src/tools/identityManager';
import { Text } from "react-native";

const {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TextInput,
  View,
} = require('react-native');

//FIXME: Small gap in ID when expanded. Probably need to program that myself

//TODO: Set up an account and begin handling account storage
//TODO: Convert server to take bytes64
//TODO: Integrate server calls into the app code for the sign up process

class App extends Component {
  state = {
    newUser: false,
    verify: false,
  };

  constructor() {
    super();
    const identityManager = new IdentityManager();
    identityManager
      .getID()
      .then(res => {
        if (!res) {
          this.setState({newUser: true});
        }
      })
      .catch(e => console.log(e));
  }

  displayContent = () => {
    if (this.state.verify) {
      return (
        <View>
          <Button onPress={this.showProfile} title="Profile" />
          <Verifier />
        </View>
      );
    } else if (this.state.newUser) {
      return (
        <View>
          <Button onPress={this.showVerify} title="Verify" />
          <EnterDetails handleSubmit={this.handleSubmit} />
        </View>
      );
    } else {
      return (
        <View>
          <Button onPress={this.showVerify} title="Verify" />
          <View style={{padding: 10}}>
            <IdCard handleDelete={this.handleDelete} />
          </View>
        </View>
      );
    }
  };

  handleSubmit = () => {
    this.setState({newUser: false});
  };

  handleDelete = () => {
    this.setState({newUser: true});
  };

  showVerify = () => {
    this.setState({verify: true});
  };

  showProfile = () => {
    this.setState({verify: false});
  };

  render() {
    return (
      <SafeAreaView>
        <StatusBar />
        {this.displayContent()}
      </SafeAreaView>
    );
  }
}

export default App;
