var object1 = {
  dev: {
    dog: {
      hash_attribute: "id",
      id: "71f3a8fa-227c-4955-a428-08db1bfd8a89",
      name: "dog",
      residence: ["node_s", "node_1", "node_2"],
      schema: "dev",
      attributes: [
        {
          attribute: "name"
        },
        {
          attribute: "id"
        },
        {
          attribute: "age"
        },
        {
          attribute: "breed"
        }
      ]
    },
    cat: {
      hash_attribute: "cat_id",
      id: "71f3a8fa-227c-4955-a428-08db1bfd8a89",
      name: "cat",
      residence: ["node_s", "node_1", "node_2"],
      schema: "dev",
      attributes: [
        {
          attribute: "gender"
        },
        {
          attribute: "color"
        },
        {
          attribute: "cat_id"
        }
      ]
    }
  },
  test: {
    customer: {
      hash_attribute: "cus_id",
      id: "71f3a8fa-227c-4955-a428-08db1bfd8a89",
      name: "customer",
      residence: ["node_s", "node_1", "node_2"],
      schema: "test",
      attributes: [
        {
          attribute: "cus_id"
        },
        {
          attribute: "first_name"
        },
        {
          attribute: "last_name"
        }
      ]
    }
  },
  notable: {},
  noatt: {
    table1: {
      hash_attribute: "productid",
      id: "a139d2e3-a5d1-4028-b5be-920525b5ff6d"
    },
    table2: {
      hash_attribute: "productid",
      id: "a139d2e3-a5d1-4028-b5be-920525b5ff6d"
    }
  }
};

var obj2 = {};

var mapDescribeAllToAddRole = desAllObject => {
  mapRoleArray = {};
  if (typeof desAllObject == "object") {
    var schemaNames = Object.keys(desAllObject);
    if (schemaNames.length > 0) {
      schemaNames.forEach(eachSchema => {
        var curSchema = {};
        if (desAllObject[eachSchema] != undefined) {
          var tableNames = Object.keys(desAllObject[eachSchema]);
          if (tableNames.length > 0) {
            tableNames.forEach(eachTable => {
              var curTable = {};
              if (
                desAllObject[eachSchema][eachTable]["attributes"] != undefined
              ) {
                // var attributes = Object.values(desAllObject[eachSchema][eachTable]['attributes'])
                var attributes = Object.keys(
                  desAllObject[eachSchema][eachTable]["attributes"]
                ).map(function(key) {
                  return desAllObject[eachSchema][eachTable]["attributes"][key];
                });
                attributes = attributes.map(a => a.attribute);
                curTable = attributes;
              }
              curSchema[eachTable] = curTable;
            });
          }
        }
        mapRoleArray[eachSchema] = curSchema;
      });
    }
  }
  // console.log(JSON.stringify(mapRoleArray));

  return mapRoleArray;
};

// mapDescribeAllToAddRole(object1);

var e = [
  {
    dev: [
      {
        dog: ["name", "id", "age", "breed"]
      },
      {
        cat: ["gender", "color", "cat_id"]
      }
    ]
  },
  {
    test: [
      {
        customer: ["cus_id", "first_name", "last_name"]
      }
    ]
  }
];

module.exports = mapDescribeAllToAddRole;
