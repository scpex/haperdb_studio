const express = require("express"),
  router = express.Router(),
  hdb_callout = require("../utility/harperDBCallout"),
  isAuthenticated = require("../utility/checkAuthenticate").isAuthenticated,
  breadcrumb = require("../utility/breadcrumb"),
  sortSchemas = require("../utility/sortSchemas");

router.get("/", [isAuthenticated, breadcrumb], function(req, res) {
  req.session.preUrl = "/schema";
  var operation = {
    operation: "describe_all"
  };
  var call_object = {
    username: req.user.username,
    password: req.user.password,
    endpoint_url: req.user.endpoint_url,
    endpoint_port: req.user.endpoint_port
  };

  hdb_callout.callHarperDB(call_object, operation, function(err, allSchema) {
    return res.render("schema", {
      schemas: sortSchemas(allSchema),
      user: req.user
    });
  });
});

router.post("/", isAuthenticated, function(req, res) {
  var operation = {
    operation: "describe_all"
  };
  if (req.body.addType == "schema") {
    var operationAdd = {
      operation: "create_schema",
      schema: req.body.schemaName
    };
  } else {
    var operationAdd = {
      operation: "create_table",
      schema: req.body.schemaName,
      table: req.body.tableName,
      hash_attribute: req.body.hashAttribute
    };
  }

  var call_object = {
    username: req.user.username,
    password: req.user.password,
    endpoint_url: req.user.endpoint_url,
    endpoint_port: req.user.endpoint_port
  };

  hdb_callout.callHarperDB(call_object, operationAdd, function(err, success) {
    hdb_callout.callHarperDB(call_object, operation, function(
      error,
      allSchema
    ) {
      return res.render("schema", {
        message: JSON.stringify(success),
        schemas: allSchema,
        user: req.user
      });
    });
  });
});

router.get("/:schemaName", isAuthenticated, function(req, res) {
  var call_object = {
    username: req.user.username,
    password: req.user.password,
    endpoint_url: req.user.endpoint_url,
    endpoint_port: req.user.endpoint_port
  };

  var operation = {
    operation: "describe_schema",
    schema: req.params.schemaName
  };

  hdb_callout.callHarperDB(call_object, operation, function(error, schema) {
    res.render("schema_name", {
      schemaName: req.params.schemaName,
      schema: schema,
      user: req.user
    });
  });
});

router.post("/addtable/:schemaName", isAuthenticated, function(req, res) {
  var operationAdd = {
    operation: "create_table",
    schema: req.params.schemaName,
    table: req.body.tableName,
    hash_attribute: req.body.hashAttribute
  };

  var call_object = {
    username: req.user.username,
    password: req.user.password,
    endpoint_url: req.user.endpoint_url,
    endpoint_port: req.user.endpoint_port
  };

  var operation = {
    operation: "describe_schema",
    schema: req.params.schemaName
  };

  hdb_callout.callHarperDB(call_object, operationAdd, function(err, success) {
    hdb_callout.callHarperDB(call_object, operation, function(error, schema) {
      res.render("schema_name", {
        schemaName: req.params.schemaName,
        schema: schema,
        message: JSON.stringify(success),
        user: req.user
      });
    });
  });
});

router.post("/upload_csv/:schemaName", isAuthenticated, function(req, res) {
  var call_object = {
    username: req.user.username,
    password: req.user.password,
    endpoint_url: req.user.endpoint_url,
    endpoint_port: req.user.endpoint_port
  };

  var operation = {
    operation: "describe_schema",
    schema: req.body.schemaName
  };
  var operationCSV = {};

  if (req.body.csvType == "file") {
    operationCSV = {
      operation: "csv_file_load",
      schema: req.body.schemaName,
      table: req.body.tableName,
      file_path: req.body.csvPath
    };
  } else if (req.body.csvType == "url") {
    operationCSV = {
      operation: "csv_url_load",
      schema: req.body.schemaName,
      table: req.body.tableName,
      csv_url: req.body.csvUrl
    };
  } else {
    operationCSV = {
      operation: "csv_data_load",
      schema: req.body.schemaName,
      table: req.body.tableName,
      data: req.body.csvData
    };
  }

  hdb_callout.callHarperDB(call_object, operationCSV, function(err, success) {
    hdb_callout.callHarperDB(call_object, operation, function(error, schema) {
      res.render("schema_name", {
        schemaName: req.params.schemaName,
        schema: schema,
        message: JSON.stringify(success),
        user: req.user
      });
    });
  });
});

router.post("/delete", isAuthenticated, function(req, res) {
  var call_object = {
    username: req.user.username,
    password: req.user.password,
    endpoint_url: req.user.endpoint_url,
    endpoint_port: req.user.endpoint_port
  };

  var operation = {
    operation: "describe_schema",
    schema: req.body.schemaName
  };
  var operationdelete = {};

  if (req.body.deleteType == "schema") {
    operationdelete = {
      operation: "drop_schema",
      schema: req.body.schemaName
    };
  } else
    operationdelete = {
      operation: "drop_table",
      schema: req.body.schemaName,
      table: req.body.tableName
    };

  hdb_callout.callHarperDB(call_object, operationdelete, function(
    error,
    schema
  ) {
    if (req.body.deleteType == "schema") res.redirect("/schema");
    else res.redirect("/schema/" + req.body.schemaName);
  });
});

router.post("/records", isAuthenticated, function(req, res) {
  var call_object = {
    username: req.user.username,
    password: req.user.password,
    endpoint_url: req.user.endpoint_url,
    endpoint_port: req.user.endpoint_port
  };
  var tableName = req.body.schemaName + "." + req.body.tableName;
  // var dotIndex = tableName.indexOf('.');
  // var sql = tableName.substr(0, dotIndex + 1) + "\"" + tableName.substr(dotIndex + 1) + "\"";

  var operation = {
    operation: "sql",
    sql: "SELECT COUNT(*) AS num FROM " + tableName
  };

  hdb_callout.callHarperDB(call_object, operation, function(err, message) {
    if (err) {
      return res.status(400).send(err);
    }

    return res.status(200).send(message);
  });
});

router.post("/csv", isAuthenticated, function(req, res) {
  var operation = {
    operation: "describe_all"
  };
  var operationCSV = {
    schema: req.body.schemaName,
    table: req.body.selectTableName
  };
  if (req.body.csvType == "file") {
    operationCSV.operation = "csv_file_load";
    operationCSV.file_path = req.body.csvPath;
  } else if (req.body.csvType == "url") {
    operationCSV.operation = "csv_url_load";
    operationCSV.csv_url = req.body.csvUrl;
  } else {
    operationCSV.operation = "csv_data_load";
    operationCSV.data = req.body.csvData;
  }

  console.log(operationCSV);
  var call_object = {
    username: req.user.username,
    password: req.user.password,
    endpoint_url: req.user.endpoint_url,
    endpoint_port: req.user.endpoint_port
  };

  hdb_callout.callHarperDB(call_object, operationCSV, function(err, success) {
    hdb_callout.callHarperDB(call_object, operation, function(
      error,
      allSchema
    ) {
      return res.render("schema", {
        message: JSON.stringify(success),
        schemas: allSchema,
        user: req.user
      });
    });
  });
});

module.exports = router;
