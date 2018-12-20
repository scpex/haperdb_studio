var mapDynamicToStableObject = require("../utility/mapDynamicToStableObject"),
  expect = require("chai").expect;

question1 = [
  {
    name: "nook",
    age: 19
  },
  {
    name: "neck",
    dog: "box box",
    age: 22
  },
  {
    name: "nink",
    gender: 0
  }
];

result1 = [
  { name: "nook", age: 19, dog: null, gender: null },
  { name: "neck", age: 22, dog: "box box", gender: null },
  { name: "nink", age: null, dog: null, gender: 0 }
];

question2 = [
  {
    country: "GREAT BRITAIN",
    name: "ENGLISH SETTER",
    section: "British and Irish Pointers and Setters",
    id: 2,
    image: "http://www.fci.be/Nomenclature/Illustrations/002g07.jpg",
    date: "1636-02-19"
  },
  {
    country: "IRELAND",
    name: "KERRY BLUE TERRIER",
    section: "Large and medium sized Terriers",
    id: 3,
    date: "1642-05-16"
  }
];

result2 = [
  {
    country: "GREAT BRITAIN",
    name: "ENGLISH SETTER",
    section: "British and Irish Pointers and Setters",
    id: 2,
    image: "http://www.fci.be/Nomenclature/Illustrations/002g07.jpg",
    date: "1636-02-19"
  },
  {
    country: "IRELAND",
    name: "KERRY BLUE TERRIER",
    section: "Large and medium sized Terriers",
    id: 3,
    image: null,
    date: "1642-05-16"
  }
];

var error1 = {
  error:
    "Parse error on line 1:\n...FROM dev.Dog  limit a5\n-----------------------^\nExpecting 'NUMBER', got 'LITERAL'"
};

var resultError1 = {
  error:
    "Parse error on line 1:\n...FROM dev.Dog  limit a5\n-----------------------^\nExpecting 'NUMBER', got 'LITERAL'"
};

mapDynamicToStableObject();
describe("map dynamic obejcts to stable object for datatable", () => {
  it("empty object should return empty", () => {
    var objTranformTest = mapDynamicToStableObject({});
    expect(objTranformTest).to.deep.equal({});

    var objTranformTest2 = mapDynamicToStableObject([]);
    expect(objTranformTest2).to.deep.equal([]);
  });

  it("question1 should equal result1", () => {
    var objTranformTest = mapDynamicToStableObject(question1);
    expect(objTranformTest).to.be.an("array");
    expect(objTranformTest).to.deep.equal(result1);
  });

  it("question2 should equal result2", () => {
    var objTranformTest = mapDynamicToStableObject(question2);
    expect(objTranformTest).to.be.an("array");
    expect(objTranformTest).to.deep.equal(result2);
  });
  it("it only object should return same object", () => {
    var objTranformTest = mapDynamicToStableObject(error1);
    expect(objTranformTest).to.deep.equal(resultError1);
  });
});
