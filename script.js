const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.font = '40px Helvetica';

let score = 0;
let timeToNextCrow = 0;
let crowIntervall = 500;
let lastTime = 0;

//creiamo un array vuoto MA che sia di variabile let perchè ci sono dei valori che possono cambiare
let crows = [];

class Crow {
  constructor() {
    this.spriteWidth = 271;
    this.spriteHeight = 194;
    this.sizeModifier = Math.random() * 0.6 + 0.4;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);
    this.speedX = Math.random() * 5 + 3;
    this.speedY = Math.random() * 5 - 2;
    this.markedForDeletion = false;
    this.image = new Image();
    this.image.src = 'raven.png';
    this.frame = 0;
    this.maxFrame = 4;
    this.timeWing = 0;
    this.intervalTimeWing = Math.random() * 50 + 50;
  }

  update(deltaTime) {
    //decrementiamo la x per farla muovere verso sinistra
    this.x -= this.speedX;
    //incrementiamo la y per far oscillare gli oggetti
    this.y += this.speedY;
    //se gli oggetti finiscono nei punti estremi di canvas.y li facciamo rimbalzare
    if (this.y > canvas.height - this.height || this.y < 0) {
      this.speedY = -this.speedY;
    }
    //se la x  diventa minore di 0 - width  (cioè se esce fuori dal canvas)
    if (this.x < 0 - this.width) {
      //la segnamo per cancellazione
      this.markedForDeletion = true;
    }
    //aumentiamo il tempo delle ali
    this.timeWing += deltaTime;
    //se il tempo delle ali  supera l'intervallo di tempo delle ali
    if (this.timeWing > this.intervalTimeWing) {
      //se il frame  supera il numero massimo di frame
      if (this.frame > this.maxFrame) {
        //riportiamo il frame a 0
        this.frame = 0;
      }
      //altrimenti incrementiamo il frame
      else {
        this.frame++;
      }
      //azzzeriamo il tempo delle ali
      this.timeWing = 0;
    }
  }
  
  draw() {
    ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
  }
}

function drawScore() {
  ctx.fillStyle = 'black';
  ctx.fillText('Score: ' + score, 40, 40);
  ctx.fillStyle = 'white';
  ctx.fillText('Score: ' + score, 43, 43);
}

window.addEventListener('click', function(e) {
  const detectPixelColor = ctx.getImageData(e.x, e.y, 1, 1);
  console.log(detectPixelColor);
  
})

function animate(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextCrow += deltaTime;
  
  if (timeToNextCrow > crowIntervall) {
    crows.push(new Crow());
    timeToNextCrow = 0;
  }
  drawScore();
  //array literal
  [...crows].forEach(obj => {
    obj.update( deltaTime);
    obj.draw();
  })
  crows = crows.filter(obj => !obj.markedForDeletion);
  requestAnimationFrame(animate);
}  
//timestamp inizialmente è undefined e riporta un numero solo dopo il primo ciclo, rendendo di fatto timeToNextCrow NaN e deltaTime null. Per ovviare a tale problema, lo impostiamo a 0 come argomento
animate(0);