export default function mergeArrays(array1, array2) {
  const replacedArray = [...array1];
  [...array2].forEach((item, index) => replacedArray[index] = item);
  return replacedArray;
};
