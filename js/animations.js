export function initScrollAnimations() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    document.querySelectorAll('.reveal, [data-animate="stagger"]').forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.18 });

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

export function initRevealOnScroll() {
  const elements = document.querySelectorAll('[data-animate="stagger"]');
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach((el) => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const children = Array.from(entry.target.children);
        children.forEach((child, index) => {
          setTimeout(() => child.classList.add('visible'), index * 80);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  elements.forEach((el) => observer.observe(el));
}

export function initGsapEffects() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.gsap) return;
  const { gsap } = window;
  gsap.from('.typewriter-line', {
    y: 30,
    opacity: 0,
    duration: 1,
    stagger: 0.25,
    ease: 'power3.out'
  });
  gsap.from('.stat-card', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    scrollTrigger: {
      trigger: '#intro',
      start: 'top 80%'
    }
  });
}

export function initLenisSmoothScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.Lenis) return;
  const lenis = new window.Lenis({
    duration: 1.2,
    smoothWheel: true,
    lerp: 0.08
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

export function initRippleEffect() {
  document.querySelectorAll('.btn-primary, .btn-secondary, .icon-btn').forEach((button) => {
    button.addEventListener('click', (event) => {
      const circle = document.createElement('span');
      const rect = button.getBoundingClientRect();
      const diameter = Math.max(rect.width, rect.height);
      circle.style.width = `${diameter}px`;
      circle.style.height = `${diameter}px`;
      circle.style.left = `${event.clientX - rect.left - diameter / 2}px`;
      circle.style.top = `${event.clientY - rect.top - diameter / 2}px`;
      circle.className = 'ripple';
      button.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  });
}
