class Obstacle {
  constructor(game, x) {
    this.game = game;
    this.spriteWidth = 160;
    this.spriteHeight = 160;
    this.scaledWidth = this.spriteWidth * this.game.ratio;
    this.scaledHeight = this.spriteHeight * this.game.ratio;
    this.x = x;
    //randmize obstcales on the Y axis
    this.y = Math.random() * (this.game.height - this.scaledHeight);
    this.collisionX;
    this.collisionY;
    this.collisionRadius = this.scaledWidth * 0.35;
    this.speedY =
      Math.random() < 0.5 ? -1 * this.game.ratio : 1 * this.game.ratio;
    this.markedForDeletion = false;
    this.imgage = document.getElementById("monster");
  }
  update() {
    this.x -= this.game.speed;
    this.y += this.speedY;
    this.collisionX = this.x + this.scaledHeight * 0.5;
    this.collisionY = this.y + this.scaledWidth * 0.5;
    if (!this.game.gameOver) {
      //creates the boundry of the obstacles and flips them when hitting the position
      if (this.y <= 0 || this.y >= this.game.height - this.scaledHeight) {
        this.speedY *= -1;
      }
    } else {
      this.speedY += 0.1;
    }
    if (this.isOffScreen()) {
      this.markedForDeletion = true;
      this.game.obstacles = this.game.obstacles.filter(
        (obstacle) => !obstacle.markedForDeletion
      );
      this.game.score++;
      console.log(this.game.obstacles.length);
      if (this.game.obstacles.length <= 0) this.game.gameOver = true;
    }
    if (this.game.detectHit(this, this.game.player)) {
      this.game.gameOver = true;
      this.game.player.contact = true;
    }
  }
  draw() {
    //draws cricle that will be used to reference for collison
    // this.game.ctx.fillRect(this.x, this.y, this.scaledWidth, this.scaledHeight);
    this.game.ctx.drawImage(
      this.imgage,
      this.x,
      this.y,
      this.scaledWidth,
      this.scaledHeight
    );
    // this.game.ctx.beginPath();
    // this.game.ctx.arc(
    //   this.collisionX,
    //   this.collisionY,
    //   this.collisionRadius,
    //   0,
    //   Math.PI * 2
    // );
    // this.game.ctx.stroke();
  }
  resize() {
    this.scaledWidth = this.spriteWidth * this.game.ratio;
    this.scaledHeight = this.spriteHeight * this.game.ratio;
  }
  isOffScreen() {
    return this.x < -this.scaledWidth || this.y > this.game.height;
  }
}
