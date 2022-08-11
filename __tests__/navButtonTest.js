import { fireEvent, render } from "@testing-library/react-native";
import React from 'react';
import NavButton from "../app/src/components/generic/navButton";


describe('nav button tests', function () {
  it('can render component successfully', () => {
    render(<NavButton text={'Test'} />);
  });

  it('can display correct text', () => {
    const {getAllByText} = render(
      <NavButton text={'Test'} />,
    );
    const text = getAllByText('Test');
    expect(text).toHaveLength(1);
  });

  it('can be pressed', () => {
    let count = 0;
    const onPress = () => count ++;
    const {getByText} = render(
      <NavButton text={'Test'} onPress={onPress} pressable={true}/>,
    );
    fireEvent.press(getByText('Test'));
    expect(count).toBe(1);
  });

  it('can be long pressed', () => {
    let count = 0;
    const onPress = () => count ++;
    const {getByText} = render(
      <NavButton text={'Test'} onLongPress={onPress} pressable={true} />,
    );
    fireEvent(getByText('Test'), 'onLongPress');
    expect(count).toBe(1);
  });

  it('can disable press', () => {
    let count = 0;
    const onPress = () => count ++;
    const {getByText} = render(
      <NavButton text={'Test'} onPress={onPress} pressable={false}/>,
    );
    fireEvent.press(getByText('Test'));
    expect(count).toBe(0);
  });

  it('can disable long press', () => {
    let count = 0;
    const onPress = () => count ++;
    const {getByText} = render(
      <NavButton text={'Test'} onLongPress={onPress} pressable={false} />,
    );
    fireEvent(getByText('Test'), 'onLongPress');
    expect(count).toBe(0);
  });
});
