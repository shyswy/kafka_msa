function isEmpty(value) {
  if (value === null || value === undefined) {
    return true; // null 또는 undefined는 비어있는 것으로 간주
  }

  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      // 배열인 경우
      return value.length === 0;
    }
    // 객체인 경우
    return Object.keys(value).length === 0;
  }

  // 객체나 배열이 아닌 경우
  return false;
}

function getKeyAndValueArray(objectArray) {
  const firstRow = objectArray[0];
  return {
    keyNames: Object.keys(firstRow),
    values: objectArray.map((row) => {
      return Object.values(row);
    }),
  };
}

function convertStringToJson(str) {
  try {
    const json = JSON.parse(str);
    if (typeof json !== 'object') throw new Error('JSON prase Result is Not Object');
    return json;
  } catch (err) {
    throw new Error(err, '[JSON Parse Error]');
  }
}

function isJsonString(str) {
  try {
    return typeof JSON.parse(str) === 'object';
  } catch (e) {
    return false;
  }
}

module.exports = {
  isEmpty,
  getKeyAndValueArray,
  convertStringToJson,
  isJsonString,
};
