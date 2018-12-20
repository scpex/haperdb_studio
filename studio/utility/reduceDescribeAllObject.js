reduceDescribeAllObject = objectAll => {
  var schemaNames = [];
  var schemaAndChilds = {};

  for (var eachSchema in objectAll) {
    // first level: save only shcemaName
    schemaNames.push(eachSchema);
    var curTable = [];
    // second level: save schema.table
    for (var eachTable in objectAll[eachSchema]) {
      curTable.push(eachTable);
      schemaNames.push(eachTable);
      var curAttr = [];
      // last level: save table.attribute
      for (var eachAttr in objectAll[eachSchema][eachTable]) {
        // schemaNames.push(eachTable);
        if (eachAttr == "attributes") {
          curAttr = objectAll[eachSchema][eachTable][eachAttr].map(
            a => a.attribute
          );
        }
      }
      schemaAndChilds[eachTable] = curAttr;
    }
    schemaAndChilds[eachSchema] = curTable;
  }

  return [schemaNames, schemaAndChilds];
};

module.exports = reduceDescribeAllObject;
