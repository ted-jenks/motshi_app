import {StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

export const ICON_DARK = '#323034';
export const SCAN_ANIMATION =
  require('../assets/75577-scan-pulse (1).json');
const text = {fontFamily: 'sans-serif-medium', letterSpacing: 0.25};
export const LINEAR_GRADIENT = ['#9b54ff', '#4c13a4'];
const textDark = {color: '#4f4f56', ...text};
const textLight = {color: 'rgba(78,74,89,0.72)', ...text};
const textBright = {color: '#6135bb', ...text};
const colouredButton = {backgroundColor: '#6135bb'};

const styles = StyleSheet.create({
  // GENERIC SECTION COMPONENT
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    ...textDark,
  },
  sectionDescription: {
    marginTop: 8,
    marginBottom: 20,
    fontSize: 18,
    fontWeight: '400',
    ...textLight,
  },
  // -------------------------------------------------------------------------//
  // SIGN UP SELECTION
  signUpSelectionButton: {
    margin: 7,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 25,
    paddingHorizontal: 32,
    borderRadius: 40,
    elevation: 3,
    ...colouredButton,
  },
  signUpSelectionText: {
    fontSize: 20,
    color: 'white',
  },
  // -------------------------------------------------------------------------//
  // DATA ENTRY NAVIGATION
  topNavBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  // -------------------------------------------------------------------------//
  // TEXT INPUTS
  input: {
    borderColor: '#d5d5e1',
    width: '96%',
    alignSelf: 'center',
    fontSize: 17,
    borderWidth: 1.5,
    borderRadius: 40,
    padding: 10,
    paddingLeft: 16,
    margin: 7,
    ...textDark,
  },
  // -------------------------------------------------------------------------//
  // NAV BUTTON
  navButton: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 40,
    elevation: 3,
    ...colouredButton,
  },
  navButtonText: {
    ...text,
    fontSize: 20,
    color: 'white',
  },
  // -------------------------------------------------------------------------//
  // BUTTON CONTAINER
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  // -------------------------------------------------------------------------//
  // CLICKABLE TEXT
  clickableText: {
    ...textLight,
    padding: 25,
    textDecorationLine: 'underline',
  },
  // -------------------------------------------------------------------------//
  // QR SCANNER CONTAINER
  qrContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  // -------------------------------------------------------------------------//
  // VERIFIER
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBox: {
    margin: 10,
    padding: 12,
    borderRadius: 20,
    elevation: 3,
  },
  scanningText: {
    fontSize: 26,
    lineHeight: 70,
    fontWeight: 'bold',
    ...textBright,
  },
  // -------------------------------------------------------------------------//
  // GENERIC ID CARD STUFF
  IDCardContainer: {
    // Keep everything centered
    flex: 1,
    flexGrow: 7,
    paddingTop: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    // Shadow Props only for ios
    shadowColor: '#0d093f',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 100,
    shadowRadius: 100,
    elevation: 20,
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  sendAnimationContainer: {
    width: '100%',
    alignItems: 'center',
  },
  //--------------------------------------------------------------------------//
  // SETTINGS
  settingsHeading: {
    fontSize: 50,
    padding: 20,
    marginBottom: 40,
    fontWeight: 'bold',
    ...textDark,
  },
  settingsTitle: {
    fontSize: 25,
    padding: 29,
    paddingTop: 40,
    paddingBottom: 15,
    fontWeight: 'bold',
    ...textDark,
  },
  settingsItem: {
    width: '95%',
    borderBottomWidth: 1,
    borderColor: 'rgba(56,49,155,0.26)',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  settingsItemText: {
    fontSize: 15,
    padding: 7,
    ...textLight,
  },

  //--------------------------------------------------------------------------//
  // PHOTO SECTION OF ID CARD
  photoSection: {
    aspectRatio: 85 / 55,
    borderRadius: 10,
    paddingHorizontal: '5%',
    width: '90%', // Height controlled by aspect ratio
    color: 'white',
  },
  photoSectionClicked: {
    aspectRatio: 85 / 55,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    paddingHorizontal: '5%',
    width: '90%', // Height controlled by aspect ratio
  },
  photoSectionFlexContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoFlex: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    width: '90%',
    borderRadius: 10,
    aspectRatio: 2 / 2.5,
  },
  currentAge: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ageBox: {
    alignItems: 'center',
  },
  yearsOldBox: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  // -------------------------------------------------------------------------//
  // ATTRIBUTE SECTION OF ID CARD
  attributeSection: {
    aspectRatio: 85 / 76,
    width: '90%',
    flexDirection: 'column',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    justifyContent: 'center',
    paddingLeft: '7.8%',
    paddingRight: '5%',
    paddingBottom: '7%',
  },
  //--------------------------------------------------------------------------//
  // ATTRIBUTE CONTENT
  attributeContainer: {
    flexDirection: 'row',
    marginTop: 6,
    marginBottom: 6,
  },
  attributeTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: 'white',
    flex: 1,
  },
  attributeDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: 'white',
    flexWrap: 'wrap',
  },
  expiredAccountSubtext: {color: '#ffffff', fontSize: 15, textAlign: 'center'},
  expiredAccountText: {fontSize: 20, color: 'white'},
  //--------------------------------------------------------------------------//
});
export default styles;
