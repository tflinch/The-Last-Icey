class Player {
  constructor(game) {
    this.game = game;
    this.x = 50;
    this.y;
    this.spriteWidth = 200;
    this.spriteHeight = 200;
    this.width;
    this.height;
    this.speedY;
    this.moveSpeed;
  }
  draw() {
    this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
  }
  update() {
    this.y += this.speedY;
    if (!this.isTouchingBottom()) {
      this.speedY += this.game.gravity;
    }
    //bottom boundary
    if (this.isTouchingBottom()) {
      this.y = this.game.height - this.height;
    }
  }
  resize() {
    this.width = this.spriteWidth * this.game.ratio;
    this.height = this.spriteHeight * this.game.ratio;
    this.y = this.game.height * 0.5 - this.height * 0.5;
    this.speedY = -8 * this.game.ratio;
    this.moveSpeed = 5 * this.game.ratio;
  }
  isTouchingTop() {
    return this.y <= 0;
  }
  isTouchingBottom() {
    return this.y >= this.game.height - this.height;
  }
  move() {
    if (!this.isTouchingTop()) {
      this.speedY = -this.moveSpeed;
    }
  }
}
