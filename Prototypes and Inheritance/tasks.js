"use strict";
//task 1
function solve1() {
  class Balloon {
    constructor(color, gasWeight) {
      this.color = color;
      this.gasWeight = gasWeight;
    }
  }

  class PartyBalloon extends Balloon {
    constructor(color, gasWeight, ribbonColor, ribbonLength) {
      super(color, gasWeight);
      this._ribbon = { color: ribbonColor, length: ribbonLength };
    }

    get ribbon() {
      return this._ribbon;
    }
  }

  class BirthdayBalloon extends PartyBalloon {
    constructor(color, gasWeight, ribbonColor, ribbonLength, text) {
      super(color, gasWeight, ribbonColor, ribbonLength);
      this._text = text;
    }

    get text() {
      return this._text;
    }
  }

  return { Balloon, PartyBalloon, BirthdayBalloon };
}
// let classes = solve1();
// let test = new classes.BirthdayBalloon("Tumno-bqlo", 20.5, "Svetlo-cherno", 10.25, "Happy Birthday!!!");
// let ribbon = test.ribbon;
// console.log(ribbon.length === 10.25);

//task 2
function solve2() {
  class Employee {
    constructor(name, age) {
      if (new.target === Employee) {
        throw new Error("Can not instatiate abstract class!");
      }
      this.name = name;
      this.age = age;
      this.salary = 0;
      this.tasks = [];
    }

    getSalary() {
      return this.salary;
    }

    work() {
      let currentTask = this.tasks.shift();
      this.tasks.push(currentTask);
      console.log(currentTask);
    }

    collectSalary() {
      console.log(`${this.name} received ${this.getSalary()} this month.`);
    }
  }

  class Junior extends Employee {
    constructor(name, age) {
      super(name, age);
      this.tasks = [`${this.name} is working on a simple task.`];
    }
  }

  class Senior extends Employee {
    constructor(name, age) {
      super(name, age);
      this.tasks = [
        `${this.name} is working on a complicated task.`,
        `${this.name} is taking time off work.`,
        `${this.name} is supervising junior workers.`
      ];
    }
  }

  class Manager extends Employee {
    constructor(name, age) {
      super(name, age);
      this.dividend = 0;
      this.tasks = [
        `${this.name} scheduled a meeting.`,
        `${this.name} is preparing a quarterly report.`
      ];
    }
    getSalary() {
      return super.getSalary() + this.dividend;
    }
  }

  return { Employee, Junior, Senior, Manager };
}
let result = solve2();

var guy1 = new result.Junior("pesho", 20);
var guy2 = new result.Senior("gosho", 21);
var guy3 = new result.Manager("ivan", 22);

//task 3:
function solve3() {
  class Post {
    constructor(title, content) {
      this.title = title;
      this.content = content;
    }
    toString() {
      return `Post: ${this.title}\nContent: ${this.content}`;
    }
  }

  class SocialMediaPost extends Post {
    constructor(title, content, likes, dislikes) {
      super(title, content);
      this.likes = likes;
      this.dislikes = dislikes;
      this.comments = [];
    }

    addComment(comment) {
      this.comments.push(comment);
    }

    toString() {
      let comments =
        this.comments.length === 0
          ? ""
          : `\nComments:\n${this.comments.map(x => ` * ${x}`).join("\n")}`;
      return `${super.toString()}\nRating: ${this.likes -
        this.dislikes}${comments}`;
    }
  }

  class BlogPost extends Post {
    constructor(title, content, views) {
      super(title, content);
      this.views = views;
    }

    view() {
      this.views++;
      return this;
    }

    toString() {
      return `${super.toString()}\nViews: ${this.views}`;
    }
  }

  return { Post, SocialMediaPost, BlogPost };
}

//task 4
function solve4() {
  class Melon {
    element = "";
    constructor(weight, melonSort) {
      if (new.target === Melon) {
        throw new Error("Abstract class cannot be instantiated directly");
      }
      this.weight = weight;
      this.melonSort = melonSort;
    }
    get elementIndex() {
      return this.weight * this.melonSort.length;
    }

    toString() {
      return `Element: ${this.element}\nSort: ${this.melonSort}\nElement Index: ${this.elementIndex}`;
    }
  }

  class Watermelon extends Melon {
    constructor(...params) {
      super(...params);
      this.element = "Water";
    }
  }

  class Firemelon extends Melon {
    constructor(...params) {
      super(...params);
      this.element = "Fire";
    }
  }

  class Earthmelon extends Melon {
    constructor(...params) {
      super(...params);
      this.element = "Earth";
    }
  }

  class Airmelon extends Melon {
    constructor(...params) {
      super(...params);
      this.element = "Air";
    }
  }

  class Melolemonmelon extends Watermelon {
    constructor(...params) {
      super(...params);
      this._elements = ["Fire", "Earth", "Air", "Water"];
    }
    morph() {
      this.element = this._elements.shift();
      this._elements.push(this.element);
      return this;
    }
  }
  return { Melon, Melolemonmelon, Watermelon, Firemelon, Earthmelon, Airmelon };
}
let classes = solve4();
let watermelon = new classes.Melolemonmelon(12.5, "Kingsize");
watermelon.morph();
watermelon.morph();
console.log(watermelon.toString());

//task 5:
//Task 6: Functional Salution
function solve6() {
  function Keyboard(manufacturer, responseTime) {
    this.manufacturer = manufacturer;
    this.responseTime = responseTime;
    return this;
  }

  function Monitor(manufacturer, width, height) {
    this.manufacturer = manufacturer;
    this.width = width;
    this.height = height;
    return this;
  }

  function Battery(manufacturer, expectedLife) {
    this.manufacturer = manufacturer;
    this.expectedLife = expectedLife;
    return this;
  }

  function Computer(manufacturer, processorSpeed, ram, hardDiskSpace) {
    if (new.target === Computer) {
      throw new TypeError("Abstract class can not be instanciated!");
    }
    this.manufacturer = manufacturer;
    this.processorSpeed = processorSpeed;
    this.ram = ram;
    this.hardDiskSpace = hardDiskSpace;
    return this;
  }

  function Laptop(
    manufacturer,
    processorSpeed,
    ram,
    hardDiskSpace,
    weight,
    color,
    battery
  ) {
    Computer.call(this,manufacturer, processorSpeed, ram, hardDiskSpace);
    this.weight = weight;
    this.color = color;

    Object.defineProperty(this, "battery", {
      get: function() {
        return this._battery;
      },
      set: function(value) {
        if (value instanceof Battery) {
          this._battery = value;
          return;
        }
        throw new TypeError("Invalid argument");
      }
    });
    this.battery = battery;
  }

  Object.setPrototypeOf(Laptop, Computer);

  function Desktop(
    manufacturer,
    processorSpeed,
    ram,
    hardDiskSpace,
    keyboard,
    monitor
  ) {
    Computer.call(this,manufacturer, processorSpeed, ram, hardDiskSpace);

    Object.defineProperty(this, "keyboard", {
      get: function() {
        return this._keyboard;
      },
      set: function(value) {
        if (value instanceof Keyboard) {
          this._keyboard = value;
          return;
        }
        throw new TypeError("Invalid argument");
      }
    });
    this.keyboard = keyboard;

    Object.defineProperty(this, "monitor", {
      get: function() {
        return this._monitor;
      },
      set: function(value) {
        if (value instanceof Monitor) {
          this._monitor = value;
          return;
        }
        throw new TypeError("Invalid argument");
      }
    });
    this.monitor = monitor;
  }
  Object.setPrototypeOf(Desktop, Computer);

  return { Battery, Keyboard, Monitor, Computer, Laptop, Desktop };
}
//Task 6: Class Salution
function solve6() {
  class Keyboard {
    constructor(manufacturer, responseTime) {
      this.manufacturer = manufacturer;
      this.responseTime = responseTime;
    }
  }

  class Monitor {
    constructor(manufacturer, width, height) {
      this.manufacturer = manufacturer;
      this.width = width;
      this.height = height;
    }
  }

  class Battery {
    constructor(manufacturer, expectedLife) {
      this.manufacturer = manufacturer;
      this.expectedLife = expectedLife;
    }
  }

  class Computer {
    constructor(manufacturer, processorSpeed, ram, hardDiskSpace) {
      if (new.target === Computer) {
        throw new TypeError("Abstract class can not be instanciated!");
      }
      this.manufacturer = manufacturer;
      this.processorSpeed = processorSpeed;
      this.ram = ram;
      this.hardDiskSpace = hardDiskSpace;
    }
  }

  class Laptop extends Computer {
    _battery;
    constructor(
      manufacturer,
      processorSpeed,
      ram,
      hardDiskSpace,
      weight,
      color,
      battery
    ) {
      super(manufacturer, processorSpeed, ram, hardDiskSpace);
      this.weight = weight;
      this.color = color;
      this.battery = battery;
    }
    get battery() {
      return this._battery;
    }
    set battery(value) {
      if (value instanceof Battery) {
        this._battery = value;
        return;
      }
      throw new TypeError("Invalid argument");
    }
  }

  class Desktop extends Computer {
    _monitor;
    _keyboard;
    constructor(
      manufacturer,
      processorSpeed,
      ram,
      hardDiskSpace,
      keyboard,
      monitor
    ) {
      super(manufacturer, processorSpeed, ram, hardDiskSpace);
      this.keyboard = keyboard;
      this.monitor = monitor;
    }
    get keyboard() {
      return this._keyboard;
    }
    set keyboard(value) {
      if (value instanceof Keyboard) {
        this._keyboard = value;
        return;
      }
      throw new TypeError("Invalid argument");
    }
    get monitor() {
      return this._monitor;
    }
    set monitor(value) {
      if (value instanceof Monitor) {
        this._monitor = value;
        return;
      }
      throw new TypeError("Invalid argument");
    }
  }

  return { Battery, Keyboard, Monitor, Computer, Laptop, Desktop };
}
// classes = solve6();
// let Computer = classes.Computer;
// let Laptop = classes.Laptop;
// let Desktop = classes.Desktop;
// let Monitor = classes.Monitor;
// let Battery = classes.Battery;
// let Keyboard = classes.Keyboard;

// let battery = new Battery("Energy", 3);
// let laptop = new Laptop(
//   "Hewlett Packard",
//   2.4,
//   4,
//   0.5,
//   3.12,
//   "Silver",
//   battery
// );

//task 7

function solve7() {
  function computerQualityMixin(classToExtend) {
    classToExtend.prototype["getQuality"] = function() {
      return (this.processorSpeed + this.ram + this.hardDiskSpace) / 3;
    };
    classToExtend.prototype["isFast"] = function() {
      return this.processorSpeed > this.ram / 4;
    };
    classToExtend.prototype["isRoomy"] = function() {
      return this.hardDiskSpace > Math.floor(this.ram * this.processorSpeed);
    };
  }

  function styleMixin(classToExtend) {
    classToExtend.prototype["isFullSet"] = function() {
      return (
        this.manufacturer === this.monitor.manufacturer &&
        this.manufacturer === this.keyboard.manufacturer &&
        this.manufacturer === this.monitor.manufacturer
      );
    };
    classToExtend.prototype["isFast"] = function() {
      return this.processorSpeed > this.ram / 4;
    };
    classToExtend.prototype["isClassy"] = function() {
      return (
        this.battery.expectedLife >= 3 &&
        ["Silver", "Black"].includes(this.color) &&
        this.weight < 3
      );
    };
  }
  return { computerQualityMixin, styleMixin };
}
