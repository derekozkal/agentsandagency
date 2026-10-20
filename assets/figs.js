/* Agents & Agency · interactive figures
   Fig. 1  Who moves first?          (from "Unprompted," July 2026)
   Fig. 2  The liquidity crisis      (from "The Liquidity Crisis of Expertise," January 2026)
   Fig. 3  Challenger or sycophant   (from "The Rise of the Agentic Class," October 2025)
   AAModel.simulate is the same toy model the Lab's full simulator runs. */
(function () {
  'use strict';
  var d = document, w = window;
  function $(s, r) { return (r || d).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); }
  function motion() { return !w.AA || !w.AA.motionOn || w.AA.motionOn(); }

  /* ---------- The toy model ----------
     Three stocks: judgment held by working seniors (tacit), judgment captured
     into systems (encoded), and the junior pipeline. a = AI adoption speed,
     p = apprenticeship investment, f = encoding fidelity, all 0 to 100. */
  var AAModel = w.AAModel = {
    YEARS: 25,
    simulate: function (a, p, f) {
      a /= 100; p /= 100; f /= 100;
      var T = 100, E = 8, J = 45, rows = [];
      for (var y = 0; y <= this.YEARS; y++) {
        var C = T + 0.85 * f * E + 0.35 * J;
        rows.push({ y: y, T: T, E: E, J: J, C: C });
        var retire = 0.05 * T, promote = 0.05 * p * J, ramp = 1 - Math.exp(-y / 7);
        var capture = retire * f * (0.15 + 0.45 * a);
        T = Math.max(0, T - retire + promote);
        E = Math.max(0, E * (0.97 + 0.03 * a) + capture + 3.2 * a * f * ramp);
        J = Math.min(130, Math.max(0, J * (1 + 0.10 * p - 0.09 * a * (1 - 0.5 * p)) + 1));
      }
      return rows;
    },
    read: function (rows) {
      var C0 = rows[0].C, minI = 0;
      rows.forEach(function (r, i) { if (r.C < rows[minI].C) minI = i; });
      var minR = rows[minI], endR = rows[rows.length - 1];
      var crunch = minR.C < 0.88 * C0 && minI > 0, trough = crunch && minI < this.YEARS;
      return {
        C0: C0, min: minR, end: endR, crunch: crunch, trough: trough,
        rebound: trough && endR.C >= minR.C * 1.04,
        pct: Math.round(100 * minR.C / C0), endPct: Math.round(100 * endR.C / C0)
      };
    }
  };

  function setFill(input) {
    var p = (input.value - input.min) / (input.max - input.min) * 100;
    input.style.setProperty('--p', p + '%');
  }
  AAModel.setFill = setFill;

  /* Draws the model into an <svg>. Colors carry meaning: green is people, blue is AI. */
  AAModel.draw = function (svg, rows, opts) {
    opts = opts || {};
    /* Phones get a narrower drawing with larger type, and the legend carries the line names. */
    var narrow = (svg.getBoundingClientRect().width || 760) < 520, fs = narrow ? 1.35 : 1;
    var W = narrow ? 420 : 760, H = narrow ? 300 : (opts.h || 360), padL = 8, padR = narrow ? 14 : (opts.padR || 132), padT = 30, padB = narrow ? 40 : 34;
    var x0 = padL, x1 = W - padR, y0 = H - padB, y1 = padT, Y = AAModel.YEARS;
    var maxV = 0; rows.forEach(function (r) { maxV = Math.max(maxV, r.C, r.T, r.E); });
    var yMax = Math.max(140, Math.ceil((maxV + 12) / 20) * 20);
    var X = function (y) { return x0 + (x1 - x0) * (y / Y); };
    var V = function (v) { return y0 - (y0 - y1) * (Math.min(v, yMax) / yMax); };
    var path = function (k) { return rows.map(function (r, i) { return (i ? 'L' : 'M') + X(r.y).toFixed(1) + ' ' + V(r[k]).toFixed(1); }).join(' '); };
    var info = AAModel.read(rows), s = '';
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    for (var g = 20; g < yMax; g += 20) s += '<line x1="' + x0 + '" x2="' + x1 + '" y1="' + V(g) + '" y2="' + V(g) + '" stroke="#E6EBF2" stroke-width="1"/>';
    s += '<line x1="' + x0 + '" y1="' + V(info.C0) + '" x2="' + x1 + '" y2="' + V(info.C0) + '" stroke="#748196" stroke-width="1.2" stroke-dasharray="3 6"/>';
    s += '<text x="' + (x0 + 2) + '" y="' + (V(info.C0) - 8) + '" font-size="' + (11 * fs) + '" font-weight="700" letter-spacing="1" fill="#748196">STARTING CAPACITY</text>';
    s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + x1 + '" y2="' + y0 + '" stroke="#0B1A2B" stroke-width="1.5"/>';
    for (var t = 0; t <= Y; t += 5) {
      s += '<line x1="' + X(t) + '" y1="' + y0 + '" x2="' + X(t) + '" y2="' + (y0 + 5) + '" stroke="#0B1A2B"/>';
      s += '<text x="' + X(t) + '" y="' + (y0 + 22 * fs) + '" text-anchor="' + (t === 0 ? 'start' : (t === Y && narrow ? 'end' : 'middle')) + '" font-size="' + (12 * fs) + '" fill="#4A5568">' + (t === 0 ? 'Year 0' : t) + '</text>';
    }
    if (info.trough) {
      var mx = X(info.min.y), my = V(info.min.C);
      s += '<line x1="' + mx + '" y1="' + my + '" x2="' + mx + '" y2="' + y0 + '" stroke="#C2410C" stroke-width="1.2" stroke-dasharray="3 4"/>';
      s += '<circle cx="' + mx + '" cy="' + my + '" r="6" fill="#fff" stroke="#C2410C" stroke-width="2.5"/>';
      s += '<text x="' + mx + '" y="' + (my + 24 * fs) + '" text-anchor="middle" font-size="' + (11 * fs) + '" font-weight="700" letter-spacing="1" fill="#C2410C">LOW POINT · YR ' + info.min.y + '</text>';
    }
    s += '<path d="' + path('T') + '" fill="none" stroke="#067A55" stroke-width="2.6" stroke-linejoin="round"/>';
    s += '<path d="' + path('E') + '" fill="none" stroke="#2457F5" stroke-width="2.6" stroke-linejoin="round"/>';
    s += '<path d="' + path('C') + '" fill="none" stroke="#0B1A2B" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>';
    var end = info.end, labels = [
      { v: end.C, t: 'TOTAL CAPACITY', c: '#0B1A2B' },
      { v: end.T, t: 'HELD BY PEOPLE', c: '#067A55' },
      { v: end.E, t: 'CAPTURED IN AI', c: '#2457F5' }
    ].sort(function (m, n) { return n.v - m.v; }), used = [];
    if (narrow) labels = [];
    labels.forEach(function (L) {
      var yy = V(L.v);
      used.forEach(function (u) { if (Math.abs(yy - u) < 17) yy = u + 17; });
      used.push(yy);
      s += '<text x="' + (x1 + 10) + '" y="' + (yy + 4) + '" font-size="11.5" font-weight="700" letter-spacing=".8" fill="' + L.c + '">' + L.t + '</text>';
    });
    svg.innerHTML = s;
    return info;
  };

  /* Smoothly morphs from the last drawn rows to new ones. Charts redraw on resize. */
  var charts = [], rt = 0;
  w.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () { charts.forEach(function (c) { if (c.last) AAModel.draw(c.svg, c.last, c.opts); }); }, 150);
  });
  function tweener(svg, opts) {
    var rec = { svg: svg, opts: opts, last: null }, raf = 0;
    charts.push(rec);
    return function (rows, done) {
      cancelAnimationFrame(raf);
      if (!rec.last || !motion()) { rec.last = rows; var i = AAModel.draw(svg, rows, opts); if (done) done(i); return; }
      var from = rec.last, t0 = null, dur = 380;
      (function step(t) {
        if (!t0) t0 = t;
        var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
        var mid = rows.map(function (r, j) {
          var a = from[j];
          return { y: r.y, T: a.T + (r.T - a.T) * e, E: a.E + (r.E - a.E) * e, J: a.J + (r.J - a.J) * e, C: a.C + (r.C - a.C) * e };
        });
        rec.last = k < 1 ? mid : rows;
        var inf = AAModel.draw(svg, rec.last, opts);
        if (k < 1) raf = requestAnimationFrame(step); else if (done) done(inf);
      })(performance.now());
    };
  }
  AAModel.tweener = tweener;

  /* ---------- Fig. 1 · Who moves first? ---------- */
  var STAGES = [
    { owners: ['you', 'you', 'you', 'ai'], ai: 'AI, when asked',
      story: '<span class="lede">Hammer.</span> You want a playhouse for your kid. You pick the design, buy the lumber, and drive the nails with a nail gun. The tool does what you aim it at.' },
    { owners: ['you', 'you', 'ai', 'ai'], ai: 'AI',
      story: '<span class="lede">Contractor.</span> You tell a contractor you want a playhouse. They draw the plans, order the lumber, and build it. Wanting one was still your decision.' },
    { owners: ['ai', 'ai', 'ai', 'ai'], ai: 'AI, unasked',
      story: '<span class="lede">Unprompted.</span> The agent noticed your kid sketching playhouses, picked a design, ordered lumber, and had it built by Saturday. You found out when it was done.' }
  ];
  function initMoves(root) {
    var steps = $$('.step', root), btns = $$('[data-stage]', root), story = $('.story p', root);
    var pips = $$('.pips i', root), count = $('.pips b', root), play = $('.fig-play', root);
    var cur = -1, timer = null, timers = [];
    function paint(el, owner, label) {
      el.classList.toggle('ai', owner === 'ai');
      el.classList.toggle('you', owner === 'you');
      $('.who b', el).textContent = owner === 'ai' ? label : 'You';
    }
    function set(i, animate) {
      var st = STAGES[i];
      timers.forEach(clearTimeout); timers = [];
      btns.forEach(function (b, k) { b.setAttribute('aria-checked', k === i ? 'true' : 'false'); });
      var n = 0;
      steps.forEach(function (el, k) {
        var o = st.owners[k], was = el.classList.contains('ai') ? 'ai' : 'you';
        if (animate && motion() && was !== o) {
          timers.push(setTimeout(function () { paint(el, o, st.ai); el.classList.remove('flip'); void el.offsetWidth; el.classList.add('flip'); }, (n++) * 170));
        } else paint(el, o, st.ai);
      });
      var mine = st.owners.slice(0, 3).filter(function (o) { return o === 'you'; }).length;
      pips.forEach(function (p, k) { p.classList.toggle('on', k < mine); });
      if (count) count.textContent = mine + ' of 3';
      if (story) story.innerHTML = st.story;
      cur = i;
    }
    function stop() { clearInterval(timer); timer = null; if (play) play.setAttribute('aria-pressed', 'false'); }
    function run() {
      stop(); set(0, true);
      if (play) play.setAttribute('aria-pressed', 'true');
      var i = 0;
      timer = setInterval(function () { i++; if (i > 2) { stop(); return; } set(i, true); }, 2600);
    }
    btns.forEach(function (b, k) {
      b.addEventListener('click', function () { stop(); root._touched = true; set(k, true); });
      b.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight') n = (k + 1) % btns.length;
        if (e.key === 'ArrowLeft') n = (k + btns.length - 1) % btns.length;
        if (n !== null) { e.preventDefault(); stop(); set(n, true); btns[n].focus(); }
      });
    });
    if (play) play.addEventListener('click', function () { root._touched = true; run(); });
    set(0, false);
    root._fig = { run: run, set: set, touched: function () { return !!root._touched; } };
  }

  /* ---------- Fig. 2 · The liquidity crisis of expertise ---------- */
  function initLiquidity(root) {
    var a = $('[data-k="adopt"]', root), p = $('[data-k="apprentice"]', root);
    var oa = $('[data-o="adopt"]', root), op = $('[data-o="apprentice"]', root);
    var svg = $('svg', root), verdict = $('.verdict', root);
    var draw = tweener(svg, { h: 340 });
    function words(i) {
      if (!i.crunch) return '<b class="ok">NO CRUNCH</b>Juniors keep replenishing judgment while captured expertise matures. That outcome costs real apprenticeship spending.';
      if (i.rebound) return '<b class="mid">DIP, THEN RECOVERY</b>Capacity bottoms out at ' + i.pct + '% of where it started in year ' + i.min.y + ', then recovers to ' + i.endPct + '%. Survivable if nothing important happens during the dip.';
      if (i.min.y >= AAModel.YEARS) return '<b class="bad">CRUNCH</b>Capacity falls for all 25 years and ends at ' + i.endPct + '% of where it started. Solvent on paper, short when it counts.';
      return '<b class="bad">CRUNCH</b>Capacity bottoms out at ' + i.pct + '% in year ' + i.min.y + ' and ends at ' + i.endPct + '%. The seniors left before anything replaced them.';
    }
    function update() {
      oa.textContent = a.value; op.textContent = p.value; setFill(a); setFill(p);
      draw(AAModel.simulate(+a.value, +p.value, 50), function (info) { verdict.innerHTML = words(info); });
    }
    [a, p].forEach(function (el) { el.addEventListener('input', function () { root._touched = true; update(); }); });
    $$('[data-preset]', root).forEach(function (b) {
      b.addEventListener('click', function () { var v = b.getAttribute('data-preset').split(','); a.value = v[0]; p.value = v[1]; root._touched = true; update(); });
    });
    update();
    root._fig = {
      preset: function (x, y) { a.value = x; p.value = y; root._touched = true; update(); },
      touched: function () { return !!root._touched; }
    };
  }

  /* ---------- Fig. 3 · Challenger or sycophant ---------- */
  var PROMPTS = [
    { q: 'We should replace our intern program with AI agents.',
      s: 'Smart move. Agents work weekends and never need parking.',
      c: 'Where will your senior people come from in ten years if nobody starts at the bottom?' },
    { q: 'My grant proposal is ready. I think it’s my best yet.',
      s: 'It’s excellent. I wouldn’t change a word.',
      c: 'Your second aim depends on data you haven’t secured. What happens if that partner says no?' },
    { q: 'Let’s cut the training budget to pay for AI tools.',
      s: 'Great call. The tools will pay for themselves.',
      c: 'Who will check the tools’ work once the training is gone? What does a mistake cost then?' }
  ];
  function initChallenger(root) {
    var btns = $$('[data-q]', root), me = $('.bubble.me', root), syc = $('.reply.syc p', root), cha = $('.reply.cha p', root);
    var timers = [];
    function typeInto(node, text, delay) {
      if (!motion()) { node.textContent = text; return; }
      node.textContent = ''; node.classList.add('caret');
      var i = 0;
      timers.push(setTimeout(function tick() {
        i += 2; node.textContent = text.slice(0, i);
        if (i < text.length) timers.push(setTimeout(tick, 24)); else node.classList.remove('caret');
      }, delay));
    }
    function set(k) {
      timers.forEach(clearTimeout); timers = [];
      btns.forEach(function (b, j) { b.setAttribute('aria-pressed', j === k ? 'true' : 'false'); });
      var P = PROMPTS[k];
      me.textContent = P.q;
      typeInto(syc, P.s, 250);
      typeInto(cha, P.c, 450);
    }
    btns.forEach(function (b, k) { b.addEventListener('click', function () { root._touched = true; set(k); }); });
    var first = PROMPTS[0]; me.textContent = first.q; syc.textContent = first.s; cha.textContent = first.c;
    btns.forEach(function (b, j) { b.setAttribute('aria-pressed', j === 0 ? 'true' : 'false'); });
    root._fig = { set: function (k) { root._touched = true; set(k); }, touched: function () { return !!root._touched; } };
  }

  $$('[data-fig="moves"]').forEach(initMoves);
  $$('[data-fig="liquidity"]').forEach(initLiquidity);
  $$('[data-fig="challenger"]').forEach(initChallenger);
})();
