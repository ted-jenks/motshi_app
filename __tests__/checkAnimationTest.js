import {render} from '@testing-library/react-native';
import React from 'react';
import CheckAnimation from "../app/src/components/existingUser/certified/verifier/checkAnimation";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('check animation tests', function () {
  it('can render component', () => {
    render(<CheckAnimation handleFinish={() => {}} />);
  });

  it('can report animation finish', async () => {
    let count = 0;
    const onAnimationComplete = () => count ++;
    render(<CheckAnimation handleFinish={onAnimationComplete} />);
    await sleep(4000);
    expect(count).toBe(1);
  });
});
