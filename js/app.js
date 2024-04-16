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
    this.obstacles = [];
    this.numberOfObstacles = 1;
    this.gravity;
    this.speed;
    this.score;
    this.gameOver;
    this.timer;
    this.message1;
    this.message2;

    this.resize(window.innerWidth, window.innerHeight);

    window.addEventListener("resize", (e) => {
      this.resize(e.currentTarget.innerWidth, e.currentTarget.innerHeight);
    });
    // mouse controls
    this.canvas.addEventListener("mousedown", (e) => {
      this.player.move();
    });
    //keyboard controls
    window.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp" || e.key === "w") {
        this.player.move();
      } else if (e.key === "ArrowDown" || e.key === "s") {
        this.player.move();
      } else if (e.code === "Space") {
        this.player.move();
      }
    });
    // touch controls
    this.canvas.addEventListener("touchstart", (e) => {
      this.player.move();
    });
  }
  resize(width, height) {
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.fillStyle = "orange";
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
    this.createObstacles();
    this.obstacles.forEach((obstacle) => {
      obstacle.resize();
    });
    this.score = 0;
    this.gameOver = false;
    this.timer = 0;
  }
  render(deltaTime) {
    //console.log(deltaTime); avg refresh time 60 frames a second
    if (!this.gameOver) this.timer += deltaTime;
    this.background.update();
    this.background.draw();
    this.drawStatusText();
    this.player.update();
    this.player.draw();
    this.obstacles.forEach((obstacle) => {
      obstacle.update();
      obstacle.draw();
    });
  }
  createObstacles() {
    this.obstacles = [];
    const firstX = this.baseHeight * this.ratio;
    const obstacleSpacing = 600 * this.ratio;
    for (let i = 0; i < this.numberOfObstacles; i++) {
      this.obstacles.push(new Obstacle(this, firstX + i * obstacleSpacing));
    }
  }
  detectHit(a, b) {
    //distance between the two objects
    const dx = a.collisionX - b.collisionX;
    const dy = a.collisionY - b.collisionY;
    const distance = Math.hypot(dx, dy);
    const sumOfRadii = a.collisionRadius + b.collisionRadius;
    return distance <= sumOfRadii;
  }
  formatTimer() {
    //cleans up timer and removes two decemial points
    return (this.timer * 0.001).toFixed(1);
  }
  drawStatusText() {
    this.ctx.save();
    this.ctx.fillText("Score: " + this.score, this.width - 15, 40);
    this.ctx.textAlign = "left";
    this.ctx.fillText("Timer: " + this.formatTimer(), 10, 40);
    if (this.gameOver) {
      if (this.player.contact) {
        this.message1 = "Melted!";
        this.message2 = "Time survied " + this.formatTimer() + " seconds!";
      } else if (this.obstacles.length <= 0) {
        this.message1 = "Ice-Cream Forever";
        this.message2 = "Time survied " + this.formatTimer() + " seconds!";
      }
      this.ctx.textAlign = "center";
      this.ctx.font = "40px Poppins";
      this.ctx.fillText(
        this.message1,
        this.width * 0.5,
        this.height * 0.5 - 40
      );
      this.ctx.font = "15px Poppins";
      this.ctx.fillText(
        this.message2,
        this.width * 0.5,
        this.height * 0.5 - 20
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
    //deltaTime is the diffrence of previousTime and current frame
    const deltaTime = timeStamp - previousTime;
    previousTime = timeStamp;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.render(deltaTime);
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
});
