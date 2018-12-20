sortSchemas = schemaObject => {
  let newSchemaObject = {};
  let schemaNames = Object.keys(schemaObject);
  schemaNames.sort();

  //schema level
  schemaNames.sort().forEach(eachSchema => {
    // table level
    newSchemaObject[eachSchema] = {};
    let tableNames = Object.keys(schemaObject[eachSchema]);
    // attribute level
    tableNames = tableNames.sort();
    tableNames.forEach(eachTable => {
      newSchemaObject[eachSchema][eachTable] =
        schemaObject[eachSchema][eachTable];
      if (schemaObject[eachSchema][eachTable].attributes != undefined)
        schemaObject[eachSchema][eachTable].attributes.sort(compare);
      newSchemaObject[eachSchema][eachTable].attributes =
        schemaObject[eachSchema][eachTable].attributes;
    });
  });

  return newSchemaObject;
};

let compare = function(a, b) {
  if (a.attribute < b.attribute) return -1;
  if (a.attribute > b.attribute) return 1;
  return 0;
};

module.exports = sortSchemas;
