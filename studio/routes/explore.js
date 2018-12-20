const express = require("express"),
  router = express.Router(),
  hdb_callout = require("./../utility/harperDBCallout"),
  reduceDescribeAllObject = require("./../utility/reduceDescribeAllObject"),
  isAuthenticated = require("../utility/checkAuthenticate").isAuthenticated,
  favorite = require("../utility/favoritesQuery"),
  mapDynamicToStableObject = require("../utility/mapDynamicToStableObject"),
  breadcrumb = require("../utility/breadcrumb"),
  sortSchemas = require("../utility/sortSchemas");

router.get("/", [isAuthenticated, breadcrumb], function(req, res) {
  favorite.getLivelink(req).then(recents => {
    res.render("explore", {
      recents: recents,
      user: req.user
    });
  });
});

router.get("/sql_search", isAuthenticated, function(req, res) {
  var call_object = {
    username: req.user.username,
    password: req.user.password,
    endpoint_url: req.user.endpoint_url,
    endpoint_port: req.user.endpoint_port
  };

  var operation = {
    operation: "describe_all"
  };

  hdb_callout.callHarperDB(call_object, operation, function(err, result) {
    if (err || result.error) {
      console.log(err);
      return err;
    }

    var keywords = reduceDescribeAllObject(result);
    res.render("sql_search", {
      keywords: JSON.stringify(keywords),
      schemas: sortSchemas(result),
      user: req.user,
      breadcrumb: {
        name: req.session.cur_url_name,
        path: req.session.cur_url_path
      }
    });
  });
});

router.get("/sql_search_edit/:livelinkId", isAuthenticated, function(req, res) {
  var call_object = {
    username: req.user.username,
    password: req.user.password,
    endpoint_url: req.user.endpoint_url,
    endpoint_port: req.user.endpoint_port
  };

  var operation = {
    operation: "describe_all"
  };

  favorite
    .getLivelinkById(req, req.params.livelinkId)
    .then(resObj => {
      hdb_callout.callHarperDB(call_object, operation, function(err, result) {
        if (err || result.error) {
          console.log(err);
          return err;
        }
        var keywords = reduceDescribeAllObject(result);
        res.render("sql_search", {
          keywords: JSON.stringify(keywords),
          schemas: sortSchemas(result),
          user: req.user,
          breadcrumb: {
            name: req.session.cur_url_name,
            path: req.session.cur_url_path
          },
          livelinkObject: JSON.stringify(resObj)
        });
      });
    })
    .catch(err => {
      return res.status(200).send(err);
    });
});

router.get("/sql_search/:sqllink", isAuthenticated, function(req, res) {
  var call_object = {
    username: req.user.username,
    password: req.user.password,
    endpoint_url: req.user.endpoint_url,
    endpoint_port: req.user.endpoint_port
  };

  var operation = {
    operation: "describe_all"
  };

  hdb_callout.callHarperDB(call_object, operation, function(err, result) {
    if (err || result.error) {
      console.log(err);
      return err;
    }
    var keywords = reduceDescribeAllObject(result);
    res.render("sql_search", {
      keywords: JSON.stringify(keywords),
      schemas: sortSchemas(result),
      sqlLink: Buffer.from(req.params.sqllink, "base64").toString(),
      user: req.user
    });
  });
});

router.get("/filter_search", isAuthenticated, function(req, res) {
  var call_object = {
    username: req.user.username,
    password: req.user.password,
    endpoint_url: req.user.endpoint_url,
    endpoint_port: req.user.endpoint_port
  };

  var operation = {
    operation: "describe_all"
  };

  hdb_callout.callHarperDB(call_object, operation, function(err, result) {
    if (err || result.error) {
      console.log(err);
      return err;
    }
    res.render("filter_search", {
      schemas: JSON.stringify(sortSchemas(result)),
      user: req.user
    });
  });
});

router.post("/filter_search", isAuthenticated, function(req, res) {
  var connection = {
    username: req.user.username,
    password: req.user.password,
    endpoint_url: req.user.endpoint_url,
    endpoint_port: req.user.endpoint_port
  };

  var operation = {
    operation: "sql",
    sql: req.body.sql
  };
  hdb_callout.callHarperDB(connection, operation, function(err, result) {
    if (err) {
      return res.status(400).send(err);
    }
    var obj = {
      result: mapDynamicToStableObject(result),
      sql: req.body.sql
    };

    return res.status(200).send(obj);
  });
});

router.post("/setfavorite", isAuthenticated, function(req, res) {
  var connection = {
    username: req.user.username,
    password: req.user.password,
    endpoint_url: req.user.endpoint_url,
    endpoint_port: req.user.endpoint_port
  };
  var favoriteObj = {
    sql: req.body.sql,
    name: req.body.name,
    note: req.body.note
  };

  favorite.setFavorites(req, res, favoriteObj).then(result => {
    return res.status(200).send(result);
  });
});
module.exports = router;
