jest.mock('react-native-pkce-challenge', () => ({
  asyncPkceChallenge: jest.fn(),
}));
