const express = require("express"),
  router = express.Router(),
  isAuthenticated = require("../utility/checkAuthenticate").isAuthenticated;

router.get("/", isAuthenticated, function(req, res) {
  res.render("index", { user: req.user });
});

module.exports = router;
