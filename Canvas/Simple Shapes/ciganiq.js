"use strict";
const canvas = () => document.getElementById("can1");
// canvas().style.background = "#d3d3d3";
console.log(+window.innerWidth, +window.innerHeight);
canvas().width = +window.innerWidth;
canvas().height = +window.innerHeight;
const c = canvas().getContext("2d");

const totalRandom = (a = 1) =>
  a * Math.random() * (Math.random() > 0.5 ? 1 : -1);

//rectangles
// c.fillRect(100, 100, 100, 50);
// c.fillStyle = "rgba(255,0,0,0.5)";
// c.fillRect(300, 300, 100, 100);
// c.fillStyle = "rgba(0,0,255,0.5)";
// c.fillRect(100, 200, 100, 50);
// c.fillStyle = "rgba(0,100,255,0.3)";
// c.strokeStyle = "purple";
// c.rect(500, 100, 100, 50);
// c.fillRect(500, 100, 100, 50);
// c.stroke();
// //circle
// c.arc(370, 370, 100, 0, 2 * Math.PI, false);
// c.stroke();

// c.beginPath();
// c.moveTo(5, 900);
// c.lineTo(100, 900);
// c.lineTo(100, 850);
// c.lineTo(25, 850);
// c.stroke();
// c.beginPath();
// c.moveTo(25, 850);
// c.strokeStyle = "darkgreen";
// c.lineTo(15, 650);
// c.lineTo(5, 650);
// c.lineTo(5, 900);
// c.stroke();

async function drawCircles(canvas, n, time, minR = 10, maxR = 60) {
  const c = canvas.getContext("2d");
  const intervals = {
    x: { min: maxR, max: canvas.width - maxR },
    y: { min: maxR, max: canvas.height - maxR }
  };
  const colors = [
    "105,36,36",
    "33,65,192",
    "153,0,153",
    "0,135,153",
    "255,128,0"
  ];

  for (let i = 0; i < n; i++) {
    const xc = Math.max(intervals.x.min, intervals.x.max * Math.random());
    const yc = Math.max(intervals.y.min, intervals.y.max * Math.random());
    const r = Math.max(minR, maxR * Math.random());
    c.beginPath();

    c.strokeStyle = `rgb(${colors[Math.floor(Math.random() * colors.length)]})`;
    console.log(`Circle R=${r}; Xc=${xc}; Yc=${yc}; Color:${c.strokeStyle}`);
    await new Promise((res, rej) => {
      setTimeout(function() {
        c.arc(xc, yc, r, 0, 2 * Math.PI, false);
        c.stroke();
        res("success");
      }, time);
    });
  }
}

function freeBuble(
  canvas,
  r,
  color,
  filled = false,
  velocity = 1,
  dirX = 1,
  dirY = 0
) {
  const c = canvas.getContext("2d");
  c.strokeStyle = color;
  c.fillStyle = color;

  const randomCoordinate = (max, r, safeDist = 0) =>
    Math.max(r + safeDist, Math.min(max - (r + safeDist), max * Math.random()));

  let xc = randomCoordinate(canvas.width, r, 5);
  let yc = randomCoordinate(canvas.height, r, 5);
  const delta = velocity + 2;

  function clear() {
    const area = {
      x1: () => xc - r - delta,
      y1: () => yc - r - delta,
      x2: () => area.x1() + 2 * (r + delta),
      y2: () => area.y1() + 2 * (r + delta)
    };
    c.clearRect(area.x1(), area.y1(), area.x2(), area.y2());
    c.beginPath();
  }

  function move() {
    xc += velocity * dirX;
    yc += velocity * dirY;
    if (xc - r <= 0 || xc + r >= canvas.width) {
      dirX *= -1;
    }
    if (yc - r <= 0 || yc + r >= canvas.height) {
      dirY *= -1;
    }
    //  velocity = Math.random() * baseVel;
    // dirX = Math.random() * (Math.random() > 0.5 ? 1 : -1);
    // dirY = Math.random() * (Math.random() > 0.5 ? 1 : -1);
  }

  function play() {
    clear();
    c.arc(xc, yc, r, 0, 2 * Math.PI);
    if (filled) {
      c.fill();
    } else {
      c.stroke();
    }
    move();
    requestAnimationFrame(play);
  }
  play();
}

function generateBubles(n, size, color) {
  const goBuble = freeBuble.bind(undefined, canvas(), size, color, true);

  for (let i = 0; i < n; i++) {
    goBuble(10, totalRandom(), totalRandom());
  }
}

(function Main() {
   generateBubles(5,50,"blue");
  //drawCircles(canvas(), 100, 600, 10, 80);
 // freeBuble(canvas(), 100, "purple", true, 40, 0.3, -1);
})();
