const EAST = 0;
const NORTH = 1;
const WEST = 2;
const SOUTH = 3;

class Direction {
  constructor(initialHeading) {
    this.heading = initialHeading;
    this.deltas = {};
    this.deltas[EAST] = [1, 0];
    this.deltas[WEST] = [-1, 0];
    this.deltas[NORTH] = [0, -1];
    this.deltas[SOUTH] = [0, 1];
  }

  get delta() {
    return this.deltas[this.heading];
  }

  turnRight() {
    this.heading = (this.heading + 3) % 4;
  }
  turnLeft() {
    this.heading = (this.heading + 1) % 4;
  }
}

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

  move() {
    const [headX, headY] = this.positions[this.positions.length - 1];
    this.previousTail = this.positions.shift();

    const [deltaX, deltaY] = this.direction.delta;

    this.positions.push([headX + deltaX, headY + deltaY]);
  }
}

class Food {
  constructor(colId, rowId) {
    this.colId = colId;
    this.rowId = rowId;
  }

  get position() {
    return [this.colId, this.rowId];
  }
}

class Game {
  constructor(snake, ghostSnake, food) {
    this.snake = snake;
    this.ghostSnake = ghostSnake;
    this.food = food;
  }

  getNewFood(width, height) {
    const newFoodX = Math.floor(Math.random() * width);
    const newFoodY = Math.floor(Math.random() * height);
    return new Food(newFoodX, newFoodY);
  }
  update() {
    this.snake.move();
    this.ghostSnake.move();
    if (areInSameLocation(this.snake.getHead(), this.food.position)) {
      this.food = this.getNewFood(50, 30);
      this.snake.positions.push(getNewSnakeTail(this.snake));
    }
  }
  turnSnakeLeft() {
    this.snake.turnLeft();
  }

  turnSnakeRight() {
    this.snake.turnRight();
  }

  currentStatus() {
    const gameState = {
      snake: {
        position: this.snake.positions.slice(),
        direction: this.snake.direction,
        tail: this.snake.previousTail.slice(),
        type: this.snake.type
      },
      ghostSnake: {
        position: this.ghostSnake.positions.slice(),
        direction: this.snake.direction,
        type: this.ghostSnake.type
      },
      food: {
        position: [this.food.colId, this.food.rowId]
      }
    };
    return gameState;
  }
}

const areInSameLocation = function(point1, point2) {
  const isXEqual = point1[0] == point2[0];
  const isYEqual = point1[1] == point2[1];
  return isXEqual && isYEqual;
};

const getNewSnakeTail = function(snake) {
  const [headX, headY] = snake.positions[snake.positions.length - 1];
  const [deltaX, deltaY] = snake.direction.delta;
  return [headX + deltaX, headY + deltaY];
};

const NUM_OF_COLS = 100;
const NUM_OF_ROWS = 60;

const GRID_ID = 'grid';

const getGrid = () => document.getElementById(GRID_ID);

const getCellId = (colId, rowId) => colId + '_' + rowId;

const getCell = (colId, rowId) =>
  document.getElementById(getCellId(colId, rowId));

const createCell = function(grid, colId, rowId) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.id = getCellId(colId, rowId);
  grid.appendChild(cell);
};

const createGrids = function() {
  const grid = getGrid();
  for (let y = 0; y < NUM_OF_ROWS; y++) {
    for (let x = 0; x < NUM_OF_COLS; x++) {
      createCell(grid, x, y);
    }
  }
};

const eraseTail = function(snake) {
  let [colId, rowId] = snake.previousTail;
  const cell = getCell(colId, rowId);
  cell.classList.remove(snake.species);
};

const eraseFood = function(food) {
  let [colId, rowId] = food.position;
  const cell = getCell(colId, rowId);
  cell.classList.remove('food');
};

const drawSnake = function(snake) {
  snake.location.forEach(([colId, rowId]) => {
    const cell = getCell(colId, rowId);
    cell.classList.add(snake.species);
  });
};

const drawFood = function(food) {
  let [colId, rowId] = food.position;
  const cell = getCell(colId, rowId);
  cell.classList.add('food');
};

const handleKeyPress = game => {
  const moves = {
    ArrowUp: NORTH,
    ArrowDown: SOUTH,
    ArrowRight: EAST,
    ArrowLeft: WEST
  };
  if (game.snake.direction.heading == (moves[event.key] + 1) % 4) {
    game.turnSnakeRight();
  }
  if (game.snake.direction.heading == (moves[event.key] + 3) % 4) {
    game.turnSnakeLeft();
  }
};

const attachEventListeners = game => {
  document.body.onkeydown = handleKeyPress.bind(null, game);
};

const initSnake = () => {
  const snakePosition = [
    [40, 25],
    [41, 25],
    [42, 25]
  ];
  return new Snake(snakePosition, new Direction(EAST), 'snake');
};

const initGhostSnake = () => {
  const ghostSnakePosition = [
    [40, 30],
    [41, 30],
    [42, 30]
  ];
  return new Snake(ghostSnakePosition, new Direction(SOUTH), 'ghost');
};

const drawSnakeAndFood = function(game) {
  const {snake, ghostSnake, food} = game;
  snake.position.forEach(([colId, rowId]) => {
    const cell = getCell(colId, rowId);
    cell.classList.add(snake.type);
  });
  ghostSnake.position.forEach(([colId, rowId]) => {
    const cell = getCell(colId, rowId);
    cell.classList.add(ghostSnake.type);
  });
  const [colId, rowId] = food.position;
  const cell = getCell(colId, rowId);
  cell.classList.add('food');
};

const setup = game => {
  const gameState = game.currentStatus();
  attachEventListeners(game);
  createGrids();
  drawSnakeAndFood(gameState);
};

const eraseTails = function(game) {
  eraseTail(game.snake);
  eraseTail(game.ghostSnake);
};

const drawSnakesAndFood = function(game) {
  drawSnake(game.snake);
  drawSnake(game.ghostSnake);
  drawFood(game.food);
};

const animateSnakes = game => {
  eraseFood(game.food);
  game.update();
  eraseTails(game);
  drawSnakesAndFood(game);
};

const randomlyTurnSnake = game => {
  let x = Math.random() * 100;
  if (x > 50) {
    game.ghostSnake.turnLeft();
  }
};

const main = function() {
  const snake = initSnake();
  const ghostSnake = initGhostSnake();
  const food = new Food(5, 5);
  const game = new Game(snake, ghostSnake, food);
  setup(game);
  setInterval(animateSnakes, 200, game);
  setInterval(randomlyTurnSnake, 500, game);
};
