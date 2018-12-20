"use strict";

/**
 * This class should be used to verify parameters to initialize the winston logger.
 */

const { promisify } = require("util");
const fs = require("fs");
const config = require("../config/config.json");
const winston = require("winston");

//Promisified functions.
const p_fs_stat = promisify(fs.stat);
const p_fs_mkdir = promisify(fs.mkdir);

const DEFAULT_LOG_LOCATION = "./log";
const EXIST_ERR_CODE = "EEXIST";

/**
 * Returns true if the directory path of the parameter exists and is a directory.  If a file name is part of the parameter
 * it will be ignored, this only verifies the destination directory as winston will create the file specified.
 * @param log_path - The desired path for the location of the log file.
 * @returns {Promise<*>}
 */
async function verifyLogLocation(log_path) {
  if (!log_path) {
    return false;
  }

  let dir_path = log_path.substring(0, log_path.lastIndexOf("/"));
  if (!dir_path || dir_path.length === 0) {
    return false;
  }

  let dir_stats = undefined;
  try {
    dir_stats = await p_fs_stat(dir_path);
  } catch (e) {
    console.error(
      `error getting stats for directory path ${dir_path} ${e}.  Did you create this directory?`
    );
    return false;
  }

  return dir_stats && dir_stats.isDirectory();
}

/**
 * Initialize the winston logger using the config values 'log_location' and 'log_level'.
 * @returns {Promise<void>}
 */
async function initLogger() {
  let log_level = "error";
  let log_path = "./log/hdb_studio_log.log";
  if (config && config.logging_level) {
    log_level = config.logging_level;
  }

  // Try to create the default log directory, if it exists we no-op.
  try {
    await p_fs_mkdir(DEFAULT_LOG_LOCATION);
  } catch (e) {
    if (e.code === EXIST_ERR_CODE) {
      //no-op, default log directory already exists.
    } else {
      console.error(
        `Got an error trying to create the default log directory at path ${DEFAULT_LOG_LOCATION}.  ${e}`
      );
      throw new Error(e);
    }
  }

  if (config && config.log_location) {
    let valid_path = undefined;
    try {
      valid_path = await verifyLogLocation(config.log_location);
    } catch (e) {
      console.error(
        `invalid log location ${config.log_location}, defaulting to ${log_path}`
      );
    }

    if (valid_path) {
      log_path = config.log_location;
    }
  }
  try {
    winston.add(winston.transports.File, {
      level: `${log_level}`,
      filename: `${log_path}`,
      handleExceptions: true,
      prettyPrint: true
    });
    winston.remove(winston.transports.Console);
  } catch (e) {
    console.error(`Had a problem adjusting the winston transports: ${e}`);
  }
}

module.exports = {
  verifyLogLocation: verifyLogLocation,
  initLogger: initLogger
};
