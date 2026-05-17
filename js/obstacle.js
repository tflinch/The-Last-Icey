class Obstacle {
  constructor(game, x) {
    this.game = game;
    this.spriteWidth = 160;
    this.spriteHeight = 160;
    this.scaledWidth = this.spriteWidth * this.game.ratio;
    this.scaledHeight = this.spriteHeight * this.game.ratio;
    this.x = x;
    this.y = Math.random() * (this.game.height - this.scaledHeight);
    this.collisionX = 0;
    this.collisionY = 0;
    this.collisionRadius = this.scaledWidth * 0.35;
    this.speedY =
      Math.random() < 0.5 ? -1 * this.game.ratio : 1 * this.game.ratio;
    this.markedForDeletion = false;
    this.image = document.getElementById("monster");
  }
  update() {
    this.x -= this.game.speed;
    this.y += this.speedY;
    this.collisionX = this.x + this.scaledHeight * 0.5;
    this.collisionY = this.y + this.scaledWidth * 0.5;
    if (!this.game.gameOver) {
      if (this.y <= 0 || this.y >= this.game.height - this.scaledHeight) {
        this.speedY *= -1;
      }
    } else {
      this.speedY += 0.1;
    }
    if (this.isOffScreen()) {
      this.markedForDeletion = true;
      this.game.score++;
    }
    if (this.game.detectHit(this, this.game.player)) {
      this.game.gameOver = true;
      this.game.player.contact = true;
    }
  }
  draw() {
    this.game.ctx.drawImage(
      this.image,
      this.x,
      this.y,
      this.scaledWidth,
      this.scaledHeight
    );
  }
  resize() {
    this.scaledWidth = this.spriteWidth * this.game.ratio;
    this.scaledHeight = this.spriteHeight * this.game.ratio;
    this.collisionRadius = this.scaledWidth * 0.35;
  }
  isOffScreen() {
    return this.x < -this.scaledWidth || this.y > this.game.height;
  }
}
