Array.prototype.myReduce = function (callbackFn, initialValue) {
  const arr = this;
  let acc = initialValue !== undefined ? initialValue : arr[0];
  let startIndex = initialValue !== undefined ? 0 : 1;
  for (let i = startIndex; i < this.length; i++) {
    acc = callbackFn(acc, this[i], i, arr);
  }
  return acc;
};
const result = [1, 2, 3].myReduce((acc, curr) => {
  const sum = acc + curr;
  return sum;
}, 0);

console.log("Result: ", result);
