/*
NOTE: TestNet MUST BE LIVE FOR THESE TESTS TO WORK!!
 */

console.log('Make sure testNet is live');
const Web3 = require('web3');
const NETWORK_URL = 'http://127.0.0.1:7545';
const CERTIFICATION_SERVICE_ABI = require('../app/src/contracts/CertificatationService.json');
const {Web3Adapter} = require('../app/src/tools/web3Adapter.js');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

describe('web3Adapter tests', function () {
  const web3 = new Web3(NETWORK_URL);
  const contractAddress = '0x6801BC7Fcc12b6ABd48af3014441Cf5BE1f03992'; // Address of smart contract MAY NEED MODIFY ON RELAUNCH
  const userAddress = '0xf8F6bda50e88CFe9Cb3bF7BB06017f3FE1AFD9F9';
  const issuerNode = '0xB5802d852D50908eA0101643E5ED3705ed34E9Df';
  const issuerNodeKey =
    '3eb6f0becf9f2b514b9cf759e1b895758cb480adb23aab3b470cb74ac6a09fb7'; // Do not use this key in production, it is strictly for the testNet
  const account = {
    address: issuerNode,
    privateKey: issuerNodeKey,
  };

  const web3Adapter = new Web3Adapter(web3, contractAddress, account);

  it('can get contract from blockchain', () => {
    const contract = web3Adapter.getContract();
    assert(contract.options.from == account.address);
  });

  it('can get account address', () => {
    const address = web3Adapter.getSenderAddress();
    assert(address == account.address);
  });

  it('can get contract address from', () => {
    const address = web3Adapter.getContractAddress();
    assert(address == contractAddress);
  });

  it('can unlock an account', async () => {
    await web3Adapter.unlockAccount().then(r => {
      assert(r);
    });
  });

  it('can modify data on smart contract', async () => {
    const contract = web3Adapter.getContract(
      CERTIFICATION_SERVICE_ABI,
      contractAddress,
      issuerNode,
    ); // Use issue node as node knows private key
    const receipt = await web3Adapter.issueCertificate(
      userAddress,
      [
        '0xff4007ffffffffc0fe0003ffffffff80f80000fffffffe00f000007ffffffe00',
        '0xff4007ffffffffc0fe0003ffffffff80f80000fffffffe00f000007ffffffe00',
      ],
      [
        '0xff4007ffffffffc0fe0003ffffffff80f80000fffffffe00f000007ffffffe00',
        '0xff4007ffffffffc0fe0003ffffffff80f80000fffffffe00f000007ffffffe00',
      ],
      91,
      100000000,
    );
    assert(receipt.status);
  });

  it('can call data on smart contract', async () => {
    const result = await web3Adapter.getCertificate(userAddress);
    assert(result.expiry == 100000000);
  });

  it('can build a valid ethereum transaction', () => {
    const tx = web3Adapter.buildTX(userAddress, 1, 5);
    assert(tx.getChainId() == 1);
  });

  it('can send an ethereum transaction', async () => {
    const receipt = await web3Adapter.transact(userAddress, 1);
    assert(receipt.status);
  });

  it('can create a new account', async () => {
    const modelAccount = web3.eth.accounts.create();
    const account = await web3Adapter.createAccount(modelAccount.privateKey);
    const cert = await web3Adapter.getCertificate(account);
    assert(cert.expiry == 0);
  });

  it('can reject a user', async () => {
    const receipt = await web3Adapter.rejectRequest(userAddress);
    const rejected = await web3Adapter.isRejected(userAddress);
    assert(rejected === true);
  });

  it('can move an account', async () => {
    const receipt = await web3Adapter.issueCertificate(
      issuerNode, // issue to self so have move permission
      [
        '0xff4007ffffffffc0fe0003ffffffff80f80000fffffffe00f000007ffffffe00',
        '0xff4007ffffffffc0fe0003ffffffff80f80000fffffffe00f000007ffffffe00',
      ],
      [
        '0xff4007ffffffffc0fe0003ffffffff80f80000fffffffe00f000007ffffffe00',
        '0xff4007ffffffffc0fe0003ffffffff80f80000fffffffe00f000007ffffffe00',
      ],
      20,
      16583795700,
    );
    assert(receipt.status);
    const moveReceipt = await web3Adapter.moveAccount(userAddress); // unused address
    assert(moveReceipt.status);
    const cert = await web3Adapter.getCertificate(userAddress);
    assert(cert.expiry == 16583795700);
  });

  it('can delete an account', async () => {
    const receipt = await web3Adapter.issueCertificate(
      issuerNode, // issue to self so have move permission
      [
        '0x0f4007ffffffffc0fe0003ffffffff80f80000fffffffe00f000007ffffffe00',
        '0x0f4007ffffffffc0fe0003ffffffff80f80000fffffffe00f000007ffffffe00',
      ],
      [
        '0xff4007ffffffffc0fe0003ffffffff80f80000fffffffe00f000007ffffffe00',
        '0xff4007ffffffffc0fe0003ffffffff80f80000fffffffe00f000007ffffffe00',
      ],
      29,
      16583795700,
    );
    assert(receipt.status);
    const deleteReceipt = await web3Adapter.deleteMyAccount(); // unused address
    assert(deleteReceipt.status);
    const cert = await web3Adapter.getCertificate(issuerNode);
    assert(cert.expiry == 0);
  });
});
