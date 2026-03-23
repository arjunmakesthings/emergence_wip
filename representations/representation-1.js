World.prototype.interpret = function (){
    for (let i = 0; i < this.beings.length; i++) {
      fill(255, 0, 0);
      circle(this.beings[i].pos.x, this.beings[i].pos.y, 50);
    }
}