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
    this.collisionX;
    this.collisionY;
    this.collisionRadius;
    this.contact;
  }
  draw() {
    this.game.ctx.fillRect(this.x, this.y, this.width, this.height);
    this.game.ctx.beginPath();
    this.game.ctx.arc(
      this.collisionX,
      this.collisionY,
      this.collisionRadius,
      0,
      Math.PI * 2
    );
    this.game.ctx.stroke();
  }
  update() {
    this.y += this.speedY;
    this.collisionY = this.y + this.height * 0.5;
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
    this.collisionRadius = this.width * 0.5;
    this.collisionX = this.x + this.width * 0.5;
    this.contact = false;
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
