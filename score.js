class Score {
  constructor() {
    this.score = 0;
  }
  update() {
    this.score++;
  }

  get currentScore() {
    return this.score;
  }
}
