var passport = require("passport");

const express = require("express");
const router = express.Router();
var isAuthenticated = require("../utility/checkAuthenticate").isAuthenticated;

router.get("/", isAuthenticated, function(req, res) {
  res.render("health", { user: req.user });
});

module.exports = router;
