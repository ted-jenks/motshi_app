/*
NOTE: TestNet MUST BE LIVE FOR THESE TESTS TO WORK!!
 */

console.log('Make sure testNet is live');
const Web3 = require('web3');
const NETWORK_URL = "http://127.0.0.1:7545";
const CERTIFICATION_SERVICE_ABI = require('../app/src/contracts/CertificatationService.json');
const {Web3Adapter} = require('../app/src/tools/web3Adapter.js');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

describe('web3Adapter tests', function () {
  const web3 = new Web3(NETWORK_URL);
  const contractAddress = '0x265e00a8bC43D1f3DBa103F87Fb156AE69B96FC2'; // Address of smart contract MAY NEED MODIFY ON RELAUNCH
  const userAddress = '0xB5802d852D50908eA0101643E5ED3705ed34E9Df';
  const issuerNode = '0xf8F6bda50e88CFe9Cb3bF7BB06017f3FE1AFD9F9';
  const issuerNodeKey =
    '14ba98ce18c157aa2894c648d16b4a0565c300662b8eb5427beb7e304883f840'; // Do not use this key in production, it is strictly for the testNet
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
      [
        '0xff4007ffffffffc0fe0003ffffffff80f80000fffffffe00f000007ffffffe00',
        '0xff4007ffffffffc0fe0003ffffffff80f80000fffffffe00f000007ffffffe00',
      ],
      100000000,
    );
    assert(receipt.status);
  });

  it('can call data on smart contract', async () => {
    const result = await web3Adapter.getCertificate(userAddress);
    assert(result.expiry == 100000000);
  });

  it('can search by hash on smart contract', async () => {
    const result = await web3Adapter.searchByHash(
      'ff4007ffffffffc0fe0003ffffffff80f80000fffffffe00f000007ffffffe00ff4007ffffffffc0fe0003ffffffff80f80000fffffffe00f000007ffffffe00',
    );
    assert(result == userAddress);
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
    const account = web3Adapter.createAccount();
    const cert = await web3Adapter.getCertificate(account.address);
    assert(cert.expiry == 0);
  });

  it('can reject a user', async () => {
    const receipt = await web3Adapter.rejectRequest(userAddress);
    const rejected = await web3Adapter.isRejected(userAddress);
    assert(rejected === true);
  });
});
