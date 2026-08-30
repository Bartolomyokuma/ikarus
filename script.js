document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. ПЕРЕКЛЮЧЕНИЕ АКТИВНОСТИ КАРТОЧЕК (TABS)
  // ==========================================
  const tabCards = document.querySelectorAll('.tab-card');
  
  tabCards.forEach(card => {
    card.addEventListener('click', () => {
      tabCards.forEach(c => c.classList.remove('active-card'));
      card.classList.add('active-card');
    });
  });


  // ==========================================
  // 2. АВТОРИЗАЦИЯ И МОДАЛЬНОЕ ОКНО + ПЛАВНЫЙ УСПЕХ
  // ==========================================
  const modal = document.getElementById('auth-modal');
  const modalTitle = document.getElementById('modal-title');
  const loginBtns = document.querySelectorAll('.login, button.btn:not(.modal-submit), a.btn');
  const closeModalBtn = document.querySelector('.modal-close');

  const authForm = document.getElementById('auth-form');
  const successMessage = document.getElementById('success-message');

  // Сброс модалки в исходное состояние при открытии
  function resetModalState() {
    if (authForm) {
      authForm.style.display = 'flex';
      authForm.classList.remove('fade-out');
      authForm.reset();
    }
    if (successMessage) {
      successMessage.style.display = 'none';
      successMessage.classList.remove('fade-in');
    }
    if (modalTitle) {
      modalTitle.style.display = 'block';
    }
  }

  // Открытие модалки
  loginBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const href = btn.getAttribute('href');
      if (href === '#' || !href || btn.classList.contains('login') || btn.innerText.includes('Login') || btn.innerText.includes('Sign up')) {
        e.preventDefault();
        if (modal && modalTitle) {
          const isSignUp = btn.innerText.includes('Sign up') || btn.innerText.includes('Регистрация');
          modalTitle.innerText = isSignUp ? 'Регистрация в IKARUS' : 'Вход в систему';
          resetModalState();
          modal.classList.add('active');
        }
      }
    });
  });

  // Закрытие по крестику
  if (closeModalBtn && modal) {
    closeModalBtn.addEventListener('click', () => {
      modal.classList.remove('active');
    });
  }

  // Закрытие по клику вне окна
  if (modal) {
    window.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  }

  // --- ПЛАВНАЯ ОТПРАВКА ФОРМЫ И ТЕКСТ «СПАСИБО» ---
  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // 1. Форма и заголовок плавно гаснут
      authForm.classList.add('fade-out');
      if (modalTitle) modalTitle.style.display = 'none';

      // 2. Скрываем форму и показываем блок «Спасибо»
      setTimeout(() => {
        authForm.style.display = 'none';
        if (successMessage) {
          successMessage.style.display = 'block';
          setTimeout(() => {
            successMessage.classList.add('fade-in');
          }, 50);
        }
      }, 400);

      // 3. Автоматически закрываем модалку через 2.8 секунды
      setTimeout(() => {
        if (modal) {
          modal.classList.remove('active');
        }
      }, 2800);
    });
  }


  // ==========================================
  // 3. КАЛЬКУЛЯТОР ЭКОНОМИИ
  // ==========================================
  function initCalculator() {
    const teamSlider = document.getElementById('team-slider');
    const hoursSlider = document.getElementById('hours-slider');
    const teamVal = document.getElementById('team-val');
    const hoursVal = document.getElementById('hours-val');
    const resHours = document.getElementById('res-hours');
    const resMoney = document.getElementById('res-money');
    const presetBtns = document.querySelectorAll('.calc-tab-btn');

    if (!teamSlider || !hoursSlider) return;

    let hourlyRate = 12;

    const presets = {
      saas: { rate: 12, defaultTeam: 10, defaultHours: 15 },
      agency: { rate: 15, defaultTeam: 8, defaultHours: 20 },
      ecommerce: { rate: 8, defaultTeam: 15, defaultHours: 12 }
    };

    function recalculate() {
      const team = parseInt(teamSlider.value, 10);
      const hours = parseInt(hoursSlider.value, 10);

      if (teamVal) teamVal.innerText = `${team} чел.`;
      if (hoursVal) hoursVal.innerText = `${hours} ч/неделю`;

      const savedHours = Math.round(team * hours * 4 * 0.75);
      const savedMoney = savedHours * hourlyRate;

      if (resHours) resHours.innerText = `${savedHours.toLocaleString('ru-RU')} ч`;
      if (resMoney) resMoney.innerText = `$${savedMoney.toLocaleString('en-US')}`;
    }

    ['input', 'change'].forEach(eventType => {
      teamSlider.addEventListener(eventType, recalculate);
      hoursSlider.addEventListener(eventType, recalculate);
    });

    presetBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        presetBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const presetKey = btn.dataset.preset;
        if (presets[presetKey]) {
          hourlyRate = presets[presetKey].rate;
          teamSlider.value = presets[presetKey].defaultTeam;
          hoursSlider.value = presets[presetKey].defaultHours;
          recalculate();
        }
      });
    });

    recalculate();
  }

  initCalculator();


  // ==========================================
  // 4. ИНТЕРАКТИВНЫЕ ЦИТАТЫ
  // ==========================================
  const quotes = [
    {
      text: "«Творчество — это способность создавать то, что оставляет след в разуме и сердце.»",
      author: "— Философия IKARUS"
    },
    {
      text: "«Время — самый ценный ресурс. Автоматизируйте рутину, чтобы заниматься действительно важным.»",
      author: "— IKARUS Productivity"
    },
    {
      text: "«Будущее принадлежит тем, кто объединяет искусственный интеллект и человеческое видение.»",
      author: "— Команда IKARUS"
    }
  ];

  let currentQuoteIndex = 0;
  const quoteText = document.getElementById('quote-text');
  const quoteAuthor = document.getElementById('quote-author');
  const prevBtn = document.getElementById('prev-quote');
  const nextBtn = document.getElementById('next-quote');
  const dotsContainer = document.getElementById('quote-dots');

  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    quotes.forEach((_, idx) => {
      const dot = document.createElement('div');
      dot.className = `dot ${idx === currentQuoteIndex ? 'active' : ''}`;
      dotsContainer.appendChild(dot);
    });
  }

  function updateQuote(index) {
    if (!quoteText || !quoteAuthor) return;
    
    quoteText.style.opacity = '0';
    setTimeout(() => {
      currentQuoteIndex = index;
      quoteText.innerText = quotes[currentQuoteIndex].text;
      quoteAuthor.innerText = quotes[currentQuoteIndex].author;
      quoteText.style.opacity = '1';
      renderDots();
    }, 200);
  }

  prevBtn?.addEventListener('click', () => {
    const newIdx = (currentQuoteIndex - 1 + quotes.length) % quotes.length;
    updateQuote(newIdx);
  });

  nextBtn?.addEventListener('click', () => {
    const newIdx = (currentQuoteIndex + 1) % quotes.length;
    updateQuote(newIdx);
  });

  if (quoteText && quoteAuthor) {
    renderDots();
  }


  // ==========================================
  // 5. АНИМАЦИЯ СЧЕТЧИКОВ ЦИФР ПРИ СКРОЛЛЕ
  // ==========================================
  const statsValues = document.querySelectorAll('.stat-number, .achieve-card h3');
  let animatedStats = false;

  function animateNumbers() {
    statsValues.forEach(counter => {
      const rawText = counter.innerText.replace(/[^0-9]/g, '');
      const target = +rawText;
      if (!target || counter.dataset.done) return;

      const prefix = counter.innerText.match(/^[^\d]+/)?.[0] || '';
      const suffix = counter.innerText.match(/[^\d]+$/)?.[0] || '';
      let count = 0;
      
      const steps = 240;
      const speed = target / steps;

      const updateCount = () => {
        count += speed;
        if (count < target) {
          counter.innerText = prefix + Math.ceil(count).toLocaleString('ru-RU') + suffix;
          setTimeout(updateCount, 25);
        } else {
          counter.innerText = prefix + target.toLocaleString('ru-RU') + suffix;
          counter.dataset.done = "true";
        }
      };

      updateCount();
    });
  }

  window.addEventListener('scroll', () => {
    const statsSection = document.querySelector('.stats-section, .achievements-section');
    if (statsSection) {
      const sectionPos = statsSection.getBoundingClientRect().top;
      const screenPos = window.innerHeight;
      if (sectionPos < screenPos && !animatedStats) {
        animateNumbers();
        animatedStats = true;
      }
    }
  });


  // ==========================================
  // 6. 3D-ЭФФЕКТ НАКЛОНА КАРТОЧЕК ПРИ ДВИЖЕНИИ МЫШИ
  // ==========================================
  const tiltCards = document.querySelectorAll('.hero-card, .tab-card, .service-card, .achieve-card, .testimonial-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      card.style.transform = `perspective(1000px) rotateX(${-y / 15}deg) rotateY(${x / 15}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });


  // ==========================================
  // 7. ВКЛАДКИ УСЛУГ (страница Service)
  // ==========================================
  function initServiceTabs() {
    const panel = document.getElementById('service-panel');
    const tabs = document.querySelectorAll('#service-tabs .calc-tab-btn');
    if (!panel || tabs.length === 0) return;

    const data = {
      automation: [
        { icon: '⚙️', title: 'Сценарии автоматизации', text: 'Настраиваешь правила один раз — система сама повторяет рутинные действия каждый день.' },
        { icon: '🔁', title: 'Повторяющиеся задачи', text: 'Рассылки, напоминания и отчёты формируются и отправляются без твоего участия.' },
        { icon: '🔔', title: 'Умные уведомления', text: 'Получай сигнал только тогда, когда действительно нужно вмешаться.' }
      ],
      analytics: [
        { icon: '📊', title: 'Дашборды в реальном времени', text: 'Все ключевые метрики проекта на одном экране, без сборки отчётов вручную.' },
        { icon: '📈', title: 'Прогноз роста', text: 'Система показывает тренды и подсказывает, куда стоит направить ресурсы.' },
        { icon: '🧠', title: 'Умные инсайты', text: 'Автоматические выводы по поведению аудитории и эффективности кампаний.' }
      ],
      community: [
        { icon: '💬', title: 'Единое пространство общения', text: 'Обсуждения, объявления и обратная связь от участников — в одном месте.' },
        { icon: '🎟️', title: 'События и встречи', text: 'Планируй мероприятия и отслеживай регистрации без сторонних сервисов.' },
        { icon: '🤝', title: 'Программы лояльности', text: 'Поощряй активных участников сообщества встроенными инструментами.' }
      ]
    };

    function render(key) {
      panel.innerHTML = '';
      data[key].forEach(item => {
        const card = document.createElement('div');
        card.className = 'service-card';
        card.innerHTML = `<div class="service-icon">${item.icon}</div><h3>${item.title}</h3><p>${item.text}</p>`;
        panel.appendChild(card);
      });
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        render(tab.dataset.service);
      });
    });

    render('automation');
  }

  initServiceTabs();


  // ==========================================
  // 8. ПЕРЕКЛЮЧАТЕЛЬ ТАРИФОВ (страница Feature)
  // ==========================================
  function initPlanToggle() {
    const panel = document.getElementById('plan-panel');
    const tabs = document.querySelectorAll('#plan-tabs .calc-tab-btn');
    if (!panel || tabs.length === 0) return;

    const data = {
      standard: [
        'До 10 участников команды',
        'Базовая автоматизация сценариев',
        'Стандартные отчёты и дашборды',
        'Поддержка по email'
      ],
      pro: [
        'Неограниченное число участников',
        'Продвинутая автоматизация и ИИ-рекомендации',
        'Расширенная аналитика в реальном времени',
        'Приоритетная поддержка 24/7',
        'Персональный менеджер аккаунта'
      ]
    };

    function render(key) {
      panel.style.opacity = '0';

      setTimeout(() => {
        panel.innerHTML = '';
        data[key].forEach(text => {
          const item = document.createElement('div');
          item.className = 'feature-check-item';
          item.innerHTML = `<span class="feature-check-icon">✓</span><p>${text}</p>`;
          panel.appendChild(item);
        });
        panel.style.opacity = '1';
      }, 250);
    }

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        render(tab.dataset.plan);
      });
    });

    render('standard');
  }

  initPlanToggle();


  // ==========================================
  // 9. КАРУСЕЛЬ ПРОДУКТОВ (страница Product)
  // ==========================================
  function initProductCarousel() {
    const track = document.getElementById('product-track');
    const dotsContainer = document.getElementById('product-dots');
    const prevBtn = document.getElementById('prod-prev');
    const nextBtn = document.getElementById('prod-next');
    if (!track) return;

    const slides = track.querySelectorAll('.product-slide');
    let current = 0;
    let autoplayTimer;

    function renderDots() {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = `dot ${idx === current ? 'active' : ''}`;
        dot.addEventListener('click', () => goTo(idx));
        dotsContainer.appendChild(dot);
      });
    }

    function goTo(index) {
      current = (index + slides.length) % slides.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      renderDots();
      restartAutoplay();
    }

    function restartAutoplay() {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(() => goTo(current + 1), 6000);
    }

    prevBtn?.addEventListener('click', () => goTo(current - 1));
    nextBtn?.addEventListener('click', () => goTo(current + 1));

    renderDots();
    restartAutoplay();
  }

  initProductCarousel();


  // ==========================================
  // 10. АНИМИРОВАННЫЕ БАРЫ МЕТРИК (страница Product)
  // ==========================================
  function initMetricBars() {
    const bars = document.querySelectorAll('.metric-bar-fill');
    if (bars.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          bar.style.width = `${bar.dataset.percent}%`;
          observer.unobserve(bar);
        }
      });
    }, { threshold: 0.4 });

    bars.forEach(bar => observer.observe(bar));
  }

  initMetricBars();


  // ==========================================
  // 11. ПОЯВЛЕНИЕ СЕКЦИЙ ПРИ СКРОЛЛЕ (reveal)
  // ==========================================
  function initRevealOnScroll() {
    const items = document.querySelectorAll('.reveal');
    if (items.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    items.forEach(item => observer.observe(item));
  }

  initRevealOnScroll();


  // ==========================================
  // 12. ФИЛЬТР ОТЗЫВОВ (страница Testimonial)
  // ==========================================
  function initTestimonialFilter() {
    const filterBtns = document.querySelectorAll('#testimonial-filters .calc-tab-btn');
    const cards = document.querySelectorAll('.testimonial-card');
    const emptyMsg = document.getElementById('testimonial-empty');
    if (filterBtns.length === 0 || cards.length === 0) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        let visibleCount = 0;

        cards.forEach(card => {
          const match = filter === 'all' || card.dataset.category === filter;
          card.classList.toggle('hidden-card', !match);
          if (match) visibleCount++;
        });

        if (emptyMsg) emptyMsg.style.display = visibleCount === 0 ? 'block' : 'none';
      });
    });
  }

  initTestimonialFilter();


  // ==========================================
  // 13. СПОТЛАЙТ "ИСТОРИЯ МЕСЯЦА" (страница Testimonial)
  // ==========================================
  function initStorySpotlight() {
    const textEl = document.getElementById('story-text');
    const authorEl = document.getElementById('story-author');
    const dotsEl = document.getElementById('story-dots');
    const prevBtn = document.getElementById('story-prev');
    const nextBtn = document.getElementById('story-next');
    if (!textEl || !authorEl) return;

    const stories = [
      {
        text: '«Мы внедрили IKARUS за неделю до крупного запуска и до сих пор не верим, что раньше жили без этого. Команда получила единый источник правды по всем задачам.»',
        author: '— Алия Нурланова, Head of Ops, Skyline Group'
      },
      {
        text: '«Раньше согласование договора занимало неделю переписки в почте. Сейчас весь процесс — три шага в IKARUS и уведомление, когда всё подписано.»',
        author: '— Данияр Есенов, Юридический директор, ArcTech'
      },
      {
        text: '«Больше всего ценю прозрачность: любой сотрудник видит, на каком этапе проект, без необходимости писать «как дела».»',
        author: '— Полина Гриценко, Project Lead, Nordwind Studio'
      }
    ];

    let index = 0;

    function renderDots() {
      dotsEl.innerHTML = '';
      stories.forEach((_, idx) => {
        const dot = document.createElement('div');
        dot.className = `dot ${idx === index ? 'active' : ''}`;
        dot.addEventListener('click', () => update(idx));
        dotsEl.appendChild(dot);
      });
    }

    function update(newIndex) {
      textEl.style.opacity = '0';
      setTimeout(() => {
        index = (newIndex + stories.length) % stories.length;
        textEl.innerText = stories[index].text;
        authorEl.innerText = stories[index].author;
        textEl.style.opacity = '1';
        renderDots();
      }, 200);
    }

    prevBtn?.addEventListener('click', () => update(index - 1));
    nextBtn?.addEventListener('click', () => update(index + 1));

    renderDots();
  }

  initStorySpotlight();


  // ==========================================
  // 14. ВИДЕО-ПРЕВЬЮ ПЛЕЙ-КНОПКА (страница Testimonial)
  // ==========================================
  function initVideoPlay() {
    const btn = document.getElementById('play-button');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const playing = btn.classList.toggle('playing');
      btn.innerText = playing ? '❚❚' : '▶';
    });
  }

  initVideoPlay();


  // ==========================================
  // 15. АККОРДЕОН + ПОИСК + ФИЛЬТР (страница FAQ)
  // ==========================================
  function initFaqPage() {
    const items = document.querySelectorAll('.faq-item');
    const searchInput = document.getElementById('faq-search');
    const filterBtns = document.querySelectorAll('#faq-filters .calc-tab-btn');
    const emptyMsg = document.getElementById('faq-empty');
    if (items.length === 0) return;

    let activeCategory = 'all';

    // Аккордеон
    items.forEach(item => {
      const question = item.querySelector('.faq-question');
      const answer = item.querySelector('.faq-answer');

      question.addEventListener('click', () => {
        const isOpen = answer.classList.contains('open');

        document.querySelectorAll('.faq-answer.open').forEach(openAnswer => {
          openAnswer.classList.remove('open');
          openAnswer.style.maxHeight = null;
          openAnswer.previousElementSibling.classList.remove('open');
        });

        if (!isOpen) {
          answer.classList.add('open');
          question.classList.add('open');
          answer.style.maxHeight = answer.scrollHeight + 40 + 'px';
        }
      });
    });

    // Поиск + фильтр по категориям
    function applyFilters() {
      const query = (searchInput?.value || '').trim().toLowerCase();
      let visibleCount = 0;

      items.forEach(item => {
        const matchesCategory = activeCategory === 'all' || item.dataset.category === activeCategory;
        const text = item.innerText.toLowerCase();
        const matchesQuery = query === '' || text.includes(query);
        const visible = matchesCategory && matchesQuery;

        item.classList.toggle('hidden-item', !visible);
        if (visible) visibleCount++;
      });

      if (emptyMsg) emptyMsg.style.display = visibleCount === 0 ? 'block' : 'none';
    }

    searchInput?.addEventListener('input', applyFilters);

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCategory = btn.dataset.category;
        applyFilters();
      });
    });
  }

  initFaqPage();

});