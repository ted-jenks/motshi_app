/*
Author: Ted Jenks

Class to act as an adapter for web3.js to interact with the certification service
smart contract deployed to the private blockchain.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// Hashing libraries
const sha3_512 = require('js-sha3').sha3_512;

//------------------------------------------------------------------------------

/* BODY */

class DataHasher {
  constructor(data) {
    this.data = data;
  }

  dateToString = date => {
    return (
      date.getFullYear().toString() +
      '-' +
      (date.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      date.getDate().toString().padStart(2, '0')
    );
  };

  generateDataHash = () => {
    const hash = sha3_512(
      this.data.name
        .toString()
        .toLowerCase()
        .concat(this.dateToString(this.data.dob).toString().toLowerCase()),
    );
    return hash;
  };

  getDataHash = () => {
    const dataHash = this.generateDataHash();
    return [
      '0x'.concat(dataHash.substring(0, 64)),
      '0x'.concat(dataHash.substring(64, 128)),
    ];
  };

  generateImageHash = () => {
    const hash = sha3_512(this.data.photoData);
    return hash;
  };

  getImageHash = () => {
    const imageHash = this.generateImageHash();
    return [
      '0x'.concat(imageHash.substring(0, 64)),
      '0x'.concat(imageHash.substring(64, 128)),
    ];
  };
}

//------------------------------------------------------------------------------

/* EXPORTS */

module.exports = {DataHasher};
