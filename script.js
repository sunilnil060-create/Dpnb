/* ============================================================
   DRUK PNB BANK — JAVASCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ================================================================
     1. TICKER BAR — CLOSE
  ================================================================ */
  const tickerBar   = document.getElementById('tickerBar');
  const tickerClose = document.getElementById('tickerClose');

  if (tickerClose && tickerBar) {
    tickerClose.addEventListener('click', () => {
  tickerBar.style.transition = 'max-height 0.4s ease, opacity 0.3s ease, padding 0.4s ease';
  tickerBar.style.maxHeight  = tickerBar.scrollHeight + 'px';
  tickerBar.style.overflow   = 'hidden';
  requestAnimationFrame(() => {
    tickerBar.style.maxHeight = '0';
    tickerBar.style.opacity   = '0';
    tickerBar.style.padding   = '0';
  });
 setTimeout(() => {
    tickerBar.remove();
    navbar.style.top = '0px';
    document.body.style.paddingTop = '68px';
    navMenu.style.paddingTop = '68px'; // ← ADD THIS
  }, 420);
});
  }


  /* ================================================================
     2. NAVBAR — SCROLL SHADOW + STICKY
  ================================================================ */
  const navbar = document.getElementById('navbar');

  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });


  /* ================================================================
     3. HAMBURGER / MOBILE NAV
  ================================================================ */
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('navMenu');
  let closeTimer  = null;

  function resetHamburger() {
    const spans = hamburger?.querySelectorAll('span');
    if (!spans) return;
    spans[0].style.transform = '';
    spans[1].style.opacity   = '';
    spans[2].style.transform = '';
  }

  function closeMobileMenu() {
    if (!navMenu) return;
    navMenu.classList.remove('open');
    document.body.style.overflow = '';
    resetHamburger();
    closeAllDropdownsInstant();
  }

  function closeAllDropdownsInstant() {
    clearTimeout(closeTimer);
    document.querySelectorAll('.nav-group').forEach(g => {
      g.classList.remove('open');
      const arrow = g.querySelector('.nav-btn i');
      if (arrow) arrow.style.transform = '';
    });
  }

  function scheduleClose(group) {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(() => {
      group.classList.remove('open');
      const arrow = group.querySelector('.nav-btn i');
      if (arrow) arrow.style.transform = '';
    }, 400);
  }

  function cancelClose() {
    clearTimeout(closeTimer);
  }

  if (hamburger && navMenu) {

    /* -- Hamburger toggle -- */
    hamburger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('open');
      const spans  = hamburger.querySelectorAll('span');
      spans[0].style.transform = isOpen ? 'rotate(45deg) translate(5px, 5px)'  : '';
      spans[1].style.opacity   = isOpen ? '0'                                    : '';
      spans[2].style.transform = isOpen ? 'rotate(-45deg) translate(5px, -5px)' : '';
      document.body.style.overflow = isOpen ? 'hidden' : '';
      if (!isOpen) closeAllDropdownsInstant();
    });

    /* -- Desktop: hover open/close with gap protection -- */
    document.querySelectorAll('.nav-group').forEach(group => {

      group.addEventListener('mouseenter', () => {
        if (window.innerWidth <= 960) return;
        cancelClose();
        document.querySelectorAll('.nav-group').forEach(g => {
          if (g !== group) {
            g.classList.remove('open');
            const arrow = g.querySelector('.nav-btn i');
            if (arrow) arrow.style.transform = '';
          }
        });
        group.classList.add('open');
      });

      group.addEventListener('mouseleave', () => {
        if (window.innerWidth <= 960) return;
        scheduleClose(group);
      });

      const panel = group.querySelector('.mega-panel');
      if (panel) {
        panel.addEventListener('mouseenter', () => {
          if (window.innerWidth <= 960) return;
          cancelClose();
        });
        panel.addEventListener('mouseleave', () => {
          if (window.innerWidth <= 960) return;
          scheduleClose(group);
        });
      }
    });

    /* -- Mobile: tap nav-btn to expand/collapse submenu -- */
    document.querySelectorAll('.nav-group .nav-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (window.innerWidth > 960) return;
        e.preventDefault();
        e.stopPropagation();
        const group  = btn.closest('.nav-group');
        const isOpen = group.classList.contains('open');
        document.querySelectorAll('.nav-group').forEach(g => {
          g.classList.remove('open');
          const arrow = g.querySelector('.nav-btn i');
          if (arrow) arrow.style.transform = '';
        });
        if (!isOpen) {
          group.classList.add('open');
          const arrow = group.querySelector('.nav-btn i');
          if (arrow) arrow.style.transform = 'rotate(180deg)';
        }
      });
    });

    /* -- Mobile: tapping links inside mega panel --
       FIX: always call e.preventDefault() on href="#" so the browser
       does NOT scroll to the top of the page (which made the menu
       visually disappear). Only close the menu for real URLs.        -- */
    document.querySelectorAll('.mega-col a').forEach(link => {
      link.addEventListener('click', (e) => {
        if (window.innerWidth > 960) return;
        const href = link.getAttribute('href');
        if (!href || href === '#') {
          e.preventDefault();   /* ← KEY FIX: stop scroll-to-top */
          return;               /* keep menu open, link is a placeholder */
        }
        /* Real link: let browser navigate and close the menu */
        closeMobileMenu();
      });
    });

    /* -- Mobile: plain nav-links (Forex Rates, Contact) close menu -- */
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth > 960) return;
        closeMobileMenu();
      });
    });

    /* -- Close menu when tapping OUTSIDE the navbar -- */
    document.addEventListener('click', (e) => {
      if (window.innerWidth > 960) return;
      if (navMenu.classList.contains('open') && !navbar.contains(e.target)) {
        closeMobileMenu();
      }
    });

    /* -- Reset on resize to desktop -- */
    window.addEventListener('resize', () => {
      if (window.innerWidth > 960) {
        navMenu.classList.remove('open');
        document.body.style.overflow = '';
        resetHamburger();
        closeAllDropdownsInstant();
      }
    });

  } /* end if (hamburger && navMenu) */


  /* ================================================================
     4. RATES TABS
  ================================================================ */
  const rtabs   = document.querySelectorAll('.rtab');
  const rpanels = document.querySelectorAll('.rtab-panel');

  rtabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');
      rtabs.forEach(t => t.classList.remove('active'));
      rpanels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById(target);
      if (panel) panel.classList.add('active');
    });
  });


  /* ================================================================
     5. EMI CALCULATOR — BHUTAN CORRECT (Reducing + Flat Rate)
  ================================================================ */
  var currentLoanType = 'home';
  var schedView       = 'm';
  var schedShowAll    = false;
  var calcData        = {};

  var loanConfig = {
    home:     { method: 'reducing', rateMin: 7,  rateMax: 12, amtMax: 5000000, tenMax: 20, defaultRate: 8.5,  defaultTen: 15, defaultAmt: 1500000 },
    business: { method: 'reducing', rateMin: 8,  rateMax: 14, amtMax: 5000000, tenMax: 15, defaultRate: 9.5,  defaultTen: 7,  defaultAmt: 1000000 },
    vehicle:  { method: 'flat',     rateMin: 8,  rateMax: 14, amtMax: 2000000, tenMax: 7,  defaultRate: 9.0,  defaultTen: 5,  defaultAmt: 300000  },
    personal: { method: 'flat',     rateMin: 10, rateMax: 18, amtMax: 500000,  tenMax: 5,  defaultRate: 11.0, defaultTen: 3,  defaultAmt: 100000  }
  };

  window.setLoanType = function(type) {
    currentLoanType = type;
    document.querySelectorAll('.lt-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.loan === type);
    });
    const cfg      = loanConfig[type];
    const slAmount = document.getElementById('slAmount');
    const slRate   = document.getElementById('slRate');
    const slTenure = document.getElementById('slTenure');
    slAmount.max = cfg.amtMax;    slAmount.value = cfg.defaultAmt;
    slRate.min   = cfg.rateMin;   slRate.max = cfg.rateMax; slRate.value = cfg.defaultRate;
    slTenure.max = cfg.tenMax;    slTenure.value = cfg.defaultTen;

    const note     = document.getElementById('methodNote');
    const noteText = document.getElementById('methodNoteText');
    if (cfg.method === 'reducing') {
      note.className       = 'method-note reducing';
      noteText.textContent = 'Reducing balance method — interest recalculated monthly on outstanding principal. Standard for home, mortgage, and business loans as per RMA guidelines.';
    } else {
      note.className       = 'method-note flat';
      noteText.textContent = 'Flat rate method — interest calculated on the full original loan amount for the entire tenure. Used in Bhutan for vehicle and personal loans. The effective rate is roughly 1.8× the stated rate.';
    }
    computeEMI();
  };

  function approxReducingEquiv(flatRate, years) {
    return flatRate * (2 * years) / (years + 1) * 0.9;
  }

  function formatNu(n) {
    return 'Nu. ' + Math.round(n).toLocaleString('en-IN');
  }

  function updateSliderTrack(slider) {
    if (!slider) return;
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const val = parseFloat(slider.value) || 0;
    const pct = ((val - min) / (max - min)) * 100;
    slider.style.background =
      `linear-gradient(to right, var(--saffron) ${pct}%, var(--n200) ${pct}%)`;
  }

  function computeEMI() {
    const slAmount = document.getElementById('slAmount');
    const slRate   = document.getElementById('slRate');
    const slTenure = document.getElementById('slTenure');
    if (!slAmount) return;

    const P       = parseInt(slAmount.value);
    const annRate = parseFloat(slRate.value);
    const years   = parseInt(slTenure.value);
    const n       = years * 12;
    const cfg     = loanConfig[currentLoanType];

    document.getElementById('dispAmount').textContent = formatNu(P);
    document.getElementById('dispRate').textContent   = annRate.toFixed(1) + '%';
    document.getElementById('dispTenure').textContent = years + (years === 1 ? ' Year' : ' Years');

    let emi, totalPay, totalInt;
    let schedule = [], yearlyData = [];

    if (cfg.method === 'reducing') {
      const r  = annRate / 12 / 100;
      emi      = r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      totalPay = emi * n;
      totalInt = totalPay - P;

      let bal = P;
      for (let m = 1; m <= n; m++) {
        const intPart  = bal * r;
        const prinPart = emi - intPart;
        bal = Math.max(0, bal - prinPart);
        schedule.push({ period: 'Month ' + m, emi, principal: prinPart, interest: intPart, balance: bal });
      }
      document.getElementById('emiSubText').textContent  = n + ' months · reducing balance';
      document.getElementById('equivNote').style.display = 'none';

    } else {
      const flatIntPerMonth = (P * annRate / 100) / 12;
      const prinPerMonth    = P / n;
      emi      = prinPerMonth + flatIntPerMonth;
      totalPay = emi * n;
      totalInt = flatIntPerMonth * n;
      const equivRate = approxReducingEquiv(annRate, years);

      for (let m = 1; m <= n; m++) {
        const bal = Math.max(0, P - prinPerMonth * m);
        schedule.push({ period: 'Month ' + m, emi, principal: prinPerMonth, interest: flatIntPerMonth, balance: bal });
      }
      document.getElementById('emiSubText').textContent  = n + ' months · flat rate';
      document.getElementById('equivNote').style.display = 'flex';
      document.getElementById('equivVal').textContent    = '~' + equivRate.toFixed(1) + '% p.a.';
    }

    for (let y = 0; y < years; y++) {
      const slice = schedule.slice(y * 12, (y + 1) * 12);
      yearlyData.push({
        label:     'Year ' + (y + 1),
        principal: slice.reduce((s, r) => s + r.principal, 0),
        interest:  slice.reduce((s, r) => s + r.interest,  0)
      });
    }

    document.getElementById('resEMI').textContent      = formatNu(emi);
    document.getElementById('resEMI2').textContent     = formatNu(emi);
    document.getElementById('resInterest').textContent = formatNu(totalInt);
    document.getElementById('resTotal').textContent    = formatNu(totalPay);

    calcData     = { P, annRate, years, n, emi, totalPay, totalInt, schedule, yearlyData };
    schedShowAll = false;
    renderSchedule();

    [slAmount, slRate, slTenure].forEach(s => updateSliderTrack(s));
  }

  function renderSchedule() {
    const tbody = document.getElementById('schedBody');
    if (!tbody) return;

    tbody.innerHTML = '';

    const rows  = schedView === 'y' ? calcData.yearlyData : calcData.schedule;
    const limit = (schedView === 'y')
                  ? rows.length
                  : (schedShowAll ? rows.length : Math.min(12, rows.length));

    let runningBalance = calcData.P;

    rows.slice(0, limit).forEach((row) => {
      let emi       = row.emi;
      let principal = row.principal;
      let interest  = row.interest;
      let balance;

      if (schedView === 'y') {
        emi            = row.principal + row.interest;
        runningBalance -= row.principal;
        balance        = runningBalance;
      } else {
        balance = row.balance;
      }

      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="color:var(--n700);font-weight:500">${schedView === 'y' ? row.label : row.period}</td>
        <td style="color:var(--n900);font-weight:600">${formatNu(emi)}</td>
        <td style="color:#8B1E3F;font-weight:700">${formatNu(principal)}</td>
        <td style="color:#B45309;font-weight:700">${formatNu(interest)}</td>
        <td style="color:var(--n700)">${formatNu(Math.max(0, balance))}</td>
      `;
      tbody.appendChild(tr);
    });

    const showMoreBtn = document.getElementById('showMoreBtn');
    if (showMoreBtn) {
      if (schedView === 'y' || schedShowAll || rows.length <= 12) {
        showMoreBtn.style.display = 'none';
      } else {
        showMoreBtn.style.display = 'block';
        showMoreBtn.textContent   = 'Show all ' + rows.length + ' rows ↓';
      }
    }
  } /* end renderSchedule */


  window.setSchedView = function(view) {
    schedView    = view;
    schedShowAll = false;
    const tabM = document.getElementById('tabM');
    const tabY = document.getElementById('tabY');
    if (tabM) tabM.classList.toggle('active', view === 'm');
    if (tabY) tabY.classList.toggle('active', view === 'y');
    renderSchedule();
  };

  window.toggleSchedule = function() {
    schedShowAll = !schedShowAll;
    renderSchedule();
  };

  ['slAmount', 'slRate', 'slTenure'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => { computeEMI(); });
  });

  computeEMI();


  /* ================================================================
     6. ANIMATED STAT COUNTERS (Hero Metrics)
  ================================================================ */
  function animateCount(el, target, duration = 2000) {
    const start = performance.now();
    const step  = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3);
      const current  = Math.floor(eased * target);
      el.textContent = current.toLocaleString('en-IN');
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toLocaleString('en-IN');
    };
    requestAnimationFrame(step);
  }

  const metricEls = document.querySelectorAll('.metric-val[data-target]');
  if (metricEls.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el     = entry.target;
          const target = parseInt(el.getAttribute('data-target'), 10);
          animateCount(el, target);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    metricEls.forEach(el => counterObserver.observe(el));
  }


  /* ================================================================
     7. SCROLL REVEAL — .reveal elements
  ================================================================ */
  const revealEls = document.querySelectorAll(
    '.scard, .why-card, .news-card, .qb-item, .cresult, .cinfo-item'
  );
  revealEls.forEach((el, idx) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${(idx % 4) * 0.07}s`;
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


  /* ================================================================
     8. BANK CARD 3D TILT
  ================================================================ */
  const bankCard = document.getElementById('bankCard');
  if (bankCard) {
    bankCard.addEventListener('mousemove', (e) => {
      const rect  = bankCard.getBoundingClientRect();
      const x     = e.clientX - rect.left;
      const y     = e.clientY - rect.top;
      const rotX  = ((y - rect.height / 2) / rect.height) * -12;
      const rotY  = ((x - rect.width  / 2) / rect.width)  *  16;
      bankCard.style.transform  = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
      bankCard.style.transition = 'transform 0.1s ease';
    });
    bankCard.addEventListener('mouseleave', () => {
      bankCard.style.transform  = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
      bankCard.style.transition = 'transform 0.5s ease';
    });
  }


  /* ================================================================
     9. MODAL — OPEN / CLOSE
  ================================================================ */
  const modalBg = document.getElementById('modalBg');

  window.openModal = function () {
    modalBg.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeModal = function () {
    modalBg.classList.remove('open');
    document.body.style.overflow = '';
  };

  modalBg?.addEventListener('click', (e) => {
    if (e.target === modalBg) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  const accountForm = document.getElementById('accountForm');
  if (accountForm) {
    accountForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn  = accountForm.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
      btn.disabled  = true;
      setTimeout(() => {
        closeModal();
        showToast('✓ Application submitted! Our team will contact you within 24 hours.');
        accountForm.reset();
        btn.innerHTML = orig;
        btn.disabled  = false;
      }, 1600);
    });
  }


  /* ================================================================
     10. CONTACT FORM SUBMISSION
  ================================================================ */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn  = contactForm.querySelector('button[type="submit"]');
      const orig = btn.innerHTML;
      btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
      btn.disabled  = true;
      setTimeout(() => {
        btn.innerHTML        = '<i class="fas fa-check"></i> Message Sent!';
        btn.style.background = 'linear-gradient(135deg, #0E7C7B, #1aA09F)';
        showToast('✓ Thank you! We\'ll get back to you within 1 business day.');
        contactForm.reset();
        setTimeout(() => {
          btn.innerHTML        = orig;
          btn.style.background = '';
          btn.disabled         = false;
        }, 3000);
      }, 1400);
    });
  }


  /* ================================================================
     11. TOAST NOTIFICATION
  ================================================================ */
  window.showToast = function (message, duration = 4500) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
  };


  /* ================================================================
     12. BACK TO TOP
  ================================================================ */
  const btt = document.getElementById('btt');
  if (btt) {
    window.addEventListener('scroll', () => {
      btt.classList.toggle('show', window.scrollY > 500);
    }, { passive: true });
    btt.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  /* ================================================================
     13. SMOOTH ANCHOR SCROLL
     — Always preventDefault on href="#" so page never jumps to top
  ================================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href === '#') {
        e.preventDefault();   /* ← KEY FIX: stop scroll-to-top on # links */
        return;
      }
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = target.getBoundingClientRect().top + window.scrollY - (navbar?.offsetHeight || 68) - 12;
      window.scrollTo({ top: offset, behavior: 'smooth' });
      if (window.innerWidth <= 960) {
        closeMobileMenu();
      }
    });
  });


  /* ================================================================
     14. QUICK BAR — RIPPLE EFFECT ON CLICK
  ================================================================ */
  document.querySelectorAll('.qb-item').forEach(item => {
    item.addEventListener('click', (e) => {
      if (item.getAttribute('href') === '#' || item.getAttribute('href') === null) e.preventDefault();
      const ripple = document.createElement('span');
      const rect   = item.getBoundingClientRect();
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(212, 168, 83, 0.25);
        width: 120px;
        height: 120px;
        left: ${e.clientX - rect.left - 60}px;
        top: ${e.clientY - rect.top - 60}px;
        transform: scale(0);
        animation: ripple 0.5s ease forwards;
        pointer-events: none;
      `;
      item.style.position = 'relative';
      item.style.overflow = 'hidden';
      item.appendChild(ripple);
      setTimeout(() => ripple.remove(), 520);
    });
  });

  const style = document.createElement('style');
  style.textContent = `@keyframes ripple { to { transform: scale(3); opacity: 0; } }`;
  document.head.appendChild(style);


  /* ================================================================
     15. SCREEN MOCKUP ANIMATION (Internet Banking Section)
  ================================================================ */
  const screenMockup = document.querySelector('.screen-mockup');
  if (screenMockup) {
    const txnObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.stxn').forEach((el, i) => {
            el.style.opacity    = '0';
            el.style.transform  = 'translateX(-8px)';
            el.style.transition = `all 0.4s ease ${0.3 + i * 0.15}s`;
            requestAnimationFrame(() => {
              el.style.opacity   = '1';
              el.style.transform = 'translateX(0)';
            });
          });
          txnObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    txnObserver.observe(screenMockup);
  }


  /* ================================================================
     16. ACTIVE NAV LINK ON SECTION SCROLL
  ================================================================ */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const isActive        = link.getAttribute('href') === '#' + id;
          link.style.color      = isActive ? 'var(--gold)' : '';
          link.style.fontWeight = isActive ? '700' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObs.observe(s));


  /* ================================================================
     17. HERO CARD FLOATING PILL ENTRANCE
  ================================================================ */
  const fps = document.querySelectorAll('.floating-pill');
  fps.forEach((fp, i) => {
    fp.style.opacity    = '0';
    fp.style.transform  = 'translateY(15px) scale(0.9)';
    fp.style.transition = `all 0.5s ease ${0.6 + i * 0.25}s`;
    setTimeout(() => {
      fp.style.opacity   = '1';
      fp.style.transform = 'translateY(0) scale(1)';
    }, 100);
  });


  /* ================================================================
     18. CONSOLE SIGNATURE
  ================================================================ */
  console.log('%cDruk PNB Bank — Modern Redesign ✓', 'color:#D4A853;font-size:14px;font-weight:bold;');
  console.log('%cKingdom of Bhutan 🐉 | Your Partner in Growth', 'color:#0A1628;font-size:11px;');

}); // end DOMContentLoaded
/* ============================================================
   DRUK PNB BANK — NEW HERO SLIDER  (hero-slider.js)
   Replace the old hero-slider.js entirely with this file.
   Self-contained IIFE — no global pollution.
   Snappy 380ms cross-fade, no widget animations to slow it down.
   ============================================================ */

/* ============================================================
   DRUK PNB BANK — HERO v2 JS  (hero-v2.js)
   Two independent loops:
     A) Main card slider (3 cards, 6s interval) — synced with
        the bottom dots + prev/next arrows
     B) Right image slider (4 images, 3.5s interval) — synced
        with the vertical dots + up/down nav buttons
   ============================================================ */

(function () {
  'use strict';

  /* ── Config ── */
  var CARD_COUNT  = 3;
  var IMG_COUNT   = 4;
  var CARD_MS     = 6000;
  var IMG_MS      = 3500;
  var TRANS_MS    = 600;

  /* ─────────────────────────────────────────
     A. MAIN CARD SLIDER
  ───────────────────────────────────────── */
  var cards      = document.querySelectorAll('.hv2-card');
  var dots       = document.querySelectorAll('#hv2Dots .hv2-dot');
  var prevBtn    = document.getElementById('hv2Prev');
  var nextBtn    = document.getElementById('hv2Next');
  var playBtn    = document.getElementById('hv2Play');
  var playIcon   = document.getElementById('hv2PlayIcon');
  var progressEl = document.getElementById('hv2Progress');

  if (!cards.length) return;

  var curCard    = 0;
  var isPlaying  = true;
  var isAnim     = false;
  var cardTimer;

  function goCard(idx) {
    if (isAnim || idx === curCard) return;
    idx = ((idx % CARD_COUNT) + CARD_COUNT) % CARD_COUNT;
    isAnim = true;

    cards[curCard].classList.add('hv2-exit');
    cards[curCard].classList.remove('active');

    setTimeout(function () {
      cards[curCard].classList.remove('hv2-exit');
      curCard = idx;
      cards[curCard].classList.add('active');
      isAnim = false;
    }, TRANS_MS);

    updateCardDots(idx);
    if (isPlaying) restartProgress();
  }

  function nextCard() { goCard(curCard + 1); }
  function prevCard() { goCard(curCard - 1); }

  function updateCardDots(idx) {
    dots.forEach(function (d, i) {
      var fill = d.querySelector('.hv2-dot-fill');
      d.classList.toggle('active', i === idx);
      fill.style.animation = 'none';
      fill.style.width = '0%';
      void fill.offsetWidth;
      if (i === idx && isPlaying) {
        d.style.setProperty('--hv2-dur', (CARD_MS / 1000) + 's');
        fill.style.animation = 'hv2DotFill ' + (CARD_MS / 1000) + 's linear forwards';
      }
    });
  }

  function restartProgress() {
    if (!progressEl) return;
    progressEl.style.transition = 'none';
    progressEl.style.width = '0%';
    void progressEl.offsetWidth;
    progressEl.style.transition = 'width ' + CARD_MS + 'ms linear';
    progressEl.style.width = '100%';
  }

  function freezeProgress() {
    if (!progressEl) return;
    var w = parseFloat(window.getComputedStyle(progressEl).width);
    var pw = progressEl.parentElement ? progressEl.parentElement.offsetWidth : 1;
    progressEl.style.transition = 'none';
    progressEl.style.width = (pw > 0 ? (w / pw * 100).toFixed(1) : 0) + '%';
  }

  function startCardAuto() {
    clearInterval(cardTimer);
    cardTimer = setInterval(nextCard, CARD_MS);
  }

  function stopCardAuto() { clearInterval(cardTimer); }

  function togglePlay() {
    isPlaying = !isPlaying;
    if (isPlaying) {
      playIcon.className = 'fas fa-pause';
      startCardAuto();
      restartProgress();
      updateCardDots(curCard);
    } else {
      playIcon.className = 'fas fa-play';
      stopCardAuto();
      freezeProgress();
      dots.forEach(function (d) {
        var fill = d.querySelector('.hv2-dot-fill');
        fill.style.animation = 'none';
        fill.style.width = d.classList.contains('active') ? fill.getBoundingClientRect().width / (d.getBoundingClientRect().width || 1) * 100 + '%' : '0%';
      });
    }
  }

  if (prevBtn) prevBtn.addEventListener('click', function () {
    prevCard();
    if (isPlaying) { stopCardAuto(); startCardAuto(); restartProgress(); }
  });
  if (nextBtn) nextBtn.addEventListener('click', function () {
    nextCard();
    if (isPlaying) { stopCardAuto(); startCardAuto(); restartProgress(); }
  });
  if (playBtn) playBtn.addEventListener('click', togglePlay);

  dots.forEach(function (d, i) {
    d.addEventListener('click', function () {
      goCard(i);
      if (isPlaying) { stopCardAuto(); startCardAuto(); restartProgress(); }
    });
  });

  /* Pause on hover */
  var hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mouseenter', function () {
      if (isPlaying) { stopCardAuto(); freezeProgress(); }
    });
    hero.addEventListener('mouseleave', function () {
      if (isPlaying) { startCardAuto(); restartProgress(); }
    });
  }

  /* Keyboard */
  document.addEventListener('keydown', function (e) {
    if (!hero) return;
    var r = hero.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    if (e.key === 'ArrowRight') { nextCard(); if (isPlaying) { stopCardAuto(); startCardAuto(); restartProgress(); } }
    if (e.key === 'ArrowLeft')  { prevCard(); if (isPlaying) { stopCardAuto(); startCardAuto(); restartProgress(); } }
    if (e.key === ' ') { e.preventDefault(); togglePlay(); }
  });

  /* Touch / swipe on hero */
  var touchStartX = 0;
  if (hero) {
    hero.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    hero.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 48) {
        if (diff > 0) { nextCard(); } else { prevCard(); }
        if (isPlaying) { stopCardAuto(); startCardAuto(); restartProgress(); }
      }
    }, { passive: true });
  }

  /* Init card slider */
  dots.forEach(function (d) { d.style.setProperty('--hv2-dur', (CARD_MS / 1000) + 's'); });
  updateCardDots(0);
  startCardAuto();
  restartProgress();


  /* ─────────────────────────────────────────
     B. RIGHT IMAGE SLIDER (independent)
  ───────────────────────────────────────── */
  var imgSlides = document.querySelectorAll('#hv2ImgStage .hv2-img-slide');
  var vdots     = document.querySelectorAll('#hv2Vdots .hv2-vdot');
  var counterEl = document.getElementById('hv2Cur');
  var upBtn     = document.getElementById('hv2Up');
  var downBtn   = document.getElementById('hv2Down');

  if (!imgSlides.length) return;

  var curImg    = 0;
  var imgAnim   = false;
  var imgTimer;

  function goImg(idx) {
    if (imgAnim) return;
    idx = ((idx % IMG_COUNT) + IMG_COUNT) % IMG_COUNT;
    if (idx === curImg) return;
    imgAnim = true;

    imgSlides[curImg].classList.add('hv2-exit');
    imgSlides[curImg].classList.remove('active');

    var prev = curImg;
    curImg = idx;

    setTimeout(function () {
      imgSlides[prev].classList.remove('hv2-exit');
      imgSlides[curImg].classList.add('active');
      imgAnim = false;
    }, TRANS_MS);

    updateVdots(idx);
    if (counterEl) counterEl.textContent = String(idx + 1).padStart(2, '0');
  }

  function nextImg() { goImg(curImg + 1); }
  function prevImg() { goImg(curImg - 1); }

  function updateVdots(idx) {
    vdots.forEach(function (d, i) {
      var fill = d.querySelector('.hv2-vdot-fill');
      d.classList.toggle('active', i === idx);
      fill.style.animation = 'none';
      fill.style.height = '0%';
      void fill.offsetWidth;
      if (i === idx) {
        d.style.setProperty('--hv2-img-dur', (IMG_MS / 1000) + 's');
        fill.style.animation = 'hv2VDotFill ' + (IMG_MS / 1000) + 's linear forwards';
      }
    });
  }

  function startImgAuto() {
    clearInterval(imgTimer);
    imgTimer = setInterval(nextImg, IMG_MS);
  }

  if (upBtn)   upBtn.addEventListener('click', function () { prevImg(); clearInterval(imgTimer); startImgAuto(); });
  if (downBtn) downBtn.addEventListener('click', function () { nextImg(); clearInterval(imgTimer); startImgAuto(); });

  vdots.forEach(function (d, i) {
    d.addEventListener('click', function () {
      goImg(i);
      clearInterval(imgTimer);
      startImgAuto();
    });
  });

  /* Init image slider */
  vdots.forEach(function (d) { d.style.setProperty('--hv2-img-dur', (IMG_MS / 1000) + 's'); });
  updateVdots(0);
  startImgAuto();

})();/* ============================================================
   DRUK PNB BANK — HERO v2 JS  (hero-v2.js)
   Two independent loops:
     A) Main card slider (3 cards, 6s interval) — synced with
        the bottom dots + prev/next arrows
     B) Right image slider (4 images, 3.5s interval) — synced
        with the vertical dots + up/down nav buttons
   ============================================================ */

(function () {
  'use strict';

  /* ── Config ── */
  var CARD_COUNT  = 3;
  var IMG_COUNT   = 4;
  var CARD_MS     = 6000;
  var IMG_MS      = 3500;
  var TRANS_MS    = 600;

  /* ─────────────────────────────────────────
     A. MAIN CARD SLIDER
  ───────────────────────────────────────── */
  var cards      = document.querySelectorAll('.hv2-card');
  var dots       = document.querySelectorAll('#hv2Dots .hv2-dot');
  var progressEl = document.getElementById('hv2Progress');

  if (!cards.length) return;

  var curCard    = 0;
  var isPlaying  = true;
  var isAnim     = false;
  var cardTimer;

  function goCard(idx) {
    if (isAnim || idx === curCard) return;
    idx = ((idx % CARD_COUNT) + CARD_COUNT) % CARD_COUNT;
    isAnim = true;

    cards[curCard].classList.add('hv2-exit');
    cards[curCard].classList.remove('active');

    setTimeout(function () {
      cards[curCard].classList.remove('hv2-exit');
      curCard = idx;
      cards[curCard].classList.add('active');
      isAnim = false;
    }, TRANS_MS);

    updateCardDots(idx);
    if (isPlaying) restartProgress();
  }

  function nextCard() { goCard(curCard + 1); }
  function prevCard() { goCard(curCard - 1); }

  function updateCardDots(idx) {
    dots.forEach(function (d, i) {
      var fill = d.querySelector('.hv2-dot-fill');
      d.classList.toggle('active', i === idx);
      fill.style.animation = 'none';
      fill.style.width = '0%';
      void fill.offsetWidth;
      if (i === idx && isPlaying) {
        d.style.setProperty('--hv2-dur', (CARD_MS / 1000) + 's');
        fill.style.animation = 'hv2DotFill ' + (CARD_MS / 1000) + 's linear forwards';
      }
    });
  }

  function restartProgress() {
    if (!progressEl) return;
    progressEl.style.transition = 'none';
    progressEl.style.width = '0%';
    void progressEl.offsetWidth;
    progressEl.style.transition = 'width ' + CARD_MS + 'ms linear';
    progressEl.style.width = '100%';
  }

  function freezeProgress() {
    if (!progressEl) return;
    var w = parseFloat(window.getComputedStyle(progressEl).width);
    var pw = progressEl.parentElement ? progressEl.parentElement.offsetWidth : 1;
    progressEl.style.transition = 'none';
    progressEl.style.width = (pw > 0 ? (w / pw * 100).toFixed(1) : 0) + '%';
  }

  function startCardAuto() {
    clearInterval(cardTimer);
    cardTimer = setInterval(nextCard, CARD_MS);
  }

  function stopCardAuto() { clearInterval(cardTimer); }

  dots.forEach(function (d, i) {
    d.addEventListener('click', function () {
      goCard(i);
      if (isPlaying) { stopCardAuto(); startCardAuto(); restartProgress(); }
    });
  });

  /* Pause on hover */
  var hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mouseenter', function () {
      if (isPlaying) { stopCardAuto(); freezeProgress(); }
    });
    hero.addEventListener('mouseleave', function () {
      if (isPlaying) { startCardAuto(); restartProgress(); }
    });
  }

  /* Keyboard */
  document.addEventListener('keydown', function (e) {
    if (!hero) return;
    var r = hero.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    if (e.key === 'ArrowRight') { nextCard(); if (isPlaying) { stopCardAuto(); startCardAuto(); restartProgress(); } }
    if (e.key === 'ArrowLeft')  { prevCard(); if (isPlaying) { stopCardAuto(); startCardAuto(); restartProgress(); } }
  });

  /* Touch / swipe on hero */
  var touchStartX = 0;
  if (hero) {
    hero.addEventListener('touchstart', function (e) {
      touchStartX = e.changedTouches[0].clientX;
    }, { passive: true });
    hero.addEventListener('touchend', function (e) {
      var diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 48) {
        if (diff > 0) { nextCard(); } else { prevCard(); }
        if (isPlaying) { stopCardAuto(); startCardAuto(); restartProgress(); }
      }
    }, { passive: true });
  }

  /* Init card slider */
  dots.forEach(function (d) { d.style.setProperty('--hv2-dur', (CARD_MS / 1000) + 's'); });
  updateCardDots(0);
  startCardAuto();
  restartProgress();


  /* ─────────────────────────────────────────
     B. RIGHT IMAGE SLIDER (independent)
  ───────────────────────────────────────── */
  var imgSlides = document.querySelectorAll('#hv2ImgStage .hv2-img-slide');
  var vdots     = document.querySelectorAll('#hv2Vdots .hv2-vdot');
  var counterEl = document.getElementById('hv2Cur');

  if (!imgSlides.length) return;

  var curImg    = 0;
  var imgAnim   = false;
  var imgTimer;

  function goImg(idx) {
    if (imgAnim) return;
    idx = ((idx % IMG_COUNT) + IMG_COUNT) % IMG_COUNT;
    if (idx === curImg) return;
    imgAnim = true;

    imgSlides[curImg].classList.add('hv2-exit');
    imgSlides[curImg].classList.remove('active');

    var prev = curImg;
    curImg = idx;

    setTimeout(function () {
      imgSlides[prev].classList.remove('hv2-exit');
      imgSlides[curImg].classList.add('active');
      imgAnim = false;
    }, TRANS_MS);

    updateVdots(idx);
    if (counterEl) counterEl.textContent = String(idx + 1).padStart(2, '0');
  }

  function nextImg() { goImg(curImg + 1); }
  function prevImg() { goImg(curImg - 1); }

  function updateVdots(idx) {
    vdots.forEach(function (d, i) {
      var fill = d.querySelector('.hv2-vdot-fill');
      d.classList.toggle('active', i === idx);
      fill.style.animation = 'none';
      fill.style.height = '0%';
      void fill.offsetWidth;
      if (i === idx) {
        d.style.setProperty('--hv2-img-dur', (IMG_MS / 1000) + 's');
        fill.style.animation = 'hv2VDotFill ' + (IMG_MS / 1000) + 's linear forwards';
      }
    });
  }

  function startImgAuto() {
    clearInterval(imgTimer);
    imgTimer = setInterval(nextImg, IMG_MS);
  }

  vdots.forEach(function (d, i) {
    d.addEventListener('click', function () {
      goImg(i);
      clearInterval(imgTimer);
      startImgAuto();
    });
  });

  /* Init image slider */
  vdots.forEach(function (d) { d.style.setProperty('--hv2-img-dur', (IMG_MS / 1000) + 's'); });
  updateVdots(0);
  startImgAuto();

})();