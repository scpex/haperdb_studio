"use strict";
const http = require("http");
const https = require("https");
const config = require("../config/config.json");

const HTTP_STRING = "http://";
const HTTPS_STRING = "https://";
const HTTP_PROTOCOL_TAG = "http:";
const HTTPS_PROTOCOL_TAG = "https:";

function callHarperDB(call_object, operation, callback) {
  let parsed_host = call_object.endpoint_url;
  // Default to the config protocol, allow this to be overridden
  let protocol = config.protocol + ":";
  // http.request does not allow for the protocol in the host or hostname fields.  If it exists we need to
  // remove it and add it to the protocol.
  if (call_object.endpoint_url.includes(HTTP_STRING)) {
    parsed_host = parsed_host.substr(
      HTTPS_STRING.length - 1,
      parsed_host.length
    );
  } else if (call_object.endpoint_url.includes(HTTPS_STRING)) {
    parsed_host = parsed_host.substr(0, HTTPS_STRING.length - 1);
    protocol = HTTPS_PROTOCOL_TAG;
  }
  let options = {
    method: "POST",
    protocol: `${protocol}`,
    hostname: `${parsed_host}`,
    port: call_object.endpoint_port,
    path: "/",
    headers: {
      "content-type": "application/json",
      authorization:
        "Basic " +
        new Buffer(call_object.username + ":" + call_object.password).toString(
          "base64"
        ),
      "cache-control": "no-cache"
    }
  };
  // For an https request we need to use https.request.  Swap the function used based on the protocol value.
  let request_call = http.request;
  if (protocol === HTTPS_PROTOCOL_TAG) {
    request_call = https.request;
  }

  let http_req = request_call(options, function(hdb_res) {
    let chunks = [];

    hdb_res.on("data", function(chunk) {
      chunks.push(chunk);
    });

    hdb_res.on("end", function() {
      let body = Buffer.concat(chunks);
      if (isJson(body)) {
        return callback(null, JSON.parse(body), hdb_res.statusCode);
      } else {
        return callback(body, null);
      }
    });
  });

  http_req.on("error", function(chunk) {
    return callback("Failed to connect", null);
  });

  http_req.write(JSON.stringify(operation));
  http_req.end();
}

function isJson(s) {
  try {
    JSON.parse(s);
    return true;
  } catch (e) {
    return false;
  }
}

module.exports = {
  callHarperDB: callHarperDB
};
