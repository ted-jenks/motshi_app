const {DataHasher} = require('../app/src/tools/dataHasher');
const Web3 = require('web3');
const {Web3Adapter} = require('../app/src/tools/web3Adapter');

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

describe('dataHasher tests', function () {
  const data = {
    name: 'Edward Jenks',
    dob: '2000-01-01',
    photoData:
      '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',
  };
  const dataHasher = new DataHasher(data);

  it('can hash name and date of birth', () => {
    const dataHash = dataHasher.getDataHash();
    const dataHashRepeat = dataHasher.getDataHash();
    assert(dataHash.length == 2);
    assert(dataHash[0].substring(0, 2) === '0x');
    assert(dataHash[1].substring(0, 2) === '0x');
    assert(dataHash[0] === dataHashRepeat[0]);
    assert(dataHash[1] === dataHashRepeat[1]);
  });

  it('can hash image data', () => {
    dataHasher.getImageHash().then(imageHash => {
      dataHasher.getImageHash().then(imageHashRepeat => {
        assert(imageHash.length == 2);
        assert(imageHash[0].substring(0, 2) === '0x');
        assert(imageHash[1].substring(0, 2) === '0x');
        assert(imageHash[0] === imageHashRepeat[0]);
        assert(imageHash[1] === imageHashRepeat[1]);
      });
    });
  });
});
