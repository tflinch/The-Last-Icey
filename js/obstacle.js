class Obstacle {
  constructor(game, x) {
    this.game = game;
    this.spriteWidth = 160;
    this.spriteHeight = 160;
    // each obstacle is slightly different size + hue so they don't all look identical
    this.sizeMultiplier = 0.85 + Math.random() * 0.3;
    this.hue = (Math.floor(Math.random() * 7) - 3) * 30;
    this.scaledWidth = this.spriteWidth * this.game.ratio * this.sizeMultiplier;
    this.scaledHeight =
      this.spriteHeight * this.game.ratio * this.sizeMultiplier;
    this.x = x;
    this.y = Math.random() * (this.game.height - this.scaledHeight);
    this.collisionX = 0;
    this.collisionY = 0;
    this.collisionRadius = this.scaledWidth * 0.35;
    this.speedY =
      Math.random() < 0.5 ? -1 * this.game.ratio : 1 * this.game.ratio;
    this.markedForDeletion = false;
    this.hasPassedPlayer = false;
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
    if (
      !this.hasPassedPlayer &&
      !this.game.gameOver &&
      this.collisionX < this.game.player.collisionX
    ) {
      this.hasPassedPlayer = true;
      const dy = Math.abs(this.collisionY - this.game.player.collisionY);
      const nearMissRange =
        (this.game.player.collisionRadius + this.collisionRadius) * 1.8;
      if (dy < nearMissRange) this.game.registerNearMiss(this);
    }
    if (this.isOffScreen() && !this.markedForDeletion) {
      this.markedForDeletion = true;
      this.game.score++;
      this.game.spawnParticles(0, this.collisionY, 6);
    }
    if (!this.game.gameOver && this.game.detectHit(this, this.game.player)) {
      this.game.player.contact = true;
      this.game.shake = 18 * this.game.ratio;
      this.game.spawnParticles(
        this.game.player.collisionX,
        this.game.player.collisionY,
        18
      );
      this.game.endGame();
    }
  }
  draw() {
    const ctx = this.game.ctx;
    ctx.save();
    if (this.hue !== 0) {
      ctx.filter = "hue-rotate(" + this.hue + "deg)";
    }
    ctx.drawImage(
      this.image,
      this.x,
      this.y,
      this.scaledWidth,
      this.scaledHeight
    );
    ctx.restore();
  }
  resize() {
    this.scaledWidth = this.spriteWidth * this.game.ratio * this.sizeMultiplier;
    this.scaledHeight =
      this.spriteHeight * this.game.ratio * this.sizeMultiplier;
    this.collisionRadius = this.scaledWidth * 0.35;
  }
  isOffScreen() {
    return this.x < -this.scaledWidth || this.y > this.game.height;
  }
}
