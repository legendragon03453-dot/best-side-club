/* Best Side Club — interactions */
(() => {
  'use strict';

  const IMG = 'assets/img/';
  const VID = 'assets/video/';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = matchMedia('(hover: hover)').matches;
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const seg = (p, a, b) => clamp((p - a) / (b - a));
  const ease = t => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ---------- media data ---------- */
  const v = name => ({ video: name });
  const p = name => ({ photo: name });

  const COLS = {
    'hero-a': [v('bestsideclub-joanne-video'), v('bestsideclub-kavita-video'), v('bestsideclub-hattie-video')],
    'hero-b': [v('bestsideclub-esme-video'), v('bestsideclub-freya-video'), v('bestsideclub-lola-video'), v('bestsideclub-gigi-video')],
    'hero-c': [v('bestsideclub-florence-video'), v('bestsideclub-paige-video'), v('bestsideclub-ivy-video')],
    'side-a': [p('bestsideclub-freya-sunglasses'), v('bestsideclub-kavita-video'), p('bestsideclub-zara-handbag')],
    'side-b': [v('bestsideclub-joanne-video'), p('bestsideclub-ivy-nail-polish'), p('bestsideclub-florence-necklace-2')],
    'side-c': [p('bestsideclub-gigi-headphones-2'), p('bestsideclub-clara-water-bottle'), v('bestsideclub-esme-video')],
    'side-d': [p('bestsideclub-kavita-earrings-3'), v('bestsideclub-florence-video'), p('bestsideclub-freya-sunglasses-2')],
  };
  const DUR = { 'hero-a': 38, 'hero-b': 46, 'hero-c': 34, 'side-a': 60, 'side-b': 52, 'side-c': 56, 'side-d': 64 };

  const WORK = [
    [p('bestsideclub-tan-handbag'), v('bestsideclub-gigi-video'), p('bestsideclub-statement-necklace'), p('bestsideclub-clara-water-bottle-2')],
    [p('bestsideclub-white-shoulder-bag'), p('bestsideclub-zara-handbag'), v('bestsideclub-hattie-video'), p('bestsideclub-black-coat')],
    [v('bestsideclub-paige-video'), p('bestsideclub-white-shoulder-bag-4'), p('bestsideclub-white-suit'), p('bestsideclub-ivy-nail-polish-2')],
    [p('bestsideclub-chain-necklace'), p('bestsideclub-face-oil'), v('bestsideclub-lola-video'), p('bestsideclub-silver-watch')],
  ];

  const CAST = [
    ['Gigi', 'bestsideclub-gigi-headphones', 'bestsideclub-gigi-video'],
    ['Clara', 'bestsideclub-clara-water-bottle'],
    ['Ivy', 'bestsideclub-ivy-nail-polish', 'bestsideclub-ivy-video'],
    ['Lola', null, 'bestsideclub-lola-video'],
    ['Florence', 'bestsideclub-florence-necklace', 'bestsideclub-florence-video'],
    ['Hattie', null, 'bestsideclub-hattie-video'],
    ['Freya', 'bestsideclub-freya-sunglasses', 'bestsideclub-freya-video'],
    ['Esme', 'bestsideclub-esme-face-oil', 'bestsideclub-esme-video'],
    ['Zara', 'bestsideclub-zara-handbag'],
    ['Paige', null, 'bestsideclub-paige-video'],
    ['Kavita', 'bestsideclub-kavita-earrings', 'bestsideclub-kavita-video'],
    ['Joanne', 'bestsideclub-joanne-mug', 'bestsideclub-joanne-video'],
  ];

  const STRIP = ['bestsideclub-cat-eye-sunglasses', 'bestsideclub-gigi-headphones', 'bestsideclub-running-trainers-2', 'bestsideclub-florence-necklace', 'bestsideclub-white-shoulder-bag-5', 'bestsideclub-joanne-mug', 'bestsideclub-black-coat-2', 'bestsideclub-freya-sunglasses-3', 'bestsideclub-tan-handbag-2'];

  /* ---------- alt text (one line per file; edit freely) ---------- */
  const ALT = {
    'bestsideclub-gigi-headphones': 'Gigi holding pink over-ear headphones on a sunny balcony',
    'bestsideclub-gigi-headphones-2': 'Gigi taking a mirror selfie with pink headphones around her neck',
    'bestsideclub-clara-water-bottle': 'Clara holding a lilac water bottle in a bright studio',
    'bestsideclub-clara-water-bottle-2': 'Clara drinking from a lilac water bottle in the park',
    'bestsideclub-ivy-nail-polish': 'Ivy holding a bottle of blue nail polish by a window',
    'bestsideclub-ivy-nail-polish-2': 'Ivy painting her nails with blue nail polish at home',
    'bestsideclub-florence-necklace': 'Florence wearing a layered gold necklace in an evening bar',
    'bestsideclub-florence-necklace-2': 'Florence taking a mirror selfie wearing a gold necklace',
    'bestsideclub-freya-sunglasses': 'Freya holding tortoiseshell sunglasses at sunset',
    'bestsideclub-freya-sunglasses-2': 'Freya wearing sunglasses and a trench coat on a city street',
    'bestsideclub-freya-sunglasses-3': 'Freya walking down a busy street in sunglasses',
    'bestsideclub-esme-face-oil': 'Esme holding a bottle of face oil in a marble bathroom',
    'bestsideclub-esme-face-oil-2': 'Esme applying face oil with a dropper',
    'bestsideclub-zara-handbag': 'Zara sitting in a hotel lobby with a checked tote bag',
    'bestsideclub-kavita-earrings': 'Kavita wearing gold hoop earrings at a candlelit dinner',
    'bestsideclub-kavita-earrings-2': 'Kavita laughing at dinner, wearing gold hoop earrings',
    'bestsideclub-kavita-earrings-3': 'Kavita having her photo taken at dinner in gold hoop earrings',
    'bestsideclub-joanne-mug': 'Joanne holding a black ceramic mug in her kitchen',
    'bestsideclub-tan-handbag': 'Creator taking a mirror selfie in a hotel with a tan leather handbag',
    'bestsideclub-tan-handbag-2': 'Creator at a café table holding a tan leather handbag',
    'bestsideclub-tan-handbag-3': 'Creator at a café with a tan leather handbag beside her coffee',
    'bestsideclub-white-shoulder-bag': 'Creator leaning on a stone wall with a white shoulder bag',
    'bestsideclub-white-shoulder-bag-2': 'Creator in a cream knit dress holding a white shoulder bag',
    'bestsideclub-white-shoulder-bag-3': 'Creator taking a mirror selfie with a white shoulder bag',
    'bestsideclub-white-shoulder-bag-4': 'Creator in a trench coat carrying a white shoulder bag',
    'bestsideclub-white-shoulder-bag-5': 'Creator in a hotel hallway with a white shoulder bag',
    'bestsideclub-cat-eye-sunglasses': 'Creator wearing tortoiseshell cat-eye sunglasses at a café',
    'bestsideclub-running-trainers': 'Creator sitting on a bench wearing blue running trainers',
    'bestsideclub-running-trainers-2': 'Creator in the park wearing blue running trainers',
    'bestsideclub-baseball-cap': 'Creator wearing a pink baseball cap at a café',
    'bestsideclub-pendant-necklace': 'Creator wearing a fine pendant necklace and black camisole',
    'bestsideclub-chain-necklace': 'Creator laughing in a bar wearing a silver chain necklace',
    'bestsideclub-statement-necklace': 'Creator in a green blouse wearing a statement necklace',
    'bestsideclub-silver-watch': 'Creator taking a mirror selfie wearing a silver watch',
    'bestsideclub-black-waistcoat': 'Creator wearing a black tailored waistcoat in the sun',
    'bestsideclub-black-waistcoat-2': 'Creator in a black waistcoat and layered necklaces',
    'bestsideclub-face-oil': 'Creator smiling while holding a bottle of face oil',
    'bestsideclub-black-coat': 'Creator wearing a black wool coat on a city street at night',
    'bestsideclub-black-coat-2': 'Creator in a black wool coat under shop lights at night',
    'bestsideclub-white-suit': 'Creator wearing a white trouser suit in a library',
    'bestsideclub-white-suit-2': 'Creator in a white trouser suit on a balcony',
    'bestsideclub-kiran-running-shoes': 'Kiran sitting on stone steps in running shoes',
    'bestsideclub-kiran-running-shoes-2': 'Kiran running in the rain in running shoes',
    'bestsideclub-finley-backpack': 'Finley in a station concourse with a canvas backpack',
    'bestsideclub-finley-backpack-2': 'Finley on a train platform with a canvas backpack',
    'bestsideclub-rory-beanie': 'Rory wearing a grey knitted beanie on a city street',
    'bestsideclub-anand-wallet': 'Anand taking a mirror selfie holding a leather wallet',
    'bestsideclub-gigi-video': 'Video: Gigi talking about her pink headphones at her desk',
    'bestsideclub-ivy-video': 'Video: Ivy showing a bottle of blue nail polish',
    'bestsideclub-lola-video': 'Video: Lola at a market with a striped tote bag',
    'bestsideclub-florence-video': 'Video: Florence showing her pearl necklace',
    'bestsideclub-hattie-video': 'Video: Hattie holding a scented candle at home',
    'bestsideclub-freya-video': 'Video: Freya in sunglasses at a café terrace',
    'bestsideclub-esme-video': 'Video: Esme showing a bottle of face oil after a shower',
    'bestsideclub-paige-video': 'Video: Paige sitting on her front steps in white trainers',
    'bestsideclub-kavita-video': 'Video: Kavita showing her gold hoop earrings',
    'bestsideclub-joanne-video': 'Video: Joanne holding a black mug in her kitchen',
  };
  const altFor = item => ALT[item.video || item.photo] || '';

  /* ---------- video playback: only what is on screen and in an active group ---------- */
  const groups = { hero: true, side: false, work: true, cast: !canHover, final: true };
  const vids = new Set();

  const syncVideo = vid => {
    const want = vid._vis && groups[vid.dataset.group] && !document.hidden && !vid._hold;
    if (want) {
      if (!vid.src) vid.src = vid.dataset.src;
      if (vid.paused) vid.play().catch(() => {});
    } else if (!vid.paused) {
      vid.pause();
    }
  };
  const syncAll = () => vids.forEach(syncVideo);
  const setGroup = (g, on) => { if (groups[g] !== on) { groups[g] = on; syncAll(); } };

  const vio = new IntersectionObserver(entries => {
    entries.forEach(e => { e.target._vis = e.isIntersecting; syncVideo(e.target); });
  }, { rootMargin: '120px 0px' });

  document.addEventListener('visibilitychange', syncAll);

  const tile = (item, group, eager) => {
    const el = document.createElement('div');
    el.className = 'tile';
    const img = new Image();
    img.alt = '';
    img.decoding = 'async';
    if (!eager) img.loading = 'lazy';
    img.width = 480;
    img.height = 600;
    img.src = item.video ? `${VID}${item.video}.webp` : `${IMG}${item.photo}.webp`;
    el.append(img);
    if (item.video) {
      const vid = document.createElement('video');
      vid.muted = true;
      vid.loop = true;
      vid.playsInline = true;
      vid.setAttribute('muted', '');
      vid.setAttribute('playsinline', '');
      vid.preload = 'none';
      vid.dataset.src = `${VID}${item.video}.mp4`;
      vid.dataset.group = group;
      vid._vis = false;
      /* fade the video in over its poster once it really plays (no black frame / jump) */
      vid.addEventListener('playing', () => el.classList.add('is-playing'), { once: true });
      el.append(vid);
      vids.add(vid);
      vio.observe(vid);
    }
    return el;
  };

  /* marquee columns (set is duplicated for a seamless loop) */
  document.querySelectorAll('[data-col]').forEach(col => {
    const key = col.dataset.col;
    const group = key.startsWith('hero') ? 'hero' : 'side';
    const track = document.createElement('div');
    track.className = 'mcol__track';
    track.style.setProperty('--dur', `${DUR[key]}s`);
    for (let i = 0; i < 2; i++) {
      const set = document.createElement('div');
      set.className = 'mcol__set';
      /* side images load up front: lazy images inside the hidden layer only start loading
         when it appears, and then pop in */
      COLS[key].forEach(item => set.append(tile(item, group, group === 'side' || i === 0)));
      track.append(set);
    }
    col.append(track);
  });

  /* examples gallery */
  const gallery = document.querySelector('[data-gallery]');
  if (gallery) {
    WORK.forEach(colItems => {
      const col = document.createElement('div');
      col.className = 'work__col';
      colItems.forEach(item => {
        const fig = document.createElement('figure');
        fig.className = 'shot';
        fig.setAttribute('data-reveal', '');
        const t = tile(item, 'work');
        t.querySelector('img').alt = altFor(item) || 'Example of our work. Made with AI.';
        if (item.video) {
          const b = document.createElement('span');
          b.className = 'shot__badge';
          b.textContent = 'Video';
          t.append(b);
        }
        const cap = document.createElement('figcaption');
        cap.textContent = 'Example of our work. Made with AI.';
        fig.append(t, cap);
        col.append(fig);
      });
      gallery.append(col);
    });
  }

  /* cast */
  const castTrack = document.querySelector('[data-cast-track]');
  if (castTrack) {
    CAST.forEach(([name, photo, video]) => {
      const li = document.createElement('li');
      li.className = 'creator';
      li.setAttribute('data-reveal', '');
      const t = tile(video ? { video } : { photo }, 'cast');
      const img = t.querySelector('img');
      if (photo) img.src = `${IMG}${photo}.webp`;
      img.alt = `${name}, one of our creators. ${ALT[photo || video] || ''}`.trim();
      const n = document.createElement('p');
      n.className = 'creator__name';
      n.textContent = name;
      li.append(t, n);
      const vid = t.querySelector('video');
      if (vid && canHover) {
        vid._hold = true;
        li.addEventListener('pointerenter', () => { vid._hold = false; li.classList.add('is-live'); syncVideo(vid); });
        li.addEventListener('pointerleave', () => { vid._hold = true; li.classList.remove('is-live'); syncVideo(vid); });
      } else if (vid) {
        li.classList.add('is-live');
      }
      castTrack.append(li);
    });

    document.querySelectorAll('[data-cast]').forEach(btn => btn.addEventListener('click', () => {
      const card = castTrack.querySelector('.creator');
      const step = card ? card.getBoundingClientRect().width * 2 : 400;
      castTrack.scrollBy({ left: step * Number(btn.dataset.cast), behavior: 'smooth' });
    }));

    /* drag to scroll with a mouse */
    let down = null;
    castTrack.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse') return;
      down = { x: e.clientX, left: castTrack.scrollLeft, moved: false };
    });
    window.addEventListener('pointermove', e => {
      if (!down) return;
      const dx = e.clientX - down.x;
      if (!down.moved && Math.abs(dx) > 4) { down.moved = true; castTrack.classList.add('is-drag'); }
      if (down.moved) castTrack.scrollLeft = down.left - dx;
    });
    window.addEventListener('pointerup', () => {
      if (!down) return;
      down = null;
      castTrack.classList.remove('is-drag');
    });
  }

  /* final strip */
  const strip = document.querySelector('[data-strip]');
  if (strip) {
    const row = document.createElement('div');
    row.className = 'final__row';
    [...STRIP, ...STRIP].forEach(name => row.append(tile({ photo: name }, 'final')));
    strip.append(row);
  }

  /* ---------- word split + reveal ---------- */
  /* wraps every word; `wrap` builds the element for one word */
  const splitWords = (el, wrap) => {
    let i = 0;
    const walk = node => {
      [...node.childNodes].forEach(child => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.append(document.createTextNode(' ')); return; }
            frag.append(wrap(part, i++));
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) {
          walk(child);
        }
      });
    };
    walk(el);
  };

  document.querySelectorAll('[data-split]').forEach(el => splitWords(el, (word, i) => {
    const w = document.createElement('span');
    w.className = 'w';
    const s = document.createElement('span');
    s.style.setProperty('--i', i);
    s.textContent = word;
    w.append(s);
    return w;
  }));

  const scrubWords = [];
  document.querySelectorAll('[data-scrub]').forEach(el => splitWords(el, word => {
    const s = document.createElement('span');
    s.className = 'sw';
    s.textContent = word;
    scrubWords.push(s);
    return s;
  }));

  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      revealIO.unobserve(e.target);
    });
  }, { threshold: .12, rootMargin: '0px 0px -6% 0px' });

  document.querySelectorAll('[data-reveal], [data-split], [data-watch]').forEach(el => {
    if (el.closest('.stage')) return;
    const sibs = [...el.parentElement.children].filter(c => c.hasAttribute('data-reveal'));
    const idx = sibs.indexOf(el);
    if (idx > 0) el.style.setProperty('--d', `${Math.min(idx, 6) * 90}ms`);
    revealIO.observe(el);
  });

  /* ---------- FAQ ---------- */
  document.querySelectorAll('[data-faq] .qa').forEach(qa => {
    const btn = qa.querySelector('.qa__q');
    btn.addEventListener('click', () => {
      const open = !qa.classList.contains('is-open');
      qa.parentElement.querySelectorAll('.qa.is-open').forEach(o => {
        o.classList.remove('is-open');
        o.querySelector('.qa__q').setAttribute('aria-expanded', 'false');
      });
      qa.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---------- free sample form ---------- */
  const sampleBtn = document.querySelector('[data-sample-open]');
  if (sampleBtn) {
    const form = document.getElementById('sample-form');
    sampleBtn.addEventListener('click', () => {
      const open = form.hidden;
      form.hidden = !open;
      sampleBtn.setAttribute('aria-expanded', String(open));
      if (open) form.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'nearest' });
    });
  }

  /* ---------- scroll stage ---------- */
  const stage = document.querySelector('.stage');
  const pin = stage.querySelector('.stage__pin');
  const brown = pin.querySelector('.brown');
  const hdr = pin.querySelector('.hdr');
  const heroCopy = pin.querySelector('.hero-copy');
  const lineCopy = pin.querySelector('.line-copy');
  const heroMedia = pin.querySelector('.hero-media');
  const side = pin.querySelector('.side-cols');
  const grpL = pin.querySelector('.side-cols__grp--l');
  const grpR = pin.querySelector('.side-cols__grp--r');
  const cue = pin.querySelector('.scroll-cue');
  const probe = document.createElement('div');
  probe.className = 'probe-r2';
  pin.append(probe);

  let W = 0, H = 0, R0, R1, R2, M = 0, travel = 1;
  const box = el => ({ x: el.offsetLeft, y: el.offsetTop, w: el.offsetWidth, h: el.offsetHeight });

  const measure = () => {
    W = pin.clientWidth;
    H = pin.clientHeight;
    M = hdr.offsetTop;
    R0 = box(heroCopy);
    R1 = { x: M, y: M, w: W - 2 * M, h: H - 2 * M };
    R2 = box(probe);
    travel = Math.max(1, stage.offsetHeight - H);
  };

  const lerpRect = (a, b, t) => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t) });

  let target = 0, cur = -1, raf = 0;
  const readTarget = () => { target = clamp(-stage.getBoundingClientRect().top / travel); };

  const render = pr => {
    const a = ease(seg(pr, .08, .40));
    const b = ease(seg(pr, .55, .86));
    const r = lerpRect(lerpRect(R0, R1, a), R2, b);
    brown.style.clipPath = `inset(${r.y.toFixed(1)}px ${(W - r.x - r.w).toFixed(1)}px ${(H - r.y - r.h).toFixed(1)}px ${r.x.toFixed(1)}px round 16px)`;

    const th = ease(seg(pr, .03, .2));
    hdr.style.transform = `translate3d(0, ${(-th * (hdr.offsetHeight + M + 20)).toFixed(1)}px, 0)`;
    hdr.style.opacity = (1 - th).toFixed(3);
    hdr.style.visibility = th >= 1 ? 'hidden' : '';

    const tc = ease(seg(pr, .06, .24));
    heroCopy.style.opacity = (1 - tc).toFixed(3);
    heroCopy.style.transform = `translate3d(0, ${(-48 * tc).toFixed(1)}px, 0)`;
    heroCopy.style.visibility = tc >= 1 ? 'hidden' : '';

    const tl = ease(seg(pr, .27, .42));
    lineCopy.style.opacity = tl.toFixed(3);
    lineCopy.style.transform = `translate(-50%, calc(-38% + ${((1 - tl) * 48).toFixed(1)}px)) scale(${(1 - .18 * b).toFixed(4)})`;

    heroMedia.style.transform = `translate3d(${(a * 60).toFixed(1)}px, 0, 0) scale(${(1 - .05 * a).toFixed(4)})`;
    heroMedia.style.visibility = a >= 1 ? 'hidden' : '';

    /* the side columns stay out of sight while the panel is full screen, then fade,
       grow and slide in from behind it as it squeezes (no raw pop at the edges) */
    const sv = ease(seg(pr, .52, .8));
    side.style.visibility = sv > 0 ? 'visible' : 'hidden';
    side.style.opacity = sv.toFixed(3);
    const push = (1 - sv) * Math.min(220, W * .14);
    const rise = (1 - sv) * Math.min(260, H * .3);
    const sc = (.9 + .1 * sv).toFixed(4);
    grpL.style.transform = `translate3d(${push.toFixed(1)}px, ${rise.toFixed(1)}px, 0) scale(${sc})`;
    grpR.style.transform = `translate3d(${(-push).toFixed(1)}px, ${rise.toFixed(1)}px, 0) scale(${sc})`;

    if (cue) cue.style.opacity = (tl * (1 - ease(seg(pr, .5, .62)))).toFixed(3);

    const inView = stage.getBoundingClientRect().bottom > 0;
    setGroup('hero', a < 1 && inView);
    setGroup('side', sv > 0 && inView);
    heroMedia.classList.toggle('is-paused', !groups.hero);
    side.classList.toggle('is-paused', !groups.side);
  };

  /* examples parallax */
  const workCols = [...document.querySelectorAll('.work__col')];
  const SPEED = [.04, -.06, .02, -.08];
  const wide = matchMedia('(min-width: 761px)');
  const parallax = () => {
    return; /* no parallax (brand manual) */
    const vh = innerHeight;
    workCols.forEach((col, i) => {
      const rc = col.parentElement.getBoundingClientRect();
      if (rc.bottom < -200 || rc.top > vh + 200) return;
      const off = clamp((rc.top + rc.height / 2 - vh / 2) * SPEED[i], -60, 60);
      col.style.transform = `translate3d(0, ${off.toFixed(1)}px, 0)`;
    });
  };

  /* words of the pain title light up one by one while scrolling */
  const scrubEl = document.querySelector('[data-scrub]');
  const scrub = () => {
    if (!scrubEl || reduced) return;
    const vh = innerHeight;
    const rc = scrubEl.getBoundingClientRect();
    if (rc.bottom < 0 || rc.top > vh) return;
    const t = clamp((vh * .9 - rc.top) / (vh * .55)) * scrubWords.length;
    scrubWords.forEach((w, i) => w.style.setProperty('--o', (.14 + .86 * clamp(t - i)).toFixed(3)));
  };

  /* brown panels open from a narrower card as they enter */
  const panels = [...document.querySelectorAll('.why__panel, .sample__panel, .final__panel')];
  panels.forEach(el => el.setAttribute('data-open', ''));
  const openPanels = () => {
    if (reduced) return;
    const vh = innerHeight;
    panels.forEach(el => {
      const rc = el.getBoundingClientRect();
      if (rc.bottom < 0 || rc.top > vh) return;
      const t = 1 - ease(clamp((vh - rc.top) / (vh * .7)));
      el.style.setProperty('--open-x', `${(t * Math.min(90, innerWidth * .06)).toFixed(1)}px`);
      el.style.setProperty('--open-y', `${(t * 30).toFixed(1)}px`);
    });
  };

  /* floating cta: after the scroll stage, hidden while the plans or the final call are on screen */
  const floatCta = document.querySelector('.float-cta');
  const plansEl = document.getElementById('plans');
  const finalEl = document.querySelector('.final');
  const floatFx = () => {
    if (!floatCta) return;
    const vh = innerHeight;
    const pr = plansEl.getBoundingClientRect();
    const on = stage.getBoundingClientRect().bottom < vh * .4
      && !(pr.top < vh && pr.bottom > 0)
      && finalEl.getBoundingClientRect().top > vh * .9;
    if (on !== floatCta.classList.contains('is-on')) {
      floatCta.classList.toggle('is-on', on);
      floatCta.setAttribute('aria-hidden', String(!on));
      floatCta.tabIndex = on ? 0 : -1;
    }
  };

  const tick = () => {
    raf = 0;
    const d = target - cur;
    cur = Math.abs(d) < .0004 || reduced || cur < 0 ? target : cur + d * .16;
    render(cur);
    parallax();
    scrub();
    openPanels();
    floatFx();
    if (cur !== target) raf = requestAnimationFrame(tick);
  };
  const kick = () => { readTarget(); if (!raf) raf = requestAnimationFrame(tick); };

  const onResize = () => { measure(); cur = -1; kick(); };
  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', onResize);
  wide.addEventListener?.('change', onResize);
  if (document.fonts?.ready) document.fonts.ready.then(onResize);
  onResize();

  /* ---------- magnetic buttons ---------- */
  if (false) { /* no cursor effects (brand manual) */
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty('--mx', `${(((e.clientX - r.left) / r.width - .5) * 14).toFixed(1)}px`);
        btn.style.setProperty('--my', `${(((e.clientY - r.top) / r.height - .5) * 10).toFixed(1)}px`);
      });
      btn.addEventListener('pointerleave', () => {
        btn.style.removeProperty('--mx');
        btn.style.removeProperty('--my');
      });
    });
  }

  /* ---------- plans switcher (phone) ---------- */
  const plansGrid = document.querySelector('[data-plans]');
  const planTabs = [...document.querySelectorAll('[data-plan-tab]')];
  if (plansGrid && planTabs.length) {
    const cards = [...plansGrid.children];
    const show = (i, smooth) => {
      const c = cards[i];
      plansGrid.scrollTo({ left: c.offsetLeft - (plansGrid.clientWidth - c.offsetWidth) / 2, behavior: smooth ? 'smooth' : 'auto' });
    };
    planTabs.forEach(t => t.addEventListener('click', () => show(+t.dataset.planTab, true)));
    let tabRaf = 0;
    plansGrid.addEventListener('scroll', () => {
      if (tabRaf) return;
      tabRaf = requestAnimationFrame(() => {
        tabRaf = 0;
        const mid = plansGrid.scrollLeft + plansGrid.clientWidth / 2;
        let best = 0;
        cards.forEach((c, i) => {
          if (Math.abs(c.offsetLeft + c.offsetWidth / 2 - mid) < Math.abs(cards[best].offsetLeft + cards[best].offsetWidth / 2 - mid)) best = i;
        });
        planTabs.forEach((t, i) => t.classList.toggle('is-on', i === best));
      });
    }, { passive: true });
    const phone = matchMedia('(max-width: 760px)');
    const start = () => { if (phone.matches) show(2, false); };
    phone.addEventListener?.('change', start);
    start();
  }

  /* ---------- phone menu ---------- */
  const menuBtn = document.querySelector('.hdr__menu');
  if (menuBtn) {
    const hdrEl = menuBtn.closest('.hdr');
    const setMenu = open => { hdrEl.classList.toggle('is-open', open); menuBtn.setAttribute('aria-expanded', String(open)); };
    menuBtn.addEventListener('click', () => setMenu(!hdrEl.classList.contains('is-open')));
    hdrEl.querySelectorAll('.hdr__nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  }

  /* ---------- monthly / yearly prices ---------- */
  const billBtns = [...document.querySelectorAll('[data-billing]')];
  billBtns.forEach(b => b.addEventListener('click', () => {
    const mode = b.dataset.billing;
    billBtns.forEach(x => { const on = x === b; x.classList.toggle('is-on', on); x.setAttribute('aria-pressed', String(on)); });
    document.querySelectorAll('[data-plans] .plan').forEach(plan => {
      const price = plan.querySelector('.plan__price');
      price.querySelector('.plan__amount').textContent = price.dataset[mode];
      const small = price.querySelector('small');
      small.textContent = small.dataset[mode];
      const note = plan.querySelector('.plan__note');
      note.textContent = note.dataset[mode];
    });
    document.querySelectorAll('[data-checkout]').forEach(a => { a.dataset.period = mode; });
  }));

  /* ---------- hero entrance ---------- */
  setTimeout(() => {
    document.body.classList.remove('is-pre');
    pin.querySelector('h1[data-split]')?.classList.add('is-in');
  }, 80);
})();
