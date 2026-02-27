//  Black Hole Sultan Core Engine V 1.0.0
//  © Caleb Beardsley 2026 • All Rights Reserved

class BHSCore {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.audioCtx = null;
    this.masterGain = null;
    this.reverb = null;
    this.particles = [];
    this.spawnRate = 2.5;         // particles per second
    this.lastSpawn = 0;
    this.mass = 0;
    this.active = false;
    this.metrics = { fps: 0, avg: 0, tps: 0, count: 0 };
    this._fpsTime = 0;
  }

  // ♦ System Initialization
  async initAudio() {
    if (!this.audioCtx)
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (this.audioCtx.state === 'suspended') await this.audioCtx.resume();
    this.masterGain = this.audioCtx.createGain();
    this.masterGain.gain.value = 0.5;
    this.masterGain.connect(this.audioCtx.destination);
    this.reverb = this.audioCtx.createConvolver();
    this.reverb.buffer = this._makeImpulse();
    this.reverb.connect(this.masterGain);
  }

  _makeImpulse() {
    const len = (this.audioCtx.sampleRate * 3) | 0;
    const buf = this.audioCtx.createBuffer(2, len, this.audioCtx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len) ** 3;
    }
    return buf;
  }

  // ♦ Control API
  async start() {
    await this.initAudio();
    this.active = true;
    this.lastSpawn = performance.now();
    requestAnimationFrame(this.update.bind(this));
  }

  stop() { this.active = false; }

  reset() {
    this.particles.length = 0;
    this.mass = 0;
    this.metrics = { fps: 0, avg: 0, tps: 0, count: 0 };
    this._fpsTime = performance.now();
  }

  // ♦ Particle and Audio Generation
  _spawnParticle() {
    if (this.particles.length > 5000000) return;
    this.particles.push({
      a: Math.random() * 6.283,
      r: 195,
      v: 0.02 + Math.random() * 0.01,
      c: `hsl(${Math.random() * 360},90%,60%)`
    });
    this._playNote();
  }

  _playNote() {
    const a = this.audioCtx;
    const o = a.createOscillator(), g = a.createGain();
    o.type = 'triangle';
    o.frequency.setValueAtTime(220 + Math.random() * 660, a.currentTime);
    g.gain.setValueAtTime(0.2, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 1.5);
    o.connect(g); g.connect(this.reverb); g.connect(this.masterGain);
    o.start(); o.stop(a.currentTime + 1.6);
  }

  // ♦ Frame Update
  update(ts) {
    if (!this.active) return;

    const dt = ts - this._fpsTime;
    this.metrics.fps = 1000 / dt;
    this.metrics.avg = (this.metrics.avg * 0.95) + (this.metrics.fps * 0.05);
    this._fpsTime = ts;

    // spawn new particles
    if (ts - this.lastSpawn > 1000 / this.spawnRate) {
      this._spawnParticle();
      this.lastSpawn = ts;
    }

    // update existing particles
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#0f0';
    ctx.fillStyle = '#0f0';

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.r -= 0.5;
      p.a += p.v;
      const x = 200 + Math.cos(p.a) * p.r;
      const y = 200 + Math.sin(p.a) * p.r * 0.5;

      if (p.r < 10) { this.particles.splice(i, 1); this.mass++; continue; }

      ctx.beginPath();
      ctx.arc(x, y, 2, 0, 6.283);
      ctx.fillStyle = p.c;
      ctx.fill();
    }

    this.metrics.count = this.particles.length;
    this.metrics.tps = Math.round(this.particles.length * this.metrics.fps);
    requestAnimationFrame(this.update.bind(this));
  }

  // ♦ Metrics Access
  exportMetrics() { return this.metrics; }
}

// expose to window for HUD module
window.BHS = new BHSCore(document.getElementById('viewportCanvas'));
