reduceTypeLogs = logs => {
  var newLogsArray = [];
  if (logs != null) {
    for (var key in logs) {
      if (logs.hasOwnProperty(key)) {
        if (logs[key] != null) {
          for (let i = 0; i < logs[key].length; i++) {
            var tempObject = logs[key][i];
            tempObject["type"] = key;
            newLogsArray.push(tempObject);
          }
        }
      }
    }
  }
  return newLogsArray;
};

module.exports = reduceTypeLogs;
