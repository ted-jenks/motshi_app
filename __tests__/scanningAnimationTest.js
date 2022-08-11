import {render} from '@testing-library/react-native';
import React from 'react';
import ScanningAnimation from "../app/src/components/existingUser/certified/verifier/scanningAnimation";
import IdentityAttribute from "../app/src/components/existingUser/certified/profile/idCard/identityAttribute";

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
    render(<ScanningAnimation/>);
  });

  it('can display correct text', async () => {
    const {getAllByText} = render(
      <ScanningAnimation />,
    );
    const text = getAllByText('SCANNING');
    expect(text).toHaveLength(1);
  });
});
