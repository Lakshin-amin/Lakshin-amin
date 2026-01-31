
window.addEventListener('load', () => {
  if (window.tsParticles) {
    tsParticles.load('tsparticles', {
      fpsLimit: 60,
      background: { color: { value: '#070818' } },
      particles: {
        number: { value: 80, density: { enable: true, area: 800 } },
        color: { value: ['#53d0ff', '#9b6bff'] },
        shape: { type: 'circle' },
        opacity: { value: 0.9, random: false },
        size: { value: 2, random: { enable: true, minimumValue: 1 } },
        links: { enable: true, distance: 140, color: '#6fb8ff', opacity: 0.12, width: 1 },
        move: { enable: true, speed: 1.6, direction: 'none', outModes: { default: 'out' } }
      },
      interactivity: {
        events: { onHover: { enable: true, mode: 'grab' }, onClick: { enable: true, mode: 'push' } },
        modes: { grab: { distance: 160, links: { opacity: 0.25 } }, push: { quantity: 4 } }
      },
      detectRetina: true
    });
  }

  // --- Typewriter effect for name ---
  const nameEl = document.getElementById('type-name');
  const full = 'Lakshin Amin';
  let idx = 0;
  function type(){
    if(idx <= full.length){
      nameEl.textContent = full.slice(0, idx);
      idx++; setTimeout(type, 90);
    } else {
      setTimeout(()=>{ idx = 0; type(); }, 3000);
    }
  }
  type();

  // --- Tab navigation & smooth show ---
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('.section');
  function activateSection(id){
    sections.forEach(s=>{ s.classList.remove('visible'); s.classList.remove('active'); });
    document.getElementById(id).classList.add('visible');
    // update nav
    navLinks.forEach(n=>{ n.classList.toggle('active', n.dataset.target === id); });
    window.location.hash = id;
    window.scrollTo({top:0,behavior:'instant'});
  }
  navLinks.forEach(link=>{
    link.addEventListener('click', e=>{ e.preventDefault(); activateSection(link.dataset.target); });
  });

  // On load, check hash
  const initial = location.hash.replace('#','') || 'home';
  activateSection(initial);

  // CTA buttons
  document.querySelectorAll('[data-target]').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const t = btn.getAttribute('data-target'); if(t) activateSection(t);
    });
  });

  // --- Projects modal behavior ---
  // --- Projects modal behavior ---
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalTech = document.getElementById('modalTech');
const modalLive = document.getElementById('modalLive');
const modalCode = document.getElementById('modalCode');
const modalClose = document.getElementById('modalClose');

document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('click', () => {
    modalImg.src = card.dataset.img;
    modalTitle.textContent = card.dataset.title;
    modalDesc.textContent = card.dataset.desc;
    modalTech.textContent = 'Tech: ' + card.dataset.tech;

    // ✅ FIX: real links
    modalLive.href = card.dataset.live || '#';
    modalCode.href = card.dataset.code || '#';

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
  });
});

modalClose.addEventListener('click', () => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
});

modal.addEventListener('click', e => {
  if (e.target === modal) {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }
});

  // --- Contact form demo submit ---
  const form = document.getElementById('contactForm');
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const send = form.querySelector('button');
    send.textContent = 'Sending...'; send.disabled = true;
    setTimeout(()=>{ alert('Thank you! Your message is sent.'); send.textContent = 'Send Message'; send.disabled=false; form.reset(); }, 900);
  });

});
