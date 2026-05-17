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
    // squash-and-stretch state, eases back to 1
    this.squashX = 1;
    this.squashY = 1;
    this.image = document.getElementById("player_icepop");
    // alt frame is optional — falls back to main if missing so the game still draws
    this.imageAlt = document.getElementById("player_icepop_alt") || this.image;
  }
  draw() {
    const ctx = this.game.ctx;
    const cx = this.x + this.width * 0.5;
    const cy = this.y + this.height * 0.5;
    // tilt toward direction of travel, clamped so it never goes vertical
    const maxRot = 0.6; // ~34deg
    const angle = Math.max(-maxRot, Math.min(maxRot, this.speedY * 0.06));
    // alt frame while rising (just flapped), default while falling
    const frame = this.speedY < 0 ? this.imageAlt : this.image;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);
    ctx.scale(this.squashX, this.squashY);
    ctx.drawImage(
      frame,
      -this.width * 0.5,
      -this.height * 0.5,
      this.width,
      this.height
    );
    ctx.restore();
  }
  update() {
    this.y += this.speedY;
    this.collisionX = this.x + this.width * 0.5 - 20;
    this.collisionY = this.y + this.height * 0.5;
    if (!this.isTouchingBottom()) {
      this.speedY += this.game.gravity;
    }
    if (this.isTouchingBottom()) {
      this.y = this.game.height - this.height;
    }
    // ease squash back to neutral
    this.squashX += (1 - this.squashX) * 0.2;
    this.squashY += (1 - this.squashY) * 0.2;
  }
  resize() {
    this.width = this.spriteWidth * this.game.ratio;
    this.height = this.spriteHeight * this.game.ratio;
    this.y = this.game.height * 0.5 - this.height * 0.5;
    this.speedY = -8 * this.game.ratio;
    this.moveSpeed = 5 * this.game.ratio;
    // tighter than the visible sprite so near-misses feel like skill
    this.collisionRadius = 55 * this.game.ratio;
    this.collisionX = this.x + this.width * 0.5 - 20;
    this.contact = false;
    this.squashX = 1;
    this.squashY = 1;
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
      this.game.sound.playMove();
      // pinch on flap, eases back in update()
      this.squashX = 0.85;
      this.squashY = 1.15;
    }
    if (!this.game.gameStart) {
      this.game.gameStart = true;
    }
  }
}
