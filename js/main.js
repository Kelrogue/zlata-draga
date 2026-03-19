// Header & logo banner scroll effect
const header = document.getElementById('header');
const logoBanner = document.getElementById('logoBanner');

function updateLogoPosition() {
  const headerHeight = header.offsetHeight;
  logoBanner.style.top = headerHeight + 'px';
}

updateLogoPosition();
window.addEventListener('resize', updateLogoPosition);

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const scrolled = scrollY > 50;
  header.classList.toggle('header--scrolled', scrolled);

  // Плавне зникання лого від 0 до 100px скролу
  const fadeStart = 0;
  const fadeEnd = 100;
  const opacity = Math.max(0, 1 - (scrollY - fadeStart) / (fadeEnd - fadeStart));
  logoBanner.style.opacity = opacity;
  logoBanner.classList.toggle('logo-banner--scrolled', opacity === 0);

  updateLogoPosition();
});

// Mobile menu
const burger = document.getElementById('burger');
const navLeft = document.getElementById('nav-left');
const navRight = document.getElementById('nav');

burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  navLeft.classList.toggle('active');
  navRight.classList.toggle('active');
});

document.querySelectorAll('.header__link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('active');
    navLeft.classList.remove('active');
    navRight.classList.remove('active');
  });
});

// Counter animation
function animateCounters() {
  document.querySelectorAll('.stat__number').forEach(counter => {
    const target = +counter.dataset.target;
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      counter.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  });
}

// Scroll reveal
const reveals = document.querySelectorAll(
  '.about__card, .service-card, .quality__item, .advantage, .testimonial-card, .contacts__form, .contacts__card'
);

reveals.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

reveals.forEach(el => observer.observe(el));

// Counter trigger
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounters();
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.hero__stats');
if (statsSection) statsObserver.observe(statsSection);

// Contact form
document.getElementById('contactForm').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.textContent = 'Надіслано!';
  btn.style.background = '#27ae60';
  setTimeout(() => {
    btn.textContent = 'Надіслати повідомлення';
    btn.style.background = '';
    e.target.reset();
  }, 3000);
});

// Cookie consent
const cookieBanner = document.getElementById('cookieBanner');
const cookieAccept = document.getElementById('cookieAccept');
const cookieDecline = document.getElementById('cookieDecline');

if (localStorage.getItem('cookieConsent')) {
  cookieBanner.classList.add('hidden');
}

cookieAccept.addEventListener('click', () => {
  localStorage.setItem('cookieConsent', 'accepted');
  cookieBanner.classList.add('hidden');
});

cookieDecline.addEventListener('click', () => {
  localStorage.setItem('cookieConsent', 'declined');
  cookieBanner.classList.add('hidden');
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const headerOffset = header.offsetHeight;
      const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;
      window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }
  });
});

// Contact form submission
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const submitBtn = contactForm.querySelector('button[type="submit"]');
  const originalText = submitBtn.textContent;
  submitBtn.textContent = 'Надсилання...';
  submitBtn.disabled = true;

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: new FormData(contactForm)
    });
    const data = await response.json();

    if (data.success) {
      submitBtn.textContent = 'Надіслано ✓';
      contactForm.reset();
      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 3000);
    } else {
      throw new Error('Помилка відправки');
    }
  } catch {
    submitBtn.textContent = 'Помилка. Спробуйте ще раз';
    submitBtn.disabled = false;
    setTimeout(() => {
      submitBtn.textContent = originalText;
    }, 3000);
  }
});
