// Typing animation in the hero heading.
const typingTarget = document.getElementById('typing-text');
const roles = ['CSE Student', 'Competitive Programmer', 'Web Developer', 'Tech Explorer'];
let roleIndex = 0;
let characterIndex = 0;
let isDeleting = false;

function runTypingAnimation() {
  const role = roles[roleIndex];
  characterIndex += isDeleting ? -1 : 1;
  typingTarget.textContent = role.slice(0, characterIndex);

  let delay = isDeleting ? 45 : 85;
  if (!isDeleting && characterIndex === role.length) {
    isDeleting = true;
    delay = 1250;
  } else if (isDeleting && characterIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 300;
  }
  window.setTimeout(runTypingAnimation, delay);
}
runTypingAnimation();

// Mobile navigation open / close.
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links');
const navItems = document.querySelectorAll('.nav-link');

function closeMenu() {
  navLinks.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Open navigation');
  menuToggle.textContent = '☰';
}

menuToggle.addEventListener('click', () => {
  const opened = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(opened));
  menuToggle.setAttribute('aria-label', opened ? 'Close navigation' : 'Open navigation');
  menuToggle.textContent = opened ? '✕' : '☰';
});

navItems.forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('click', (event) => {
  if (!navLinks.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
});
window.addEventListener('resize', () => {
  if (window.innerWidth > 700) closeMenu();
});

// Reveal cards as they enter the viewport. The no-IntersectionObserver fallback
// keeps all content visible in older browsers.
const revealItems = document.querySelectorAll(
  '.section-heading, .panel, .skill-card, .project-card, .qualification-card, .resume-note, .contact-wrap'
);
if ('IntersectionObserver' in window) {
  revealItems.forEach((item) => item.classList.add('reveal'));
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

// Highlight the current navigation item while scrolling.
const observedSections = document.querySelectorAll('main section[id]');
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navItems.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px' });
  observedSections.forEach((section) => sectionObserver.observe(section));
}

// The contact form is handled by the Formspree AJAX library in index.html.

// Current year in the footer.
document.getElementById('year').textContent = new Date().getFullYear();

// ANTIGRAVITY PARTICLE BACKGROUND

const canvas = document.getElementById("antigravity-bg");
const ctx = canvas.getContext("2d");

let particles = [];
let width, height;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const mouse = {
    x: -1000,
    y: -1000
};

const colors = [
    "rgba(59, 130, 246, 0.8)",
    "rgba(250, 204, 21, 0.8)"
];

function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const count = Math.min(
        100,
        Math.max(35, Math.floor(width * height / 18000))
    );

    particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)]
    }));
}

function animateParticles() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {

        // Floating movement
        p.x += p.vx;
        p.y += p.vy;

        // Keep particles inside the screen
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Repel particles near the mouse
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 130 && distance > 0) {
            const force = (130 - distance) / 130;

            p.x += (dx / distance) * force * 2;
            p.y += (dy / distance) * force * 2;
        }

        // Draw glowing particles
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;

        ctx.fill();
    });

    ctx.shadowBlur = 0;

    requestAnimationFrame(animateParticles);
}

// Track mouse movement
window.addEventListener("pointermove", event => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
});

window.addEventListener("pointerleave", () => {
    mouse.x = -1000;
    mouse.y = -1000;
});

// Initialize
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

function drawStaticParticles() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
    });
}

if (prefersReducedMotion) {
    drawStaticParticles();
} else {
    animateParticles();
}