import {StyleSheet} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    marginBottom: 20,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  // -------------------------------------------------------------------------//
  input: {
    borderColor: Colors.dark,
    color: Colors.dark,
    width: '96%',
    fontSize: 15,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    paddingLeft: 10,
    margin: '2%',
  },
  button: {
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#763b98',
  },
  navButton: {
    flex: 1,
    margin: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: '#763b98',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  textBlack: {
    fontSize: 26,
    lineHeight: 70,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
  },
  // -------------------------------------------------------------------------//
  // Sign up Stuff
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  qrContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  // -------------------------------------------------------------------------//
  // Verifier Stuff
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
  // -------------------------------------------------------------------------//
  // ID Card Stuff
  IDCardContainer: {
    // Keep everything centered
    flex: 1,
    flexGrow: 8,
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: {
    // Shadow Props only for ios
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  sendAnimationContainer: {
    width: '100%',
    alignItems: 'center',
  },
  expiredAccountSubtext: {color: '#ffffff', fontSize: 15, textAlign: 'center'},
  expiredAccountText: {fontSize: 20, color: 'white'},
  //--------------------------------------------------------------------------//
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
  attributeContainer: {
    flexDirection: 'row',
    marginTop: 6,
    marginBottom: 6,
  },
  attributeTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  attributeDescription: {
    fontSize: 14,
    fontWeight: '400',
  },
  //--------------------------------------------------------------------------//
});
export default styles;
