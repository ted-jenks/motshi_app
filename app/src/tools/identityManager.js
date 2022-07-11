import Realm from 'realm';

class IdentityManager {
  IDENTITY_SCHEMA = {
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
      address: 'string',
      key: 'string',
      photoData: 'string',
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
    const realm = await this.open();
    const ID = realm.objects(this.IDENTITY_SCHEMA.name);
    if (ID.length == 0) {
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
    address,
    key,
    photoData,
  ) {
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
        address: address,
        key: key,
        photoData: photoData,
      });
    });
  }
}

module.exports = {IdentityManager};
