/* ═══════════════════════════════════════════════════
   CONOR TAPLEY PORTFOLIO — Scripts
   ═══════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─── Navbar: add .scrolled class on scroll ─── */
  const nav = document.getElementById('mainNav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();


  /* ─── Typed text animation ─── */
  const phrases = [
    'Lead Unity Developer',
    'VR Game Specialist',
    'Game Designer',
    'C# Programmer',
    'XR Experience Creator',
  ];
  const typedEl  = document.getElementById('typed-text');
  let pIdx = 0, cIdx = 0, deleting = false;

  function tick() {
    const phrase = phrases[pIdx];
    if (!deleting) {
      typedEl.textContent = phrase.slice(0, ++cIdx);
      if (cIdx === phrase.length) {
        deleting = true;
        setTimeout(tick, 2000);
        return;
      }
      setTimeout(tick, 80);
    } else {
      typedEl.textContent = phrase.slice(0, --cIdx);
      if (cIdx === 0) {
        deleting = false;
        pIdx = (pIdx + 1) % phrases.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 40);
    }
  }
  setTimeout(tick, 600);


  /* ─── Scroll-reveal (Intersection Observer) ─── */
  const revealEls = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger siblings by their index within their parent
        const siblings = Array.from(entry.target.parentElement.children)
          .filter(el => el.classList.contains('reveal'));
        const delay = siblings.indexOf(entry.target) * 80;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealEls.forEach(el => revealObs.observe(el));


  /* ─── Skill bar animation ─── */
  const skillFills = document.querySelectorAll('.skill-fill');
  const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        skillObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  skillFills.forEach(el => skillObs.observe(el));


  /* ─── Stats counter animation ─── */
  const statNums = document.querySelectorAll('.stat-num[data-target]');
  const statObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const dur    = 1600;
      const start  = performance.now();

      const ease = (t) => t < 0.5 ? 2*t*t : -1+(4-2*t)*t; // easeInOut

      const update = (now) => {
        const elapsed = Math.min((now - start) / dur, 1);
        el.textContent = Math.round(ease(elapsed) * target);
        if (elapsed < 1) requestAnimationFrame(update);
        else el.textContent = target;
      };

      requestAnimationFrame(update);
      statObs.unobserve(el);
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => statObs.observe(el));


  /* ─── Active nav link on scroll ─── */
  const sections = document.querySelectorAll('section[id], header[id]');
  const navLinks = document.querySelectorAll('#mainNav .nav-link[href^="#"]');

  const activeObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active-nav',
            link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => activeObs.observe(s));


  /* ─── Keyboard accessibility: open modal on Enter for project cards ─── */
  document.querySelectorAll('.project-card[tabindex]').forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });


  /* ─── Smooth scroll for all anchor links ─── */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--nav-h') || '70', 10);
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
      // Close mobile nav if open
      const collapse = document.getElementById('navbarResponsive');
      if (collapse && collapse.classList.contains('show')) {
        collapse.classList.remove('show');
      }
    });
  });

});
