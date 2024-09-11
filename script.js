const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let timeToNextCrow = 0;
let crowIntervall = 500;
let lastTime = 0;

//creiamo un array vuoto MA che sia di variabile let perchè ci sono dei valori che possono cambiare
let crows = [];

class Crow {
  constructor() {
    this.width = 100;
    this.height = 50;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);
    this.speedX = Math.random() * 5 + 3;
    this.speedY = Math.random() * 5 - 2;
  }

  update() {
    this.x -= this.speedX;
    this.y += this.speedY;
  }
  
  draw() {
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}



function animate(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextCrow += deltaTime;
  
  if (timeToNextCrow > crowIntervall) {
    crows.push(new Crow());
    timeToNextCrow = 0;
  }
  requestAnimationFrame(animate);
}  
//timestamp inizialmente è undefined e riporta un numero solo dopo il primo ciclo, rendendo di fatto timeToNextCrow NaN e deltaTime null. Per ovviare a tale problema, lo impostiamo a 0 come argomento
animate(0);