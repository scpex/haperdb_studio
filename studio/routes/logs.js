const express = require("express"),
  router = express.Router(),
  hdb_callout = require("../utility/harperDBCallout"),
  reduceTypeLogs = require("../utility/reduceTypeLogs"),
  isAuthenticated = require("../utility/checkAuthenticate").isAuthenticated,
  mapDynamicToStableObject = require("../utility/mapDynamicToStableObject");

router.get("/", isAuthenticated, function(req, res) {
  var operation = {
    operation: "read_log",
    limit: 500,
    start: 0,
    // "from": "2017-07-10",
    // "until": "2019-07-11",
    order: "desc"
  };

  var call_object = {
    username: req.user.username,
    password: req.user.password,
    endpoint_url: req.user.endpoint_url,
    endpoint_port: req.user.endpoint_port
  };

  hdb_callout.callHarperDB(call_object, operation, function(err, logs) {
    return res.render("logs", {
      user: req.user,
      logs: JSON.stringify(mapDynamicToStableObject(reduceTypeLogs(logs))),
      error: err
    });
  });
});

router.post("/search", isAuthenticated, function(req, res) {
  var connection = {
    username: req.user.username,
    password: req.user.password,
    endpoint_url: req.user.endpoint_url,
    endpoint_port: req.user.endpoint_port
  };

  hdb_callout.callHarperDB(connection, JSON.parse(req.body.operation), function(
    err,
    result
  ) {
    if (err) {
      return res.status(400).send(result);
    }
    var obj = {
      result: mapDynamicToStableObject(reduceTypeLogs(result))
    };
    return res.status(200).send(obj);
  });
});

router.get("/individual/:logDetail", isAuthenticated, function(req, res) {
  var decoded = new Buffer(req.params.logDetail, "base64").toString("ascii");
  res.render("log_individual", {
    user: req.user,
    log: JSON.parse(decoded)
  });
});

router.get("/search", isAuthenticated, function(req, res) {
  res.render("logs_advance", {
    user: req.user
  });
});

module.exports = router;
