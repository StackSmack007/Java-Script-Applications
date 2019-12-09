//task1:
"use strict";
// (function() {
//   Array.prototype["last"] = function() {
//     return this[this.length - 1];
//   };

//   Array.prototype["skip"] = function(n) {
//     if (this.length < n) {
//       return;
//     }
//     return this.slice(n);
//   };

//   Array.prototype["take"] = function(n) {
//     if (this.length < n) {
//       return;
//     }
//     return this.slice(0, n);
//   };

//   Array.prototype["sum"] = function(n) {
//     return this.reduce((a, b) => a + Number(b), 0);
//   };

//   Array.prototype["average"] = function(n) {
//     return this.sum() / this.length;
//   };
// }());

// let arr = [1, 2, 3];
// console.log(arr.take(2));

//task2:

// function refreshWorker(w) {
//   if (w.dizziness) {
//     let { weight, experience } = w;
//     w.levelOfHydrated += weight * experience * 0.1;
//     w.dizziness = false;
//   }
//   return w;
// }

// console.log(
//   refreshWorker({
//     weight: 80,
//     experience: 1,
//     levelOfHydrated: 0,
//     dizziness: true
//   })
// );

//task3:

// function carAssembler(req) {
//   let engines = [
//     { power: 90, volume: 1800 },
//     { power: 120, volume: 2400 },
//     { power: 200, volume: 3500 }
//   ];
//   let { model, power, color, carriage, wheelsize } = req;

//   return {
//     ...{ model },
//     ...{ engine: engines.find(x => x.power >= power) },
//     ...{ carriage: { type: carriage, color } },
//     ...{
//       wheels: new Array(4).fill(wheelsize % 2 === 1 ? wheelsize : wheelsize - 1)
//     }
//   };
// }

// console.log(
//   carAssembler({
//     model: "VW Golf II",
//     power: 90,
//     color: "blue",
//     carriage: "hatchback",
//     wheelsize: 14
//   })
// );

//task 4:
// let myObj = function() {
//   return {
//     extend: function(obj) {
//       [...Object.entries(obj)].forEach(([key, value]) => {
//         if (typeof value === "function") {
//           Object.getPrototypeOf(this)[key] = value;
//         } else {
//           this[key] = value;
//         }
//       });
//     }
//   };
// };

//task 5:
(function() {
  String.prototype["ensureStart"] = function(str) {
    if (this.startsWith(str)) {
      return this.toString();
    }
    return str + this;
  };

  String.prototype["ensureEnd"] = function(str) {
    if (this.endsWith(str)) {
      return this.toString();
    }
    return this + str;
  };

  String.prototype["isEmpty"] = function() {
    return this.toString() === "";
  };

  String.prototype["truncate"] = function(n) {
    const suffix = "...";
    if (this.length <= n) {
      return this.toString();
    }
    if (n < 4) {
      return ".".repeat(n);
    }
    let target = this.substr(0, n - 3);
    if (target.endsWith(" ") || this[n - 3] === " ") {
      return target.trim() + suffix;
    }
    if (!target.includes(" ")) {
      return target + suffix;
    }
    return target.substring(0, target.lastIndexOf(" ")) + suffix;
  };

  String["format"] = function(string, ...params) {
    let result = string;
    for (let i = 0; i < params.length; i++) {
      let pattern = new RegExp(`\\{${i}\\}`, "g");
      if (result.match(pattern)) {
        result = result.replace(pattern, params[i]);
      }
    }
    return result;
  };
})();

console.log("the quick brown fox jumps over the lazy dog".truncate(12));
// let str = "my string";
// str = str.ensureStart("my");
// str = str.ensureEnd("string");
// str = str.ensureStart("hello ");
// str = str.ensureStart("hello ");
// str = str.truncate(16);
// str = str.truncate(14);
// str = str.truncate(8);
// str = str.truncate(4);
// str = str.truncate(2);

// var testString = "the quick brown fox jumps over the lazy dog";
// console.log(testString.length);
// let answer = testString.truncate(10);
// console.log(answer === "the...");
// answer = testString.truncate(43);
// console.log(answer === "the quick brown fox jumps over the lazy dog");

//6
function solve() {
  class SortedList {
    constructor() {
      this.innerArray = [];
      this.size = 0;
    }

    add = function(element) {
      this.innerArray.push(element);
      this.innerArray = this.innerArray.sort(this._comparator);
      this.size++;
    };

    remove = function(index) {
      index = this._validateIndex(index);
      this.innerArray.splice(index, 1);
      this.size--;
    };

    get = function(index) {
      index = this._validateIndex(index);
      return this.innerArray[index];
    };

    _validateIndex(index) {
      if (isNaN(index) || this.innerArray.length <= +index || +index < 0) {
        throw Error("Invalid index!");
      }
      return Number(index);
    }

    _comparator(a, b) {
      if (!isNaN(a) && !isNaN(b)) {
        return Number(a) - Number(b);
      }
      a.toString().localeCompare(b.toString());
    }
  }
  return new SortedList();
}
