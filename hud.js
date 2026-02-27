// hud.js
(() => {
  const fpsReadout = document.getElementById('hudFPS');
  const themeName = document.getElementById('themeName');
  let lastFrame = performance.now();
  let frameCount = 0;

  function updateFPS() {
    const now = performance.now();
    frameCount++;
    if (now - lastFrame >= 1000) {
      fpsReadout.textContent = frameCount + ' FPS';
      frameCount = 0;
      lastFrame = now;
    }
    requestAnimationFrame(updateFPS);
  }

  function initHUD() {
    themeName.textContent = 'Nebula Standard v1.0';
    updateFPS();
  }

  window.addEventListener('load', initHUD);
})();
