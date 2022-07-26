/*
Author: Ted Jenks

This class is an adapter for Realm to manage the personal identity of users
locally.
 */

//------------------------------------------------------------------------------

/* IMPORTS */

// Third party packages
import Realm from 'realm';

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
      });
    });
  }
}

//------------------------------------------------------------------------------

/* EXPORTS */

module.exports = {IdentityManager};
