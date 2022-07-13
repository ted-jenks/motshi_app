/*
Author: Ted Jenks

React-Native component to serve as a portal for the entry of personal details
on signing up to the service.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// React imports
import React, {Component} from 'react';
import {Alert, Button, ScrollView, Text, TextInput, View} from 'react-native';

// Local imports
import styles from '../style/styles';
import {IdentityManager} from '../tools/identityManager';

// Third party packages
import {launchCamera} from 'react-native-image-picker';
import * as Keychain from 'react-native-keychain';
import Section from './section';
const fetch = require('node-fetch');
const formData = require('form-data');
const Web3 = require('web3');

// Global constants
const NETWORK_URL = 'http://10.0.2.2:7545';
const web3 = new Web3(NETWORK_URL);
const SERVER_URL = 'http://10.0.2.2:5000/submit-data';

//------------------------------------------------------------------------------

/* BODY */

class EnterDetails extends Component {
  state = {
    data: {
      personal: ['', '', ''],
      nationality: ['', ''],
      address: ['', '', '', ''],
      document: [''],
    }, // data entered by user
    documentImageData: null,
    photoData: null,
    pageCount: 0,
    address: null,
  };

  _checkComplete = () => {
    // check that the form has been completed
    for (const datum in this.state.data) {
      for (const item of datum) {
        if (item == '') {
          return false;
        }
      }
    }
    if (this.state.photoData == null || this.state.documentImageData == null) {
      return false;
    }
    return true;
  };

  _submitData = () => {
    if (this._checkComplete()) {
      // write data to file and then submit
      this._writeData();
    } else {
      console.log('Form not complete');
      this._incompleteAlert();
    }
  };

  _incompleteAlert = () =>
    // show alert informing user that the form is not complete
    Alert.alert(
      'FORM NOT COMPLETE',
      'Please enter all necessary information to continue',
      [{text: 'OK', onPress: () => console.log('OK Pressed')}],
    );

  _sendData = () => {
    // address of server for sign-up
    const url = SERVER_URL;
    const headers = {
      Accept: 'application/json',
    };
    // create formData object to send via https
    const form = new formData();
    form.append('Content-Type', 'application/octet-stream');
    form.append('name', this.state.data.personal[0]);
    form.append('dob', this.state.data.personal[1]);
    form.append('pob', this.state.data.nationality[1]);
    form.append('expiry', this.state.data.document[0]);
    form.append('house', this.state.data.address[0]);
    form.append('street', this.state.data.address[1]);
    form.append('city', this.state.data.address[2]);
    form.append('postcode', this.state.data.address[3]);
    form.append('sex', this.state.data.personal[2]);
    form.append('nationality', this.state.data.nationality[0]);
    form.append('bc_address', this.state.address);
    form.append('image', this.state.photoData, 'base64');
    form.append('doc', this.state.documentImageData, 'base64');
    // make https put request
    fetch(url, {method: 'POST', headers: headers, body: form})
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  _autofill = () => {
    // dev tool for quickly filling in form during development
    this.setState({
      data: {
        personal: ['Edward Jenk', '2000-06-01', 'Male'],
        nationality: ['United Kingdom', 'London'],
        address: ['22a', 'Greswell Street', 'London', 'SW6 6PP'],
        document: ['2028-01-01'],
      },
      pageCount: 3,
    });
  };

  _launchCameraFront = () => {
    // launch camera and save the photo
    let options = {
      mediaType: 'photo',
      includeBase64: true,
      cameraType: 'front',
    };
    launchCamera(options, response => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        // console.log('response', JSON.stringify(response));
        // successful image collection
        this.setState({
          photoData: response.assets[0].base64,
        });
      }
    });
  };

  _launchCameraBack = () => {
    // launch camera and save the photo
    let options = {
      mediaType: 'photo',
      includeBase64: true,
      cameraType: 'back',
    };
    launchCamera(options, response => {
      // console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        // console.log('response', JSON.stringify(response));
        // successful image collection
        this.setState({
          documentImageData: response.assets[0].base64,
        });
      }
    });
  };

  _createAccount = () => {
    // generate account and key on BC
    return web3.eth.accounts.create();
  };

  _saveToKeychain = async account => {
    // save BC account information in keystore
    await Keychain.setGenericPassword(account.address, account.privateKey);
  };

  _writeData = () => {
    const account = this._createAccount(); // generate account
    this._saveToKeychain(account).catch(e => console.log(e)); // save account locally
    this.setState({address: account.address});
    const identityManager = new IdentityManager(); // open instance of realm to save to
    console.log('writing...');
    identityManager
      .storeID(
        // save data to realm
        this.state.data.personal[0],
        this.state.data.personal[1],
        this.state.data.nationality[1],
        this.state.data.document[0],
        this.state.data.address[0],
        this.state.data.address[1],
        this.state.data.address[2],
        this.state.data.address[3],
        this.state.data.personal[2],
        this.state.data.nationality[0],
        this.state.photoData,
        account.address,
      )
      .then(r => {
        // update the display
        this.props.handleSubmit();
        // send data to sign up server
        this._sendData();
      })
      .catch(e => console.log(e));
  };

  _nextPage = () => {
    let currentPage = this.state.pageCount;
    currentPage++;
    this.setState({pageCount: currentPage});
  };

  _prevPage = () => {
    let currentPage = this.state.pageCount;
    currentPage--;
    this.setState({pageCount: currentPage});
  };

  _formFromFields = (fields, dataKey) => {
    return (
      <View>
        {this.state.data[dataKey].map((value, key) => (
          <TextInput
            style={styles.input}
            key={key}
            label={fields[key]}
            mode="outlined"
            placeholder={fields[key]}
            value={value}
            onChangeText={res => {
              let newData = this.state.data;
              newData[dataKey][key] = res;
              this.setState({data: newData});
            }}
            ref={input => {
              this.name = input;
            }}
          />
        ))}
      </View>
    );
  };

  _personalDataEntry = () => {
    const fields = ['Name', 'Date of Birth (YYYY-MM-DD)', 'Sex'];
    return (
      <View>
        <Section title={'Personal Details'}>
          Please enter your personal information as it appears on your document
          below.
        </Section>
        {this._formFromFields(fields, 'personal')}
        <View style={{padding: 10}}>
          <Button onPress={this._nextPage} title="Next" />
        </View>
      </View>
    );
  };

  _nationalityDataEntry = () => {
    const fields = ['Nationality', 'Place of Birth'];
    return (
      <View>
        <Section title={'Nationality'}>
          Please enter your nationality information as it appears on your
          document below.
        </Section>
        {this._formFromFields(fields, 'nationality')}
        <View style={{padding: 10}}>
          <Button onPress={this._prevPage} title="Back" />
        </View>
        <View style={{padding: 10}}>
          <Button onPress={this._nextPage} title="Next" />
        </View>
      </View>
    );
  };

  _addressDataEntry = () => {
    const fields = ['House', 'Street', 'City', 'Postcode'];
    return (
      <View>
        <Section title={'Address'}>
          Please enter your address as it appears on your document below.
        </Section>
        {this._formFromFields(fields, 'address')}
        <View style={{padding: 10}}>
          <Button onPress={this._prevPage} title="Back" />
        </View>
        <View style={{padding: 10}}>
          <Button onPress={this._nextPage} title="Next" />
        </View>
      </View>
    );
  };

  _documentDataEntry = () => {
    const fields = ['Expiry (YYYY-MM-DD)'];
    return (
      <View>
        <Section title={'Document'}>
          Please enter your document expiry dat and upload a photo of your
          document.
        </Section>
        {this._formFromFields(fields, 'document')}
        <View style={{padding: 10}}>
          <Button
            onPress={this._launchCameraBack}
            title="Take Photo of Document"
          />
        </View>
        <View style={{padding: 10}}>
          <Button onPress={this._prevPage} title="Back" />
        </View>
        <View style={{padding: 10}}>
          <Button onPress={this._nextPage} title="Next" />
        </View>
      </View>
    );
  };

  _imageDataEntry = () => {
    return (
      <View>
        <Section title={'Identification Image'}>
          Please take a photo of your face. You must not wear glasses or
          obstruct your face in any way. Makeup must not be worn and hair must
          be tied back. The photo should be taken around 50cm away at eye level
          with your face in the center if the image. Do not smile or make any
          other expressions.
          {'\n\n'}
          Failure to comply with these restrictions will result in your account
          being rejected.
        </Section>
        <View style={{padding: 10}}>
          <Button onPress={this._launchCameraFront} title="Take Photo" />
        </View>
        <View style={{padding: 10}}>
          <Button onPress={this._prevPage} title="Back" />
        </View>
        <View style={{padding: 10}}>
          <Button onPress={this._submitData} title="Submit" />
        </View>
      </View>
    );
  };

  render() {
    const pages = [
      this._personalDataEntry,
      this._nationalityDataEntry,
      this._addressDataEntry,
      this._documentDataEntry,
      this._imageDataEntry,
    ];
    return (
      <ScrollView contentContainerStyle={{paddingBottom: 70}}>
        {pages[this.state.pageCount]()}
        <View style={{padding: 10}}>
          <Button onPress={this._autofill} title="Autofill" />
        </View>
      </ScrollView>
    );
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

export default EnterDetails;
