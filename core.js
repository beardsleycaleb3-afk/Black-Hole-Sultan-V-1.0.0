// core.js
(() => {
  const canvas = document.getElementById('viewportCanvas');
  const ctx = canvas.getContext('2d');
  const countDisplay = document.getElementById('particleCount');
  let particles = [];
  let running = false;

  function spawnParticles(n = 100) {
    const arr = [];
    for (let i = 0; i < n; i++) {
      arr.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        r: 2 + Math.random() * 2
      });
    }
    return arr;
  }

  function update() {
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
    });
  }

  function draw() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0f0';
    particles.forEach(p => ctx.fillRect(p.x, p.y, p.r, p.r));
  }

  function loop() {
    if (!running) return;
    update();
    draw();
    countDisplay.textContent = particles.length;
    requestAnimationFrame(loop);
  }

  async function start() {
    if (running) return;
    running = true;
    particles = spawnParticles(120);
    console.log('Simulation started with', particles.length, 'particles.');
    loop();
  }

  window.BHS = { start };
})();
