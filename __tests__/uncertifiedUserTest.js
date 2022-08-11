import { fireEvent, render } from "@testing-library/react-native";
import React from 'react';
import UncertifiedUser from '../app/src/components/existingUser/uncertified/uncertifiedUser';

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

describe('uncertified user tests', function () {
  it('can render component successfully', () => {
    render(<UncertifiedUser onRefresh={() => {}} onDelete={() => {}} />);
  });

  it('can display correct title', () => {
    const {getAllByText} = render(
      <UncertifiedUser onRefresh={() => {}} onDelete={() => {}} />,
    );
    const title = getAllByText('Awaiting Authentication');
    expect(title).toHaveLength(1);
  });

  it('can display correct body', () => {
    const {getAllByText} = render(
      <UncertifiedUser onRefresh={() => {}} onDelete={() => {}} />,
    );
    const title = getAllByText(
      'We are checking over your details to make sure they are valid.\n\nCheck back soon!',
    );
    expect(title).toHaveLength(1);
  });

  it('can refresh page', () => {
    let count = 0;
    const onRefresh = () => count ++;
    const {getByText} = render(
      <UncertifiedUser onRefresh={onRefresh} onDelete={() => {}} />,
    );
    fireEvent.press(getByText('REFRESH'));
    expect(count).toBe(1);
  });

  it('can refresh page', () => {
    let count = 0;
    const onDelete = () => count ++;
    const {getByText} = render(
      <UncertifiedUser onRefresh={() => {}} onDelete={onDelete} />,
    );
    fireEvent(getByText('REFRESH'), 'onLongPress');
    expect(count).toBe(1);
  });
});
