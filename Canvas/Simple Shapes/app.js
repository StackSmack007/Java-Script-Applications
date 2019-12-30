"use strict";
const canvas = () => document.getElementById("can1");
// canvas().style.background = "#d3d3d3";
console.log(+window.innerWidth, +window.innerHeight);
canvas().width = +window.innerWidth;
canvas().height = +window.innerHeight;
const c = canvas().getContext("2d");

const randomSign = () => (Math.random() > 0.5 ? 1 : -1);
const totalRandom = (a = 1) => a * Math.random() * randomSign();

const measureDistance = (x1, y1, x2, y2) =>
  Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));

const colors = ["#0540F2", "#3D6AF2", "#02732A", "#F2E205", "#F24130"];

let mouse = {};

canvas().addEventListener("mousemove", function(evnt) {
  mouse["x"] = evnt.x;
  mouse["y"] = evnt.y;
});

canvas().addEventListener("click", function(evnt) {
  const target = bubles.find(
    b => b.r >= measureDistance(evnt.x, evnt.y, b.position.xc, b.position.yc)
  );
  if (typeof target === "undefined") {
    return;
  }
  target.isInMotion = false;
  console.log(target.isInMotion);
});

window.addEventListener("resize", function() {
  canvas().width = +window.innerWidth;
  canvas().height = +window.innerHeight;
});

const hoverSettings = {
  maxRk: 5,
  range: 6,
  growSpeed: 4,
  shrinkSpeed: 1
};

class Buble {
  constructor(
    canvas,
    r,
    color,
    filled = false,
    velocity = 1,
    dirX = 1,
    dirY = 0
  ) {
    this.isInMotion = true;
    this.canvas = canvas;
    this.r = r;
    this.baseR = r;
    this.filled = filled;
    this.velocity = velocity;
    this.dirX = dirX;
    this.dirY = dirY;
    this.c = this.canvas.getContext("2d");
    this.color = color;
    this.deltaErase = this.velocity + 2;
    this.cornersDistance = 5;
    this.position = {
      xc: this._randomCoordinate(this.canvas.width, this.r, 5),
      yc: this._randomCoordinate(this.canvas.height, this.r, 5)
    };
  }

  setColor() {
    this.c.strokeStyle = this.color;
    this.c.fillStyle = this.color;
  }

  _randomCoordinate(max) {
    return Math.max(
      this.r + this.cornersDistance,
      Math.min(max - (this.r + this.cornersDistance), max * Math.random())
    );
  }

  drawSelf() {
    this.c.beginPath();
    this.resize();
    if (this.r === this.baseR && this.isInMotion) {
      return;
    }
    this.c.arc(this.position.xc, this.position.yc, this.r, 0, 2 * Math.PI);
    this.setColor();
    if (this.filled) {
      this.c.fill();
    } else {
      this.c.stroke();
    }
  }

  resize() {
    if (!this.isInMotion) {
      return;
    }
    const distance = measureDistance(
      mouse.x,
      mouse.y,
      this.position.xc,
      this.position.yc
    );

    if (
      distance <= hoverSettings.range * this.baseR &&
      this.r / this.baseR < hoverSettings.maxRk
    ) {
      this.r += hoverSettings.growSpeed;
    }
    if (distance > hoverSettings.range * this.baseR && this.r > this.baseR) {
      this.r -= hoverSettings.shrinkSpeed;
    }
  }

  movePosition() {
    if (!this.isInMotion) {
      return;
    }
    if (
      this.position.xc - this.r <= 0 ||
      this.position.xc + this.r >= this.canvas.width
    ) {
      this.dirX *= -1;
    }
    if (
      this.position.yc - this.r <= 0 ||
      this.position.yc + this.r >= this.canvas.height
    ) {
      this.dirY *= -1;
    }
    this.position.xc += this.velocity * this.dirX;
    this.position.yc += this.velocity * this.dirY;
  }
}

function animate(bubles) {
  if (!(bubles[0] instanceof Buble)) {
    return;
  }
  const canvas = bubles[0].canvas;
  const c = bubles[0].c;
  function engine() {
    c.clearRect(0, 0, canvas.width, canvas.height);
    bubles.forEach(x => {
      x.movePosition();
      x.drawSelf();
    });
    requestAnimationFrame(engine);
  }
  engine();
}

let bubles = [];
function generateBubles(n, size, speed, colors, filled = false) {
  for (let i = 0; i < n; i++) {
    const col = colors[i % colors.length];
    const dx = totalRandom();
    const dy = Math.sqrt(1 - dx * dx) * randomSign();
    let newOne = new Buble(canvas(), size, col, filled, speed, dx, dy);
    bubles.push(newOne);
  }
  animate(bubles);
}

(function Main() {
  generateBubles(400, 60, 6, colors, true);
})();
