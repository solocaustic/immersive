let particles = [];
const numParticles = 9999;
const maxSpeed = 3;
const noiseScale = 0.03;
const colorPalette = ['#FF0000', '#808080'];
let circleSize = 3;
let splashFade = 0; 
let state = "splash";
let mergeFont;
let fadeInDuration = 5 * 60; 

function preload() {
  mergeFont = loadFont('./YujiSyuku-Regular.ttf'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  let redParticleIndex = floor(random(numParticles));
  for (let i = 0; i < numParticles; i++) {
    let particleColor = (i === redParticleIndex) ? color(colorPalette[0]) : color(colorPalette[1]);
    let particle = new Particle(random(width), random(height), particleColor);
    particles.push(particle);
  }
}

function draw() {
  if (state === "splash") {
    drawSplashScreen();
  } else if (state === "main") {
    background(0);
    for (let particle of particles) {
      particle.update();
      particle.display();
    }
  }
}

function drawSplashScreen() {
  background(0);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(44);
  textFont(mergeFont);
  text("merge", width / 2, height / 2);
  let fadeAmount = 255 / fadeInDuration;
  splashFade = constrain(splashFade + fadeAmount, 0, 255);
  fill(0, splashFade);
  rect(0, 0, width, height);
  if (splashFade >= 255) {
    state = "main";
  }
}

class Particle {
  constructor(x, y, particleColor) {
    this.position = createVector(x, y);
    this.velocity = createVector(random(-maxSpeed, maxSpeed), random(-maxSpeed, maxSpeed));
    this.color = particleColor;
  }

  update() {
    let noiseX = noise(this.position.x * noiseScale, this.position.y * noiseScale);
    let noiseY = noise(this.position.y * noiseScale, this.position.x * noiseScale);
    let noiseVector = createVector(noiseX, noiseY);
    noiseVector.mult(2);
    this.velocity.add(noiseVector);
    this.velocity.limit(maxSpeed);
    this.position.add(this.velocity);

    if (this.position.x < 0) this.position.x = width;
    if (this.position.x > width) this.position.x = 0;
    if (this.position.y < 0) this.position.y = height;
    if (this.position.y > height) this.position.y = 0;
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.position.x, this.position.y, circleSize);
  }
}
