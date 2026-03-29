
(() => {
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  }

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  const canvas = document.getElementById('infinity-bg');
  if (!canvas) return;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;
  const ctx = canvas.getContext('2d', { alpha: true });

  let dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  let w = 0, h = 0, t = 0;

  const palette = {
    gold: [212,175,55],
    white: [255,250,240],
    violet: [108,92,231]
  };

  const orbs = Array.from({ length: 6 }, (_, i) => ({
    x: Math.random(),
    y: Math.random(),
    r: 0.14 + Math.random() * 0.18,
    drift: .1 + Math.random() * .35,
    speed: .08 + Math.random() * .11,
    phase: Math.random() * Math.PI * 2
  }));

  const stars = Array.from({ length: 140 }, () => ({
    x: Math.random(),
    y: Math.random(),
    a: .1 + Math.random() * .55,
    s: .4 + Math.random() * 1.4
  }));

  function fit(){
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    w = Math.floor(window.innerWidth * dpr);
    h = Math.floor(window.innerHeight * dpr);
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = window.innerWidth + 'px';
    canvas.style.height = window.innerHeight + 'px';
  }
  fit();
  window.addEventListener('resize', fit);

  function glow(x, y, radius, color, alpha){
    const g = ctx.createRadialGradient(x, y, 0, x, y, radius);
    g.addColorStop(0, `rgba(${color[0]},${color[1]},${color[2]},${alpha})`);
    g.addColorStop(.45, `rgba(${color[0]},${color[1]},${color[2]},${alpha * .2})`);
    g.addColorStop(1, `rgba(${color[0]},${color[1]},${color[2]},0)`);
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
  }

  function ribbon(seed, amp, width, alpha, color){
    ctx.beginPath();
    const yMid = h * (.24 + seed * .12);
    for(let x=0; x<=w; x+=8){
      const nx = x / w;
      const y = yMid
        + Math.sin(nx * 11 + t * (.35 + seed*.1)) * (h * amp)
        + Math.sin(nx * 23 - t * (.22 + seed*.07) + seed * 7) * (h * amp * .28);
      if(x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.lineWidth = width;
    ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},${alpha})`;
    ctx.stroke();
  }

  function ring(cx, cy, radius, stroke, alpha){
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(Math.sin(t * .17) * .15);
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(${palette.gold[0]},${palette.gold[1]},${palette.gold[2]},${alpha})`;
    ctx.lineWidth = stroke;
    ctx.stroke();
    ctx.restore();
  }

  function draw(now){
    t = now * 0.001;
    ctx.clearRect(0,0,w,h);

    const bg = ctx.createLinearGradient(0,0,0,h);
    bg.addColorStop(0,'rgba(4,4,6,.08)');
    bg.addColorStop(.5,'rgba(4,4,6,.02)');
    bg.addColorStop(1,'rgba(4,4,6,.15)');
    ctx.fillStyle = bg;
    ctx.fillRect(0,0,w,h);

    stars.forEach(star => {
      const tw = star.a + Math.sin(t * star.s + star.x * 40) * 0.15;
      ctx.fillStyle = `rgba(255,248,230,${Math.max(.03, tw)})`;
      ctx.fillRect(star.x * w, star.y * h, 1.2 * dpr, 1.2 * dpr);
    });

    ribbon(.2, .028, 1.2 * dpr, .11, palette.white);
    ribbon(.45, .042, 2.0 * dpr, .09, palette.violet);
    ribbon(.68, .035, 1.7 * dpr, .11, palette.gold);

    orbs.forEach((orb, i) => {
      const x = (orb.x + Math.sin(t * orb.speed + orb.phase) * orb.drift) * w;
      const y = (orb.y + Math.cos(t * (orb.speed * .8) + orb.phase) * orb.drift * .5) * h;
      glow(x, y, Math.min(w, h) * orb.r, i % 2 ? palette.gold : palette.violet, .045);
    });

    const cx = w * .78;
    const cy = h * .22;
    glow(cx, cy, Math.min(w,h) * .18, palette.white, .08);
    ring(cx, cy, Math.min(w,h) * .12, 1.1 * dpr, .22);
    ring(cx, cy, Math.min(w,h) * .16, .7 * dpr, .14);

    const cx2 = w * .18;
    const cy2 = h * .72;
    glow(cx2, cy2, Math.min(w,h) * .12, palette.gold, .05);

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
})();
