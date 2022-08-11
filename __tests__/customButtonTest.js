import { fireEvent, render } from "@testing-library/react-native";
import React from 'react';
import CustomButton from "../app/src/components/generic/customButton";


describe('custom button tests', function () {
  it('can render component successfully', () => {
    render(<CustomButton text={'Test'} />);
  });

  it('can display correct text', () => {
    const {getAllByText} = render(
      <CustomButton text={'Test'} />,
    );
    const text = getAllByText('Test');
    expect(text).toHaveLength(1);
  });

  it('can be pressed', () => {
    let count = 0;
    const onPress = () => count ++;
    const {getByText} = render(
      <CustomButton text={'Test'} onPress={onPress} />,
    );
    fireEvent.press(getByText('Test'));
    expect(count).toBe(1);
  });

  it('can be long pressed', () => {
    let count = 0;
    const onPress = () => count ++;
    const {getByText} = render(
      <CustomButton text={'Test'} onLongPress={onPress} />,
    );
    fireEvent(getByText('Test'), 'onLongPress');
    expect(count).toBe(1);
  });
});
