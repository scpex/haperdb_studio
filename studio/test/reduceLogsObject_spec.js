var reduceTypeLogs = require("../utility/reduceTypeLogs"),
  expect = require("chai").expect;
// var assert = require('assert');
var obj = {
  file: [
    {
      level: "error",
      message: "ping timeout",
      timestamp: "2018-02-01T08:48:40.133Z"
    },
    {
      level: "error",
      message: "ping timeout",
      timestamp: "2018-02-01T08:48:40.043Z"
    },
    {
      level: "error",
      message: "Item not found!",
      timestamp: "2018-02-01T08:47:57.171Z"
    },
    {
      level: "error",
      message: "",
      timestamp: "2018-02-01T08:47:53.970Z"
    }
  ],
  register: [
    {
      level: "non",
      message: "wrong password",
      timestamp: "2018"
    },
    {
      level: "non",
      message: "wrong password",
      timestamp: "2017"
    }
  ]
};

describe("reduce logs obejct function", () => {
  it("return empty object when logs is empty", () => {
    var logsTest = reduceTypeLogs({});
    expect(logsTest).to.be.an("array").that.is.empty;
    expect(logsTest.length).to.equal(0);
  });

  it("return reduct object", () => {
    var logsTest = reduceTypeLogs(obj);
    expect(logsTest).to.be.an("array");
    expect(logsTest.length).to.equal(6);
    logsTest.forEach(element => {
      expect(element).to.have.own.property("type");
    });
  });
});
