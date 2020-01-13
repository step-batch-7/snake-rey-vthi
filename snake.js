const EAST = 0;
const NORTH = 1;
const WEST = 2;
const SOUTH = 3;

class Snake {
  constructor(positions, direction, type) {
    this.positions = positions.slice();
    this.direction = direction;
    this.type = type;
    this.previousTail = [0, 0];
  }

  get location() {
    return this.positions.slice();
  }

  get species() {
    return this.type;
  }

  turnLeft() {
    this.direction.turnLeft();
  }

  turnRight() {
    this.direction.turnRight();
  }

  getHead() {
    return this.positions[this.positions.length - 1];
  }

  getState() {
    const state = {};
    state.location = this.positions.slice();
    state.species = this.type;
    state.previousTail = this.previousTail.slice();
    return state;
  }

  move() {
    const [headX, headY] = this.positions[this.positions.length - 1];
    this.previousTail = this.positions.shift();

    const [deltaX, deltaY] = this.direction.delta;

    this.positions.push([headX + deltaX, headY + deltaY]);
  }
}

