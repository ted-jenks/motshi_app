import {render} from '@testing-library/react-native';
import React from 'react';
import SuccessAnimation from "../app/src/components/existingUser/certified/profile/successAnimation";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('success animation tests', function () {
  it('can render component', () => {
    render(<SuccessAnimation onAnimationFinish={() => {}} />);
  });

  it('can report animation finish', async () => {
    let count = 0;
    const onAnimationComplete = () => count ++;
    render(<SuccessAnimation onAnimationFinish={onAnimationComplete} />);
    await sleep(2500);
    expect(count).toBe(1);
  });
});
