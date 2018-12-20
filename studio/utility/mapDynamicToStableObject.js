var getFullPropertyName = function(arrayObject) {
  var resultColumns = [];
  if (!Array.isArray(arrayObject)) return [];

  arrayObject.forEach(curentObject => {
    if (typeof curentObject == "object") {
      var currentColumn = Object.keys(curentObject);
      currentColumn.forEach(propName => {
        if (resultColumns.find(x => x == propName) == undefined) {
          resultColumns.push(propName);
        }
      });
    }
  });

  return resultColumns;
};

var mapDynamicToStableObject = function(arrayObject) {
  if (!Array.isArray(arrayObject)) return arrayObject;
  else if (typeof yourVariable === "object") return arrayObject;
  var columns = getFullPropertyName(arrayObject);
  var newArrayObject = [];

  arrayObject.forEach(object => {
    var curobject = {};
    columns.forEach(col => {
      if (object[col] == undefined) curobject[col] = null;
      else curobject[col] = object[col];
    });
    newArrayObject.push(curobject);
  });

  return newArrayObject;
};

// console.log(mapDynamicToStableObject());

module.exports = mapDynamicToStableObject;
