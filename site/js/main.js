/* ==========================================================================
   Rústico Burguer VR — interações da landing page
   Os dados (cardápio, preços, horários, links) ficam em js/data.js
   ========================================================================== */
(() => {
  'use strict';

  const D = window.RUSTICO;
  if (!D) return;

  const root = document.documentElement;
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const byId = Object.fromEntries(D.menu.map((item) => [item.id, item]));

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const money = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  const priceHTML = (v) => {
    const [int, cents] = v.toFixed(2).split('.');
    return `<span class="price"><span class="sr-only">${money(v)}</span><span class="price-cur" aria-hidden="true">R$</span><span aria-hidden="true">${int}</span><span class="price-cents" aria-hidden="true">,${cents}</span></span>`;
  };
  const orderAttrs = () => `href="${esc(D.orderUrl)}" target="_blank" rel="noopener"`;
  const photo = (item) =>
    item.img
      ? `<img src="img/menu/${item.img}.webp" width="200" height="200" alt="${esc(item.name)}" loading="lazy" decoding="async">`
      : '';
  const tagHTML = (tag) => (tag ? `<span class="tag${/promo|off|grátis/i.test(tag) ? ' tag--hot' : ''}">${esc(tag)}</span>` : '');

  /* ---------- Links centralizados ---------- */
  $$('[data-order]').forEach((a) => { a.href = D.orderUrl; });
  $$('[data-instagram]').forEach((a) => { a.href = D.instagramUrl; });
  $$('[data-maps]').forEach((a) => { a.href = D.mapsUrl; });
  $$('[data-year]').forEach((el) => { el.textContent = String(new Date().getFullYear()); });

  /* ---------- Intro ---------- */
  const reveal = () => root.classList.add('is-loaded');
  const minIntro = reduceMotion ? 0 : 950;
  const afterLoad = () => setTimeout(reveal, Math.max(0, minIntro - performance.now()));
  if (document.readyState === 'complete') afterLoad();
  else window.addEventListener('load', afterLoad, { once: true });
  setTimeout(reveal, 2400); // nunca segura o visitante esperando

  /* ---------- Loja aberta / fechada (horário de Brasília) ---------- */
  const DAYS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const DAYS_SHORT = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const toMin = (t) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  const hhmm = (t) => t.replace(':', 'h');
  const pad = (n) => String(n).padStart(2, '0');
  const clock = new Intl.DateTimeFormat('en-US', {
    timeZone: D.timezone, weekday: 'short', hour: 'numeric', minute: 'numeric', second: 'numeric', hourCycle: 'h23',
  });

  function nowInStore() {
    const p = {};
    clock.formatToParts(new Date()).forEach(({ type, value }) => { p[type] = value; });
    return {
      day: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday),
      mins: (Number(p.hour) % 24) * 60 + Number(p.minute),
      secs: Number(p.second),
    };
  }

  // Janela de funcionamento de um dia; aceita fechamento depois da meia-noite.
  function windowFor(day) {
    const h = D.hours[day];
    if (!h) return null;
    const open = toMin(h[0]);
    let close = toMin(h[1]);
    if (close <= open) close += 1440;
    return { open, close, h };
  }

  function getStatus() {
    const { day, mins, secs } = nowInStore();
    const yesterday = windowFor((day + 6) % 7);
    if (yesterday && yesterday.close > 1440 && mins < yesterday.close - 1440) {
      return { open: true, closeAt: yesterday.h[1], left: (yesterday.close - 1440 - mins) * 60 - secs };
    }
    const today = windowFor(day);
    if (today) {
      if (mins >= today.open && mins < today.close) return { open: true, closeAt: today.h[1], left: (today.close - mins) * 60 - secs };
      if (mins < today.open) return { open: false, openAt: today.h[0], when: 'hoje', whenShort: 'hoje', left: (today.open - mins) * 60 - secs };
    }
    for (let i = 1; i <= 7; i++) {
      const d = (day + i) % 7;
      const w = windowFor(d);
      if (w) {
        return {
          open: false,
          openAt: w.h[0],
          when: i === 1 ? 'amanhã' : DAYS[d],
          whenShort: i === 1 ? 'amanhã' : DAYS_SHORT[d],
          left: (1440 - mins + (i - 1) * 1440 + w.open) * 60 - secs,
        };
      }
    }
    return null;
  }

  function statusTexts(s) {
    if (!s) return { long: 'Confira nosso horário', short: 'Horário' };
    if (s.open) return { long: `Aberto agora · até ${hhmm(s.closeAt)}`, short: `Aberto · até ${hhmm(s.closeAt)}` };
    return {
      long: `Fechado agora · abre ${s.when} às ${hhmm(s.openAt)}`,
      short: `Abre ${s.whenShort} ${hhmm(s.openAt)}`,
    };
  }

  function countdownHTML(s) {
    if (!s) return '';
    const h = Math.floor(s.left / 3600);
    const m = Math.floor((s.left % 3600) / 60);
    const sec = s.left % 60;
    if (s.open) {
      return s.left <= 3600
        ? `Última chamada: a cozinha fecha em <b>${Math.max(1, m)} min</b>. Corre!`
        : `Brasa acesa! Ainda dá tempo: fecha em <b>${h}h${pad(m)}</b>.`;
    }
    if (s.left < 86400) return `A brasa acende em <b>${pad(h)}:${pad(m)}:${pad(sec)}</b>`;
    return `Voltamos ${s.when} às ${hhmm(s.openAt)}. Já deixa o pedido escolhido!`;
  }

  const statusEls = $$('[data-status]');
  const statusLong = $$('[data-status-text]');
  const statusShort = $$('[data-status-short]');
  const countdownEl = $('[data-countdown]');
  let lastStatus = '';

  function tickStatus() {
    const s = getStatus();
    const t = statusTexts(s);
    if (t.long !== lastStatus) {
      lastStatus = t.long;
      const open = Boolean(s && s.open);
      statusEls.forEach((el) => {
        el.classList.toggle('is-open', open);
        el.classList.toggle('is-closed', !open);
      });
      statusLong.forEach((el) => { el.textContent = t.long; });
      statusShort.forEach((el) => { el.textContent = t.short; });
    }
    if (countdownEl) countdownEl.innerHTML = countdownHTML(s);
  }
  tickStatus();
  setInterval(tickStatus, 1000);

  const hoursEl = $('[data-hours]');
  if (hoursEl) {
    const today = nowInStore().day;
    hoursEl.innerHTML = [1, 2, 3, 4, 5, 6, 0]
      .map((d) => {
        const h = D.hours[d];
        const cls = [d === today ? 'is-today' : '', h ? '' : 'is-off'].filter(Boolean).join(' ');
        const name = DAYS[d].charAt(0).toUpperCase() + DAYS[d].slice(1);
        return `<li${cls ? ` class="${cls}"` : ''}><span>${name}${d === today ? ' <small>(hoje)</small>' : ''}</span><span>${h ? `${hhmm(h[0])} às ${hhmm(h[1])}` : 'Fechado'}</span></li>`;
      })
      .join('');
  }

  /* ---------- Ofertas ---------- */
  const offersEl = $('[data-offers]');
  if (offersEl) {
    offersEl.innerHTML = D.offers
      .map((id) => byId[id])
      .filter(Boolean)
      .map((item, i) => {
        const name = item.short || item.name;
        return `
        <div class="offer" data-reveal style="--d:${((i % 3) * 0.08).toFixed(2)}s">
          <article class="offer-card" data-tilt>
            <div class="offer-media">${photo(item)}</div>
            ${tagHTML(item.tag)}
            <h3 class="offer-name">${esc(name)}</h3>
            <p class="offer-desc">${esc(item.desc)}</p>
            <div class="offer-foot">
              ${priceHTML(item.price)}
              <a class="btn btn-primary btn-sm" ${orderAttrs()} aria-label="Pedir ${esc(name)}">Pedir</a>
            </div>
          </article>
        </div>`;
      })
      .join('');
  }

  /* ---------- Combos ---------- */
  const combosEl = $('[data-combos]');
  if (combosEl) {
    combosEl.innerHTML = D.combos
      .map((c, i) => {
        const item = byId[c.id];
        if (!item) return '';
        return `
        <div class="combo" data-reveal style="--d:${(i * 0.1).toFixed(2)}s">
          <article class="combo-card" data-tilt>
            <div class="combo-top">
              <div class="combo-media">${photo(item)}</div>
              <div>
                <span class="combo-sticker">${esc(c.sticker)}</span>
                <span class="combo-serves">${esc(c.serves)}</span>
              </div>
            </div>
            <h3>${esc(item.name)}</h3>
            <p class="combo-pitch">${esc(c.pitch)}</p>
            <ul class="combo-items">${c.items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
            <div class="combo-foot">
              ${priceHTML(item.price)}
              <a class="btn btn-primary btn-sm" ${orderAttrs()} aria-label="Quero o ${esc(item.name)}">Quero esse</a>
            </div>
          </article>
        </div>`;
      })
      .join('');
  }

  /* ---------- Fomômetro ---------- */
  const range = $('[data-hunger]');
  if (range) {
    const label = $('[data-hunger-label]');
    const result = $('[data-hunger-result]');
    const flame = $('[data-hunger-flame]');
    const levels = D.hunger;
    range.max = String(levels.length);
    let current = -1;

    const render = (animate) => {
      const idx = clamp(Number(range.value) - 1, 0, levels.length - 1);
      if (idx === current) return;
      current = idx;
      const lvl = levels[idx];
      const item = byId[lvl.id];
      if (!item) return;
      const t = idx / (levels.length - 1);
      label.textContent = lvl.label;
      range.setAttribute('aria-valuetext', `${lvl.label}: ${item.short || item.name}`);
      range.style.setProperty('--fill', `${(t * 100).toFixed(1)}%`);
      flame.style.setProperty('--s', (0.62 + t * 0.7).toFixed(2));
      flame.style.setProperty('--glow', (8 + t * 26).toFixed(0));
      result.innerHTML = `
        <article class="pick">
          <div class="pick-media">${photo(item)}</div>
          <div class="pick-body">
            <span class="pick-kicker">Pra essa fome, vai de</span>
            <h3 class="pick-name">${esc(item.short || item.name)}</h3>
            <p class="pick-why">${esc(lvl.why)}</p>
            <div class="pick-foot">
              ${priceHTML(item.price)}
              <a class="btn btn-primary" ${orderAttrs()}>Pedir esse</a>
            </div>
          </div>
        </article>`;
      if (animate && !reduceMotion && result.firstElementChild.animate) {
        result.firstElementChild.animate(
          [{ opacity: 0, transform: 'translateY(16px) scale(.97)' }, { opacity: 1, transform: 'none' }],
          { duration: 480, easing: 'cubic-bezier(.22,1,.36,1)' }
        );
      }
    };
    range.addEventListener('input', () => render(true));
    render(false);
  }

  /* ---------- Cardápio com abas ---------- */
  const tabsEl = $('[data-tabs]');
  const panel = $('[data-menu-panel]');
  if (tabsEl && panel) {
    const count = (cat) => D.menu.filter((i) => i.cat === cat).length;
    tabsEl.innerHTML = D.categories
      .map(
        (c, i) =>
          `<button class="tab" type="button" role="tab" id="tab-${c.id}" aria-controls="menu-panel" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-cat="${c.id}">${esc(c.label)}<span class="tab-count">${count(c.id)}</span></button>`
      )
      .join('');
    const tabs = $$('.tab', tabsEl);

    const itemHTML = (item, i) => `
      <article class="menu-item" style="--i:${i}">
        ${photo(item)}
        <div class="menu-item-body">
          ${tagHTML(item.tag)}
          <h3>${esc(item.name)}</h3>
          <p>${esc(item.desc)}</p>
          <div class="menu-item-foot">
            ${priceHTML(item.price)}
            <a class="btn-add" ${orderAttrs()} aria-label="Pedir ${esc(item.name)}">Pedir <span aria-hidden="true">+</span></a>
          </div>
        </div>
      </article>`;

    const drinksHTML = (items) => `
      <div class="drinks">
        ${items
          .map(
            (d) =>
              `<div class="drink"><span class="drink-name">${esc(d.name)}${d.desc ? `<small>${esc(d.desc)}</small>` : ''}</span><span class="drink-dots" aria-hidden="true"></span><span class="drink-price">${money(d.price)}</span></div>`
          )
          .join('')}
        <a class="btn btn-primary drinks-cta" ${orderAttrs()}>Pedir bebidas</a>
      </div>`;

    let active = '';
    const show = (cat, focusTab) => {
      if (cat === active) return;
      const first = !active;
      active = cat;
      tabs.forEach((t) => {
        const on = t.dataset.cat === cat;
        t.setAttribute('aria-selected', String(on));
        t.tabIndex = on ? 0 : -1;
        if (on && focusTab) t.focus();
        if (on && !first) {
          tabsEl.scrollTo({
            left: t.offsetLeft - tabsEl.clientWidth / 2 + t.offsetWidth / 2,
            behavior: reduceMotion ? 'auto' : 'smooth',
          });
        }
      });
      panel.setAttribute('aria-labelledby', `tab-${cat}`);
      const items = D.menu.filter((i) => i.cat === cat);
      const paint = () => {
        panel.innerHTML = cat === 'bebidas' ? drinksHTML(items) : items.map(itemHTML).join('');
        panel.classList.remove('is-switching');
      };
      if (first || reduceMotion) paint();
      else {
        panel.classList.add('is-switching');
        setTimeout(paint, 180);
      }
    };

    tabsEl.addEventListener('click', (e) => {
      const t = e.target.closest('.tab');
      if (t) show(t.dataset.cat);
    });
    tabsEl.addEventListener('keydown', (e) => {
      const i = tabs.findIndex((t) => t.dataset.cat === active);
      const next = { ArrowRight: (i + 1) % tabs.length, ArrowLeft: (i - 1 + tabs.length) % tabs.length, Home: 0, End: tabs.length - 1 }[e.key];
      if (next !== undefined) {
        e.preventDefault();
        show(tabs[next].dataset.cat, true);
      }
    });
    show(D.categories[0].id);
  }

  /* ---------- Gotas de cheddar ---------- */
  const drips = $('[data-drips]');
  if (drips) {
    const n = window.innerWidth < 700 ? 10 : 18;
    let html = '';
    for (let i = 0; i < n; i++) {
      const x = ((i + 0.5) / n) * 100 + (Math.random() - 0.5) * (50 / n);
      const w = 14 + Math.random() * 26;
      const h = 18 + Math.random() * 64;
      html += `<span class="drip" style="--x:${x.toFixed(2)}%;--w:${w.toFixed(0)}px;--h:${h.toFixed(0)}px;--t:${(2.8 + Math.random() * 3).toFixed(2)}s;--delay:${(-Math.random() * 5).toFixed(2)}s"></span>`;
    }
    drips.innerHTML = html;
  }

  /* ---------- Faixas infinitas (tickers e Instagram) ---------- */
  $$('[data-marquee]').forEach((track) => {
    const speed = Number(track.dataset.marquee) || 50; // px por segundo
    const perCopy = track.children.length;
    const original = track.innerHTML;
    const box = track.parentElement;
    let copies = 1;
    while (track.scrollWidth < box.clientWidth * 2 + 200 && copies < 16) {
      track.insertAdjacentHTML('beforeend', original);
      copies++;
    }
    if (copies % 2) {
      track.insertAdjacentHTML('beforeend', original);
      copies++;
    }
    Array.from(track.children)
      .slice(perCopy)
      .forEach((el) => {
        el.setAttribute('aria-hidden', 'true');
        if (el.matches('a')) el.tabIndex = -1;
      });
    track.style.setProperty('--dur', `${(track.scrollWidth / 2 / speed).toFixed(1)}s`);
  });

  /* ---------- Revelar ao rolar ---------- */
  const revealEls = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('is-in');
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-in'));
  }

  /* ---------- Contadores ---------- */
  const counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !reduceMotion) {
    const animateCount = (el) => {
      const to = Number(el.dataset.count);
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / 1600);
        el.textContent = Math.round(to * (1 - Math.pow(1 - p, 4))).toLocaleString('pt-BR');
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            cio.unobserve(en.target);
            animateCount(en.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => {
      el.textContent = '0';
      cio.observe(el);
    });
  }

  /* ---------- Troca de palavras no CTA final ---------- */
  $$('[data-rotator]').forEach((el) => {
    const words = el.dataset.rotator.split('|');
    if (reduceMotion || words.length < 2) return;
    let i = 0;
    setInterval(() => {
      el.classList.add('is-out');
      setTimeout(() => {
        i = (i + 1) % words.length;
        el.textContent = words[i];
        el.classList.remove('is-out');
      }, 320);
    }, 2400);
  });

  /* ---------- Chat animado ---------- */
  const chat = $('[data-chat]');
  if (chat) {
    const field = $('[data-chat-field]', chat);
    const user = $('[data-chat-user]', chat);
    const typing = $('[data-chat-typing]', chat);
    const bot = $('[data-chat-bot]', chat);
    const replay = $('[data-chat-replay]', chat);
    let playing = false;

    const play = async () => {
      if (playing) return;
      playing = true;
      [user, typing, bot].forEach((b) => b.classList.remove('is-visible'));
      field.textContent = '';
      if (reduceMotion) {
        user.classList.add('is-visible');
        bot.classList.add('is-visible');
        playing = false;
        return;
      }
      const text = field.dataset.text;
      field.classList.add('is-typing');
      for (let i = 1; i <= text.length; i++) {
        field.textContent = text.slice(0, i);
        await wait(28 + Math.random() * 38);
      }
      await wait(380);
      field.classList.remove('is-typing');
      field.textContent = '';
      user.classList.add('is-visible');
      await wait(450);
      typing.classList.add('is-visible');
      await wait(1400);
      typing.classList.remove('is-visible');
      bot.classList.add('is-visible');
      playing = false;
    };

    if ('IntersectionObserver' in window) {
      const chatIO = new IntersectionObserver(
        ([en]) => {
          if (en.isIntersecting) {
            chatIO.disconnect();
            play();
          }
        },
        { threshold: 0.5 }
      );
      chatIO.observe(chat);
    } else play();
    replay.addEventListener('click', play);
  }

  /* ---------- Faíscas da brasa (canvas) ---------- */
  function embers(canvas) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const count = Number(canvas.dataset.embers) || 60;
    const sprites = ['255,205,90', '255,135,35', '255,75,30'].map((rgb) => {
      const s = document.createElement('canvas');
      s.width = s.height = 32;
      const g = s.getContext('2d');
      const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
      grad.addColorStop(0, 'rgba(255,248,225,1)');
      grad.addColorStop(0.22, `rgba(${rgb},.95)`);
      grad.addColorStop(1, `rgba(${rgb},0)`);
      g.fillStyle = grad;
      g.fillRect(0, 0, 32, 32);
      return s;
    });
    let w = 0;
    let h = 0;
    let running = false;
    let inView = false;
    let raf = 0;
    const ps = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const spawn = (p, anywhere) => {
      p.x = Math.random() * w;
      p.y = anywhere ? Math.random() * h : h + 20;
      p.size = 4 + Math.random() * 11;
      p.vy = 0.35 + Math.random() * 1.15;
      p.vx = (Math.random() - 0.5) * 0.4;
      p.phase = Math.random() * Math.PI * 2;
      p.freq = 0.01 + Math.random() * 0.025;
      p.life = anywhere ? Math.random() * 300 : 0;
      p.ttl = 320 + Math.random() * 520;
      p.sprite = sprites[(Math.random() * sprites.length) | 0];
      return p;
    };
    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      for (const p of ps) {
        p.life++;
        p.phase += p.freq;
        p.x += p.vx + Math.sin(p.phase) * 0.45;
        p.y -= p.vy;
        const t = p.life / p.ttl;
        if (t >= 1 || p.y < -20) {
          spawn(p, false);
          continue;
        }
        ctx.globalAlpha = Math.max(0, Math.sin(Math.PI * t) * (0.55 + 0.45 * Math.sin(p.phase * 3)));
        const s = p.size * (1 - t * 0.5);
        ctx.drawImage(p.sprite, p.x - s / 2, p.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    const start = () => {
      if (!running && inView && !document.hidden) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    for (let i = 0; i < count; i++) ps.push(spawn({}, true));
    let resizeTimer = 0;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    });
    new IntersectionObserver(([en]) => {
      inView = en.isIntersecting;
      if (inView) start();
      else stop();
    }).observe(canvas);
    document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));
  }
  if (!reduceMotion && 'IntersectionObserver' in window) $$('[data-embers]').forEach(embers);

  /* ---------- Anatomia: o burger se desmonta com a rolagem ---------- */
  const anatomy = $('[data-anatomy]');
  let updateAnatomy = () => {};
  if (anatomy) {
    const stack = $('[data-stack]', anatomy);
    const bar = $('[data-anatomy-bar]', anatomy);
    const shadow = $('[data-burger-shadow]', anatomy);
    const cta = $('[data-anatomy-cta]', anatomy);
    const tilt = [-6, 3, -3, 4, -2, 3];
    const layers = $$('[data-layer]', anatomy).map((el, i) => ({
      el,
      art: $('.layer-art', el),
      label: $('.layer-label', el),
      off: parseFloat(el.style.getPropertyValue('--off')) || 0,
      rot: tilt[i] || 0,
      fromLeft: true,
    }));
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const isStatic = () => reduceMotion || window.innerHeight < 520;
    let inView = false;

    const measure = () => {
      layers.forEach((l) => { l.fromLeft = l.label.offsetLeft > 0; });
    };

    updateAnatomy = () => {
      if (isStatic()) {
        if (!anatomy.classList.contains('is-static')) {
          anatomy.classList.add('is-static');
          layers.forEach((l) => {
            l.el.style.transform = '';
            l.art.style.transform = '';
            l.label.style.opacity = '';
            l.label.style.transform = '';
          });
        }
        return;
      }
      anatomy.classList.remove('is-static');
      if (!inView) return;
      const r = anatomy.getBoundingClientRect();
      const total = r.height - window.innerHeight;
      const p = total > 0 ? clamp(-r.top / total, 0, 1) : 1;
      const e = ease(clamp((p - 0.04) / 0.5, 0, 1));
      const unit = stack.offsetHeight / 640;
      layers.forEach((l, i) => {
        l.el.style.transform = `translate3d(0, ${(l.off * unit * e).toFixed(2)}px, 0)`;
        l.art.style.transform = `rotate(${(l.rot * e).toFixed(2)}deg)`;
        const t = clamp((p - (0.2 + i * 0.06)) / 0.08, 0, 1);
        l.label.style.opacity = t.toFixed(3);
        l.label.style.transform = `translate3d(${((1 - t) * (l.fromLeft ? -16 : 16)).toFixed(1)}px, -50%, 0)`;
      });
      if (bar) bar.style.transform = `scaleX(${p.toFixed(4)})`;
      if (shadow) {
        shadow.style.transform = `scale(${(1 + e * 0.3).toFixed(3)}, ${(1 - e * 0.35).toFixed(3)})`;
        shadow.style.opacity = (1 - e * 0.45).toFixed(3);
      }
      if (cta) cta.classList.toggle('is-visible', p > 0.72);
    };

    measure();
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(
        ([en]) => {
          inView = en.isIntersecting;
          updateAnatomy();
        },
        { rootMargin: '200px 0px' }
      ).observe(anatomy);
    } else inView = true;
    window.addEventListener('resize', () => {
      measure();
      updateAnatomy();
    });
    updateAnatomy();
  }

  /* ---------- Rolagem: nav, barra de progresso, barra mobile, parallax ---------- */
  const nav = $('[data-nav]');
  const progress = $('[data-progress]');
  const mobileBar = $('[data-mobile-bar]');
  const heroVisual = $('[data-hero-visual]');
  const toggle = $('[data-menu-toggle]');
  const mobileMenu = $('[data-mobile-menu]');
  let menuOpen = false;
  let lastY = window.scrollY;

  const onScroll = () => {
    const y = window.scrollY;
    const max = root.scrollHeight - window.innerHeight;
    if (progress) progress.style.transform = `scaleX(${max > 0 ? (y / max).toFixed(4) : 0})`;
    nav.classList.toggle('is-scrolled', y > 24);
    const dy = y - lastY;
    if (Math.abs(dy) > 6) {
      nav.classList.toggle('is-hidden', dy > 0 && y > 420 && !menuOpen);
      lastY = y;
    }
    if (mobileBar) mobileBar.classList.toggle('is-visible', y > window.innerHeight * 0.55);
    if (heroVisual && !reduceMotion && y < window.innerHeight * 1.2) heroVisual.style.setProperty('--sy', `${(y * 0.12).toFixed(1)}px`);
    updateAnatomy();
  };
  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
    },
    { passive: true }
  );
  onScroll();

  /* ---------- Menu mobile ---------- */
  const setMenu = (open) => {
    menuOpen = open;
    toggle.setAttribute('aria-expanded', String(open));
    $('.sr-only', toggle).textContent = open ? 'Fechar menu' : 'Abrir menu';
    mobileMenu.hidden = !open;
    document.body.classList.toggle('menu-open', open);
    if (open) nav.classList.remove('is-hidden');
  };
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => setMenu(!menuOpen));
    mobileMenu.addEventListener('click', (e) => {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menuOpen) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 1101px)').addEventListener('change', (e) => {
      if (e.matches && menuOpen) setMenu(false);
    });
  }

  /* ---------- Link ativo no menu ---------- */
  const navLinks = $$('.nav-links a');
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            navLinks.forEach((a) => a.classList.toggle('is-active', a.getAttribute('href') === `#${en.target.id}`));
          }
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    navLinks.forEach((a) => {
      const target = $(a.getAttribute('href'));
      if (target) spy.observe(target);
    });
  }

  /* ---------- Efeitos de mouse (só desktop) ---------- */
  if (finePointer && !reduceMotion) {
    // Cards com inclinação 3D e brilho
    $$('[data-tilt]').forEach((card) => {
      let raf = 0;
      card.addEventListener('pointerenter', () => card.classList.add('is-tilting'));
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => {
          card.style.transform = `perspective(1000px) rotateX(${((0.5 - y) * 9).toFixed(2)}deg) rotateY(${((x - 0.5) * 11).toFixed(2)}deg) translateY(-6px)`;
          card.style.setProperty('--gx', `${(x * 100).toFixed(1)}%`);
          card.style.setProperty('--gy', `${(y * 100).toFixed(1)}%`);
        });
      });
      card.addEventListener('pointerleave', () => {
        cancelAnimationFrame(raf);
        card.classList.remove('is-tilting');
        card.style.transform = '';
      });
    });

    // Botões magnéticos
    $$('[data-magnetic]').forEach((btn) => {
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty('--mx', `${((e.clientX - r.left - r.width / 2) * 0.25).toFixed(1)}px`);
        btn.style.setProperty('--my', `${((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1)}px`);
      });
      btn.addEventListener('pointerleave', () => {
        btn.style.setProperty('--mx', '0px');
        btn.style.setProperty('--my', '0px');
      });
    });

    // Burger do hero acompanha o mouse
    const hero = $('.hero');
    if (hero && heroVisual) {
      hero.addEventListener('pointermove', (e) => {
        const r = hero.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        heroVisual.style.setProperty('--px', `${(x * -22).toFixed(1)}px`);
        heroVisual.style.setProperty('--py', `${(y * -16).toFixed(1)}px`);
      });
      hero.addEventListener('pointerleave', () => {
        heroVisual.style.setProperty('--px', '0px');
        heroVisual.style.setProperty('--py', '0px');
      });
    }
  }
})();
