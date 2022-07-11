const Tx = require('ethereumjs-tx').Transaction;
const CERTIFICATION_SERVICE_ABI = require('../contracts/CertificatationService.json');

class Web3Adapter {
  constructor(web3, contractAddress, account) {
    this.web3 = web3;
    this.contractAdress = contractAddress;
    this.account = account;
    this.contract = new this.web3.eth.Contract(
      CERTIFICATION_SERVICE_ABI,
      contractAddress,
      {
        from: account.address,
        gasPrice: '0',
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

  createAccount() {
    const ac = this.web3.eth.accounts.create();
    return ac;
  }

  async unlockAccount() {
    try {
      await this.web3.eth.personal.unlockAccount(
        this.account.address,
        this.account.privateKey,
        1000,
      );
      return true;
    } catch {
      return false;
    }
  }

  async getCertificate(address) {
    await this.unlockAccount();
    try {
      return await this.contract.methods.certificates(address).call();
    } catch {
      return {data: 'Invalid Address'};
    }
  }

  async searchByHash(hash) {
    await this.unlockAccount();
    try {
      let hash_2 = await this.contract.methods
        .data_hash('0x'.concat(hash.substring(0, 64)))
        .call();
      if (hash_2 == '0x'.concat(hash.substring(64, 128))) {
        return await this.contract.methods.account(hash_2).call();
      }
      return '0x0000000000000000000000000000000000000000';
    } catch {
      return {data: 'Invalid Address'};
    }
  }

  async issueCertificate(
    address,
    data_hash_to_submit,
    // salt_hash_to_submit,
    image_hash_to_submit,
    embedding_to_submit,
    expiry,
  ) {
    await this.unlockAccount();

    try {
      return await this.contract.methods
        .createCertificate(
          address,
          data_hash_to_submit,
          image_hash_to_submit,
          // salt_hash_to_submit,
          embedding_to_submit,
          expiry,
        )
        .send();
    } catch (e) {
      console.log(e);
      return 'Invalid Address';
    }
  }

  buildTX(dest, nonce, qty) {
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
    const txCount = await this.web3.eth.getTransactionCount(
      this.account.address,
    );
    let tx = this.buildTX(dest, txCount, qty);
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
}

module.exports = {Web3Adapter};
