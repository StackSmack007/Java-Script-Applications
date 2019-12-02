function getFibonator() {
  let previous = 0;
  let current = 0;
  return function() {
    let temp = previous;
    previous = current;
    current += temp;
    if (current === 0) {
      current = 1;
    }
    return current;
  };
}
let fib = getFibonator();
console.log(fib()); // 1
console.log(fib()); // 1
console.log(fib()); // 2
console.log(fib()); // 3
console.log(fib()); // 5
console.log(fib()); // 8
console.log(fib()); // 13



