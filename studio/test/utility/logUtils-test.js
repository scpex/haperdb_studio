"use strict";

const assert = require("assert");
const sinon = require("sinon");
const log_utils = require("../../utility/logUtils");
const rewire = require("rewire");
// We need to use rewire to stub out p_fs_mkdir, since sinon doesn't see it as a function
const log_utils_rw = rewire("../../utility/logUtils");
const winston = require("winston");
const default_config = require("../../config/config");
const fs = require("fs");

describe("Test verifyLogLocation", function() {
  it("Test with valid path, expect true", async function() {
    let test_path = "./log/";
    try {
      let valid_path = await log_utils.verifyLogLocation(test_path);
      assert.equal(valid_path, true, "expect true result (valid path)");
    } catch (e) {
      throw e;
    }
  });
  it("Test with valid path and file name, expect true", async function() {
    let test_path = "./log/test_name.log";
    try {
      let valid_path = await log_utils.verifyLogLocation(test_path);
      assert.equal(valid_path, true, "expect true result (valid path)");
    } catch (e) {
      throw e;
    }
  });
  it("Test with invalid path and file name, expect false", async function() {
    let test_path = "./logblahblah/test_name.log";
    try {
      let valid_path = await log_utils.verifyLogLocation(test_path);
      assert.equal(valid_path, false, "expect false result (invalid path)");
    } catch (e) {
      throw e;
    }
  });
  it("Test with undefined path, expect false", async function() {
    let test_path = undefined;
    try {
      let valid_path = await log_utils.verifyLogLocation(test_path);
      assert.equal(valid_path, false, "expect false result (invalid path)");
    } catch (e) {
      throw e;
    }
  });
  it("Test with empty path, expect false", async function() {
    let test_path = "";
    try {
      let valid_path = await log_utils.verifyLogLocation(test_path);
      assert.equal(valid_path, false, "expect false result (invalid path)");
    } catch (e) {
      throw e;
    }
  });
});

describe("Test initLogger", function() {
  let sandbox = null;
  let fs_mkdir_stub = undefined;
  beforeEach(function() {
    sandbox = sinon.createSandbox();
  });
  afterEach(function() {
    sandbox.restore();
    winston.default.transports.file = undefined;
  });
  it("Test nominal path, create default directory, no errors", async function() {
    // We dont want to mess with the file system, so stub out mkdir
    fs_mkdir_stub = sandbox.stub().returns(true);
    log_utils_rw.__set__("p_fs_mkdir", fs_mkdir_stub);
    try {
      await log_utils_rw.initLogger();
    } catch (e) {
      throw e;
    }
    assert.ok(
      winston.default.transports.file !== undefined,
      "File transport was not initialized."
    );
    let log_path = `${winston.default.transports.file.dirname}/${
      winston.default.transports.file.filename
    }`;
    assert.equal(
      log_path,
      default_config.log_location,
      "log path does not equal the path in config"
    );
    assert.equal(
      winston.default.transports.console,
      undefined,
      "Console logger should have been removed"
    );
  });
  it("Test error handling with directory creation", async function() {
    fs_mkdir_stub = sandbox.stub().throws("bummer");
    log_utils_rw.__set__("p_fs_mkdir", fs_mkdir_stub);
    let err_msg = undefined;
    try {
      await log_utils_rw.initLogger();
    } catch (e) {
      err_msg = e;
    }
    assert.equal(err_msg instanceof Error, true, "expected an error back");
  });
  it("Test invalid log location, settings to default", async function() {
    fs_mkdir_stub = sandbox.stub().returns(true);
    log_utils_rw.__set__("p_fs_mkdir", fs_mkdir_stub);
    //Overwrite config with a bad path
    log_utils_rw.__set__("config", {
      logging_level: "info",
      log_location: "./whatalong/strangetripitsbeen.log"
    });
    try {
      await log_utils_rw.initLogger();
    } catch (e) {
      // Unexpected error
      throw e;
    }
    // Bad values in the config file, expect default values
    assert.ok(
      winston.default.transports.file !== undefined,
      "File transport was not initialized."
    );
    let log_path = `${winston.default.transports.file.dirname}/${
      winston.default.transports.file.filename
    }`;
    assert.equal(
      log_path,
      default_config.log_location,
      "log path does not equal the path in config"
    );
    assert.equal(
      winston.default.transports.console,
      undefined,
      "Console logger should have been removed"
    );

    // restore config file
    log_utils_rw.__set__("config", default_config);
  });
  it("Test valid custom log path", async function() {
    fs_mkdir_stub = sandbox.stub().returns(true);
    log_utils_rw.__set__("p_fs_mkdir", fs_mkdir_stub);
    let custom_log_path = "./test/utility/test_log_file.log";
    //Overwrite config with a bad path
    log_utils_rw.__set__("config", {
      logging_level: "info",
      log_location: `${custom_log_path}`
    });
    try {
      await log_utils_rw.initLogger();
    } catch (e) {
      // Unexpected error
      throw e;
    }

    assert.ok(
      winston.default.transports.file !== undefined,
      "File transport was not initialized."
    );
    let log_path = `${winston.default.transports.file.dirname}/${
      winston.default.transports.file.filename
    }`;
    assert.equal(
      log_path,
      custom_log_path,
      "log path does not equal the path in config"
    );
    assert.equal(
      winston.default.transports.console,
      undefined,
      "Console logger should have been removed"
    );

    // restore config file
    log_utils_rw.__set__("config", default_config);
  });
});
