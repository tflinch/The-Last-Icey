class Player {
  constructor(game) {
    this.game = game;
    this.x = 50;
    this.y = 0;
    this.spriteWidth = 200;
    this.spriteHeight = 200;
    this.width = 0;
    this.height = 0;
    this.speedY = 0;
    this.moveSpeed = 0;
    this.collisionX = 0;
    this.collisionY = 0;
    this.collisionRadius = 0;
    this.contact = false;
    this.image = document.getElementById("player_icepop");
  }
  draw() {
    this.game.ctx.drawImage(
      this.image,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
  update() {
    this.y += this.speedY;
    this.collisionY = this.y + this.height * 0.5;
    if (!this.isTouchingBottom()) {
      this.speedY += this.game.gravity;
    }
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
    this.collisionRadius = 80 * this.game.ratio;
    this.collisionX = this.x + this.width * 0.5 - 20;
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
      this.game.sound.move.play();
    }
    if (!this.game.gameStart) {
      this.game.gameStart = true;
    }
  }
}
