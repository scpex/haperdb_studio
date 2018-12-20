let sortSchemas = require("../../utility/sortSchemas"),
  expect = require("chai").expect,
  chai = require("chai");

chai.use(require("chai-sorted"));

var schemas = {
  dev: {
    dog: {
      hash_attribute: "id",
      id: "787784c3-8212-41ec-872a-8cf2cd546ee0",
      name: "dog",
      schema: "dev",
      attributes: []
    },
    breed: {
      hash_attribute: "id",
      id: "93dfa034-845f-4975-9fea-fce27b35cdf1",
      name: "breed",
      schema: "dev",
      attributes: [
        {
          attribute: "name"
        },
        {
          attribute: "image"
        },
        {
          attribute: "id"
        },
        {
          attribute: "country"
        },
        {
          attribute: "date"
        },
        {
          attribute: "section"
        }
      ]
    }
  },
  northnwd: {
    orders: {
      hash_attribute: "orderid",
      id: "14eed73c-159c-479c-a6a1-39f19a86492d",
      name: "orders",
      schema: "northnwd",
      attributes: [
        {
          attribute: "shipname"
        },
        {
          attribute: "requireddate"
        },
        {
          attribute: "shipcity"
        },
        {
          attribute: "shipPostalcode"
        },
        {
          attribute: "shipaddress"
        },
        {
          attribute: "employeeid"
        },
        {
          attribute: "orderdate"
        },
        {
          attribute: "shipregion"
        },
        {
          attribute: "shipcountry"
        },
        {
          attribute: "orderid"
        },
        {
          attribute: "shippeddate"
        },
        {
          attribute: "shipvia"
        },
        {
          attribute: "customerid"
        },
        {
          attribute: "freight"
        },
        {
          attribute: "field15"
        }
      ]
    },
    suppliers: {
      hash_attribute: "supplierid",
      id: "2367a322-e054-4ff4-9bfd-ede43c761197",
      name: "suppliers",
      schema: "northnwd",
      attributes: [
        {
          attribute: "fax"
        },
        {
          attribute: "region"
        },
        {
          attribute: "companyname"
        },
        {
          attribute: "supplierid"
        },
        {
          attribute: "homepage"
        },
        {
          attribute: "contactname"
        },
        {
          attribute: "phone"
        },
        {
          attribute: "country"
        },
        {
          attribute: "contacttitle"
        },
        {
          attribute: "postalcode"
        },
        {
          attribute: "city"
        },
        {
          attribute: "address"
        }
      ]
    },
    shippers: {
      hash_attribute: "shipperid",
      id: "28667f45-0536-4634-b41f-73966cb5010f",
      name: "shippers",
      schema: "northnwd",
      attributes: [
        {
          attribute: "companyname"
        },
        {
          attribute: "shipperid"
        },
        {
          attribute: "phone"
        }
      ]
    },
    employees: {
      hash_attribute: "employeeid",
      id: "2b0c9a47-5631-4b08-8dc7-c2571dabc4af",
      name: "employees",
      schema: "northnwd",
      attributes: [
        {
          attribute: "address"
        },
        {
          attribute: "lastname"
        },
        {
          attribute: "reportsto"
        },
        {
          attribute: "city"
        },
        {
          attribute: "notes"
        },
        {
          attribute: "country"
        },
        {
          attribute: "postalCode"
        },
        {
          attribute: "titleofcourtesy"
        },
        {
          attribute: "extension"
        },
        {
          attribute: "firstname"
        },
        {
          attribute: "region"
        },
        {
          attribute: "homephone"
        },
        {
          attribute: "hireDate"
        },
        {
          attribute: "photopath"
        },
        {
          attribute: "employeeid"
        },
        {
          attribute: "title"
        },
        {
          attribute: "birthdate"
        }
      ]
    },
    Orderdetails: {
      hash_attribute: "id",
      id: "305b7e00-db86-45cf-be55-256334cdd82c",
      name: "Orderdetails",
      schema: "northnwd",
      attributes: [
        {
          attribute: "productid"
        },
        {
          attribute: "id"
        },
        {
          attribute: "discount"
        },
        {
          attribute: "orderid"
        },
        {
          attribute: "unitprice"
        },
        {
          attribute: "quantity"
        }
      ]
    },
    territories: {
      hash_attribute: "territoryid",
      id: "3f578764-375f-4b5c-b74c-56f45b805a25",
      name: "territories",
      schema: "northnwd",
      attributes: [
        {
          attribute: "regionid"
        },
        {
          attribute: "territoryid"
        },
        {
          attribute: "territorydescription"
        }
      ]
    },
    categories: {
      hash_attribute: "categoryid",
      id: "49923381-2589-4c90-83a2-b7e460ff7cc5",
      name: "categories",
      schema: "northnwd",
      attributes: [
        {
          attribute: "picture"
        },
        {
          attribute: "description"
        },
        {
          attribute: "categoryid"
        },
        {
          attribute: "categoryname"
        }
      ]
    },
    employee_territories: {
      hash_attribute: "id",
      id: "76286576-44a3-4889-a942-1c9aef383498",
      schema: "northnwd",
      name: "employee_territories",
      attributes: [
        {
          attribute: "id"
        },
        {
          attribute: "employeeid"
        },
        {
          attribute: "territoryid"
        }
      ]
    },
    customers: {
      hash_attribute: "id",
      id: "876420b7-7a86-4376-b7fb-e0b94a862a42",
      name: "customers",
      schema: "northnwd",
      attributes: [
        {
          attribute: "id"
        },
        {
          attribute: "phone"
        },
        {
          attribute: "city"
        },
        {
          attribute: "fax"
        },
        {
          attribute: "contactmame"
        },
        {
          attribute: "country"
        },
        {
          attribute: "address"
        },
        {
          attribute: "contacttitle"
        },
        {
          attribute: "companyname"
        },
        {
          attribute: "postalcode"
        },
        {
          attribute: "region"
        },
        {
          attribute: "customerid"
        }
      ]
    },
    products: {
      hash_attribute: "productid",
      id: "cd4b7a4b-b9f2-40e1-b520-eb2d8b1f25c9",
      name: "products",
      schema: "northnwd",
      attributes: [
        {
          attribute: "unitsnnorder"
        },
        {
          attribute: "unitprice"
        },
        {
          attribute: "productname"
        },
        {
          attribute: "unitsinstock"
        },
        {
          attribute: "productid"
        },
        {
          attribute: "quantityperunit"
        },
        {
          attribute: "discontinued"
        },
        {
          attribute: "categoryid"
        },
        {
          attribute: "reorderlevel"
        },
        {
          attribute: "supplierid"
        }
      ]
    },
    region: {
      hash_attribute: "regionid",
      id: "d0fe5d57-3fde-4d82-bb39-7c998a9b4a6c",
      name: "region",
      schema: "northnwd",
      attributes: [
        {
          attribute: "regionid"
        },
        {
          attribute: "regiondescription"
        }
      ]
    }
  },
  iot_data: {
    message: {
      hash_attribute: "timetoken",
      id: "7d840a97-cbf6-4844-9717-b3e18a7b9903",
      name: "message",
      schema: "iot_data",
      attributes: [
        {
          attribute: "sensor_uuid"
        },
        {
          attribute: "radiation_level"
        },
        {
          attribute: "timetoken"
        },
        {
          attribute: "humidity"
        },
        {
          attribute: "ambient_temperature"
        },
        {
          attribute: "photosensor"
        },
        {
          attribute: "timestamp"
        }
      ]
    }
  },
  harperdb_studio: {
    livelink: {
      hash_attribute: "id",
      id: "b6b470bd-f3a5-4d51-9f02-e13143c1453b",
      name: "livelink",
      schema: "harperdb_studio",
      attributes: [
        {
          attribute: "id"
        },
        {
          attribute: "username"
        },
        {
          attribute: "graphType"
        },
        {
          attribute: "isFavorited"
        },
        {
          attribute: "notes"
        },
        {
          attribute: "Notes"
        },
        {
          attribute: "sql"
        },
        {
          attribute: "livelinkName"
        },
        {
          attribute: "en_url"
        },
        {
          attribute: "date"
        },
        {
          attribute: "options"
        }
      ]
    }
  },
  baremetal: {
    telemetry: {
      hash_attribute: "id",
      id: "f3a7f005-f2dd-440d-8c64-d45d7d75777a",
      name: "telemetry",
      schema: "baremetal",
      attributes: [
        {
          attribute: "description"
        },
        {
          attribute: "event"
        },
        {
          attribute: "id"
        },
        {
          attribute: "time"
        }
      ]
    }
  },
  animal: {}
};

describe("sort schema object function", () => {
  it("shcema object do not change", () => {
    var schema = sortSchemas(schemas);
    expect(schema).to.deep.equal(schemas);
  });

  it("shcema should sort alphabetically", () => {
    var schema = sortSchemas(schemas);
    var schemaName = Object.keys(schema);
    expect(schemaName).to.be.sorted();
    schemaName.forEach(schemaName => {
      var tableNames = Object.keys(schema[schemaName]);
      expect(tableNames).to.be.sorted();

      tableNames.forEach(tablename => {
        expect(schema[schemaName][tablename].attributes).to.be.sortedBy(
          "attribute"
        );
      });
    });
  });
});
