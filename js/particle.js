class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    const angle = Math.random() * Math.PI * 2;
    const speed = 1 + Math.random() * 3;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.gravity = 0.08;
    this.life = 1;
    this.size = 3 + Math.random() * 3;
    // icy blue/cyan palette
    this.color = `hsl(${190 + Math.random() * 40}, 90%, 70%)`;
  }
  update(deltaTime) {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    // ~500ms lifetime at 60fps
    this.life -= deltaTime * 0.002;
  }
  draw(ctx) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}
