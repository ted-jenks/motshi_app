import {render} from '@testing-library/react-native';
import React from 'react';
import ScanningAnimation from "../app/src/components/existingUser/certified/verifier/scanningAnimation";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('scanning animation tests', function () {
  it('can render component', () => {
    // render(<ScanningAnimation/>);
  });
});
