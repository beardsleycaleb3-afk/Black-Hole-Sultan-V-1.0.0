//  Black Hole Sultan HUD Module V 1.0.0
//  © Caleb Beardsley 2026  • All Rights Reserved

class BHSHud {
  constructor() {
    this.presets = [];
    this.currentTheme = 0;
    this.metrics = {fps:0,avg:0,tps:0,count:0};
    this.console = document.getElementById('consoleHUD');
    this.counter = document.getElementById('particleCount');
    this.themeName = document.getElementById('themeName');
    this.buttons = [];
    this.loadPresets();
    this._setupButtons();
    this._animate();
  }

  async loadPresets() {
    try {
      const res = await fetch('js/presets.json');
      const data = await res.json();
      this.presets = data.themes;
      this.applyTheme(0);
    } catch(e){ console.warn('Theme presets missing.',e); }
  }

  applyTheme(index){
    const p = this.presets[index];
    if(!p) return;
    document.documentElement.style.setProperty('--console-bg', p.console);
    document.documentElement.style.setProperty('--btn-bg', p.button);
    document.documentElement.style.setProperty('--btn-border', p.border);
    document.documentElement.style.setProperty('--text-color', p.text);
    document.documentElement.style.setProperty('--highlight', p.highlight);
    this.currentTheme = index;
    if(this.themeName) this.themeName.innerText = p.name;
  }

  _setupButtons(){
    const symbols = ['£','¢','€','¥','π','§','∆','™','®','©','%','@'];
    const area = document.getElementById('buttonPad');
    if(!area) return;
    symbols.forEach(s=>{
      let b = document.createElement('button');
      b.innerText = s;
      b.className = 'hudBtn';
      b.onclick = ()=>this._handleButton(s);
      area.appendChild(b);
      this.buttons.push(b);
    });
    const gear = document.getElementById('settingsBtn');
    if(gear) gear.onclick = ()=>this.cycleTheme();
  }

  _handleButton(symbol){
    // reserved for future expansion triggers like reset/spawn toggles
    if(symbol==='@') BHS.reset();
    if(symbol==='%') BHS.start();
  }

  cycleTheme(){
    let i = (this.currentTheme + 1) % this.presets.length;
    this.applyTheme(i);
  }

  _animate(){
    requestAnimationFrame(this._animate.bind(this));
    if(!BHS) return;
    this.metrics = BHS.exportMetrics();
    this._updateHUD();
  }

  _updateHUD(){
    if(!this.counter) return;
    this.counter.innerText = this.metrics.count.toLocaleString();
    document.getElementById('hudFPS').innerText =
      `${this.metrics.fps.toFixed(0)} fps / ${Math.round(this.metrics.avg)} avg`;
    document.getElementById('hudTPS').innerText =
      `${this.metrics.tps.toLocaleString()} TPS`;
  }
}

// launch HUD when DOM ready
window.addEventListener('DOMContentLoaded',()=>window.HUD = new BHSHud());
