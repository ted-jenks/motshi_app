import React, {Component} from 'react';
import {Button, ScrollView, TextInput, View} from 'react-native';
import styles from '../style/styles';
import {IdentityManager} from '../tools/identityManager';
import {PermissionsAndroid, launchCamera} from 'react-native-image-picker';
import {Buffer} from 'buffer';

const fetch = require('node-fetch');
const formData = require('form-data');

const Web3 = require('web3');
const NETWORK_URL = 'http://10.0.2.2:7545';
const web3 = new Web3(NETWORK_URL);

class EnterDetails extends Component {
  state = {
    fields: [
      'Name',
      'Date of Birth',
      'Sex',
      'Nationality',
      'Place of Birth',
      'House',
      'Street',
      'City',
      'Postcode',
      'Expiry',
    ],
    data: ['', '', '', '', '', '', '', '', '', ''],
    photoData: null,
  };

  _submitData = () => {
    // TODO: Add check all fields complete
    for (const prop in this.state) {
      if (this.state[prop] == null) {
        return;
      }
    }
    this._writeData();
    this._sendData();
  };

  _sendData = () => {
    //TODO: Change this to real data to send
    const url = 'http://10.0.2.2:5000/submit-data';
    const headers = {
      Accept: 'application/json',
    };
    const form = new formData();
    const data = {
      name: 'Edward p Jenks',
      dob: '2000-06-01',
      pob: 'London',
      expiry: '2022-11-01',
      house: '22a',
      street: 'Greswell Street',
      city: 'London',
      postcode: 'SW6 6PP',
      sex: 'Male',
      nationality: 'United Kingdom',
      bc_address: '0xde31E9c996959C2b98b132bc3DDb1815ab96ed5c',
    };
    form.append('Content-Type', 'application/octet-stream');
    form.append('name', data.name);
    form.append('dob', data.dob);
    form.append('pob', data.pob);
    form.append('expiry', data.expiry);
    form.append('house', data.house);
    form.append('street', data.street);
    form.append('city', data.city);
    form.append('postcode', data.postcode);
    form.append('sex', data.sex);
    form.append('nationality', data.nationality);
    form.append('bc_address', data.bc_address);
    form.append('image', this.state.photoData, 'base64');

    fetch(url, {method: 'POST', headers: headers, body: form})
      .then(data => {
        console.log(data);
      })
      .catch(err => {
        console.log(err);
      });
  };

  _autofill = () => {
    this.setState({
      data: [
        'Edward Jenks',
        '2000-06-01',
        'Male',
        'United Kingdom',
        'London',
        '22a',
        'Greswell Street',
        'London',
        'SW6 6PP',
        '2028-01-01',
      ],
    });
  };

  _launchCamera = () => {
    let options = {
      mediaType: 'photo',
      includeBase64: true,
      cameraType: 'front,',
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
        this.setState({
          photoData: response.assets[0].base64,
        });
      }
    });
  };

  _createAccount = () => {
    return web3.eth.accounts.create();
  };

  _writeData = () => {
    const account = this._createAccount();
    const identityManager = new IdentityManager();
    console.log('writing...');
    identityManager
      .storeID(
        this.state.data[0],
        this.state.data[1],
        this.state.data[4],
        this.state.data[9],
        this.state.data[5],
        this.state.data[6],
        this.state.data[7],
        this.state.data[8],
        this.state.data[2],
        this.state.data[3],
        account.address,
        account.privateKey,
        this.state.photoData,
      )
      .then(this.props.handleSubmit())
      .catch(e => console.log(e));
  };

  render() {
    return (
      <ScrollView contentContainerStyle={{paddingBottom: 70}}>
        {this.state.data.map((value, key) => (
          <TextInput
            style={styles.input}
            key={key}
            label={this.state.fields[key]}
            mode="outlined"
            placeholder={this.state.fields[key]}
            value={value}
            onChangeText={res => {
              let newData = this.state.data;
              newData[key] = res;
              this.setState({data: newData});
            }}
            ref={input => {
              this.name = input;
            }}
          />
        ))}
        <View style={{padding: 10}}>
          <Button onPress={this._launchCamera} title="Take Photo" />
        </View>
        <View style={{padding: 10}}>
          <Button onPress={this._autofill} title="Autofill" />
        </View>
        <View style={{padding: 10}}>
          <Button onPress={this._submitData} title="Submit" />
        </View>
      </ScrollView>
    );
  }
}

export default EnterDetails;
