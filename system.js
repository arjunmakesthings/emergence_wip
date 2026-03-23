/*
from the readme:
the system is a world, created during the big_bang. the world keeps track of time, and runs in a 24-second loop (called a day). each day, some beings are born, some die, and some exist. existence is governed by a schedule that requires beings to move between home (place of birth) to other places. as they age, they have more places to move to. the system can be visualized like so: 
*/

let world;

//variables for time:
let day_length = 24;
let day = 0;
let time = [0, 0, 0, 0]; //an array of (human) ms, seconds, minutes, hours.

function setup() {
  createCanvas(windowWidth, windowHeight);

  world = new World();
  world.big_bang();

  //wipe the background clean.
  background(0);
}
function draw() {
  background(0);
  world.run();
}

/*
definitions:
*/

class World {
  constructor() {
    // the world also has coordinates in the universe; so.
    this.x = 0;
    this.y = 0;

    this.beings = [];

    this.time = 0;

    //helpers for calculations:
    this.prev_second = 0;
  }
  big_bang() {
    for (let i = 0; i < 2; i++) {
      this.beings.push(Being.birth(random(width), random(height)));
    }
  }
  run() {
    //keep time.
    this.time = this.keep_time();
    let second = this.time[0];
    let hour = this.time[1];

    //every second, a being can be created or killed.
    if (second > this.prev_second) {
      this.create_kill();
    }

    //handle beings:
    for (let i = this.beings.length - 1; i >= 0; i--) {
      let being = this.beings[i];
      being.live(this.time);
      if (!being.alive) this.beings.splice(i, 1);
    }

    // this.represent();

    //update time.
    this.prev_second = second;
  }

  create_kill() {
    //small probabilities for birth and death here.
    let c_birth = random();
    let p_birth = random(0, 0.08);

    if (c_birth < p_birth) {
      this.beings.push(Being.birth(random(width), random(height)));
    }

    let c_death = random();
    let p_death = random(0, 0.01);

    if (c_death < p_death && this.beings.length > 2) {
      let n = Math.floor(random(0, this.beings.length));
      this.beings[n].alive = false;
    }
  }

  //helper to keep time.
  keep_time() {
    const ms = millis() - day;
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / (1000 * 60)) % 60;
    const hours = Math.floor(ms / (1000 * 60 * 60));

    //one minute loop.
    if (seconds >= day_length) {
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

    return time;
  }
}

/*
being-definition:
*/

class Being {
  constructor(x, y) {
    //beings have positions in space.
    this.pos = createVector(x, y);
    this.vel = createVector(3, 0);

    //they have houses, and other destinations that they frequent.
    this.home = this.pos.copy();
    this.other_destinations = [];
    this.other_destinations.push({ x: this.home.x, y: this.home.y }); //the first position in other destinations is always home.

    //they live by a schedule.
    this.schedule = this.make_schedule();

    //they have a current-age.
    this.curr_age = 0;

    //they have a dying rate.
    this.dying_rate = 0;

    //they have the probability to die.
    this.prob_to_die = 0;

    //they have a mass.
    this.mass = 10;

    //they move at different speeds.
    this.speed = random(0, 2);

    //they are alive when born.
    this.alive = true;

    //helper variables to do calculations.
    this.current_hour = -1; //remember last hour to prevent jittering.
    this.new_pos = createVector(x, y);

    //helper allocations:
    this.other_destinations.push({ x: random(0, width), y: random(0, height) });
  }

  //constructor helper to make a schedule:
  make_schedule() {
    let f = 24;
    let segments = Math.floor(random(3, 9));
    let cuts = [0];

    for (let i = 0; i < segments - 1; i++) {
      let cut;
      do {
        cut = Math.floor(random(1, f));
      } while (cuts.includes(cut));
      cuts.push(cut);
    }
    cuts.push(f);

    // Sort cut points
    cuts.sort((a, b) => a - b);

    // Build segments as [start, end] pairs
    let schedule = [];
    for (let i = 0; i < cuts.length - 1; i++) {
      schedule.push([cuts[i], cuts[i + 1]]);
    }

    return schedule;
  }

  static birth(x, y) {
    return new Being(x, y);
  }

  live(t) {
    this.show();
    this.move(t);
    // this.age();
    this.die();
  }

  show() {
    noFill();
    let c = map(this.curr_age, 0, 80, 255, 50);
    stroke(c);
    circle(this.pos.x, this.pos.y, this.mass);
  }

  move(t) {
    this.constrain();

    //t[0] comes as a 24 second loop.
    let hour = t[1];

    //only pick a new destination when the hour changes
    if (hour !== this.current_hour) {
      this.current_hour = hour;

      for (let i = 0; i < this.schedule.length; i++) {
        if (i !== hour) continue; //if we're not checking against the current time, we don't care.

        //if i is the current time:
        if (i % 2 == 0) {
          //starting number of a pair.
          let n = Math.floor(random(this.other_destinations.length));
          this.new_pos.set(
            this.other_destinations[n].x,
            this.other_destinations[n].y,
          );
        }

        if (i === this.schedule.length - 1) {
          this.add_posis();
        }
      }
    }

    //move toward the chosen destination every frame
    let d = p5.Vector.sub(this.new_pos, this.pos);

    if (d.mag() > this.speed) {
      d.setMag(this.speed);
      this.pos.add(d);
    } else {
      this.pos = this.new_pos.copy();
    }
  }

  add_posis() {
    this.other_destinations.push({ x: random(0, width), y: random(0, height) });
  }

  constrain() {
    if (this.pos.x < 0 || this.pos.x > width) {
      this.vel.x *= -1;
    }
    if (this.pos.y < 0 || this.pos.y > height) {
      this.vel.y *= -1;
    }
  }

  age() {
    this.curr_age += this.dying_rate;

    this.dying_rate += abs(noise(frameCount) * 0.00005); //dying rate keeps changing between 0,1.

    this.mass += this.curr_age * 0.005;
    this.mass = constrain(this.mass, 1, 20);
  }

  die() {
    //as beings get older, their probability to die increases.
    this.prob_to_die = this.curr_age * 0.00005;

    //probability can never exceed 1.
    this.prob_to_die = constrain(this.prob_to_die, 0, 1);

    this.mass -= this.prob_to_die;

    let n = random();

    if (n < this.prob_to_die) {
      this.alive = false;
    }
  }
}
