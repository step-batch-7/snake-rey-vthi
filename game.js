class Game {
  constructor(snake, ghostSnake, food, score, boundary) {
    this.snake = snake;
    this.ghostSnake = ghostSnake;
    this.food = food;
    this.score = score;
    this.boundary = boundary;
  }

  getNewFood(width, height) {
    const newFoodX = Math.floor(Math.random() * width);
    const newFoodY = Math.floor(Math.random() * height);
    return new Food(newFoodX, newFoodY);
  }

  get boundarySize() {
    return [this.boundary.x, this.boundary.y];
  }

  update() {
    this.snake.move();
    this.ghostSnake.move();
    if (isFoodEaten(this.snake.getHead(), this.food.position)) {
      this.food = this.getNewFood(50, 30);
      this.score.update();
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
    state.score = this.score.currentScore;
    return state;
  }

  isOver() {
    return this.snake.isTouchedWall(this.boundarySize);
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

const displayScore = function(game) {
  const {score} = game.currentStatus();
  document.getElementById('score').innerText = `Score: ${score}`;
};

const setup = game => {
  attachEventListeners(game);
  createGrids();
  drawSnakesAndFood(game);
  displayScore(game);
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
  const score = new Score();
  const boundary = {x: 100, y: 60};
  const game = new Game(snake, ghostSnake, food, score, boundary);
  setup(game);
  const gameLoop = setInterval(
    () => {
      eraseFood(game.currentStatus());
      game.update();
      if (game.isOver()) {
        clearInterval(gameLoop);
        alert('game Over');
      }
      eraseTails(game);
      drawSnakesAndFood(game);
      displayScore(game);
    },
    200,
    game
  );
  setInterval(randomlyTurnSnake, 500, game);
};
