function throttle(callbackFn, delay) {
  let lastExecuted = 0;
  return function (...args) {
    let now = Date.now();
    if (lastExecuted === 0 || now - lastExecuted >= delay) {
      lastExecuted = now;
      callbackFn.apply(this, args);
    }
  };
}

let count = 0;
function log() {
  console.log("Executed:", ++count, "at", new Date().toLocaleTimeString());
}

const throttledLog = throttle(log, 1000);

// Simulate rapid firing (every 100ms)
let interval = setInterval(throttledLog, 100);

// Stop after 5 seconds
setTimeout(() => {
  clearInterval(interval);
  console.log("Stopped after 5s");
}, 5000);
