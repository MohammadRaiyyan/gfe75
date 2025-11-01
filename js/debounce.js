function debounce(callbackFn = () => {}, delay = 500) {
  let timerId;
  return function (...args) {
    if (timerId) {
      clearInterval(timerId);
    }
    timerId = setTimeout(() => {
      callbackFn.apply(this, args);
    }, delay);
  };
}
let count = 0;
const printCount = debounce((args) => {
  console.log("Called from debounce function " + args);
});

printCount(++count);
printCount(++count);
printCount(++count);
printCount(++count); // this will only get executed which will output 4
