import {StyleSheet} from 'react-native';

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
    borderColor: 'gray',
    width: '96%',
    fontSize: 15,
    borderWidth: 1,
    borderRadius: 10,
    padding: 5,
    paddingLeft: 10,
    margin: '2%',
  },
  button: {
    margin:10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
  },
  navButton: {
    flex:1,
    margin:10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
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
  formSection: {
    height: '85%', //92
  },
  // -------------------------------------------------------------------------//
  // Verifier Stuff
  statusContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBox: {
    margin:10,
    padding: 12,
    borderRadius: 20,
    elevation: 3,
  },
  // -------------------------------------------------------------------------//
  // ID Card Stuff
  IDCardContainer: {
    // Keep everything centered
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
  //--------------------------------------------------------------------------//
  photoSection: {
    aspectRatio: 85 / 55,
    borderRadius: 10,
    width: '90%', // Height controlled by aspect ratio
    paddingTop: '5%',
    paddingLeft: '5%',
    paddingRight: '5%',
    paddingBottom: '0.5%',
    backgroundColor: '#a9e1f5',
  },
  photoSectionClicked: {
    aspectRatio: 85 / 55,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: '90%', // Height controlled by aspect ratio
    paddingTop: '5%',
    paddingLeft: '5%',
    paddingRight: '5%',
    paddingBottom: '0.5%',
    backgroundColor: '#a9e1f5',
  },
  photoFlex: {
    flex: 1,
    flexDirection: 'row',
  },
  photo: {
    flex: 1,
    borderRadius: 10,
    aspectRatio: 2 / 2.5,
  },
  currentAge: {
    flex: 1,
  },
  ageBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexBasis: '30%',
  },
  yearsOldBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 30,
  },
  // -------------------------------------------------------------------------//
  attributeSection: {
    aspectRatio: 85 / 76,
    width: '90%',
    backgroundColor: '#a9e1f5',
    flexDirection: 'column',
    padding: '5%',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: 15,
  },
  //--------------------------------------------------------------------------//
  attributeContainer: {
    flexDirection: 'row',
    marginTop: 6,
    marginBottom: 6,
  },
  attributeTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  attributeDescription: {
    fontSize: 16,
    fontWeight: '400',
  },
  //--------------------------------------------------------------------------//
});
export default styles;
