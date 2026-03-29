// Header scroll effect
const header = document.getElementById('header');

window.addEventListener('scroll', () => {
  header.classList.toggle('header--scrolled', window.scrollY > 50);
});

// Mobile menu
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');

burger.addEventListener('click', () => {
  burger.classList.toggle('active');
  nav.classList.toggle('active');
});

document.querySelectorAll('.header__link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('active');
    nav.classList.remove('active');
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
  '.about__card, .service-card, .quality__item, .advantage, .testimonial-card, .contacts__form, .contacts__card, .gallery__item'
);

reveals.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

reveals.forEach(el => observer.observe(el));

// Counter trigger
const statsSection = document.querySelector('.hero__stats');
if (statsSection) {
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  statsObserver.observe(statsSection);
}

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
      submitBtn.textContent = 'Надіслано!';
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

// Fullpage panels
function closeFullpage() {
  document.querySelectorAll('.fullpage.active').forEach(p => p.classList.remove('active'));
  document.body.classList.remove('fullpage-open');
}

document.querySelectorAll('.hero__nav-btn[data-page]').forEach(btn => {
  btn.addEventListener('click', () => {
    const page = document.getElementById('page-' + btn.dataset.page);
    if (page) {
      history.pushState({ fullpage: btn.dataset.page }, '');
      page.classList.add('active');
      document.body.classList.add('fullpage-open');
    }
  });
});

document.querySelectorAll('.fullpage a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    closeFullpage();
    history.back();
    setTimeout(() => {
      const target = document.querySelector(targetId);
      if (target) {
        const headerOffset = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    }, 100);
  });
});

// Service tiles detail
const serviceData = [
  { icon: 'fas fa-crown', title: 'Ексклюзивний мерчандайзинг', img: 'img/services/Ексклюзивний мерчандайзинг.jpg', text: 'Рекомендуємо компаніям з широким асортиментом торгових марок використовувати виділену команду, для цілковитого зосередження на завданнях однієї компанії й досягнення максимальних результатів.<br><br>Виділена команда мерчандайзерів працює виключно з вашим брендом, що гарантує повне занурення у специфіку продукції, дотримання стандартів викладки та оперативне реагування на будь-які зміни в торговій точці.' },
  { icon: 'fas fa-crosshairs', title: 'Фокусний мерчандайзинг', img: 'img/services/Фокусний мерчандайзинг.jpg', text: 'Рекомендуємо компаніям, які зацікавлені в мінімізації витрат на функцію мерчандайзингу. За даною схемою мерчандайзер працює в одній точці з декількома "портфелями", виділяючи на кожен узгоджену кількість часу.<br><br>Це оптимальне рішення для брендів із невеликим асортиментом або обмеженим бюджетом, що дозволяє отримати якісний мерчандайзинг за доступною ціною.' },
  { icon: 'fas fa-store', title: '"Мережевий" мерчандайзинг', img: 'img/services/Мережевий мерчандайзинг.jpg', text: 'Цей сервіс розроблений спеціально для гіпермаркетів та великих мереж, де є потреба в ефективній та оперативній роботі з великими обсягами товарів. Мерчандайзинг здійснюється в нічну зміну і спрямований на максимальне заповнення полиць до відкриття торгового залу для відвідувачів.<br><br>Наша команда забезпечує повний цикл нічного мерчандайзингу: приймання товару, викладка згідно з планограмою, ротація та контроль термінів придатності.' },
  { icon: 'fas fa-users', title: 'Аутстафінг персоналу', img: 'img/services/Аутстафінг персоналу.jpg', text: 'Це тип моделі віддаленого найму, при якій компанія-підрядник надає фахівця або групу професіоналів для участі в проєкті клієнта на період дії контракту. При цьому клієнт повністю контролює і керує "орендованою" командою або фахівцем, а компанія-підрядник займається підбором, юридичними аспектами співпраці, оплачує зарплату і проводить HR-процеси.<br><br>Ви отримуєте готових спеціалістів без витрат на пошук, оформлення та адміністрування — ми беремо це на себе.' },
  { icon: 'fas fa-bullhorn', title: 'BTL', img: 'img/services/BTL.jpg', text: 'Заходи, Таємний покупець, Outlet Sensus, Проведення аудитів, Моніторинг цін, Промо-консультант, Продавець-консультант та інші види послуг, які спрямовані на збільшення продажів.<br><br>Ми розробляємо та реалізовуємо BTL-кампанії повного циклу: від креативної концепції та підбору персоналу до логістики матеріалів та детальної звітності з результатами.' },
  { icon: 'fas fa-clipboard-list', title: 'Стандартний пакет послуг компанії', img: 'img/services/Стандартний пакет послуг.jpg', text: 'Викладання продукції на торговому устаткуванні відповідно до стандартів мерчандайзингу та планограми мережі. Поповнення товарного запасу на полиці та у додаткових місцях продажу. Контроль за ротацією товару (FIFO). Контроль ціни на продукцію (оновлення цінників). Розміщення та заміна рекламних матеріалів. Підтримання чистоти торговельного обладнання. Зняття залишків продукції. Дозамовлення продукції.' },
  { icon: 'fas fa-rocket', title: 'Стимулювання продажів', img: 'img/services/Стимулювання продажів.jpg', text: 'Комплекс заходів для збільшення обсягів продажів у торгових точках: розробка та впровадження акційних механік, програм лояльності, спеціальних пропозицій та знижкових кампаній.<br><br>Ми аналізуємо поведінку покупців, формуємо ефективні стратегії та забезпечуємо їх реалізацію на місцях для досягнення максимального результату. Щомісячна аналітика дозволяє коригувати підхід та масштабувати успішні механіки.' }
];

const serviceDetail = document.getElementById('page-service-detail');

document.querySelectorAll('.service-tile').forEach(tile => {
  tile.addEventListener('click', () => {
    const idx = +tile.dataset.service;
    const data = serviceData[idx];
    serviceDetail.querySelector('.service-detail__img').src = data.img + '?v=' + Date.now();
    serviceDetail.querySelector('.service-detail__img').alt = data.title;
    serviceDetail.querySelector('.service-detail__icon').innerHTML = '<i class="' + data.icon + '"></i>';
    serviceDetail.querySelector('.service-detail__title').textContent = data.title;
    serviceDetail.querySelector('.service-detail__text').innerHTML = data.text;
    serviceDetail.classList.add('active');
    serviceDetail.scrollTop = 0;
    history.pushState({ serviceDetail: true }, '');
  });
});

window.addEventListener('popstate', (e) => {
  if (serviceDetail.classList.contains('active')) {
    serviceDetail.classList.remove('active');
    return;
  }
  closeFullpage();
});

// 3D Carousel
(function() {
  const slides = document.querySelectorAll('.carousel3d__slide');
  const prevBtn = document.querySelector('.carousel3d__btn--prev');
  const nextBtn = document.querySelector('.carousel3d__btn--next');
  let current = 0;

  function updateSlides() {
    slides.forEach(s => s.className = 'carousel3d__slide');
    const prev = (current - 1 + slides.length) % slides.length;
    const next = (current + 1) % slides.length;
    slides[current].classList.add('carousel3d__slide--active');
    slides[prev].classList.add('carousel3d__slide--prev');
    slides[next].classList.add('carousel3d__slide--next');
  }

  prevBtn.addEventListener('click', () => {
    current = (current - 1 + slides.length) % slides.length;
    updateSlides();
  });

  nextBtn.addEventListener('click', () => {
    current = (current + 1) % slides.length;
    updateSlides();
  });

  updateSlides();

  // Auto-rotate every 5 seconds
  setInterval(() => {
    current = (current + 1) % slides.length;
    updateSlides();
  }, 5000);
})();

// Copy phone number to clipboard
document.querySelectorAll('a[href="tel:+380503843737"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    navigator.clipboard.writeText('+380503843737').then(() => {
      const original = link.textContent;
      link.textContent = 'Скопійовано!';
      setTimeout(() => { link.textContent = original; }, 2000);
    });
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      if (document.body.classList.contains('fullpage-open')) {
        closeFullpage();
        history.back();
        setTimeout(() => {
          const headerOffset = header.offsetHeight;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;
          window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }, 100);
      } else {
        const headerOffset = header.offsetHeight;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
      }
    }
  });
});
