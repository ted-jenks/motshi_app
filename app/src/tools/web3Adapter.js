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
// Global constants
const CERTIFICATION_SERVICE_ABI = require('../contracts/CertificatationService.json');

//------------------------------------------------------------------------------

/* BODY */

class Web3Adapter {
  constructor(web3, contractAddress, account) {
    this.web3 = web3;
    this.contractAdress = contractAddress;
    this.account = account;
    this.contract = new this.web3.eth.Contract(
      // contract object (certification service smart contract deployed to private BC)
      CERTIFICATION_SERVICE_ABI,
      contractAddress,
      {
        from: account.address,
        gasPrice: '0',
        gas: 3000000,
      },
    );
    this.web3.eth.personal
      .importRawKey(account.privateKey, account.privateKey)
      .catch(e => {
        console.log('Enhandled error importing key: ', e);
      });
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

  async createAccount(privateKey) {
    const accounts = await this.web3.eth.getAccounts();
    const ac = await this.web3.eth.personal.importRawKey(
      privateKey,
      privateKey,
    );
    return ac;
  }

  async unlockAccount() {
    // unlock blockchain account to use for transactions
    try {
      const accounts = await this.web3.eth.getAccounts();
      await this.web3.eth.personal.unlockAccount(
        this.account.address,
        this.account.privateKey,
        1000,
      );
      return true;
    } catch (e) {
      console.log('Unhandled exception while unlocking account: ', e);
      return false;
    }
  }

  async getCertificate(address) {
    // get the certificate of a specific user
    await this.unlockAccount();
    try {
      return await this.contract.methods.certificates(address).call();
    } catch (e) {
      console.log(e);
      return {data: 'Invalid Address'};
    }
  }

  async issueCertificate(
    address,
    data_hash_to_submit,
    embedding_to_submit,
    bin_index_to_submit,
    expiry,
  ) {
    // issue a certificate to a given account
    await this.unlockAccount();
    try {
      return await this.contract.methods
        .createCertificate(
          address,
          data_hash_to_submit,
          embedding_to_submit,
          bin_index_to_submit,
          expiry,
        )
        .send();
    } catch (e) {
      console.log(e);
      return 'Invalid Address';
    }
  }

  buildTX(dest, nonce, qty) {
    // put together eth-tx
    const transaction = {
      to: dest,
      value: this.web3.utils.toHex(this.web3.utils.toWei(String(qty), 'ether')),
      gasPrice: this.web3.utils.toHex(0),
      gasLimit: this.web3.utils.toHex(6721975),
      nonce: this.web3.utils.toHex(nonce),
    };
    return new Tx(transaction);
  }

  async transact(dest, qty) {
    // run an eth transaction (can include data in these if needed)
    const txCount = await this.web3.eth.getTransactionCount(
      this.account.address,
    );
    let tx = this.buildTX(dest, txCount, qty);
    // eslint-disable-next-line no-undef
    const key = Buffer.from(this.account.privateKey, 'hex');
    tx.sign(key);

    const serializedTransaction = tx.serialize();
    const raw = '0x' + serializedTransaction.toString('hex');
    try {
      return await this.web3.eth.sendSignedTransaction(raw);
    } catch (e) {
      return 'Invalid Address or Transaction Formatting: ' + e;
    }
  }

  async rejectRequest(address) {
    await this.unlockAccount();
    try {
      return await this.contract.methods.reject(address).send();
    } catch {
      return {data: 'Invalid Address'};
    }
  }

  async isRejected(address) {
    await this.unlockAccount();
    try {
      return await this.contract.methods.rejected(address).call();
    } catch {
      return {data: 'Invalid Address'};
    }
  }

  async deleteMyAccount() {
    await this.unlockAccount();
    try {
      return await this.contract.methods.deleteMyAccount().send();
    } catch (e) {
      console.log(e);
      return {data: 'Invalid Address'};
    }
  }

  async moveAccount(newAddress) {
    await this.unlockAccount();
    try {
      return await this.contract.methods.moveAccount(newAddress).send();
    } catch (e) {
      console.log(e);
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
