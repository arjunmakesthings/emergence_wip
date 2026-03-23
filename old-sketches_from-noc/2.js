/* 
untitled; by arjun; march 2026. 
simple system: 

- there are beings the world.
- beings move, and stay on surface. 
- beings close together cluster together. 

*/

let beings = [];

let num = 100;

function setup() {
  // createCanvas(1000, 562); //in 16:9 aspect ratio.
  createCanvas(800, 800); //square to handle calculations better.

  for (let i = 0; i < num; i++) {
    beings.push(new Being(width / 2, height / 2));
  }

  //clear canvas with a black background.
  background(0);
}

function draw() {
  // background(0);
  for (let being of beings) {
    //being.show();
    being.move(time);
  }

  for (let i = 0; i < beings.length; i++) {
    for (let j = 0; j < beings.length; j++) {
      if (i === j) continue;

      strokeWeight(0.08);
      if ((i + j) % 2 === 0) {
        stroke(255, 100);
      } else {
        stroke(0, 100);
      }
      line(beings[i].pos.x, beings[i].pos.y, beings[j].pos.x, beings[j].pos.y);
    }
  }

  keep_time();
}

class Being {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.home = this.pos.copy();
    this.dest = this.home.copy();

    this.other_places = [createVector(random(0, width), random(0, height))];

    this.vel = createVector(0, 0);

    this.last_time = 0;

    this.pace = random(0.5, 2);
  }
  show() {
    noFill();
    stroke(255);
    circle(this.pos.x, this.pos.y, 20);

    //this.show_places();
  }
  show_places() {
    for (let i = 0; i < this.other_places.length; i++) {
      noFill();
      stroke(255, 0, 0);
      circle(this.other_places[i].x, this.other_places[i].y, 50);
    }
  }
  move(time) {
    let norm_time = Math.floor(map(time[1], 0, 30, 0, 24));

    noStroke();
    fill(255, 0, 0);
    text(norm_time, 50, 50);

    if (norm_time < 8) {
      this.dest.set(this.home);
    } else if (norm_time >= 8 && norm_time < 17) {
      this.dest.set(this.other_places[0]);
    } else if (norm_time >= 17 && norm_time < 20) {
      let n = Math.floor(random(this.other_places.length));
      this.dest.set(this.other_places[n]);
    } else {
      this.dest.set(this.home);
    }

    if (norm_time === 23 && this.last_time !== 23) {
      //new day:
      this.other_places.push(createVector(random(0, width), random(0, height)));
    }

    this.last_time = norm_time;

    // Calculate direction and distance
    let d = p5.Vector.sub(this.dest, this.pos);
    let distance = d.mag();

    // Slow down as you get close (max speed = this.pace, min speed = 0)
    let speed = map(distance, 0, 100, 0, this.pace); // 100 is the "slowing radius"
    speed = constrain(speed, 0, this.pace);

    if (distance > 1) {
      d.setMag(speed);
      this.vel = d;
    } else {
      this.vel.set(0, 0);
    }

    this.pos.add(this.vel);
    this.stay();
  }
  stay() {
    if (this.pos.x >= width || this.pos.x < 0) {
      this.vel.x *= -1;
    }
    if (this.pos.y >= height || this.pos.y < 0) {
      this.vel.y *= -1;
    }
  }
}

//helper to keep time.
let day = 0;
let time = [0, 0, 0, 0]; //ms, seconds, minutes, hours.

function keep_time() {
  const ms = millis() - day;
  const seconds = Math.floor(ms / 1000) % 60;
  const minutes = Math.floor(ms / (1000 * 60)) % 60;
  const hours = Math.floor(ms / (1000 * 60 * 60));

  //one minute loop.
  if (seconds >= 30) {
    day = millis();
    time[0] = 0;
    time[1] = 0;
    time[2] = 0;
    time[3] = 0;
  } else {
    time[0] = Math.floor(ms);
    time[1] = seconds;
    time[2] = minutes;
    time[3] = hours;
  }
}
