import { fireEvent, render } from "@testing-library/react-native";
import React from 'react';
import SignUpSelection from "../app/src/components/newUser/signUpSelection/signUpSelection";


describe('sign up selection tests', function () {
  it('can render component successfully', () => {
    render(<SignUpSelection onDelete={() => {}}/>);
  });

  it('can display correct register text', () => {
    const {getAllByText} = render(
      <SignUpSelection onDelete={() => {}} />,
    );
    const text = getAllByText('REGISTER');
    expect(text).toHaveLength(1);
  });

  it('can display correct import text', () => {
    const {getAllByText} = render(
      <SignUpSelection onDelete={() => {}} />,
    );
    const text = getAllByText('IMPORT ACCOUNT');
    expect(text).toHaveLength(1);
  });

  it('can display correct report text', () => {
    const {getAllByText} = render(
      <SignUpSelection onDelete={() => {}} />,
    );
    const text = getAllByText('REPORT ACCOUNT STOLEN OR LOST');
    expect(text).toHaveLength(1);
  });

  it('can press register', () => {
    let count = 0;
    const onPress = () => count ++;
    const {getByText} = render(
      <SignUpSelection onDelete={() => {}} onRegister={onPress} />,
    );
    fireEvent.press(getByText('REGISTER'));
    expect(count).toBe(1);
  });

  it('can press import', () => {
    let count = 0;
    const onPress = () => count ++;
    const {getByText} = render(
      <SignUpSelection onDelete={() => {}} onImport={onPress}/>,
    );
    fireEvent.press(getByText('IMPORT ACCOUNT'));
    expect(count).toBe(1);
  });

  it('can press stolen', () => {
    let count = 0;
    const onPress = () => count ++;
    const {getByText} = render(
      <SignUpSelection onDelete={() => {}} onStolen={onPress}/>,
    );
    fireEvent.press(getByText('REPORT ACCOUNT STOLEN OR LOST'));
    expect(count).toBe(1);
  });
});
