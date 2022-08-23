/*
NOTE: TestNet MUST BE LIVE FOR THESE TESTS TO WORK!!
 */

// console.log('Make sure testNet is live');
// const NETWORK_URL = 'https://rpc.sepolia.online';
// const {Web3Adapter} = require('../app/src/tools/web3Adapter.js');

// function assert(condition, message) {
//   if (!condition) {
//     throw new Error(message || 'Assertion failed');
//   }
// }

// describe('web3Adapter tests', function () {
//   const contractAddress = '0xC93331a94F3f44854f9195682176180789fF5838'; // Address of smart contract MAY NEED MODIFY ON RELAUNCH
//   const userAddress = '0x9445bEDA1B149Bc9e0a015b2bF77DA45CD787561';
//   const issuerNode = '0x9445bEDA1B149Bc9e0a015b2bF77DA45CD787561';
//   const issuerNodeKey =
//     '0x047a90bc3a34d377d4892babb3d6e2f774851fdf3472ae39c7669832b2c48f15'; // Do not use this key in production, it is strictly for the testNet
//   const account = {
//     address: issuerNode,
//     privateKey: issuerNodeKey,
//   };

//   const web3Adapter = new Web3Adapter(NETWORK_URL, contractAddress, account);

//   it('can get contract from blockchain', () => {
//     const contract = web3Adapter.getContract();
//     assert(contract.options.from == account.address);
//   });

//   it('can get account address', () => {
//     const address = web3Adapter.getSenderAddress();
//     assert(address == account.address);
//   });

//   it('can get contract address from', () => {
//     const address = web3Adapter.getContractAddress();
//     assert(address == contractAddress);
//   });

//   it('can call data on smart contract', async () => {
//     const result = await web3Adapter.getCertificate(userAddress);
//     console.log(result)
//     assert(result.expiry == 0);
//   });
// });
