class Game {
  constructor(canvas, context) {
    this.canvas = canvas;
    this.ctx = context;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.baseHeight = 720;
    this.ratio = this.height / this.baseHeight;
    this.background = new Background(this);
    this.player = new Player(this);
    this.sound = new SoundControl();
    this.obstacles = [];
    this.particles = [];
    this.numberOfObstacles = 11;
    this.gravity = 0;
    this.speed = 0;
    this.score = 0;
    this.gameStart = false;
    this.gameOver = false;
    this.timer = 0;
    this.shake = 0;
    this.message1 = "";
    this.message2 = "";
    this.message3 = "";

    this.resize(window.innerWidth, window.innerHeight);
    this.init();

    window.addEventListener("resize", (e) => {
      this.resize(e.currentTarget.innerWidth, e.currentTarget.innerHeight);
    });
    this.canvas.addEventListener("mousedown", () => this.player.move());
    this.canvas.addEventListener("touchstart", () => this.player.move());
    window.addEventListener("keydown", (e) => {
      const isMoveKey =
        e.code === "Space" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "w" ||
        e.key === "s";
      if (isMoveKey) {
        this.player.move();
      } else if ((e.key === "r" || e.key === "R") && this.gameOver) {
        this.restartGame();
      }
    });
  }
  init() {
    this.gameStart = false;
    this.gameOver = false;
    this.timer = 0;
    this.score = 0;
    this.shake = 0;
    this.particles = [];
    this.createObstacles();
  }
  restartGame() {
    this.player.resize();
    this.init();
  }
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.font = "35px Poppins";
    this.ctx.textAlign = "right";
    this.ctx.lineWidth = 3;
    this.ctx.strokeStyle = "white";
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.ratio = this.height / this.baseHeight;

    this.gravity = 0.15 * this.ratio;
    this.speed = 2 * this.ratio;
    this.background.resize();
    this.player.resize();
    this.obstacles.forEach((o) => o.resize());
  }
  spawnParticles(x, y, count = 6) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y));
    }
  }
  render(deltaTime) {
    if (!this.gameOver) this.timer += deltaTime;

    // gameplay layer — shakeable
    this.ctx.save();
    if (this.shake > 0) {
      const sx = (Math.random() - 0.5) * this.shake;
      const sy = (Math.random() - 0.5) * this.shake;
      this.ctx.translate(sx, sy);
      this.shake *= 0.85;
      if (this.shake < 0.5) this.shake = 0;
    }

    if (!this.gameStart) {
      this.background.draw();
      this.player.draw();
    } else {
      this.background.update();
      this.background.draw();
      this.player.update();
      this.player.draw();
      this.obstacles.forEach((obstacle) => {
        obstacle.update();
        obstacle.draw();
      });
      this.obstacles = this.obstacles.filter((o) => !o.markedForDeletion);

      this.particles.forEach((p) => p.update(deltaTime));
      this.particles.forEach((p) => p.draw(this.ctx));
      this.particles = this.particles.filter((p) => p.life > 0);

      if (!this.gameOver && this.obstacles.length <= 0) {
        this.gameOver = true;
        this.sound.winner.play();
      }
    }
    this.ctx.restore();

    // UI layer — steady, never shakes
    this.drawStatusText();
  }
  createObstacles() {
    this.obstacles = [];
    const firstX = this.baseHeight * this.ratio;
    const obstacleSpacing = 300 * this.ratio;
    for (let i = 0; i < this.numberOfObstacles; i++) {
      this.obstacles.push(new Obstacle(this, firstX + i * obstacleSpacing));
    }
  }
  detectHit(a, b) {
    const dx = a.collisionX - b.collisionX;
    const dy = a.collisionY - b.collisionY;
    const distance = Math.hypot(dx, dy);
    const sumOfRadii = a.collisionRadius + b.collisionRadius;
    return distance <= sumOfRadii;
  }
  formatTimer() {
    return (this.timer * 0.001).toFixed(1);
  }
  drawStatusText() {
    this.ctx.save();
    if (this.gameStart) {
      this.ctx.fillText("Score: " + this.score, this.width - 15, 40);
      this.ctx.textAlign = "left";
      this.ctx.fillText("Timer: " + this.formatTimer(), 10, 40);
    } else {
      this.message1 = "Tap to start";
      this.ctx.textAlign = "center";
      this.ctx.font = "bold 100px Poppins";
      this.ctx.fillStyle = "white";
      this.ctx.fillText(
        this.message1,
        this.width * 0.5,
        this.height * 0.5 - 40
      );
      this.message2 = "How to Play:";
      this.ctx.textAlign = "left";
      this.ctx.font = "60px Poppins";
      this.ctx.fillStyle = "white";
      this.ctx.fillText(this.message2, this.width * 0.65, this.height * 0.7);
      this.message3 = "SpaceBar Or Tap or Click to Move";
      this.ctx.textAlign = "left";
      this.ctx.font = "20px Poppins";
      this.ctx.fillStyle = "white";
      this.ctx.fillText(this.message3, this.width * 0.65, this.height * 0.8);
    }
    if (this.gameOver) {
      if (this.player.contact) {
        this.message1 = "Melted!";
        this.message2 = "Time survived " + this.formatTimer() + " seconds!";
      } else if (this.obstacles.length <= 0) {
        this.message1 = "Ice-Pops Forever";
        this.message2 = "Time survived " + this.formatTimer() + " seconds!";
      }
      this.ctx.textAlign = "center";
      this.ctx.font = "80px Poppins";
      this.ctx.fillText(
        this.message1,
        this.width * 0.5,
        this.height * 0.5 - 80
      );
      this.ctx.font = "45px Poppins";
      this.ctx.fillText(
        this.message2,
        this.width * 0.5,
        this.height * 0.5 - 45
      );
      this.ctx.fillText(
        "Press 'R' to restart!",
        this.width * 0.5,
        this.height * 0.5
      );
    }
    this.ctx.restore();
  }
}

window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 720;
  canvas.height = 720;

  const game = new Game(canvas, ctx);

  let previousTime = 0;
  function animate(timeStamp) {
    const deltaTime = timeStamp - previousTime;
    previousTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(deltaTime);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
});
