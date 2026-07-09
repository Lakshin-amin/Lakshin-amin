window.addEventListener('load', () => {

  /* ── 1. LOCOMOTIVE SCROLL ── */
  const locoScroll = new LocomotiveScroll({
    el: document.querySelector('[data-scroll-container]'),
    smooth: true,
    multiplier: 0.9,
    lerp: 0.07,
  });

  gsap.registerPlugin(ScrollTrigger);
  locoScroll.on('scroll', ScrollTrigger.update);

  ScrollTrigger.scrollerProxy('[data-scroll-container]', {
    scrollTop(value) {
      return arguments.length
        ? locoScroll.scrollTo(value, { duration: 0, disableLerp: true })
        : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    pinType: document.querySelector('[data-scroll-container]').style.transform
      ? 'transform' : 'fixed',
  });

  ScrollTrigger.addEventListener('refresh', () => locoScroll.update());
  ScrollTrigger.refresh();

  /* ── NAV SMOOTH LINKS — fix anchor clicks with Locomotive ── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        locoScroll.scrollTo(target);
      }
    });
  });


  /* ── 2. THREE.JS — HERO PARTICLE NETWORK ──
     FIX: Reuse a single LineSegments instead of creating/destroying hundreds
          of THREE.Line objects every 8 frames (was the primary crash cause).
  ── */
  const heroCanvas = document.getElementById('three-canvas');
  if (heroCanvas && window.THREE) {
    const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(heroCanvas.offsetWidth, heroCanvas.offsetHeight);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, heroCanvas.offsetWidth / heroCanvas.offsetHeight, 0.1, 1000);
    camera.position.z = 80;

    const PARTICLE_COUNT = 100;
    const positions  = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      positions[i*3]   = (Math.random() - 0.5) * 160;
      positions[i*3+1] = (Math.random() - 0.5) * 100;
      positions[i*3+2] = (Math.random() - 0.5) * 60;
      velocities[i*3]   = (Math.random() - 0.5) * 0.06;
      velocities[i*3+1] = (Math.random() - 0.5) * 0.06;
      velocities[i*3+2] = (Math.random() - 0.5) * 0.03;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMat  = new THREE.PointsMaterial({ color: 0x00ff9d, size: 0.8, transparent: true, opacity: 0.7 });
    const particleMesh = new THREE.Points(particleGeo, particleMat);
    scene.add(particleMesh);

    // Pre-allocate single LineSegments — never create/destroy geometry per frame
    const MAX_LINES     = PARTICLE_COUNT * 4;
    const linePositions = new Float32Array(MAX_LINES * 6);
    const lineGeo       = new THREE.BufferGeometry();
    const linePosAttr   = new THREE.BufferAttribute(linePositions, 3);
    linePosAttr.setUsage(THREE.DynamicDrawUsage);
    lineGeo.setAttribute('position', linePosAttr);
    lineGeo.setDrawRange(0, 0);
    const lineMat  = new THREE.LineBasicMaterial({ color: 0x00ff9d, transparent: true, opacity: 0.08 });
    const lineSegs = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineSegs);

    const MAX_DIST_SQ = 18 * 18;

    function rebuildLines() {
      const pos = particleGeo.attributes.position.array;
      let lineIdx = 0;
      for (let i = 0; i < PARTICLE_COUNT && lineIdx < MAX_LINES; i++) {
        for (let j = i + 1; j < PARTICLE_COUNT && lineIdx < MAX_LINES; j++) {
          const dx = pos[i*3] - pos[j*3];
          const dy = pos[i*3+1] - pos[j*3+1];
          const dz = pos[i*3+2] - pos[j*3+2];
          if (dx*dx + dy*dy + dz*dz < MAX_DIST_SQ) {
            const b = lineIdx * 6;
            linePositions[b]   = pos[i*3];   linePositions[b+1] = pos[i*3+1]; linePositions[b+2] = pos[i*3+2];
            linePositions[b+3] = pos[j*3];   linePositions[b+4] = pos[j*3+1]; linePositions[b+5] = pos[j*3+2];
            lineIdx++;
          }
        }
      }
      linePosAttr.needsUpdate = true;
      lineGeo.setDrawRange(0, lineIdx * 2);
    }

    let mouseX = 0, mouseY = 0;
    document.addEventListener('mousemove', e => {
      mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Pause Three.js when hero is off-screen
    let threeVisible = true;
    const heroObs = new IntersectionObserver(entries => { threeVisible = entries[0].isIntersecting; }, { threshold: 0.01 });
    heroObs.observe(document.getElementById('hero'));

    let frameCount = 0;
    function animateThree() {
      requestAnimationFrame(animateThree);
      if (!threeVisible) return;
      frameCount++;
      const pos = particleGeo.attributes.position.array;
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        pos[i*3]   += velocities[i*3];
        pos[i*3+1] += velocities[i*3+1];
        pos[i*3+2] += velocities[i*3+2];
        if (Math.abs(pos[i*3])   > 80) velocities[i*3]   *= -1;
        if (Math.abs(pos[i*3+1]) > 50) velocities[i*3+1] *= -1;
        if (Math.abs(pos[i*3+2]) > 30) velocities[i*3+2] *= -1;
      }
      particleGeo.attributes.position.needsUpdate = true;
      if (frameCount % 12 === 0) rebuildLines();
      camera.position.x += (mouseX * 12 - camera.position.x) * 0.03;
      camera.position.y += (-mouseY * 8  - camera.position.y) * 0.03;
      camera.lookAt(scene.position);
      particleMesh.rotation.y += 0.0008;
      lineSegs.rotation.y     += 0.0008;
      renderer.render(scene, camera);
    }
    animateThree();

    window.addEventListener('resize', () => {
      const w = heroCanvas.offsetWidth, h = heroCanvas.offsetHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }


  /* ── 3. TYPED.JS ── */
  if (window.Typed && document.getElementById('typed-output')) {
    new Typed('#typed-output', {
      strings: ['whoami --verbose','ls ./skills/','ping nexus-systems.io','nmap -sV 192.168.0.0/24','ssh ghost@void.dev','cat /etc/shadow','exploit --target core.sys'],
      typeSpeed: 55, backSpeed: 28, backDelay: 1800, loop: true, showCursor: false,
    });
  }


  /* ── 4. GSAP PAGE LOAD ── */
  gsap.timeline({ defaults: { ease: 'power3.out' } })
    .fromTo('nav',            { y: -60, opacity: 0 }, { y: 0,  opacity: 1, duration: 0.8 })
    .fromTo('.profile-wrap',  { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(1.4)' }, '-=0.3')
    .fromTo('.hero-tag',      { x: -30, opacity: 0 }, { x: 0,  opacity: 1, duration: 0.6 }, '-=0.5')
    .fromTo('.hero-name',     { y: 60,  opacity: 0, skewY: 4 }, { y: 0, opacity: 1, skewY: 0, duration: 0.9 }, '-=0.3')
    .fromTo('.hero-role',     { y: 30,  opacity: 0 }, { y: 0,  opacity: 1, duration: 0.6 }, '-=0.4')
    .fromTo('.hero-desc',     { y: 20,  opacity: 0 }, { y: 0,  opacity: 1, duration: 0.6 }, '-=0.3')
    .fromTo('.hero-btns',     { y: 20,  opacity: 0 }, { y: 0,  opacity: 1, duration: 0.6 }, '-=0.3')
    .fromTo('.terminal-card', { x: 60,  opacity: 0 }, { x: 0,  opacity: 1, duration: 0.9 }, '-=0.7');


  /* ── 5. GSAP SCROLL ANIMATIONS ── */
  const scroller = '[data-scroll-container]';

  document.querySelectorAll('.stat-num').forEach(el => {
    const target = parseFloat(el.dataset.value);
    const suffix = el.dataset.suffix || '';
    gsap.fromTo(el, { opacity: 0, y: 30 }, {
      opacity: 1, y: 0, duration: 0.8,
      scrollTrigger: { trigger: el, scroller, start: 'top 85%' },
      onStart() {
        gsap.to({ val: 0 }, {
          val: target, duration: 1.6, ease: 'power2.out',
          onUpdate() { el.innerHTML = Math.round(this.targets()[0].val) + `<span>${suffix}</span>`; },
        });
      },
    });
  });

  gsap.fromTo('.skill-block', { y: 50, opacity: 0 },
    { y: 0, opacity: 1, stagger: 0.1, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: '.skills-grid', scroller, start: 'top 80%' } });

  document.querySelectorAll('.skill-bar').forEach(bar => {
    const tw = bar.style.width;
    bar.style.width = '0%';
    ScrollTrigger.create({
      trigger: bar, scroller, start: 'top 85%',
      onEnter: () => gsap.to(bar, { width: tw, duration: 1.4, ease: 'power3.out', delay: 0.2 }),
    });
  });

  gsap.fromTo('.project-card', { y: 60, opacity: 0 },
    { y: 0, opacity: 1, stagger: 0.12, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: '.projects-grid', scroller, start: 'top 80%' } });

  gsap.fromTo('.exp-item', { x: -40, opacity: 0 },
    { x: 0, opacity: 1, stagger: 0.15, duration: 0.8, ease: 'power2.out',
      scrollTrigger: { trigger: '.exp-list', scroller, start: 'top 80%' } });

  gsap.fromTo('.contact-headline', { y: 50, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.9, scrollTrigger: { trigger: '.contact-headline', scroller, start: 'top 85%' } });

  gsap.fromTo('.contact-link', { x: -30, opacity: 0 },
    { x: 0, opacity: 1, stagger: 0.08, duration: 0.6,
      scrollTrigger: { trigger: '.contact-links', scroller, start: 'top 85%' } });

  gsap.fromTo('.status-panel', { x: 40, opacity: 0 },
    { x: 0, opacity: 1, duration: 0.8, scrollTrigger: { trigger: '.status-panel', scroller, start: 'top 85%' } });

  document.querySelectorAll('.section-title').forEach(el => {
    gsap.fromTo(el, { y: 40, opacity: 0, clipPath: 'inset(100% 0 0 0)' },
      { y: 0, opacity: 1, clipPath: 'inset(0% 0 0 0)', duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, scroller, start: 'top 88%' } });
  });


  /* ── 6. CARD TILT ── */
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 14;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 14;
      gsap.to(card, { rotateY: x, rotateX: -y, transformPerspective: 800, duration: 0.4, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateY: 0, rotateX: 0, duration: 0.6, ease: 'elastic.out(1,0.5)' });
    });
  });


  /* ── 7. CURSOR ── */
  const cursor = document.getElementById('cursor');
  const ring   = document.getElementById('cursor-ring');
  document.addEventListener('mousemove', e => {
    gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.05 });
    gsap.to(ring,   { x: e.clientX, y: e.clientY, duration: 0.18, ease: 'power2.out' });
  });
  document.querySelectorAll('a, button, .skill-block, .project-card').forEach(el => {
    el.addEventListener('mouseenter', () => { gsap.to(ring, { scale: 2, opacity: 0.6, duration: 0.3 }); gsap.to(cursor, { scale: 0.4, duration: 0.3 }); });
    el.addEventListener('mouseleave', () => { gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3 }); gsap.to(cursor, { scale: 1, duration: 0.3 }); });
  });


  /* ── 8. CANVAS PREVIEW — pauses when off-screen ── */
  const previewCanvas = document.getElementById('preview-canvas');
  if (previewCanvas) {
    const ctx = previewCanvas.getContext('2d');
    let nodes = [], edges = [], tick = 0, previewVisible = false, rafId = null;

    function resizePreview() {
      previewCanvas.width  = previewCanvas.offsetWidth;
      previewCanvas.height = previewCanvas.offsetHeight;
      buildNodes();
    }
    function buildNodes() {
      nodes = []; edges = [];
      const W = previewCanvas.width, H = previewCanvas.height;
      for (let i = 0; i < 10; i++) {
        nodes.push({ x: 30+Math.random()*(W-60), y: 20+Math.random()*(H-40),
          vx: (Math.random()-0.5)*0.35, vy: (Math.random()-0.5)*0.35,
          r: 3+Math.random()*3, state: Math.random()>0.55?'breached':Math.random()>0.4?'active':'locked',
          pulse: Math.random()*Math.PI*2 });
      }
      for (let i = 1; i < 10; i++) edges.push({a:i-1,b:i});
      edges.push({a:0,b:9}); edges.push({a:1,b:7});
    }
    function drawPreview() {
      if (!previewVisible) { rafId = null; return; }
      rafId = requestAnimationFrame(drawPreview);
      ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
      tick += 0.02;
      const W = previewCanvas.width, H = previewCanvas.height;
      edges.forEach(e => {
        const a = nodes[e.a], b = nodes[e.b];
        ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y);
        ctx.strokeStyle = a.state==='breached'?'rgba(0,255,157,0.18)':'rgba(255,255,255,0.04)';
        ctx.lineWidth = 0.5; ctx.stroke();
      });
      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        if (n.x<10||n.x>W-10) n.vx*=-1;
        if (n.y<10||n.y>H-10) n.vy*=-1;
        n.pulse += 0.04;
        const glow = Math.sin(n.pulse)*0.5+0.5;
        const col = n.state==='breached'?`rgba(0,255,157,${0.6+glow*0.4})`:n.state==='active'?`rgba(0,207,255,${0.4+glow*0.3})`:`rgba(26,48,64,0.8)`;
        if (n.state==='breached') {
          ctx.beginPath(); ctx.arc(n.x,n.y,n.r*2+glow*5,0,Math.PI*2);
          ctx.fillStyle=`rgba(0,255,157,${glow*0.07})`; ctx.fill();
        }
        ctx.beginPath(); ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
        ctx.fillStyle=col;
        ctx.strokeStyle=n.state==='breached'?'rgba(0,255,157,0.7)':n.state==='active'?'rgba(0,207,255,0.4)':'rgba(26,48,64,1)';
        ctx.lineWidth=1; ctx.fill(); ctx.stroke();
      });
      const t=tick*0.3%1, e=edges[Math.floor(tick*0.5)%edges.length];
      const a=nodes[e.a], b=nodes[e.b];
      ctx.beginPath(); ctx.arc(a.x+(b.x-a.x)*t, a.y+(b.y-a.y)*t, 2.5, 0, Math.PI*2);
      ctx.fillStyle='rgba(0,255,157,0.9)'; ctx.fill();
    }
    const canvasObs = new IntersectionObserver(entries => {
      previewVisible = entries[0].isIntersecting;
      if (previewVisible && !rafId) drawPreview();
    }, { threshold: 0.01 });
    canvasObs.observe(previewCanvas);
    window.addEventListener('resize', resizePreview);
    resizePreview();
  }


  /* ── 9. NAV ACTIVE LINKS ── */
  const sectionIds = ['hero','skills','projects','experience','contact'];
  const navLinks   = document.querySelectorAll('.nav-links a');
  sectionIds.forEach((id, i) => {
    ScrollTrigger.create({
      trigger: `#${id}`, scroller,
      start: 'top center', end: 'bottom center',
      onEnter:     () => setActive(i),
      onEnterBack: () => setActive(i),
    });
  });
  function setActive(i) {
    navLinks.forEach(a => a.classList.remove('active-link'));
    if (navLinks[i-1]) navLinks[i-1].classList.add('active-link');
  }


  /* ── 10. GLITCH RESET ── */
  document.querySelectorAll('.glitch').forEach(el => {
    el.addEventListener('mouseenter', () => {
      el.style.animation = 'none';
      requestAnimationFrame(() => requestAnimationFrame(() => (el.style.animation = '')));
    });
  });

});
