import IdentityAttribute from '../app/src/components/existingUser/certified/profile/idCard/identityAttribute';
import {render} from '@testing-library/react-native';
import React from 'react';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

describe('identity attribute tests', function () {
  it('can render component successfully', () => {
    render(
      <IdentityAttribute heading="Test">{'this is a test'}</IdentityAttribute>,
    );
  });

  it('can report value as expected', () => {
    const {getAllByText} = render(
      <IdentityAttribute heading="Test">{'this is a test'}</IdentityAttribute>,
    );
    const valElements = getAllByText('this is a test');
    expect(valElements).toHaveLength(1);
  });

  it('can report title as expected', () => {
    const {getAllByText} = render(
      <IdentityAttribute heading="Testing">
        {'this is a test'}
      </IdentityAttribute>,
    );
    const valElements = getAllByText('Testing:');
    expect(valElements).toHaveLength(1);
  });
});
