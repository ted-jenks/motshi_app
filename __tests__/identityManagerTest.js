import { IdentityManager } from "../app/src/tools/identityManager";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message || "Assertion failed");
  }
}

describe("Identity Manager tests", function() {

  const identityManager = new IdentityManager("Test");
  const id = {
    name: "test",
    dob: new Date("2000-01-01"),
    pob: "test",
    expiry: new Date("2000-01-01"),
    house: "test",
    street: "test",
    city: "test",
    postcode: "test",
    sex: "test",
    nationality: "test",
  };

  it("can store an identity", () => {
    identityManager.storeID(
      "test",
      "2000-01-01",
      "test",
      "2000-01-01",
      "test",
      "test",
      "test",
      "test",
      "test",
      "test")
      .then(() => {
        identityManager.getID()
          .then(res => {
            assert(res == id);
          });
      });
  });

  it("can delete an identity", () => {
    identityManager.storeID(
      "test",
      "2000-01-01",
      "test",
      "2000-01-01",
      "test",
      "test",
      "test",
      "test",
      "test",
      "test")
      .then(() => {
        identityManager.deleteAll()
          .then(() => {
            identityManager.getID()
              .then(res => {
                assert(res == null);
              });
          });
      });
  });


});

