var objectReduce = require("../utility/reduceDescribeAllObject"),
  expect = require("chai").expect;
var object1 = {
  dev: {
    dog: {
      hash_attribute: "id",
      id: "71f3a8fa-227c-4955-a428-08db1bfd8a89",
      name: "dog",
      residence: ["node_s", "node_1", "node_2"],
      schema: "dev",
      attributes: [
        {
          attribute: "name"
        },
        {
          attribute: "id"
        },
        {
          attribute: "age"
        },
        {
          attribute: "breed"
        }
      ]
    },
    cat: {
      hash_attribute: "cat_id",
      id: "71f3a8fa-227c-4955-a428-08db1bfd8a89",
      name: "cat",
      residence: ["node_s", "node_1", "node_2"],
      schema: "dev",
      attributes: [
        {
          attribute: "gender"
        },
        {
          attribute: "color"
        },
        {
          attribute: "cat_id"
        }
      ]
    }
  },
  test: {
    customer: {
      hash_attribute: "cus_id",
      id: "71f3a8fa-227c-4955-a428-08db1bfd8a89",
      name: "customer",
      residence: ["node_s", "node_1", "node_2"],
      schema: "test",
      attributes: [
        {
          attribute: "cus_id"
        },
        {
          attribute: "first_name"
        },
        {
          attribute: "last_name"
        }
      ]
    }
  }
};

var result1 = [
  ["dev", "dog", "cat", "test", "customer"],
  {
    dog: ["name", "id", "age", "breed"],
    cat: ["gender", "color", "cat_id"],
    dev: ["dog", "cat"],
    customer: ["cus_id", "first_name", "last_name"],
    test: ["customer"]
  }
];

var object2 = {
  b1: {
    dog: {
      hash_attribute: "id",
      id: "71f3a8fa-227c-4955-a428-08db1bfd8a89",
      name: "dog",
      residence: ["node_s", "node_1", "node_2"],
      schema: "dev"
    }
  },
  b2: {},
  n3: {}
};

var result2 = [
  ["b1", "dog", "b2", "n3"],
  {
    dog: [],
    b1: ["dog"],
    b2: [],
    n3: []
  }
];

describe("reduce obejct function", () => {
  it("empty object should return empty", () => {
    var objectReduceTest = objectReduce({});
    expect(objectReduceTest).to.be.an("array");
    expect(objectReduceTest[0]).to.be.empty;
    expect(objectReduceTest[1]).to.be.empty;
  });

  it("object1 should equal result1", () => {
    var objectReduceTest = objectReduce(object1);
    expect(objectReduceTest).to.be.an("array");
    expect(objectReduceTest[0]).to.deep.equal(result1[0]);
    expect(objectReduceTest[1]).to.deep.equal(result1[1]);
  });

  it("object2 should equal result2", () => {
    var objectReduceTest = objectReduce(object2);
    expect(objectReduceTest).to.be.an("array");
    expect(objectReduceTest[0]).to.deep.equal(result2[0]);
    expect(objectReduceTest[1]).to.deep.equal(result2[1]);
  });
});
