"use strict";

const passport = require("passport");
const express = require("express");
const router = express.Router();
const config = require("../config/config");

const DEFAULT_HOST = "localhost";
const DEFAULT_PORT = 9925;

router.get("/", function(req, res) {
  let login_object = {
    title: "Hey",
    ref: req.query.ref,
    default_host: config.default_host ? config.default_host : DEFAULT_HOST,
    default_port: config.default_port ? config.default_port : DEFAULT_PORT
  };
  res.render("login", login_object);
  return;
});

router.post("/", function(req, res, next) {
  var err_msg = "";
  if (!req.body.username) {
    err_msg += "Missing Username ";
  }

  if (!req.body.password) {
    err_msg += " Missing Password ";
  }

  if (!req.body.endpoint_url) {
    err_msg += " Missing Endpoint URL ";
  }

  if (!req.body.endpoint_port) {
    err_msg += " Missing Endpoint Port ";
  }

  if (err_msg) {
    // console.log(err_msg);
    return res.render("login", { error: err_msg });
  }

  var ref = "";
  if (req.body.ref && req.body.ref != "undefined") ref = req.body.ref;

  passport.authenticate("local", function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render("login", { error: info.message });
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }

      return res.redirect("/" + ref);
    });
  })(req, res, next);
});

module.exports = router;
