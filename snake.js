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

const isFoodEaten = function(point1, point2) {
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

const eraseFood = function(game) {
  const {food} = game;
  let [colId, rowId] = food.location;
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

  if (game.snakeDirection() == (moves[event.key] + 1) % 4) {
    game.turnSnakeRight();
  }
  if (game.snakeDirection() == (moves[event.key] + 3) % 4) {
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

const drawSnakeAndFood = function(gameState) {
  const {snake, ghostSnake, food} = gameState;
  snake.location.forEach(([colId, rowId]) => {
    const cell = getCell(colId, rowId);
    cell.classList.add(snake.type);
  });
  ghostSnake.location.forEach(([colId, rowId]) => {
    const cell = getCell(colId, rowId);
    cell.classList.add(ghostSnake.type);
  });
  const [colId, rowId] = food.location;
  const cell = getCell(colId, rowId);
  cell.classList.add('food');
};

const setup = game => {
  attachEventListeners(game);
  createGrids();
  drawSnakeAndFood(game.currentStatus());
};

const eraseTails = function(game) {
  const {snake, ghostSnake} = game.currentStatus();
  eraseTail(snake);
  eraseTail(ghostSnake);
};

const drawSnakesAndFood = function(game) {
  const {snake, ghostSnake, food} = game;
  drawSnake(snake);
  drawSnake(ghostSnake);
  drawFood(food);
};

const animateSnakes = game => {
  const currentState = game.currentStatus();
  eraseFood(currentState);
  game.update();
  eraseTails(game);
  drawSnakesAndFood(game);
};

const randomlyTurnSnake = game => {
  let x = Math.random() * 100;
  if (x > 50) {
    game.turnGhostSnakeLeft();
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
