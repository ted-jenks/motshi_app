/*
Author: Ted Jenks

Class to act as an adapter for web3.js to interact with the certification service
smart contract deployed to the private blockchain.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// Third party packages
const Tx = require('ethereumjs-tx').Transaction;
let EthCrypto;
try {
  EthCrypto = require('eth-crypto');
} catch {
  EthCrypto = null;
}
const Web3 = require('web3');

// Global constants
const CERTIFICATION_SERVICE_ABI = require('../contracts/CertificatationService.json');

//------------------------------------------------------------------------------

/* BODY */

class Web3Adapter {
  constructor(url, contractAddress, account) {
    const web3Provider = new Web3.providers.HttpProvider(url);
    this.web3 = new Web3(web3Provider);
    this.contractAdress = contractAddress;
    this.account = account;
    this.contract = new this.web3.eth.Contract(
      // contract object (certification service smart contract deployed to private BC)
      CERTIFICATION_SERVICE_ABI,
      contractAddress,
      {
        from: account.address,
        gas: 3000000,
      },
    );
  }

  getContract() {
    return this.contract;
  }

  getContractAddress() {
    return this.contractAdress;
  }

  getSenderAddress() {
    return this.account.address;
  }

  async getCertificate(address) {
    // get the certificate of a specific user
    try {
      return await this.contract.methods.certificates(address).call();
    } catch (e) {
      console.log(e);
      return {data: 'Invalid Address'};
    }
  }

  async isRejected(address) {
    try {
      return await this.contract.methods.rejected(address).call();
    } catch {
      return {data: 'Invalid Address'};
    }
  }

  async sign(dataToSign) {
    const messageHash = EthCrypto.hash.keccak256(dataToSign);

    const signature = EthCrypto.sign(this.account.privateKey, messageHash);
    return signature;
  }

  async validate(message, signature) {
    const messageHash = EthCrypto.hash.keccak256(message);

    const signer = EthCrypto.recover(signature, messageHash);
    return signer;
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

module.exports = {Web3Adapter};
