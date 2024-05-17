
let particles = [];
let smokeParticles = [];
let absorbPoint;
let splashFont;
let splashFade = 255; 
let fadeInDuration = 5 * 60;
function preload() {

  splashFont = loadFont('YujiSyuku-Regular.ttf'); 
}

function setup() {
  createCanvas(windowWidth, windowHeight); 
  setTimeout(() => {
    fadeInDuration = 0; 
  }, 5000); 
  generateParticles();
  absorbPoint = createVector(width / 2, height / 2); 
}

function draw() {
  if (fadeInDuration > 0) {
    drawSplashScreen();
  } else {
    background(17);
    applyForces();
    updateParticles();
    displayParticles();
    addAtmos();
    animateAtmos();
  }
}

function applyForces() {
  for (let i = 0; i < particles.length; i++) {
    let particle = particles[i];
t
    let forceX = random(-0.5, 0.5);
    let forceY = random(-0.5, 0.5);

    particle.acceleration.add(createVector(forceX, forceY));
    
    let gravity = p5.Vector.sub(absorbPoint, particle.position);
    gravity.setMag(0.3); 
    particle.acceleration.add(gravity);
    
    particle.velocity.limit(1);

    if (random(100) < 1) {
      particle.color = color(255, 0, 0); 
    } else {
      particle.color = color(random(100,200)); 
    }
  }
  

  for (let i = 0; i < smokeParticles.length; i++) {
    let particle = smokeParticles[i];
    

    let gravity = p5.Vector.sub(absorbPoint, particle);
    gravity.setMag(0.05); 
    particle.add(gravity);
  }
}

function updateParticles() {

  for (let i = 0; i < particles.length; i++) {
    let particle = particles[i];

    particle.velocity.add(particle.acceleration);

    particle.position.add(particle.velocity);

    particle.acceleration.mult(0);

    particle.position.x = (particle.position.x + width) % width;
    particle.position.y = (particle.position.y + height) % height;
  }
}

function displayParticles() {

  stroke(255, 100); 
  
  for (let i = 0; i < particles.length; i++) {
    let particle = particles[i];
    let resultPos = p5.Vector.add(particle.position, particle.velocity);
    
    line(particle.position.x, particle.position.y, resultPos.x, resultPos.y);
    
    fill(particle.color);
    noStroke();
    ellipse(particle.position.x, particle.position.y, 5);
  }
}

function addAtmos() {

  for (let i = 0; i < 5; i++) {
    let x = random(width);
    let y = random(height);
    smokeParticles.push(createVector(x, y));
  }
}

function animateAtmos() {

  for (let i = smokeParticles.length - 1; i >= 0; i--) {
    let particle = smokeParticles[i];
    let gravity = p5.Vector.sub(absorbPoint, particle);
    gravity.setMag(0.05); 
    particle.add(gravity);
    
    fill(150, 50);
    noStroke();
    ellipse(particle.x, particle.y, 5);
  }
}

function generateParticles() {
  for (let i = 0; i < 666; i++) {
    let x = random(width);
    let y = random(height);
    let velocity = p5.Vector.random2D().mult(random(1, 3)); 
    let acceleration = createVector(0, 0); 
    particles.push({position: createVector(x, y), velocity: velocity, acceleration: acceleration});
  }
}

function drawSplashScreen() {
  background(17); 

  fill(255); 
  textAlign(CENTER, CENTER);
  textSize(44);
  textFont(splashFont);
  text("absorb", width / 2, height / 2);

  let fadeAmount = 255 / fadeInDuration;

  splashFade -= fadeAmount;

  if (splashFade < 0) {
    splashFade = 0;
  }

  fill(17, splashFade); 
  rect(0, 0, width, height);


  fadeInDuration--;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
