(function () {
  const canvas = document.getElementById('starfield');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [], shooters = [];

  function resize() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    initStars();
  }

  function initStars() {
    stars = [];
    const count = Math.floor((canvas.width * canvas.height) / 2500);
    for (let i = 0; i < count; i++) {
      stars.push({
        x:       Math.random() * canvas.width,
        y:       Math.random() * canvas.height,
        size:    Math.pow(Math.random(), 2) * 3 + 0.3,
        speedX:  -(Math.random() * 0.5 + 0.08),
        speedY:  (Math.random() - 0.5) * 0.12,
        opacity: Math.random() * 0.85 + 0.15,
        phase:   Math.random() * Math.PI * 2,
        freq:    Math.random() * 2 + 0.8,
        gold:    Math.random() < 0.15
      });
    }
  }

  function spawnShooter() {
    const angle = (Math.PI / 5) + (Math.random() - 0.5) * 0.4;
    shooters.push({
      x:       Math.random() * canvas.width * 0.7,
      y:       Math.random() * canvas.height * 0.4,
      vx:      Math.cos(angle) * (10 + Math.random() * 8),
      vy:      Math.sin(angle) * (10 + Math.random() * 8),
      len:     120 + Math.random() * 100,
      life:    1,
      width:   1 + Math.random() * 1.5
    });
  }

  function drawShooter(s) {
    const tx = s.x - s.vx / Math.hypot(s.vx, s.vy) * s.len;
    const ty = s.y - s.vy / Math.hypot(s.vx, s.vy) * s.len;
    const g = ctx.createLinearGradient(tx, ty, s.x, s.y);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(0.7, `rgba(255,250,220,${s.life * 0.6})`);
    g.addColorStop(1, `rgba(255,255,255,${s.life})`);
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(s.x, s.y);
    ctx.strokeStyle = g;
    ctx.lineWidth = s.width;
    ctx.stroke();
    // head glow
    const hg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.width * 5);
    hg.addColorStop(0, `rgba(255,250,200,${s.life})`);
    hg.addColorStop(1, 'rgba(255,250,200,0)');
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.width * 5, 0, Math.PI * 2);
    ctx.fillStyle = hg;
    ctx.fill();
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const t = Date.now() / 1000;

    stars.forEach(s => {
      const a = s.opacity * (0.55 + 0.45 * Math.sin(t * s.freq + s.phase));
      // glow for bigger stars
      if (s.size > 1.2) {
        const r = s.size * 4;
        const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, r);
        const c = s.gold ? `212,160,26` : `255,255,255`;
        grd.addColorStop(0, `rgba(${c},${a * 0.5})`);
        grd.addColorStop(1, `rgba(${c},0)`);
        ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fillStyle = grd; ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = s.gold ? `rgba(212,160,26,${a})` : `rgba(255,255,255,${a})`;
      ctx.fill();

      s.x += s.speedX;
      s.y += s.speedY;
      if (s.x < -4) { s.x = canvas.width + 4; s.y = Math.random() * canvas.height; }
      if (s.y < -4) s.y = canvas.height + 4;
      if (s.y > canvas.height + 4) s.y = -4;
    });

    shooters = shooters.filter(s => s.life > 0.02);
    shooters.forEach(s => {
      drawShooter(s);
      s.x += s.vx; s.y += s.vy;
      s.life -= 0.022;
    });

    requestAnimationFrame(draw);
  }

  // 流れ星：2〜4秒ごとにランダム発射
  function scheduleShooter() {
    spawnShooter();
    if (Math.random() < 0.35) setTimeout(spawnShooter, 180);
    setTimeout(scheduleShooter, 2000 + Math.random() * 2500);
  }
  setTimeout(scheduleShooter, 1200);

  window.addEventListener('resize', resize);
  resize();
  draw();
})();
