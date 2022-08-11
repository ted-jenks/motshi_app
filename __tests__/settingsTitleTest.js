import {render} from '@testing-library/react-native';
import React from 'react';
import SettingsTitle from "../app/src/components/existingUser/certified/settings/menu/settingsTitle";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

describe('settings title tests', function () {
  it('can render component successfully', () => {
    render(
      <SettingsTitle text="Test"/>,
    );
  });

  it('can report text', () => {
    const {getAllByText} = render(
      <SettingsTitle text="Test"/>,
    );
    const textElements = getAllByText('Test');
    expect(textElements).toHaveLength(1);
  });
});
