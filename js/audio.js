class SoundControl {
  constructor() {
    this.winner = document.getElementById("victory");
    this.move = document.getElementById("jump");
    this.bgMusic = document.getElementById("bgMusic");
    // winner sound is loud; pull it back so it doesn't dominate the flap sfx
    this.winner.volume = 0.5;
    this.move.volume = 0.6;
    if (this.bgMusic) this.bgMusic.volume = 0.25;

    this.musicStarted = false;
    this.musicDisabled = false;

    this.muted = false;
    try {
      this.muted = localStorage.getItem("iceyMuted") === "1";
    } catch (e) {}
    this.applyMute();

    const btn = document.getElementById("muteBtn");
    if (btn) {
      this.updateButton(btn);
      btn.addEventListener("click", () => this.toggleMute());
    }
  }
  applyMute() {
    this.winner.muted = this.muted;
    this.move.muted = this.muted;
    if (this.bgMusic) this.bgMusic.muted = this.muted;
  }
  toggleMute() {
    this.muted = !this.muted;
    this.applyMute();
    try {
      localStorage.setItem("iceyMuted", this.muted ? "1" : "0");
    } catch (e) {}
    const btn = document.getElementById("muteBtn");
    if (btn) this.updateButton(btn);
  }
  updateButton(btn) {
    btn.textContent = this.muted ? "🔇 Muted" : "🔊 Sound";
    btn.setAttribute("aria-pressed", this.muted ? "true" : "false");
  }
  playMove() {
    if (this.muted) return;
    // slight pitch variation keeps the rapid retrigger from grating
    this.move.playbackRate = 0.9 + Math.random() * 0.2;
    this.move.currentTime = 0;
    this.move.play();
  }
  playWinner() {
    if (this.muted) return;
    this.winner.currentTime = 0;
    this.winner.play();
  }
  playCombo(comboLevel) {
    if (this.muted) return;
    // reuse the jump sound but pitched up — climbs with combo, capped so it stays musical
    this.move.playbackRate = Math.min(2.4, 1.3 + comboLevel * 0.08);
    this.move.currentTime = 0;
    this.move.play();
  }
  ensureMusicPlaying() {
    if (!this.bgMusic || this.musicStarted || this.musicDisabled) return;
    this.musicStarted = true;
    this.bgMusic.play().catch(() => {
      // missing file, blocked by autoplay policy, or codec unsupported — give up quietly
      this.musicStarted = false;
      this.musicDisabled = true;
    });
  }
  pauseMusic() {
    if (this.bgMusic && this.musicStarted) this.bgMusic.pause();
  }
  resumeMusic() {
    if (this.bgMusic && this.musicStarted) {
      this.bgMusic.play().catch(() => {});
    }
  }
}
