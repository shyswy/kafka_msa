/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable node/no-unsupported-features/es-builtins */
const deepmerge = require('deepmerge');

const KEY_SEPARATOR = '/';

function getKey(keys, keySeperator = KEY_SEPARATOR) {
  return keys.join(keySeperator);
}

// object에서 특정 필드 추가
function addObjectFields(obj, addFields) {
  const copyObj = { ...obj };
  Object.entries(addFields).forEach(([key, value]) => {
    copyObj[key] = value;
  });
  return copyObj;
}

// object에서 특정 필드 제거
function removeObjectFields(obj, deleteFieldKeys) {
  const isRemoved = (key) => deleteFieldKeys.find((fieldName) => fieldName === key);
  const removedObj = {};
  Object.keys(obj).forEach((key) => {
    if (!isRemoved(key)) {
      removedObj[key] = obj[key];
    }
  });
  return removedObj;
}

// object에서 특정 필드만 남기기.
function maintainObjectFields(obj, maintainFieldKeys) {
  const isMaintain = (key) => maintainFieldKeys.find((fieldName) => fieldName === key);
  const newObj = {};
  Object.keys(obj).forEach((key) => {
    if (isMaintain(key)) {
      newObj[key] = obj[key];
    }
  });
  return newObj;
}

function updateObjectFields(obj, updateFields) {
  const copyObj = { ...obj };
  const updateKeys = Object.keys(copyObj);
  const isUpdateField = (key) => updateKeys.find((fieldName) => fieldName === key);
  Object.entries(updateFields)
    .filter(([key, value]) => isUpdateField(key))
    .forEach(([key, value]) => {
      copyObj[key] = value;
    });
  return copyObj;
}

function excludeKeysFromObject(obj, keys) {
  const filteredObj = {};

  Object.keys(obj).forEach((key) => {
    if (!keys.includes(key)) {
      filteredObj[key] = obj[key];
    }
  });

  return filteredObj;
}

// object들을 key별로 array에 담아 분류.
function groupByKey(objArr, keyFieldNames, constKeyName = false) {
  if (!Array.isArray(objArr) || !Array.isArray(keyFieldNames)) {
    throw new Error('inValid Param at objectArrToObjWithKey');
  }
  return objArr.reduce((acc, item) => {
    // keyFields 배열의 각 필드 값을 결합하여 단일 키를 생성
    let keyValue = keyFieldNames.map((field) => item[field] ?? 'null').join(KEY_SEPARATOR);
    // key에 추가할 내용이 있다면, 추가
    keyValue = constKeyName ? `${keyValue}${KEY_SEPARATOR}${constKeyName}` : keyValue;

    // group별 arr에 object 추가.
    if (!acc[keyValue]) {
      acc[keyValue] = [];
    }
    acc[keyValue].push(item);
    return acc;
  }, {});
}

function deepMergeAll(objArr) {
  return deepmerge.all(objArr);
}

// objectArray를 distinct한 필드명을 key 값으로, object로 변환.
function objectArrToObjWithKey(objArr, keyFieldNames, constKeyName = false) {
  if (!Array.isArray(objArr) || !Array.isArray(keyFieldNames)) {
    throw new Error('inValid Param at objectArrToObjWithKey');
  }
  return objArr.reduce((acc, item) => {
    // keyFields 배열의 각 필드 값을 결합하여 단일 키를 생성
    let keyValue = keyFieldNames.map((field) => item[field] ?? 'null').join(KEY_SEPARATOR);
    keyValue = constKeyName ? `${keyValue}${KEY_SEPARATOR}${constKeyName}` : keyValue;
    // key가 될 값을 object에서 제거.
    acc[keyValue] = removeObjectFields(item, keyFieldNames);
    return acc;
  }, {});
}

// 모든 objectArray를 key를 기준으로 병합.
function mergeAllObjectArrByKeys(objArrs, keyFieldNames, constKeyName = false) {
  return deepMergeAll(objArrs.map((objArr) => objectArrToObjWithKey(objArr, keyFieldNames, constKeyName)));
}

// object Array들을 하나로 병합
function mergeObjects(objArrs) {
  return objArrs.reduce((acc, collaction) => {
    return { ...acc, ...collaction };
  }, {});
}

// select 결과로 받은 objectList에 대해, pk (각 row를 식별 가능한)를 통한 자료구조 생성.

// 각 key 별로 특정 value만 남긴 Map 리턴
function buildMultiPkMapWithValues(objList, pkFieldNames, pkSeperator, valueFeildNames) {
  const buildPk = (obj) => pkFieldNames.map((fieldName) => obj[fieldName]).join(pkSeperator);
  return objList.reduce((map, obj) => {
    map.set(buildPk(obj), maintainObjectFields(obj, valueFeildNames));
    return map;
  }, new Map());
}

// 각 복합키 key 별로 특정 value만 남긴 Map 리턴
function buildPkMapWithValues(objList, pkFieldName, valueFeildNames) {
  return objList.reduce((map, obj) => {
    map.set(obj[pkFieldName], maintainObjectFields(obj, valueFeildNames));
    return map;
  }, new Map());
}

// 각 key 별로 특정 value만 남긴 Map 리턴
function buildMultiPkMap(objList, pkFieldNames, pkSeperator) {
  const buildPk = (obj) => pkFieldNames.map((fieldName) => obj[fieldName]).join(pkSeperator);
  return objList.reduce((map, obj) => {
    map.set(buildPk(obj), obj);
    return map;
  }, new Map());
}

// 각 복합키 key 별로 특정 value만 남긴 Map 리턴
function buildPkMap(objList, pkFieldName) {
  return objList.reduce((map, obj) => {
    map.set(obj[pkFieldName], obj);
    return map;
  }, new Map());
}

// 각 key가 존재하는지만 확인하는 set
function buildPkSet(objList, pkFieldName) {
  return new Set(objList.map((obj) => obj[pkFieldName]));
}

// 각 key가 존재하는지만 확인하는 set
function buildMultiPkSet(objList, pkFieldNames, pkSeperator) {
  const buildPk = (obj) => pkFieldNames.map((fieldName) => obj[fieldName]).join(pkSeperator);
  return new Set(objList.map((obj) => buildPk(obj)));
}

// pk를 식별자로하는 두 prevs, posts에서, 공통인 object의 pk만 set으로 리턴.
function buildCommonPkSet(prevs, posts, pkName) {
  const prevMap = new Map(prevs.map((prev) => [prev[pkName], prev]));
  return posts.reduce((accSet, post) => {
    if (prevMap.has(post[pkName])) {
      accSet.add(post[pkName]);
    }
    return accSet;
  }, new Set());
}

function buildCombinedKey(obj, pkNames, keySeperator = KEY_SEPARATOR) {
  return getKey(
    pkNames.map((pk) => obj[pk]),
    keySeperator,
  );
}

//  다수의 pkName을 복합키 식별자로하는 두 prevs, posts에서, 공통인 object의 pk만 set으로 리턴.
function buildCommonPkSetWithPks(prevs, posts, pkNames, keySeperator = KEY_SEPARATOR) {
  console.log(prevs, 'prevs');

  console.log(posts, 'posts');
  const prevMap = new Map(prevs.map((prev) => [buildCombinedKey(prev, pkNames, keySeperator), prev]));
  return posts.reduce((commonSet, post) => {
    const postCombinedKey = buildCombinedKey(post, pkNames, keySeperator);
    if (prevMap.has(postCombinedKey)) {
      commonSet.add(postCombinedKey);
    }
    return commonSet;
  }, new Set());
}

function categorizeObject(prevs, posts, pkName) {
  const categorized = {
    prevOnlyData: [], // 기존에만 존재하고 신규에 없는 데이터
    postOnlyData: [], // 기존에 없던 신규 데이터
    commonData: [], // 기존과 신규 모두에 존재하는 데이터
  };

  // prev의 pk를 키로 하는 맵으로 변환
  const prevMap = new Map(prevs.map((prev) => [prev[pkName], prev]));

  // post 순회하며 common, post only 데이터 식별
  posts.forEach((post) => {
    if (prevMap.has(post[pkName])) {
      // 기존에 존재하는 데이터
      categorized.commonData.push(post);
    } else {
      // 신규 데이터
      categorized.postOnlyData.push(post);
    }
  });

  const commonMap = new Map(categorized.commonData.map((common) => [common[pkName], common]));

  // prev 순회하며 prev only 데이터 식별.
  prevs.forEach((prev) => {
    if (!commonMap.has(prev[pkName])) {
      categorized.prevOnlyData.push(prev);
    }
  });

  return categorized;
}

function extractDistinct(consumedMessages, keyName) {
  const distinctSet = new Set(consumedMessages.map((msg) => msg[keyName]));
  return Array.from(distinctSet);
}

// object array에서 value가 존재하는 필드만 남김.  {} 도 필터?
function filterExist(objects) {
  return Object.fromEntries(Object.entries(objects).filter(([key, value]) => value));
}

function isJsonParse(jsonString) {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    return false;
  }
}

module.exports = {
  objectArrToObjWithKey,
  groupByKey,
  deepMergeAll,
  mergeAllObjectArrByKeys,
  addObjectFields,
  removeObjectFields,
  updateObjectFields,
  excludeKeysFromObject,
  mergeObjects,
  buildMultiPkMap,
  buildPkMap,
  buildPkSet,
  buildMultiPkSet,
  maintainObjectFields,
  getKey,
  categorizeObject,
  buildCombinedKey,
  buildCommonPkSet,
  buildCommonPkSetWithPks,
  extractDistinct,
  filterExist,
  isJsonParse,
  KEY_SEPARATOR,
};
