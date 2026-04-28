/* ============================================================
   FORMA Studio — script.js
   ============================================================ */

'use strict';

// ── Cursor ────────────────────────────────────────────────────
(function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  function lerp(a, b, t) { return a + (b - a) * t; }

  function animateRing() {
    ringX = lerp(ringX, mouseX, .12);
    ringY = lerp(ringY, mouseY, .12);
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }

  animateRing();

  const hoverEls = document.querySelectorAll('a, button, .case-card, .case-item, .btn, [data-cursor-hover]');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // Fix #6: document.documentElement is reliable; document itself doesn't fire mouseenter
  document.documentElement.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });

  document.documentElement.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();

// ── Navigation ────────────────────────────────────────────────
(function initNav() {
  const nav    = document.querySelector('.nav');
  const burger = document.querySelector('.nav__burger');
  const mobile = document.querySelector('.nav__mobile');

  if (!nav) return;

  // Scroll behavior
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        nav.classList.toggle('scrolled', window.scrollY > 40);
        ticking = false;
      });
      ticking = true;
    }
  });

  // Burger menu — Fix #4: update aria-expanded
  if (burger && mobile) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      mobile.classList.toggle('open', open);
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      document.body.style.overflow = open ? 'hidden' : '';
    });

    mobile.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobile.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  // Active link
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a, .nav__mobile a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();

// ── Scroll Reveal (IntersectionObserver) ──────────────────────
(function initReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => observer.observe(el));
})();

// ── Parallax ──────────────────────────────────────────────────
(function initParallax() {
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (!parallaxEls.length) return;

  function onScroll() {
    const scrolled = window.scrollY;
    parallaxEls.forEach(el => {
      const speed  = parseFloat(el.dataset.parallax) || .3;
      const rect   = el.closest('section')?.getBoundingClientRect();
      const offset = rect ? (window.innerHeight - rect.top) * speed * .3 : scrolled * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  }

  let raf;
  window.addEventListener('scroll', () => {
    if (raf) cancelAnimationFrame(raf);
    raf = requestAnimationFrame(onScroll);
  });
})();

// ── Counter Animation ─────────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el  = entry.target;
      const end = parseInt(el.dataset.count, 10);
      const dur = 1800;
      const start = performance.now();

      function step(now) {
        const elapsed  = now - start;
        const progress = Math.min(elapsed / dur, 1);
        const ease     = 1 - Math.pow(1 - progress, 4);
        el.textContent = Math.floor(ease * end);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = end;
      }

      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: .5 });

  counters.forEach(el => observer.observe(el));
})();

// ── Cases Modal ───────────────────────────────────────────────
(function initModal() {
  const overlay = document.getElementById('caseModal');
  if (!overlay) return;

  const casesData = [
    {
      id: 1,
      title: 'Neolux',
      subtitle: 'Ребрендинг технологического стартапа',
      category: 'Брендинг · UI/UX',
      bg: 'case-bg-1',
      pattern: 'case-pattern-lines',
      iconContent: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none"><circle cx="40" cy="40" r="36" stroke="rgba(201,168,76,.4)" stroke-width="1"/><circle cx="40" cy="40" r="20" stroke="rgba(201,168,76,.3)" stroke-width="1"/><line x1="40" y1="4" x2="40" y2="76" stroke="rgba(201,168,76,.2)" stroke-width="1"/><line x1="4" y1="40" x2="76" y2="40" stroke="rgba(201,168,76,.2)" stroke-width="1"/></svg>`,
      task: 'Neolux — стартап в области умного освещения, столкнувшийся с проблемой слабой идентичности бренда на конкурентном рынке. Задача: переосмыслить визуальный язык компании, создать запоминаемый бренд, способный конкурировать с мировыми игроками, и разработать дизайн продуктового приложения с нуля.',
      process: 'Мы провели глубинный анализ конкурентов и аудиторию. Разработали три концепции фирменного стиля, выбрали направление «технологичная теплота» — сочетание точности и уюта. Построили систему токенов дизайна и разработали 120+ экранов мобильного приложения с проработанными состояниями компонентов.',
      result: 'Новый бренд получил признание на Awwwards. Приложение набрало 4.8★ в App Store. Конверсия в покупку выросла.',
      tools: ['Figma', 'Principle', 'After Effects', 'Procreate', 'Notion'],
      stats: [{ num: '+340%', label: 'Рост узнаваемости' }, { num: '4.8★', label: 'Рейтинг в App Store' }, { num: '12 нед', label: 'Срок проекта' }]
    },
    {
      id: 2,
      title: 'Vesta',
      subtitle: 'Мобильное приложение для управления задачами',
      category: 'UI/UX · Прототипирование',
      bg: 'case-bg-2',
      pattern: 'case-pattern-dots',
      iconContent: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none"><rect x="16" y="16" width="48" height="48" rx="8" stroke="rgba(62,232,160,.4)" stroke-width="1"/><rect x="24" y="28" width="32" height="2" rx="1" fill="rgba(62,232,160,.4)"/><rect x="24" y="36" width="24" height="2" rx="1" fill="rgba(62,232,160,.3)"/><rect x="24" y="44" width="28" height="2" rx="1" fill="rgba(62,232,160,.2)"/></svg>`,
      task: 'Vesta — B2B-инструмент для управления проектами в дизайн-командах. Клиент хотел создать принципиально иной подход к таск-трекерам: минималистичный, быстрый, без перегруза функций. Наша задача — спроектировать UX с нуля и довести до production-ready прототипа.',
      process: 'Провели 18 интервью с дизайнерами и менеджерами. Построили карту пользовательского пути, выявили ключевые «боли». Разработали IA и wire-flows. Итеративно тестировали прототипы с реальными пользователями — три раунда юзабилити-тестов. Итоговый дизайн прошёл через 7 ревизий.',
      result: 'Прототип получил инвестиции на посевном раунде. Среднее время выполнения задачи сократилось на 40% по сравнению с конкурентами в тестах.',
      tools: ['Figma', 'ProtoPie', 'Maze', 'FigJam', 'Lottie'],
      stats: [{ num: '−40%', label: 'Время на задачу' }, { num: '18', label: 'Глубинных интервью' }, { num: '7', label: 'Итераций дизайна' }]
    },
    {
      id: 3,
      title: 'Arvid Commerce',
      subtitle: 'Дизайн-система для e-commerce платформы',
      category: 'Дизайн-система · UI',
      bg: 'case-bg-3',
      pattern: 'case-pattern-grid',
      iconContent: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none"><rect x="12" y="12" width="24" height="24" rx="3" stroke="rgba(62,160,232,.4)" stroke-width="1"/><rect x="44" y="12" width="24" height="24" rx="3" stroke="rgba(62,160,232,.3)" stroke-width="1"/><rect x="12" y="44" width="24" height="24" rx="3" stroke="rgba(62,160,232,.3)" stroke-width="1"/><rect x="44" y="44" width="24" height="24" rx="3" stroke="rgba(62,160,232,.2)" stroke-width="1"/></svg>`,
      task: 'Крупная российская e-commerce платформа с командой из 30 дизайнеров столкнулась с проблемой несогласованности интерфейсов. Задача — создать единую, масштабируемую дизайн-систему, которая ускорит разработку и унифицирует визуальный язык продукта.',
      process: 'Провели аудит 2000+ экранов существующего продукта. Выявили 400+ уникальных компонентов и свели их к 80 базовым. Создали систему токенов (650 дизайн-токенов), документацию, Storybook-интеграцию. Провели онбординг для команды из 30 дизайнеров.',
      result: 'Скорость разработки новых фич выросла в 2.4 раза. Консистентность интерфейса по результатам UX-аудита — 94%.',
      tools: ['Figma', 'Tokens Studio', 'Storybook', 'Zeroheight', 'GitHub'],
      stats: [{ num: '×2.4', label: 'Скорость разработки' }, { num: '650', label: 'Дизайн-токенов' }, { num: '94%', label: 'Консистентность UI' }]
    },
    {
      id: 4,
      title: 'Кедр',
      subtitle: 'Фирменный стиль ресторанной сети',
      category: 'Брендинг · Айдентика',
      bg: 'case-bg-4',
      pattern: 'case-pattern-lines',
      iconContent: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none"><path d="M40 10 L40 70 M20 30 Q40 20 60 30 M15 50 Q40 35 65 50" stroke="rgba(201,120,76,.4)" stroke-width="1" stroke-linecap="round"/></svg>`,
      task: 'Кедр — новая сеть ресторанов сибирской кухни, открывающая 12 заведений в 5 городах. Задача: создать сильный, узнаваемый бренд, транслирующий аутентичность и современность одновременно, разработать полный гайдбук и все носители фирменного стиля.',
      process: 'Исследовали рынок ресторанного брендинга и ЦА. Разработали платформу бренда: архетип, тон голоса, миссию. Создали три концепции — «Тайга», «Очаг», «Кедр». После тестирования на фокус-группах выбрали «Кедр». Разработали полный гайдбук: 180 страниц, 60+ применений.',
      result: 'Все 12 ресторанов открылись в срок с единым визуальным стилем. Узнаваемость бренда в ЦА через 6 месяцев — 67%.',
      tools: ['Illustrator', 'InDesign', 'Photoshop', 'Figma', 'Procreate'],
      stats: [{ num: '180 стр', label: 'Гайдбук бренда' }, { num: '67%', label: 'Узнаваемость за 6 мес' }, { num: '60+', label: 'Носителей стиля' }]
    },
    {
      id: 5,
      title: 'Pulse Health',
      subtitle: 'Дизайн медицинского дашборда',
      category: 'UI/UX · Дашборд',
      bg: 'case-bg-2',
      pattern: 'case-pattern-dots',
      iconContent: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none"><polyline points="10,40 25,40 32,20 40,55 48,30 55,40 70,40" stroke="rgba(232,62,62,.4)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
      task: 'Pulse — стартап в сфере цифрового здоровья. Платформа агрегирует данные с носимых устройств и строит персональные рекомендации. Задача: спроектировать дашборд, который делает сложные медицинские данные понятными обычному пользователю.',
      process: 'Исследование с участием врачей и пациентов. Приоритизация метрик по методу MoSCoW. Разработка системы визуализации данных — 40+ типов графиков. Проектирование адаптивного дашборда под web и мобайл. Accessibility-аудит: WCAG AA.',
      result: 'DAU вырос на 280% после редизайна. NPS пользователей: 72. Продукт получил награду Red Dot Design Award 2024.',
      tools: ['Figma', 'Framer', 'D3.js', 'Lottie', 'UserTesting'],
      stats: [{ num: '+280%', label: 'DAU после редизайна' }, { num: 'NPS 72', label: 'Индекс лояльности' }, { num: 'Red Dot', label: 'Награда 2024' }]
    },
    {
      id: 6,
      title: 'Nord Capital',
      subtitle: 'Веб-сайт инвестиционного фонда',
      category: 'UI/UX · Веб-дизайн',
      bg: 'case-bg-1',
      pattern: 'case-pattern-grid',
      iconContent: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none"><line x1="10" y1="70" x2="10" y2="20" stroke="rgba(201,168,76,.3)" stroke-width="1"/><line x1="10" y1="70" x2="70" y2="70" stroke="rgba(201,168,76,.3)" stroke-width="1"/><polyline points="15,60 28,40 42,48 56,25 70,15" stroke="rgba(201,168,76,.5)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`,
      task: 'Nord Capital — инвестиционный фонд с AUM $800M, нуждающийся в современном цифровом присутствии. Существующий сайт морально устарел и не отвечал уровню премиальных клиентов. Задача — создать сайт, транслирующий экспертность, надёжность и современность.',
      process: 'Бенчмарк-анализ 20 топовых инвестфондов мира. Разработка архитектуры информации, wireframes, motion-концепция. Создание дизайна 28 страниц с анимациями и интерактивными элементами. Разработка CMS-решения для команды.',
      result: 'Bounce rate снизился с 72% до 31%. Количество квалифицированных заявок выросло в 3 раза. Время на сайте +4 минуты.',
      tools: ['Figma', 'Webflow', 'GSAP', 'Lottie', 'Hotjar'],
      stats: [{ num: '−41%', label: 'Bounce rate' }, { num: '×3', label: 'Квалификация лидов' }, { num: '+4 мин', label: 'Время на сайте' }]
    }
  ];

  // Attach click events to case items
  
  document.addEventListener('click', e => {
    const card = e.target.closest('[data-case-id]');
    if (!card) return;
    const data = casesData.find(c => c.id === parseInt(card.dataset.caseId, 10));
    if (data) openModal(data);
  });

  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('[data-case-id]');
    if (!card) return;
    e.preventDefault();
    const data = casesData.find(c => c.id === parseInt(card.dataset.caseId, 10));
    if (data) openModal(data);
  });

  function openModal(data) {
    overlay.querySelector('.modal__title').textContent    = data.title;
    overlay.querySelector('.modal__subtitle').textContent = data.subtitle;

    const visual = overlay.querySelector('.modal__visual');
    visual.className = 'modal__visual ' + data.bg;
    visual.innerHTML = `
      <div class="case-pattern ${data.pattern}" style="position:absolute;inset:0;opacity:.4;"></div>
      <div class="case-icon" style="position:relative;z-index:1;">${data.iconContent}</div>
    `;

    overlay.querySelector('#modal-task').textContent    = data.task;
    overlay.querySelector('#modal-process').textContent = data.process;
    overlay.querySelector('#modal-result').textContent  = data.result;

    const toolsEl = overlay.querySelector('#modal-tools');
    toolsEl.innerHTML = data.tools.map(t => `<span class="case-tag">${t}</span>`).join('');

    const statsEl = overlay.querySelector('#modal-stats');
    statsEl.innerHTML = data.stats.map(s => `
      <div class="result-stat">
        <div class="result-stat__num">${s.num}</div>
        <div class="result-stat__label">${s.label}</div>
      </div>
    `).join('');

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    overlay.querySelector('.modal__close').focus();
  }

  overlay.querySelector('.modal__close')?.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal(); });

  function closeModal() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  
})();

// ── Contact Form Validation ───────────────────────────────────
(function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const formMain    = form.querySelector('.form-main');
  const formSuccess = form.querySelector('.form-success');

  function validateInput(input) {
    const value = input.value.trim();
    let valid = true;

    if (input.required && !value) {
      valid = false;
    } else if (input.type === 'email' && value) {
      valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    } else if (input.dataset.minLength && value) {
      valid = value.length >= parseInt(input.dataset.minLength, 10);
    }

    input.classList.toggle('error', !valid);
    return valid;
  }

  form.querySelectorAll('.form-input').forEach(input => {
    input.addEventListener('blur', () => validateInput(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('error')) validateInput(input);
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();

    let allValid = true;

    form.querySelectorAll('.form-input[required]').forEach(input => {
      if (!validateInput(input)) allValid = false;
    });

    // Also validate minLength fields
    form.querySelectorAll('.form-input[data-min-length]').forEach(input => {
      if (!validateInput(input)) allValid = false;
    });

    const checkbox = form.querySelector('input[name="consent"]');
    if (checkbox && !checkbox.checked) {
      allValid = false;
      checkbox.closest('.form-check').style.color = '#e05454';
    } else if (checkbox) {
      checkbox.closest('.form-check').style.color = '';
    }

    if (!allValid) return;

    const btn = form.querySelector('[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Отправка...';
    btn.disabled = true;

    setTimeout(() => {
      formMain?.classList.add('hidden');
      formSuccess?.classList.add('show');
    }, 1200);
  });
})();

// ── Smooth Scroll ──────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── Stagger children animation ─────────────────────────────────
(function staggerChildren() {
  document.querySelectorAll('[data-stagger]').forEach(parent => {
    Array.from(parent.children).forEach((child, i) => {
      child.classList.add('reveal');
      child.style.transitionDelay = (i * 0.1) + 's';
    });
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('[data-stagger] .reveal').forEach(el => observer.observe(el));
})();

// ── Hero animation — Fix #7: use CSS class to avoid FOUC ──────
(function initHeroAnim() {
  const heroHead = document.querySelector('.hero__heading .display');
  if (!heroHead) return;

  // Apply initial state immediately (synchronous, before paint)
  // Use a class toggled off rather than setting opacity via JS after parse
  heroHead.classList.add('hero-anim-hidden');
  const eyebrow = document.querySelector('.hero__eyebrow');
  const actions = document.querySelector('.hero__actions');
  [eyebrow, actions].forEach(el => el?.classList.add('hero-anim-hidden'));

  // Trigger after a short frame to ensure class was painted
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      heroHead.classList.remove('hero-anim-hidden');
      heroHead.classList.add('hero-anim-in');

      setTimeout(() => {
        eyebrow?.classList.remove('hero-anim-hidden');
        eyebrow?.classList.add('hero-anim-in');
      }, 200);

      setTimeout(() => {
        actions?.classList.remove('hero-anim-hidden');
        actions?.classList.add('hero-anim-in');
      }, 350);
    });
  });

  const stats = document.querySelectorAll('.hero__stat');
  stats.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transition = 'opacity .6s ease';
    setTimeout(() => { el.style.opacity = '1'; }, 900 + i * 80);
  });
})();

// ── Marquee — Fix #3: HTML already has doubled content; no JS clone needed ──
(function initMarquee() {
  const marquee = document.querySelector('.marquee');
  if (!marquee) return;
  // The marquee__inner in HTML already contains duplicated content
  // so CSS translateX(-50%) lands seamlessly. No cloning needed.
  // Respect prefers-reduced-motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const inner = marquee.querySelector('.marquee__inner');
    if (inner) inner.style.animation = 'none';
  }
})();

