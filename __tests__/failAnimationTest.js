import {render} from '@testing-library/react-native';
import React from 'react';
import FailAnimation from '../app/src/components/existingUser/certified/profile/failAnimation';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

describe('fail animation tests', function () {
  it('can render component', () => {
    render(<FailAnimation onAnimationFinish={() => {}} />);
  });

  it('can report animation finish', async () => {
    let count = 0;
    const onAnimationComplete = () => count ++;
    render(<FailAnimation onAnimationFinish={onAnimationComplete} />);
    await sleep(2000);
    expect(count).toBe(1);
  });
});
