//untitled; arjun; month, 2026.

/*
ask: 

*/

/*
thought: 

*/

//there is a world, and there are beings in the world.

let world;

let margin = 100;

function setup() {
  // createCanvas(1000, 562); //in 16:9 aspect ratio.
  createCanvas(800, 800); //square to handle calculations better.

  world = new World(width, height);

  world.big_bang();
}

function draw() {
  world.run();
}

class World {
  constructor(w, h) {
    this.w = w;
    this.h = h;

    this.time = [0, 0, 0, 0];
    this.day = 0;

    this.beings = [];
  }
  big_bang() {
    this.beings.push(Being.birth(this.w / 2, this.h / 2));
    // this.beings.push(Being.birth(this.w / 2, this.h / 2));
  }
  run() {
    background(0);

    this.keep_time();

    for (let being of this.beings) {
      being.exist();
    }

    // //every x second, a new unit is added into space.
    if (frameCount % 60 == 0) {
      // this.units.push(Unit.birth(random(margin, this.w), random(margin,this.h)));
    }
  }
  keep_time() {
    const ms = millis() - this.day;
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / (1000 * 60)) % 60;
    const hours = Math.floor(ms / (1000 * 60 * 60));

    // When a minute passes, reset loopStart
    if (seconds >= 10) {
      this.day = millis();
      this.time[0] = 0;
      this.time[1] = 0;
      this.time[2] = 0;
      this.time[3] = 0;
    } else {
      this.time[0] = Math.floor(ms);
      this.time[1] = seconds;
      this.time[2] = minutes;
      this.time[3] = hours;
    }

    console.log(this.time); 
  }
}

class Being {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.home = this.pos;
    this.age = 1;
    this.aging_rate = 0.37;

    this.other_places = [this.home.add(random(20, 50))];
  }
  static birth(x, y) {
    return new Being(x, y);
  }
  exist() {
    this.show();
    this.grow();
    this.move();
  }
  show() {
    noFill();
    stroke(255);
    circle(this.pos.x, this.pos.y, 10);
  }
  grow() {
    const prev_age = Math.floor(this.age);
    this.age += this.aging_rate;
    const curr_age = Math.floor(this.age);

    if (curr_age > prev_age) {
      //happy birthday:
      this.other_places.push(random(width / 2, height / 2));
    }
  }
  move() {
  }
  static death() {}
}
