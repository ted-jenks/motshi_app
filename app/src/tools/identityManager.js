/*
Author: Ted Jenks

This class is an adapter for Realm to manage the personal identity of users
locally.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// Third party packages
import Realm from 'realm';
import { LINEAR_GRADIENT } from "../style/styles";

//------------------------------------------------------------------------------

/* BODY */

class IdentityManager {
  IDENTITY_SCHEMA = {
    // schema for the personal data stored locally
    name: 'Identity',
    properties: {
      name: 'string',
      dob: 'date',
      pob: 'string',
      expiry: 'date',
      house: 'string',
      street: 'string',
      city: 'string',
      postcode: 'string',
      sex: 'string',
      nationality: 'string',
      photoData: 'string',
      address: 'string', // this is the BC address btw
      linearGrad1: 'string',
      linearGrad2: 'string',
    },
  };

  constructor(schemaName = 'Identity') {
    this.IDENTITY_SCHEMA.name = schemaName;
  }

  async open() {
    const realm = await Realm.open({
      schema: [this.IDENTITY_SCHEMA],
    });
    return realm;
  }

  async getID() {
    // returns an object with all the data in the same form as the schema
    const realm = await this.open();
    const ID = realm.objects(this.IDENTITY_SCHEMA.name);
    if (ID.length == 0 || !ID) {
      await realm.close();
      return null;
    } else {
      let object = {};
      for (let [property, _] of Object.entries(
        this.IDENTITY_SCHEMA.properties,
      )) {
        object[property] = ID[0][property];
      }
      await realm.close();
      return object;
    }
  }

  async deleteAll() {
    // remove all data from the realm
    const realm = await this.open();
    realm.write(() => {
      realm.delete(realm.objects(this.IDENTITY_SCHEMA.name));
    });
    realm.close();
  }

  async changeColors(color1, color2) {
    const realm = await this.open();
    realm.write(() => {
      let ID = realm.objects(this.IDENTITY_SCHEMA.name)[0];
      ID.linearGrad1 = color1;
      ID.linearGrad2 = color2;
    });
  }

  async storeID(
    name,
    dob,
    pob,
    expiry,
    house,
    street,
    city,
    postcode,
    sex,
    nationality,
    photoData,
    address,
    linearGrad1= LINEAR_GRADIENT[0],
    linearGrad2= LINEAR_GRADIENT[1],
  ) {
    // writes the data to file locally
    const realm = await this.open();
    realm.write(() => {
      realm.create(this.IDENTITY_SCHEMA.name, {
        name: name,
        dob: new Date(dob),
        pob: pob,
        expiry: new Date(expiry),
        house: house,
        street: street,
        city: city,
        postcode: postcode,
        sex: sex,
        nationality: nationality,
        photoData: photoData,
        address: address,
        linearGrad1: linearGrad1,
        linearGrad2: linearGrad2,
      });
    });
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

module.exports = {IdentityManager};
