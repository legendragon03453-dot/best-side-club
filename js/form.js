/* Best Side Club — form engine
   Each page sets window.FORM_CONFIG = { webhook, steps: [...], done: {...} } before this script.
   Field types: text, email, url, tel, textarea, select, chips, creators, files, products, consent.
   Any field can be pre-filled from the page address, e.g. onboarding.html?email=jo@shop.com&plan=growth */
(() => {
  'use strict';
  const CFG = window.FORM_CONFIG;
  if (!CFG) return;

  const CREATORS = [
    ['Gigi', 'img/bestsideclub-gigi-headphones'], ['Clara', 'img/bestsideclub-clara-water-bottle'],
    ['Ivy', 'img/bestsideclub-ivy-nail-polish'], ['Lola', 'video/bestsideclub-lola-video'],
    ['Florence', 'img/bestsideclub-florence-necklace'], ['Hattie', 'video/bestsideclub-hattie-video'],
    ['Freya', 'img/bestsideclub-freya-sunglasses'], ['Esme', 'img/bestsideclub-esme-face-oil'],
    ['Zara', 'img/bestsideclub-zara-handbag'], ['Paige', 'video/bestsideclub-paige-video'],
    ['Kavita', 'img/bestsideclub-kavita-earrings'], ['Joanne', 'img/bestsideclub-joanne-mug'],
  ];

  const $ = (s, r = document) => r.querySelector(s);
  const h = (tag, attrs = {}, ...kids) => {
    const el = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (v === false || v == null) return;
      if (k === 'class') el.className = v;
      else if (k === 'text') el.textContent = v;
      else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? '' : v);
    });
    kids.flat().forEach(k => k != null && el.append(k));
    return el;
  };

  const query = new URLSearchParams(location.search);
  const files = {};            // name -> File[]
  const form = $('[data-form]');
  const stepsEl = $('[data-steps]');
  const bar = $('[data-prog] i');
  const progTxt = $('[data-prog-txt]');
  const errBox = $('[data-error]');
  let current = 0;

  /* plan-dependent limits, e.g. { from: 'plan', map: { starter: 2, growth: 6 } } */
  const limit = (v, fallback) => {
    if (typeof v === 'number') return v;
    if (v && v.from) {
      const el = form.elements[v.from];
      const val = el ? (el.value || (el.length ? [...el].find(x => x.checked)?.value : '')) : '';
      return v.map[val] ?? v.default ?? fallback;
    }
    return fallback;
  };

  /* ---------- builders ---------- */
  const errEl = msg => h('p', { class: 'fld__err', text: msg || 'Please fill this in.' });
  const labelEl = (f, forId) => h('label', { for: forId }, f.label, f.required ? null : h('small', { text: 'optional' }));
  const helpEl = f => f.help ? h('p', { class: 'fld__help', text: f.help }) : null;

  const buildFiles = (f, name) => {
    files[name] = [];
    const thumbs = h('div', { class: 'fthumbs' });
    const max = () => limit(f.max, 3);
    const input = h('input', { type: 'file', accept: f.accept || 'image/*', multiple: true, 'aria-label': f.label });
    const drop = h('label', { class: 'fdrop' }, input,
      h('strong', { text: f.cta || 'Add photos' }),
      h('span', { text: f.hint || 'Tap to choose, or drag them here. Phone photos are fine.' }));
    const draw = () => {
      thumbs.replaceChildren(...files[name].map((file, i) => {
        const url = URL.createObjectURL(file);
        return h('div', { class: 'fthumb' }, h('img', { src: url, alt: file.name }),
          h('button', { type: 'button', 'aria-label': `Remove ${file.name}`, text: '×', onclick: () => { files[name].splice(i, 1); draw(); } }));
      }));
      drop.hidden = files[name].length >= max();
    };
    const add = list => {
      [...list].filter(x => x.type.startsWith('image/') || !f.accept).forEach(x => { if (files[name].length < max()) files[name].push(x); });
      input.value = '';
      draw();
      wrap.classList.remove('is-bad');
    };
    input.addEventListener('change', () => add(input.files));
    ['dragenter', 'dragover'].forEach(e => drop.addEventListener(e, ev => { ev.preventDefault(); drop.classList.add('is-over'); }));
    ['dragleave', 'drop'].forEach(e => drop.addEventListener(e, () => drop.classList.remove('is-over')));
    drop.addEventListener('drop', ev => { ev.preventDefault(); add(ev.dataTransfer.files); });
    const wrap = h('div', { class: 'fld', 'data-files': name },
      h('label', {}, f.label, f.required === false ? h('small', { text: 'optional' }) : null), helpEl(f), drop, thumbs, errEl(f.error || 'Please add at least one photo.'));
    wrap._check = () => f.required === false || files[name].length >= (f.min || 1);
    return wrap;
  };

  const buildField = (f, prefix = '') => {
    const name = prefix + f.name;
    const id = 'f-' + name.replace(/\W/g, '-');
    const pre = query.get(f.name) || '';
    let wrap;
    switch (f.type) {
      case 'textarea':
        wrap = h('div', { class: 'fld' }, labelEl(f, id), helpEl(f),
          h('textarea', { class: 'fin', id, name, required: f.required, placeholder: f.placeholder, rows: 4 }, pre), errEl(f.error));
        break;
      case 'select':
        wrap = h('div', { class: 'fld' }, labelEl(f, id), helpEl(f),
          h('select', { class: 'fin', id, name, required: f.required },
            h('option', { value: '', text: f.placeholder || 'Choose one' }),
            f.options.map(o => { const [v, t] = Array.isArray(o) ? o : [o, o]; return h('option', { value: v, text: t, selected: pre.toLowerCase() === String(v).toLowerCase() }); })),
          errEl(f.error));
        break;
      case 'chips':
        wrap = h('fieldset', { class: 'fld' }, h('legend', {}, f.label, f.required ? null : h('small', { text: 'optional' })), helpEl(f),
          h('div', { class: 'fchips' }, f.options.map(o => {
            const [v, t] = Array.isArray(o) ? o : [o, o];
            return h('label', { class: 'fchip' }, h('input', { type: f.multiple ? 'checkbox' : 'radio', name, value: v, checked: pre.toLowerCase() === String(v).toLowerCase() }), h('span', { text: t }));
          })), errEl(f.error || 'Please choose one.'));
        wrap._check = () => !f.required || !!wrap.querySelector('input:checked');
        break;
      case 'creators': {
        const multi = () => limit(f.max, 1) > 1;
        const grid = h('div', { class: 'fcreators' });
        const draw = () => {
          const type = multi() ? 'checkbox' : 'radio';
          const was = [...grid.querySelectorAll('input:checked')].map(x => x.value);
          const opts = [...CREATORS];
          grid.replaceChildren(...opts.map(([n, src]) => h('label', { class: 'fcreator' },
            h('input', { type, name, value: n, checked: was.includes(n) || pre === n }),
            h('figure', {}, h('img', { src: `assets/${src}.webp`, alt: `${n}, one of our creators`, loading: 'lazy', width: 240, height: 300 })),
            h('b', { text: n }))),
            f.allowAny ? h('label', { class: 'fcreator fcreator--any' },
              h('input', { type, name, value: 'Choose for me', checked: was.includes('Choose for me') }),
              h('figure', {}, h('span', { text: 'Not sure? We’ll choose for you' })), h('b', { text: 'Choose for me' })) : null);
          const lab = wrap.querySelector('legend small[data-max]');
          if (lab) lab.textContent = multi() ? `choose up to ${limit(f.max, 1)}` : 'choose one';
        };
        grid.addEventListener('change', e => {
          const max = limit(f.max, 1);
          const on = [...grid.querySelectorAll('input:checked')];
          if (e.target.value === 'Choose for me' && e.target.checked) on.forEach(x => { if (x !== e.target) x.checked = false; });
          else if (e.target.checked) { const any = grid.querySelector('input[value="Choose for me"]'); if (any) any.checked = false; }
          if (on.length > max) e.target.checked = false;
          wrap.classList.remove('is-bad');
        });
        wrap = h('fieldset', { class: 'fld' }, h('legend', {}, f.label, h('small', { 'data-max': '' })), helpEl(f), grid, errEl(f.error || 'Please choose a creator.'));
        wrap._check = () => !f.required || !!grid.querySelector('input:checked');
        wrap._refresh = draw;
        draw();
        break;
      }
      case 'files':
        return buildFiles(f, name);
      case 'products':
        return buildProducts(f);
      case 'consent':
        wrap = h('div', { class: 'fld' }, h('label', { class: 'fcheck' }, h('input', { type: 'checkbox', name, value: 'yes', required: f.required }), h('span', { text: f.label })), errEl(f.error || 'Please tick this box to continue.'));
        break;
      default:
        wrap = h('div', { class: 'fld' }, labelEl(f, id), helpEl(f),
          h('input', { class: 'fin', id, name, type: f.type || 'text', required: f.required, placeholder: f.placeholder, value: pre, autocomplete: f.autocomplete, inputmode: f.inputmode }), errEl(f.error));
    }
    wrap.addEventListener('input', () => wrap.classList.remove('is-bad'));
    wrap.addEventListener('change', () => wrap.classList.remove('is-bad'));
    return wrap;
  };

  function buildProducts(f) {
    const list = h('div', { class: 'ffields' });
    const max = () => limit(f.max, 6);
    let n = 0;
    const renumber = () => {
      [...list.children].forEach((card, i) => {
        card.querySelector('.fprod__h span').textContent = `Product ${i + 1}`;
        const rm = card.querySelector('.fprod__h button');
        rm.hidden = list.children.length <= (f.min || 1);
      });
      addBtn.hidden = list.children.length >= max();
      addBtn.textContent = `+ Add another product (${list.children.length} of ${max()})`;
    };
    const addCard = () => {
      const i = n++;
      const card = h('div', { class: 'fprod' },
        h('div', { class: 'fprod__h' }, h('span'), h('button', { type: 'button', text: 'Remove', onclick: () => { card.remove(); f.fields.forEach(x => { if (x.type === 'files') delete files[`product_${i}_${x.name}`]; }); renumber(); } })),
        f.fields.map(x => buildField(x, `product_${i}_`)));
      list.append(card);
      renumber();
    };
    const addBtn = h('button', { type: 'button', class: 'fadd', onclick: addCard });
    const wrap = h('div', { class: 'ffields', 'data-products': '' }, list, addBtn);
    wrap._refresh = () => { while (list.children.length > max()) list.lastElementChild.remove(); renumber(); };
    for (let k = 0; k < (f.min || 1); k++) addCard();
    return wrap;
  }

  /* ---------- steps ---------- */
  const steps = CFG.steps.map((s, i) => {
    const sec = h('section', { class: 'fstep', hidden: i > 0, 'aria-labelledby': `st-${i}` },
      h('h2', { class: 'fstep__t', id: `st-${i}`, tabindex: '-1', text: s.title }),
      s.text ? h('p', { class: 'fstep__d', text: s.text }) : null,
      s.review ? h('dl', { class: 'freview', 'data-review': '' }) : h('div', { class: 'ffields' }, s.fields.map(f => buildField(f))));
    stepsEl.append(sec);
    return sec;
  });

  const back = $('[data-back]');
  const next = $('[data-next]');
  const nextLabel = next.querySelector('span');

  const valid = sec => {
    let first = null;
    sec.querySelectorAll('.fld').forEach(w => {
      if (w.closest('.fstep') !== sec) return;
      let ok = true;
      if (w._check) ok = w._check();
      else {
        const el = w.querySelector('input, textarea, select');
        if (el && el.willValidate) ok = el.checkValidity();
      }
      w.classList.toggle('is-bad', !ok);
      if (!ok && !first) first = w;
    });
    if (first) {
      first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      first.querySelector('input:not([type=file]), textarea, select')?.focus({ preventScroll: true });
    }
    return !first;
  };

  const collect = () => {
    const fd = new FormData(form);
    Object.entries(files).forEach(([k, list]) => list.forEach(file => fd.append(k, file, file.name)));
    query.forEach((v, k) => { if (!fd.has(k)) fd.append(k, v); });
    fd.append('form', CFG.id || document.title);
    fd.append('submitted_at', new Date().toISOString());
    return fd;
  };

  const review = () => {
    const dl = steps[current].querySelector('[data-review]');
    if (!dl) return;
    const fd = collect();
    const rows = [];
    const label = name => {
      const el = form.querySelector(`[name="${CSS.escape(name)}"]`);
      const fld = el?.closest('.fld');
      const raw = fld?.querySelector('label, legend')?.firstChild?.textContent || name;
      const m = name.match(/^product_(\d+)_/);
      if (m) {
        const cards = [...form.querySelectorAll('.fprod')];
        const idx = cards.indexOf(el?.closest('.fprod')) + 1;
        return `Product ${idx}: ${raw}`;
      }
      return raw;
    };
    const seen = new Map();
    for (const [k, v] of fd) {
      if (['form', 'submitted_at'].includes(k) || query.has(k) && !form.elements[k]) continue;
      const val = v instanceof File ? null : String(v);
      if (!seen.has(k)) seen.set(k, []);
      if (val) seen.get(k).push(val);
    }
    const shown = (k, v) => {
      const opt = form.querySelector(`[name="${CSS.escape(k)}"][value="${CSS.escape(v)}"] + span`) || form.querySelector(`select[name="${CSS.escape(k)}"] option[value="${CSS.escape(v)}"]`);
      return opt ? opt.textContent : v;
    };
    seen.forEach((vals, k) => { if (vals.length && vals[0] !== 'yes') rows.push([label(k), vals.map(v => shown(k, v)).join(', ')]); });
    Object.entries(files).forEach(([k, list]) => {
      const w = form.querySelector(`[data-files="${k}"]`);
      if (!w) return;
      const raw = w.querySelector('label')?.firstChild?.textContent || 'Photos';
      const card = w.closest('.fprod');
      const pre = card ? `Product ${[...form.querySelectorAll('.fprod')].indexOf(card) + 1}: ` : '';
      rows.push([pre + raw, `${list.length} photo${list.length === 1 ? '' : 's'}`]);
    });
    dl.replaceChildren(...rows.map(([a, b]) => h('div', {}, h('dt', { text: a }), h('dd', { text: b }))));
  };

  const go = i => {
    steps[current].hidden = true;
    current = i;
    steps[current].hidden = false;
    steps[current].querySelectorAll('.fld, [data-products]').forEach(w => w._refresh?.());
    review();
    back.hidden = current === 0;
    const last = current === steps.length - 1;
    nextLabel.textContent = last ? (CFG.submitLabel || 'Send') : 'Continue';
    const pct = ((current + 1) / steps.length) * 100;
    bar.style.width = `${pct}%`;
    progTxt.textContent = `Step ${current + 1} of ${steps.length}`;
    errBox.hidden = true;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    steps[current].querySelector('.fstep__t').focus({ preventScroll: true });
  };

  back.addEventListener('click', () => go(Math.max(0, current - 1)));

  form.addEventListener('submit', async e => {
    e.preventDefault();
    if (!valid(steps[current])) return;
    if (current < steps.length - 1) { go(current + 1); return; }

    next.disabled = true;
    nextLabel.textContent = 'Sending…';
    try {
      const fd = collect();
      if (CFG.webhook) {
        const res = await fetch(CFG.webhook, { method: 'POST', body: fd });
        if (!res.ok) throw new Error(res.status);
      } else {
        console.info('No webhook set yet. This is what would be sent:', Object.fromEntries([...fd].map(([k, v]) => [k, v instanceof File ? `${v.name} (${Math.round(v.size / 1024)} KB)` : v])));
        await new Promise(r => setTimeout(r, 700));
      }
      $('[data-flow]').hidden = true;
      $('[data-done]').hidden = false;
      bar.style.width = '100%';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      errBox.hidden = false;
      next.disabled = false;
      nextLabel.textContent = CFG.submitLabel || 'Send';
    }
  });

  go(0);
})();
