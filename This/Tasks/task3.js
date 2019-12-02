class Hex {
  constructor(value) {
    this.value = value;
  }

  valueOf() {
    return this.value;
  }

  toString() {
    return "0x" + this.value.toString(16).toUpperCase();
  }

  toString() {
    return "0x" + this.value.toString(16).toUpperCase();
  }

  parse(str) {
    return parseInt(str, 16);
  }

  plus(other) {
    return new Hex(this.valueOf() + other.valueOf());
  }

  minus(other) {
    return new Hex(this.valueOf() - other.valueOf());
  }
}

let FF = new Hex(255);
console.log(FF.toString());
console.log(Hex.parse("0xFF"));
