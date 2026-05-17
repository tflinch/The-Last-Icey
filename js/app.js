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
    // target number of live obstacles on screen at once (endless spawn keeps refilling)
    this.numberOfObstacles = 6;
    this.obstacleSpacing = 300;
    this.baseSpeed = 0;
    this.gravity = 0;
    this.speed = 0;
    this.speedMultiplier = 1;
    this.score = 0;
    this.gameStart = false;
    this.gameOver = false;
    this.paused = false;
    this.timer = 0;
    this.shake = 0;
    this.combo = 0;
    this.lastNearMissTime = -10000;
    this.highScore = 0;
    this.highTime = 0;
    this.newBest = false;
    this.message1 = "";
    this.message2 = "";
    this.message3 = "";

    this.loadHighScore();
    this.resize(window.innerWidth, window.innerHeight);
    this.init();

    window.addEventListener("resize", (e) => {
      this.resize(e.currentTarget.innerWidth, e.currentTarget.innerHeight);
    });
    window.addEventListener("blur", () => {
      if (this.gameStart && !this.gameOver && !this.paused) {
        this.paused = true;
      }
    });
    this.canvas.addEventListener("mousedown", () => this.handleAction());
    this.canvas.addEventListener("touchstart", () => this.handleAction());
    window.addEventListener("keydown", (e) => {
      const isMoveKey =
        e.code === "Space" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown" ||
        e.key === "w" ||
        e.key === "s";
      if (e.key === "p" || e.key === "P") {
        if (this.gameStart && !this.gameOver) this.togglePause();
      } else if (isMoveKey) {
        this.handleAction();
      } else if ((e.key === "r" || e.key === "R") && this.gameOver) {
        this.restartGame();
      }
    });
  }
  handleAction() {
    // first interaction is the user gesture needed to start audio playback
    this.sound.ensureMusicPlaying();
    if (this.paused) {
      this.togglePause();
      return;
    }
    this.player.move();
  }
  togglePause() {
    this.paused = !this.paused;
    if (this.paused) {
      this.sound.pauseMusic();
    } else {
      this.sound.resumeMusic();
    }
  }
  init() {
    this.gameStart = false;
    this.gameOver = false;
    this.paused = false;
    this.timer = 0;
    this.score = 0;
    this.shake = 0;
    this.combo = 0;
    this.lastNearMissTime = -10000;
    this.newBest = false;
    this.particles = [];
    this.obstacles = [];
    this.spawnInitialObstacles();
  }
  registerNearMiss(obstacle) {
    this.combo++;
    this.lastNearMissTime = this.timer;
    // tiny sparkle at the player so feedback is unmistakable
    this.spawnParticles(
      this.player.collisionX,
      this.player.collisionY - 20,
      4
    );
    this.sound.playCombo(this.combo);
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
    this.baseSpeed = 2 * this.ratio;
    this.speed = this.baseSpeed;
    this.background.resize();
    this.player.resize();
    this.obstacles.forEach((o) => o.resize());
  }
  spawnInitialObstacles() {
    const firstX = this.baseHeight * this.ratio;
    for (let i = 0; i < this.numberOfObstacles; i++) {
      this.obstacles.push(
        new Obstacle(this, firstX + i * this.obstacleSpacing * this.ratio)
      );
    }
  }
  refillObstacles() {
    while (this.obstacles.length < this.numberOfObstacles) {
      let rightmost = this.width;
      for (const o of this.obstacles) {
        if (o.x > rightmost) rightmost = o.x;
      }
      this.obstacles.push(
        new Obstacle(this, rightmost + this.obstacleSpacing * this.ratio)
      );
    }
  }
  spawnParticles(x, y, count = 6) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y));
    }
  }
  endGame() {
    if (this.gameOver) return;
    this.gameOver = true;
    this.saveHighScore();
  }
  loadHighScore() {
    try {
      this.highScore = parseInt(
        localStorage.getItem("iceyHighScore") || "0",
        10
      );
      this.highTime = parseFloat(localStorage.getItem("iceyHighTime") || "0");
    } catch (e) {
      this.highScore = 0;
      this.highTime = 0;
    }
  }
  saveHighScore() {
    this.newBest = false;
    const time = parseFloat(this.formatTimer());
    try {
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem("iceyHighScore", String(this.score));
        this.newBest = true;
      }
      if (time > this.highTime) {
        this.highTime = time;
        localStorage.setItem("iceyHighTime", String(time));
        this.newBest = true;
      }
    } catch (e) {
      // localStorage may be blocked; high scores still display in-session
    }
    if (this.newBest) this.sound.playWinner();
  }
  applyDifficulty() {
    // smooth ramp: 1x at start, ~2x at 50s, capped at 3x
    this.speedMultiplier = Math.min(3, 1 + this.timer * 0.00002);
    this.speed = this.baseSpeed * this.speedMultiplier;
  }
  render(deltaTime) {
    if (!this.gameOver && !this.paused) this.timer += deltaTime;
    if (!this.paused) this.applyDifficulty();

    // gameplay layer — shakeable
    this.ctx.save();
    if (this.shake > 0) {
      const sx = (Math.random() - 0.5) * this.shake;
      const sy = (Math.random() - 0.5) * this.shake;
      this.ctx.translate(sx, sy);
      if (!this.paused) {
        this.shake *= 0.85;
        if (this.shake < 0.5) this.shake = 0;
      }
    }

    if (!this.gameStart) {
      this.background.draw();
      this.player.draw();
    } else {
      if (!this.paused) {
        this.background.update();
        this.player.update();
        this.obstacles.forEach((o) => o.update());
        this.obstacles = this.obstacles.filter((o) => !o.markedForDeletion);
        if (!this.gameOver) this.refillObstacles();
        this.particles.forEach((p) => p.update(deltaTime));
        this.particles = this.particles.filter((p) => p.life > 0);
      }
      this.background.draw();
      this.player.draw();
      this.obstacles.forEach((o) => o.draw());
      this.particles.forEach((p) => p.draw(this.ctx));
    }
    this.ctx.restore();

    // day/night tint — fades from clear to deep blue as the timer climbs
    if (this.gameStart) {
      const dayProgress = Math.min(1, this.timer / 60000);
      if (dayProgress > 0) {
        this.ctx.save();
        this.ctx.fillStyle = `rgba(10, 25, 70, ${dayProgress * 0.45})`;
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.restore();
      }
    }

    // UI layer — steady, never shakes
    this.drawStatusText();
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
  drawPanel(y, h) {
    const w = Math.min(640, this.width * 0.85);
    const x = (this.width - w) * 0.5;
    this.ctx.save();
    this.ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
    this.ctx.fillRect(x, y, w, h);
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
    this.ctx.restore();
  }
  drawStatusText() {
    this.ctx.save();
    if (this.gameStart && !this.gameOver) {
      this.ctx.fillText("Score: " + this.score, this.width - 15, 40);
      this.ctx.textAlign = "left";
      this.ctx.fillText("Timer: " + this.formatTimer(), 10, 40);
      this.ctx.save();
      this.ctx.font = "22px Poppins";
      this.ctx.textAlign = "right";
      this.ctx.fillStyle =
        this.speedMultiplier >= 2.5
          ? "#ff6b6b"
          : this.speedMultiplier >= 1.8
          ? "#ffd84d"
          : "white";
      this.ctx.fillText(
        "Speed " + this.speedMultiplier.toFixed(1) + "x",
        this.width - 15,
        72
      );
      this.ctx.restore();
      const sinceMiss = this.timer - this.lastNearMissTime;
      if (this.combo > 1 && sinceMiss < 2000) {
        const fade = 1 - sinceMiss / 2000;
        this.ctx.save();
        this.ctx.textAlign = "center";
        this.ctx.fillStyle = `rgba(255, 216, 77, ${fade})`;
        this.ctx.font = "bold 40px Poppins";
        this.ctx.fillText(
          "Combo x" + this.combo + "!",
          this.width * 0.5,
          90
        );
        this.ctx.restore();
      }
    } else if (!this.gameStart) {
      this.drawPanel(this.height * 0.5 - 140, 260);
      this.ctx.textAlign = "center";
      this.ctx.font = "bold 100px Poppins";
      this.ctx.fillStyle = "white";
      this.ctx.fillText("Tap to start", this.width * 0.5, this.height * 0.5 - 40);

      if (this.highTime > 0) {
        this.ctx.font = "30px Poppins";
        this.ctx.fillText(
          "Best: " + this.highTime.toFixed(1) + "s  /  " + this.highScore + " dodged",
          this.width * 0.5,
          this.height * 0.5 + 30
        );
      }

      this.ctx.textAlign = "left";
      this.ctx.font = "60px Poppins";
      this.ctx.fillText("How to Play:", this.width * 0.65, this.height * 0.7);
      this.ctx.font = "20px Poppins";
      this.ctx.fillText(
        "SpaceBar Or Tap or Click to Move",
        this.width * 0.65,
        this.height * 0.8
      );
      this.ctx.fillText(
        "Press P to Pause",
        this.width * 0.65,
        this.height * 0.85
      );
    }
    if (this.gameOver) {
      this.drawPanel(this.height * 0.5 - 180, 290);
      this.ctx.textAlign = "center";
      this.ctx.font = "80px Poppins";
      this.ctx.fillStyle = "white";
      this.ctx.fillText("Melted!", this.width * 0.5, this.height * 0.5 - 100);

      this.ctx.font = "45px Poppins";
      this.ctx.fillText(
        "Time survived " + this.formatTimer() + "s  /  " + this.score + " dodged",
        this.width * 0.5,
        this.height * 0.5 - 45
      );

      this.ctx.font = "35px Poppins";
      if (this.combo > 1) {
        this.ctx.fillStyle = "#ffd84d";
        this.ctx.fillText(
          "Top combo: x" + this.combo,
          this.width * 0.5,
          this.height * 0.5 - 5
        );
        this.ctx.fillStyle = "white";
      }
      if (this.newBest) {
        this.ctx.fillStyle = "#ffd84d";
        this.ctx.fillText("NEW BEST!", this.width * 0.5, this.height * 0.5 + 30);
        this.ctx.fillStyle = "white";
      } else {
        this.ctx.fillText(
          "Best: " + this.highTime.toFixed(1) + "s",
          this.width * 0.5,
          this.height * 0.5 + 30
        );
      }

      this.ctx.font = "30px Poppins";
      this.ctx.fillText(
        "Press 'R' to restart!",
        this.width * 0.5,
        this.height * 0.5 + 80
      );
    }
    if (this.paused && !this.gameOver) {
      this.drawPanel(this.height * 0.5 - 70, 140);
      this.ctx.textAlign = "center";
      this.ctx.font = "bold 80px Poppins";
      this.ctx.fillStyle = "white";
      this.ctx.fillText("Paused", this.width * 0.5, this.height * 0.5);
      this.ctx.font = "25px Poppins";
      this.ctx.fillText(
        "Press P or click to resume",
        this.width * 0.5,
        this.height * 0.5 + 40
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
