// function classNames(...args) {
//   let result = "";
//   args.forEach((arg) => {
//     if (arg) {
//       if (typeof arg === "string") {
//         result = result + " " + arg;
//       } else if (typeof arg === "object" && !Array.isArray(arg)) {
//         for (let key in arg) {
//           if (arg[key] === true) {
//             result = result + " " + key;
//           } else if (typeof arg[key] === "string") {
//             result = result + " " + key;
//           } else if (Array.isArray(arg[key])) {
//             result += " " + classNames(arg[key]);
//           }
//         }
//       } else if (Array.isArray(arg)) {
//         for (let i = 0; i < arg.length; i++) {
//           if (arg[i]) {
//             if (typeof arg[i] === "string") {
//               result = result + " " + arg[i];
//             } else if (Array.isArray(arg[i])) {
//               result += " " + classNames(arg[i]);
//             } else if (typeof arg[i] === "object") {
//               for (let key in arg[i]) {
//                 if (arg[i][key] === true) {
//                   result = result + " " + key;
//                 } else if (typeof arg[key] === "string") {
//                   result = result + " " + key;
//                 } else if (Array.isArray(arg[key])) {
//                   result += " " + classNames(arg[key]);
//                 }
//               }
//             }
//           }
//         }
//       }
//     }
//   });
//   return result;
// }
function classNames(...args) {
  const classes = [];

  function process(value) {
    if (!value) return;

    if (typeof value === "string" || typeof value === "number") {
      classes.push(String(value));
    } else if (Array.isArray(value)) {
      value.forEach(process);
    } else if (typeof value === "object") {
      for (const key in value) {
        const val = value[key];
        if (typeof val === "boolean" && val) {
          classes.push(key);
        } else if (typeof val === "string" || typeof val === "number") {
          classes.push(key);
        } else if (typeof val === "object") {
          process(val);
        }
      }
    }
  }

  args.forEach(process);
  return classes.join(" ");
}

console.log(classNames("foo", "bar")); // 'foo bar'
console.log(classNames("foo", { bar: true })); // 'foo bar'
console.log(classNames({ "foo-bar": true })); // 'foo-bar'
console.log(classNames({ "foo-bar": false })); // ''
console.log(classNames({ foo: true }, { bar: true })); // 'foo bar'
console.log(classNames({ foo: true, bar: true })); // 'foo bar'
console.log(classNames({ foo: true, bar: false, qux: true })); // 'foo qux'
console.log(classNames("Array", ["item1", "item2"])); // 'Array item1 item2'
console.log(classNames("a", ["b", { c: true, d: false }])); // 'a b c'
