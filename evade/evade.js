let vehicles = [];
let state = "splash";
let splashFade = 0;
let fadeInDuration = 60;
let mergeFont;

function preload() {
    mergeFont = loadFont('https://solocaustic.github.io/immersive/YujiSyuku-Regular.ttf'); 
  }

class Vehicle {
  constructor(x, y, type) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, 0);
    this.acceleration = createVector(0, 0);
    this.wanderTheta = 0;
    this.state = 'wander';  
    this.target = null;

    if (type === 'wanderer') {
      this.maxSpeed = 5; 
    } else {
      this.maxSpeed = 2; 
    }
    this.maxForce = 0.1;
    this.type = type; 
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  wander() {
    let wanderRadius = 25;
    let wanderDistance = 50;
    let wanderChange = 0.3;

    this.wanderTheta += random(-wanderChange, wanderChange);

    let wanderCircle = this.velocity.copy();
    wanderCircle.setMag(wanderDistance);
    wanderCircle.add(this.position);

    let h = this.velocity.heading();

    let wanderForce = createVector(
      wanderRadius * cos(this.wanderTheta + h),
      wanderRadius * sin(this.wanderTheta + h)
    );

    let steer = p5.Vector.sub(wanderCircle.add(wanderForce), this.position);
    steer.limit(this.maxForce);
    this.applyForce(steer);
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.position);
    desired.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce);
    this.applyForce(steer);
  }

  flee(target) {
    let desired = p5.Vector.sub(this.position, target);
    desired.setMag(this.maxSpeed);
    let steer = p5.Vector.sub(desired, this.velocity);
    steer.limit(this.maxForce);
    this.applyForce(steer);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.velocity.limit(this.maxSpeed);
    this.position.add(this.velocity);
    this.acceleration.mult(0);

    if (this.position.x < 0) {
      this.position.x = 0;
      this.velocity.x *= -1;
    } else if (this.position.x > width) {
      this.position.x = width;
      this.velocity.x *= -1;
    }

    if (this.position.y < 0) {
      this.position.y = 0;
      this.velocity.y *= -1;
    } else if (this.position.y > height) {
      this.position.y = height;
      this.velocity.y *= -1;
    }
  }

  display() {
    let theta = this.velocity.heading() + PI / 2;
    if (this.state === 'wander') {
      fill(255, 0, 0); 
    } else {
      fill(211);
    }
    stroke(0);
    push();
    translate(this.position.x, this.position.y);
    rotate(theta);
    beginShape();
    vertex(0, -10);
    vertex(-5, 10);
    vertex(5, 10);
    endShape(CLOSE);
    pop();
  }

  changeState(state, target = null) {
    this.state = state;
    this.target = target;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  for (let i = 0; i < 2; i++) {
    vehicles.push(new Vehicle(random(width), random(height), 'seeker'));
  }

  for (let i = 0; i < 3; i++) {
    vehicles.push(new Vehicle(random(width), random(height), 'wanderer'));
  }
}

function draw() {
  if (state === "splash") {
    drawSplashScreen();
  } else if (state === "main") {
    background(17);
    for (let vehicle of vehicles) {
      if (vehicle.state === 'wander') {
        vehicle.wander();
      } else if (vehicle.state === 'seek') {
        vehicle.seek(vehicle.target.position);
      } else if (vehicle.state === 'flee') {
        vehicle.flee(vehicle.target.position);
      }

      vehicle.update();
      vehicle.display();
    }

    checkInteractions();
  }
}

function drawSplashScreen() {
  background(0);
  fill(255);
  textAlign(CENTER, CENTER);
  textSize(44);
  textFont(mergeFont);
  text("evade", width / 2, height / 2);
  let fadeAmount = 255 / fadeInDuration;
  splashFade = constrain(splashFade + fadeAmount, 0, 255);
  fill(0, splashFade);
  rect(0, 0, width, height);
  if (splashFade >= 255) {
    state = "main";
  }
}

function checkInteractions() {
  for (let i = 0; i < vehicles.length; i++) {
    for (let j = 0; j < vehicles.length; j++) {
      if (i !== j) {
        let vehicleA = vehicles[i];
        let vehicleB = vehicles[j];
        let distance = p5.Vector.dist(vehicleA.position, vehicleB.position);
        if (vehicleA.state === 'wander' && vehicleB.state === 'wander' && distance < 50) {
          vehicleA.changeState('seek', vehicleB);
          vehicleB.changeState('seek', vehicleA);
        } else if (vehicleA.state === 'seek' && vehicleB.state === 'wander' && distance < 50) {
          vehicleB.changeState('seek', vehicleA);
          vehicleA.changeState('flee', vehicleB);
        } else if (vehicleA.state === 'flee' && distance > 100) {
          vehicleA.changeState('wander');
        }
      }
    }
  }
}
