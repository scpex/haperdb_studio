const express = require("express"),
  router = express.Router(),
  hdb_callout = require("../utility/harperDBCallout"),
  isAuthenticated = require("../utility/checkAuthenticate").isAuthenticated,
  isSuperAdmin = require("../utility/checkAuthenticate").isSuperAdmin,
  mapObject = require("../utility/mapDescribeAllToAddRole");

router.get("/", [isAuthenticated, isSuperAdmin], function(req, res) {
  var operation = {
    operation: "list_users"
  };
  var call_object = {
    username: req.user.username,
    password: req.user.password,
    endpoint_url: req.user.endpoint_url,
    endpoint_port: req.user.endpoint_port
  };

  hdb_callout.callHarperDB(call_object, operation, function(err, users) {
    return res.render("security", {
      user: req.user,
      users: JSON.stringify(users),
      error: err
    });
  });
});

router.post("/update_user_active", [isAuthenticated, isSuperAdmin], function(
  req,
  res
) {
  var operation = {
    operation: "alter_user",
    username: req.body.username,
    active: JSON.parse(req.body.active)
  };

  var call_object = {
    username: req.user.username,
    password: req.user.password,
    endpoint_url: req.user.endpoint_url,
    endpoint_port: req.user.endpoint_port
  };

  hdb_callout.callHarperDB(call_object, operation, function(err, success) {
    if (err) {
      return res.status(400).send(err);
    }
    return res.status(200).send(success);
  });
});

router.post("/update_user_password", [isAuthenticated, isSuperAdmin], function(
  req,
  res
) {
  var operation = {
    operation: "alter_user",
    username: req.body.username,
    password: req.body.password
  };

  var call_object = {
    username: req.user.username,
    password: req.user.password,
    endpoint_url: req.user.endpoint_url,
    endpoint_port: req.user.endpoint_port
  };

  hdb_callout.callHarperDB(call_object, operation, function(err, success) {
    if (err) {
      return res.status(400).send(err);
    }
    return res.status(200).send(success);
  });
});

router.get("/add_role", [isAuthenticated, isSuperAdmin], function(req, res) {
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
    res.render("add_role", {
      schemas: result,
      flatenSchema: JSON.stringify(mapObject(result)),
      user: req.user
    });
  });
});

router.post("/add_role", [isAuthenticated, isSuperAdmin], function(req, res) {
  var call_object = {
    username: req.user.username,
    password: req.user.password,
    endpoint_url: req.user.endpoint_url,
    endpoint_port: req.user.endpoint_port
  };
  hdb_callout.callHarperDB(
    call_object,
    JSON.parse(req.body.operationAddRole),
    function(err, result) {
      if (err) {
        return res.status(400).send(result);
      }

      return res.status(200).send(result);
    }
  );
});

router.post("/alter_role", [isAuthenticated, isSuperAdmin], function(req, res) {
  var call_object = {
    username: req.user.username,
    password: req.user.password,
    endpoint_url: req.user.endpoint_url,
    endpoint_port: req.user.endpoint_port
  };
  hdb_callout.callHarperDB(
    call_object,
    JSON.parse(req.body.operationEditRole),
    function(err, result) {
      if (err) {
        return res.status(400).send(result);
      }

      return res.status(200).send(result);
    }
  );
});

router.get("/add_user", [isAuthenticated, isSuperAdmin], function(req, res) {
  res.render("add_user", {
    user: req.user
  });
});

router.get("/edit_role", [isAuthenticated, isSuperAdmin], function(req, res) {
  Promise.all([getSchemaAll(req, res), getListRole(req, res)]).then(
    resultArray => {
      res.render("edit_role", {
        user: req.user,
        schemas: resultArray[0],
        flatenSchema: JSON.stringify(mapObject(resultArray[0])),
        roles: resultArray[1]
      });
    }
  );
});

router.post("/edit_user", [isAuthenticated, isSuperAdmin], function(req, res) {
  res.render("edit_user", {
    user: JSON.parse(req.body.user)
  });
});

router.post("/getalluser", [isAuthenticated, isSuperAdmin], function(req, res) {
  var connection = {
    username: req.user.username,
    password: req.user.password,
    endpoint_url: req.user.endpoint_url,
    endpoint_port: req.user.endpoint_port
  };
  var operation = {
    operation: "list_users"
  };
  hdb_callout.callHarperDB(connection, operation, function(err, user) {
    if (err) {
      return res.status(400).send(user);
    }

    return res.status(200).send(user);
  });
});

router.post("/getallrole", [isAuthenticated, isSuperAdmin], function(req, res) {
  var connection = {
    username: req.user.username,
    password: req.user.password,
    endpoint_url: req.user.endpoint_url,
    endpoint_port: req.user.endpoint_port
  };
  var operation = {
    operation: "list_roles"
  };
  hdb_callout.callHarperDB(connection, operation, function(err, roles) {
    if (err) {
      return res.status(400).send(err);
    }

    return res.status(200).send(roles);
  });
});

router.post("/add_user", [isAuthenticated, isSuperAdmin], function(req, res) {
  var connection = {
    username: req.user.username,
    password: req.user.password,
    endpoint_url: req.user.endpoint_url,
    endpoint_port: req.user.endpoint_port
  };
  var operation = {
    operation: "add_user",
    role: req.body.role,
    username: req.body.username,
    password: req.body.password,
    active: req.body.active
  };

  hdb_callout.callHarperDB(connection, operation, function(err, message) {
    if (err) {
      return res.status(400).send(message);
    }

    return res.status(200).send(message);
  });
});

router.post("/drop_user", [isAuthenticated, isSuperAdmin], function(req, res) {
  var connection = {
    username: req.user.username,
    password: req.user.password,
    endpoint_url: req.user.endpoint_url,
    endpoint_port: req.user.endpoint_port
  };
  var operation = {
    operation: "drop_user",
    username: req.body.username
  };

  hdb_callout.callHarperDB(connection, operation, function(err, message) {
    if (err) {
      return res.status(400).send(err);
    }

    return res.status(200).send(message);
  });
});

router.post("/drop_role", [isAuthenticated, isSuperAdmin], function(req, res) {
  var connection = {
    username: req.user.username,
    password: req.user.password,
    endpoint_url: req.user.endpoint_url,
    endpoint_port: req.user.endpoint_port
  };

  var operation = {
    operation: "drop_role",
    id: req.body.roleId
  };

  hdb_callout.callHarperDB(connection, operation, function(err, message) {
    if (err) {
      return res.status(400).send(message);
    }

    return res.status(200).send(message);
  });
});

var getListRole = (req, res) => {
  return new Promise(resolve => {
    var connection = {
      username: req.user.username,
      password: req.user.password,
      endpoint_url: req.user.endpoint_url,
      endpoint_port: req.user.endpoint_port
    };
    var operation = {
      operation: "list_roles"
    };
    hdb_callout.callHarperDB(connection, operation, function(err, roles) {
      if (err) {
        return resolve(err);
      }
      return resolve(roles);
    });
  });
};

var getSchemaAll = (req, res) => {
  return new Promise(resolve => {
    var connection = {
      username: req.user.username,
      password: req.user.password,
      endpoint_url: req.user.endpoint_url,
      endpoint_port: req.user.endpoint_port
    };
    var operation = {
      operation: "describe_all"
    };
    hdb_callout.callHarperDB(connection, operation, function(err, schemas) {
      if (err) {
        return resolve(schemas);
      }
      return resolve(schemas);
    });
  });
};

module.exports = router;
