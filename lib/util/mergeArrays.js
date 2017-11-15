"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mergeArrays;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function mergeArrays(array1, array2) {
  var replacedArray = [].concat(_toConsumableArray(array1));
  [].concat(_toConsumableArray(array2)).forEach(function (item, index) {
    return replacedArray[index] = item;
  });
  return replacedArray;
};