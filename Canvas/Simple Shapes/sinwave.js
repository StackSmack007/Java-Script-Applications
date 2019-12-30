import * as gui from "dat.gui";
const dat = new gui.GUI();

const canvas = document.getElementById("can1");
const c = canvas.getContext("2d");
canvas.width =  +window.innerWidth;
canvas.height = 0.9 * +window.innerHeight;
canvas.style.background = "#D4DBF5";

class HSL {
  constructor(hue, saturation, lightness) {
    this.h = hue;
    this.s = saturation;
    this.l = lightness;
  }
  toString() {
    return `hsl(${this.h},${this.s}%,${this.l}%)`;
  }
}

class Wave {
  constructor(
    x1,
    y1,
    x2,
    y2,
    width,
    lengthW,
    speed = 0.1,
    axis = true,
    color = new HSL(200, 50, 50),
    mode = 1
  ) {
    this.position = {
      x1,
      y1,
      x2,
      y2,
      len: function() {
        return Math.sqrt(
          Math.pow(this.x1 - this.x2, 2) + Math.pow(this.y1 - this.y2, 2)
        );
      }
    };
    this.width = width;
    this.lengthW = lengthW;
    this.frequencyStep = speed;
    this.baseFrequency = 0;
    this.hasAxis = axis;
    this.color = color;
    this.mode = mode;
  }

  _getNewCoordinates(alphaRad, x, y) {
    return [
      x * Math.cos(alphaRad) - y * Math.sin(alphaRad),
      x * Math.sin(alphaRad) + y * Math.cos(alphaRad)
    ];
  }

  drawSelf() {
    const { x1, y1, x2, y2 } = this.position;
    const len = this.position.len();
    const deltas = {
      dx: (x2 - x1) / len,
      dy: (y2 - y1) / len,
      alpha: function() {
        return Math.atan(this.dy / this.dx);
      }
    };
    if (this.hasAxis) {
      c.beginPath();
      c.moveTo(x1, y1);
      c.lineTo(x2, y2);
      c.stroke();
    }

    c.beginPath();
    c.moveTo(x1, y1);

    for (let lx = 1; lx <= len; lx++) {
      let [x, y] = this._getNewCoordinates(
        deltas.alpha(),
        lx,
        Math.sin(lx / this.lengthW + this.baseFrequency) *
          this.width *
          this.modeEffect(lx)
      );
      c.lineTo(x1 + x, y1 + y);
    }
    this.baseFrequency += this.frequencyStep;
    c.strokeStyle = this.color.toString();
    c.stroke();
  }

  modeEffect(i) {
    const modeChoise = Math.round(this.mode);
    const modes = [
      1,
      Math.sin(this.baseFrequency),
      Math.sin(i),
      Math.sin(Math.pow(Math.sin(i + this.baseFrequency), 2)),
      Math.pow(Math.sin(i), 2),
      Math.pow(Math.sin(i), 1),
     - (i * i + 3 * this.baseFrequency) / Math.pow(this.position.len(),2)
    ];
    return modes[modeChoise] || 1;
  }
}

const color = new HSL(0, 50, 50);
const wave1 = new Wave(
  0,
  canvas.height * 0.5,
  canvas.width * 0.9,
  canvas.height * 0.5,
  200,
  60,
  -0.01,
  false,
  color,
  0
);
const Geometry = dat.addFolder(`Geometry`);
Geometry.add(wave1.position, "x1", 0, canvas.width);
Geometry.add(wave1.position, "x2", 0, canvas.width);
Geometry.add(wave1.position, "y1", 0, canvas.height);
Geometry.add(wave1.position, "y2", 0, canvas.height);
Geometry.add(wave1, "width", 0, 200);
Geometry.add(wave1, "lengthW", 0, 200);
Geometry.add(wave1, "frequencyStep", -0.1, 0.1);
Geometry.open();

const Color = dat.addFolder(`Color-Wave`);
Color.add(color, "h", 0, 354);
Color.add(color, "s", 0, 100);
Color.add(color, "l", 0, 100);
Color.open();

const Shape = dat.addFolder(`Shape-Wave`);
Shape.add(wave1, "mode", 1, 8);
Shape.open();

let splines = [
  wave1
  //  new Wave(0, 150, 500, 150, 80, 50, 0.01, false, `hsl(0,50%,50%)`)
];

function animate() {
  c.fillStyle = "rgba(0,0,0,.01)";
  c.fillRect(0, 0, canvas.width, canvas.height);
  c.strokeStyle = `hsl(200,50%,50%)`;
  splines.forEach(x => {
    x.drawSelf();
  });
  requestAnimationFrame(animate);
}

animate();
