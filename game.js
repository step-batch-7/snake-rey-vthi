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
