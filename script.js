const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const canvasCollision = document.getElementById('canvasCollision');
const ctxCollision = canvasCollision.getContext('2d');
canvasCollision.width = window.innerWidth;
canvasCollision.height = window.innerHeight;
ctx.font = '40px Helvetica';
let gameOver = false;
let score = 0;
let timeToNextCrow = 0;
let crowIntervall = 500;
let lastTime = 0;

//creiamo un array vuoto MA che sia di variabile let perchè ci sono dei valori che possono cambiare
let crows = [];
const arrival =[];
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
    this.randomColor = [Math.floor(Math.random() * 255), Math.floor(Math.random() * 255), Math.floor(Math.random() * 255)];
    this.color = 'rgb(' + this.randomColor[0] + ',' + this.randomColor[1] + ',' + this.randomColor[2] + ')';
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
    //condizione dei corvi per il game over
    if(this.x < 0 - this.width) {
      arrival.push(this);
      if(arrival.length === 3) {
        gameOver = true;
      }
    }
  }
  
  draw() {
    ctxCollision.fillStyle = this.color; 
    ctxCollision.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(this.image, this.frame * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
  }
}

let explosions = [];
class Explosion {
  constructor(x, y, size) {
    this.image = new Image();
    this.image.src = 'boom.png';
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.size = size;
    this.x = x;
    this.y = y;
    this.frame = 0;
    this.sound = new Audio();
    this.sound.src = 'boom.wav';
    this.timeSinceLastFrame = 0;
    this.frameInterval = 200;
    this.markedForDeletion = false;
  }

  update(deltaTime) {
    if (this.frame === 0) {
      this.sound.play();
    }
    this.timeSinceLastFrame += deltaTime;
    if (this.timeSinceLastFrame > this.frameInterval) {
      this.frame++;
      this.timeSinceLastFrame = 0;
      if (this.frame > 5) {
        this.markedForDeletion = true;
        
      }
    }
  }

  draw() {
    ctx.drawImage(this.image, this.spriteWidth * this.frame, 0, this.spriteWidth, this.spriteHeight, this.x, this.y - this.size/4, this.size, this.size);
  }
}    

function drawScore() {
  ctx.fillStyle = 'black';
  ctx.fillText('Score: ' + score, 40, 40);
  ctx.fillStyle = 'white';
  ctx.fillText('Score: ' + score, 43, 43);
}

function drawGameOver(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'black';
  ctx.fillText('GAME OVER punteggio:'+ score, canvas.width/2, canvas.height/2);
  ctx.fillStyle = 'white';
  ctx.fillText('GAME OVER punteggio:'+ score, canvas.width/2 + 2, canvas.height/2 + 2);
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
}

window.addEventListener('click', function(e) {
  const detectPixelColor = ctxCollision.getImageData(e.x, e.y, 1, 1);
  console.log(detectPixelColor);
  const pc = detectPixelColor.data;
  crows.forEach(obj => {
    if (obj.randomColor[0] === pc[0] && obj.randomColor[1] === pc[1] && obj.randomColor[2] === pc[2]) {
      //collision effettuata
      obj.markedForDeletion = true;
      score++;
      explosions.push(new Explosion(obj.x, obj.y, obj.width));
    }
  })
})

function animate(timestamp) {
  ctxCollision.clearRect(0, 0, canvasCollision.width, canvasCollision.height);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextCrow += deltaTime;
  
  if (timeToNextCrow > crowIntervall) {
    crows.push(new Crow());
    timeToNextCrow = 0;
    //ordiniamo i crows per la loro larghezza, più saranno piccoli, più saranno posizionati in secondo piano e viceversa
    crows.sort((a, b) => a.width - b.width);
  }
  drawScore();
  //array literal
  [...crows, ...explosions].forEach(obj => {
    obj.update( deltaTime);
    obj.draw();
  })

  crows = crows.filter(obj => !obj.markedForDeletion);
  explosions = explosions.filter(obj => !obj.markedForDeletion);
  if (!gameOver) requestAnimationFrame(animate);
  else drawGameOver();
}  
//timestamp inizialmente è undefined e riporta un numero solo dopo il primo ciclo, rendendo di fatto timeToNextCrow NaN e deltaTime null. Per ovviare a tale problema, lo impostiamo a 0 come argomento
animate(0);