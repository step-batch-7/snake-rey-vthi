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
    if (isFoodEaten(this.snake.getHead(), this.food.position)) {
      this.food = this.getNewFood(50, 30);
      this.snake.positions.push(getNewSnakeTail(this.snake));
    }
  }

  snakeDirection() {
    return this.snake.direction.heading;
  }

  turnSnakeLeft() {
    this.snake.turnLeft();
  }

  turnSnakeRight() {
    this.snake.turnRight();
  }

  turnGhostSnakeLeft() {
    this.ghostSnake.turnLeft();
  }

  currentStatus() {
    const state = {};
    state.snake = this.snake.getState();
    state.ghostSnake = this.ghostSnake.getState();
    state.food = {location: this.food.position};
    return state;
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

const setup = game => {
  attachEventListeners(game);
  createGrids();
  drawSnakesAndFood(game);
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
