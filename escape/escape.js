let splashFont;
let splashFade = 0; 
let fadeInDuration = 5 * 60; 

function preload() {
  splashFont = loadFont('https://solocaustic.github.io/immersive/YujiSyuku-Regular.ttf'); 
}

function setup() {
  createCanvas(400, 400);
  setTimeout(() => {
    fadeInDuration = 0; 
  }, 5000); 
}

function draw() {
  if (fadeInDuration > 0) {
    drawSplashScreen();
  } else {
    background(17);
    update(); 
    noFill(); 
    stroke(80); 
    renderEscape(); 
    renderPlayer(); 
  }
}

function drawSplashScreen() {
  background(17);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(44);
  textFont(splashFont);
  text("escape", width / 2, height / 2);

  let fadeAmount = 255 / fadeInDuration;

  splashFade = constrain(splashFade + fadeAmount, 0, 255);

  fill(17, splashFade);
  rect(0, 0, width, height);

  if (splashFade >= 255) {
    fadeInDuration = 0; 
  }
}

let player;
let pressedKeys = {}; 

function setup() {
  createCanvas(400, 400);
  player = {
    x: width / 2, 
    y: height / 2, 
    size: 10,
    speed: 3, 
    velocityX: 0, 
    velocityY: 0 
  };
}

function keyPressed() {
  pressedKeys[keyCode] = true;
}

function keyReleased() {
  pressedKeys[keyCode] = false;
}

function update() {
  player.velocityX = (pressedKeys[37] ? -player.speed : 0) + (pressedKeys[39] ? player.speed : 0);
  player.velocityY = (pressedKeys[38] ? -player.speed : 0) + (pressedKeys[40] ? player.speed : 0);

  let distanceToCenter = dist(player.x, player.y, width / 2, height / 2);

  let escapeRadius = map(noise(cos(angle), sin(angle), noiseOffset), 0, 1, 80, 120);

  if (distanceToCenter > escapeRadius) {

    let angleToCenter = atan2(height / 2 - player.y, width / 2 - player.x);

    player.x += cos(angleToCenter) * player.speed;
    player.y += sin(angleToCenter) * player.speed;
  } else {
    player.x += player.velocityX;
    player.y += player.velocityY;
    player.x = constrain(player.x, 0, width);
    player.y = constrain(player.y, 0, height);
  }
}

function renderPlayer() {

  fill(255, 0, 0); 
  ellipse(player.x, player.y, player.size, player.size); 
}


let angle = 0;
let noiseOffset = 0.0;
let noiseStep = 0.05;


function renderEscape() {

  noiseOffset += noiseStep;

  beginShape();
  for (let i = 0; i < TWO_PI; i += 0.1) {
    let xoff = map(cos(angle + i), -1, 1, 0, 5);
    let yoff = map(sin(angle + i), -1, 1, 0, 5);
    let r = map(noise(xoff, yoff, noiseOffset), 0, 1, 80, 120);
    let x = width / 2 + cos(angle + i) * r;
    let y = height / 2 + sin(angle + i) * r;
    vertex(x, y);
  }
  endShape(CLOSE);
  angle += 0.01;
}
