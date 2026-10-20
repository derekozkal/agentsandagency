/* Agents & Agency · shared behavior
   Menu, reveals, count-ups, motion and agent switches, inline video,
   the hero's delegation dial, and the unprompted agent. No dependencies. */
(function () {
  'use strict';
  var d = document, html = d.documentElement, w = window;
  window.__aaReady = true;
  /* Hide reveal blocks only once this script runs, and skip the fade on the first frame. */
  html.classList.add('ready', 'no-trans');
  requestAnimationFrame(function () { requestAnimationFrame(function () { html.classList.remove('no-trans'); }); });

  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  function sess(k, v) { try { if (v === undefined) return sessionStorage.getItem(k); sessionStorage.setItem(k, v); } catch (e) { return null; } }
  function $(s, r) { return (r || d).querySelector(s); }
  function $$(s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); }
  function motionOn() { return html.getAttribute('data-motion') !== 'off'; }
  var AA = w.AA = w.AA || {};
  AA.motionOn = motionOn;

  /* ---------- Old anchors that moved to their own pages ---------- */
  var moved = { '#writing': 'writing.html', '#network': 'research.html', '#media': 'media.html', '#about': 'about.html', '#lab': 'lab.html' };
  if (/(^|\/)(index\.html)?$/.test(location.pathname) && moved[location.hash]) location.replace(moved[location.hash]);

  /* ---------- Header ---------- */
  var mast = $('.masthead'), nav = $('#nav'), tog = $('.menu-toggle');
  if (tog && nav) {
    tog.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      tog.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); tog.setAttribute('aria-expanded', 'false'); }); });
  }
  if (mast) {
    var darkSel = mast.getAttribute('data-dark-until'), darkEl = darkSel && $(darkSel);
    var onScroll = function () {
      mast.classList.toggle('scrolled', w.scrollY > 8);
      if (darkEl) mast.classList.toggle('on-dark', darkEl.getBoundingClientRect().bottom > mast.offsetHeight);
    };
    w.addEventListener('scroll', onScroll, { passive: true });
    w.addEventListener('resize', onScroll);
    onScroll();
  }

  /* ---------- Reveal on scroll, count-ups, timelines ---------- */
  function countUp(el) {
    var end = parseFloat(el.getAttribute('data-count')), dec = parseInt(el.getAttribute('data-dec') || '0', 10);
    var pre = el.getAttribute('data-pre') || '', suf = el.getAttribute('data-suf') || '', comma = el.hasAttribute('data-comma');
    var fmt = function (v) {
      var s = v.toFixed(dec);
      if (comma) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      return pre + s + suf;
    };
    if (!motionOn()) { el.textContent = fmt(end); return; }
    var t0 = null, dur = 1400;
    function step(t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(end * e);
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var watch = $$('[data-reveal],[data-count],[data-observe]');
  if ('IntersectionObserver' in w && watch.length) {
    var vh = w.innerHeight;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        el.classList.add('is-in');
        if (el.hasAttribute('data-count') && !el._counted) { el._counted = true; countUp(el); }
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    watch.forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (el.hasAttribute('data-reveal') && r.top < vh * 0.92 && r.bottom > 0) el.classList.add('is-in');
      if (el.hasAttribute('data-count') && motionOn()) {
        el.textContent = (el.getAttribute('data-pre') || '') + '0' + (el.getAttribute('data-suf') || '');
      }
      io.observe(el);
    });
  } else {
    watch.forEach(function (el) { el.classList.add('is-in'); });
  }
  /* Backup for fast jumps and anchor links: reveal anything that has scrolled into view. */
  var pending = $$('[data-reveal]'), ticking = false;
  function sweep() {
    ticking = false;
    var vh = w.innerHeight;
    pending = pending.filter(function (el) {
      if (el.classList.contains('is-in')) return false;
      if (el.getBoundingClientRect().top < vh * 0.96) { el.classList.add('is-in'); return false; }
      return true;
    });
    if (!pending.length) w.removeEventListener('scroll', onSweep);
  }
  function onSweep() { if (!ticking) { ticking = true; requestAnimationFrame(sweep); } }
  w.addEventListener('scroll', onSweep, { passive: true });
  w.addEventListener('resize', onSweep);

  /* ---------- Switches: motion and agent ---------- */
  function setSvgMotion() {
    $$('svg').forEach(function (s) {
      if (!s.querySelector('animate,animateMotion,animateTransform')) return;
      try { motionOn() ? s.unpauseAnimations() : s.pauseAnimations(); } catch (e) {}
    });
  }
  function paintToggles() {
    $$('[data-toggle]').forEach(function (b) {
      var k = b.getAttribute('data-toggle');
      var on = html.getAttribute('data-' + k) !== 'off';
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      var lab = b.querySelector('b');
      if (lab) lab.textContent = on ? 'on' : 'off';
    });
  }
  function setSwitch(k, on) {
    html.setAttribute('data-' + k, on ? 'on' : 'off');
    store('aa-' + k, on ? 'on' : 'off');
    paintToggles();
    if (k === 'motion') setSvgMotion();
    if (k === 'agent') { if (!on) Agent.dismiss(true); Agent.tally(); }
  }
  $$('[data-toggle]').forEach(function (b) {
    b.addEventListener('click', function () {
      var k = b.getAttribute('data-toggle');
      setSwitch(k, html.getAttribute('data-' + k) === 'off');
    });
  });
  paintToggles(); setSvgMotion();
  AA.setSwitch = setSwitch;

  /* ---------- The unprompted agent ----------
     It offers to do something you didn't ask for. You decide.
     One offer at a time, at most once per visit each, never mid-scroll. */
  var Agent = (function () {
    var log = {}; try { log = JSON.parse(sess('aa-agent-log') || '{}'); } catch (e) {}
    log.offers = log.offers || 0; log.yes = log.yes || 0; log.no = log.no || 0; log.seen = log.seen || {};
    var el = null, cur = null, lastScroll = 0, lastClose = 0, typing = null, hideTimer = null;
    w.addEventListener('scroll', function () { lastScroll = Date.now(); }, { passive: true });
    function on() { return html.getAttribute('data-agent') !== 'off'; }
    function save() { sess('aa-agent-log', JSON.stringify(log)); tally(); }
    function tally() {
      var t = $('#agentTally'); if (!t) return;
      if (!on()) { t.innerHTML = 'The agent is off. It will stay quiet until you turn it back on.'; return; }
      if (!log.offers) { t.innerHTML = 'No unprompted offers yet this visit.'; return; }
      t.innerHTML = 'This visit the agent made <b>' + log.offers + '</b> unprompted ' + (log.offers === 1 ? 'offer' : 'offers') +
        '. You accepted <b>' + log.yes + '</b> and declined <b>' + log.no + '</b>.';
    }
    function build() {
      el = d.createElement('div');
      el.className = 'agent-toast';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      el.innerHTML = '<div class="agent-head"><span class="pulse" aria-hidden="true"></span><span>agent</span><span class="unp">unprompted</span>' +
        '<button class="x" type="button" aria-label="Dismiss">&times;</button></div>' +
        '<p class="agent-msg"></p><div class="agent-acts"><button type="button" class="yes"></button><button type="button" class="no"></button></div>' +
        '<button type="button" class="agent-off">Turn the agent off</button>';
      d.body.appendChild(el);
      $('.x', el).addEventListener('click', function () { close('ignored'); });
      $('.yes', el).addEventListener('click', function () { close('yes'); });
      $('.no', el).addEventListener('click', function () { close('no'); });
      $('.agent-off', el).addEventListener('click', function () { close('ignored'); setSwitch('agent', false); });
    }
    function type(node, text) {
      clearInterval(typing);
      if (!motionOn()) { node.textContent = text; return; }
      var i = 0; node.textContent = '';
      typing = setInterval(function () {
        i += 2; node.textContent = text.slice(0, i);
        if (i >= text.length) { clearInterval(typing); node.textContent = text; }
      }, 22);
    }
    function show(o) {
      if (!el) build();
      cur = o;
      log.offers++; log.seen[o.id] = 1; save();
      $('.yes', el).textContent = o.yes || 'Do it';
      $('.no', el).textContent = o.no || 'No thanks';
      el.style.display = 'block';
      requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('show'); }); });
      type($('.agent-msg', el), o.msg);
      if (o.target) focus(o.target);
      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () { if (cur === o) close('ignored'); }, 16000);
    }
    function focus(t) {
      t = typeof t === 'string' ? $(t) : t; if (!t) return;
      t.classList.add('agent-focus');
      setTimeout(function () { t.classList.remove('agent-focus'); }, 4500);
    }
    function close(how) {
      if (!cur) return;
      var o = cur; cur = null; lastClose = Date.now();
      clearTimeout(hideTimer); clearInterval(typing);
      if (how === 'yes') { log.yes++; try { o.onYes && o.onYes(); } catch (e) {} }
      if (how === 'no') { log.no++; try { o.onNo && o.onNo(); } catch (e) {} }
      save();
      el.classList.remove('show');
      setTimeout(function () { if (!cur && el) el.style.display = 'none'; }, 420);
    }
    function dismiss(silent) { if (cur) close('ignored'); }
    function visible(t) {
      if (!t) return true;
      var r = t.getBoundingClientRect(), vh = w.innerHeight;
      var shown = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      return shown > Math.min(r.height, vh) * 0.4;
    }
    /* when({id, after, inView, dwell, test, msg, yes, no, onYes, onNo, target}) */
    function when(o) {
      if (log.seen[o.id]) return;
      var start = Date.now(), seenSince = 0, t = o.inView && (typeof o.inView === 'string' ? $(o.inView) : o.inView);
      if (o.inView && !t) return;
      var iv = setInterval(function () {
        if (log.seen[o.id]) { clearInterval(iv); return; }
        if (!on() || cur || d.hidden) return;
        var now = Date.now();
        if (now - start < (o.after || 0)) return;
        if (t) {
          if (visible(t)) { if (!seenSince) seenSince = now; } else { seenSince = 0; return; }
          if (now - seenSince < (o.dwell || 2500)) return;
        }
        if (now - lastScroll < 1100 || now - lastClose < 15000) return;
        if (o.test && !o.test()) return;
        clearInterval(iv);
        show(o);
      }, 400);
    }
    tally();
    return { when: when, dismiss: dismiss, tally: tally, focus: focus, on: on };
  })();
  AA.agent = Agent;

  /* ---------- Inline video ---------- */
  function playInline(a) {
    var id = a.getAttribute('data-yt'); if (!id) return;
    var box = d.createElement('div');
    box.className = a.className + ' playing';
    box.innerHTML = a.innerHTML;
    a.parentNode.replaceChild(box, a);
    var th = $('.thumb', box);
    var f = d.createElement('iframe');
    f.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0&modestbranding=1';
    f.title = ($('b', box) || {}).textContent || 'Video';
    f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    f.allowFullscreen = true;
    th.appendChild(f);
    var img = $('img', th); if (img) img.style.opacity = '0';
  }
  $$('a[data-yt]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button === 1) return;
      e.preventDefault(); playInline(a);
    });
  });
  AA.playInline = function (sel) { var a = $(sel); if (a && a.hasAttribute('data-yt')) playInline(a); };

  /* ---------- Copy link ---------- */
  $$('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var txt = b.getAttribute('data-copy'), label = b.textContent;
      function ok() { b.textContent = 'Link copied'; b.classList.add('done'); setTimeout(function () { b.textContent = label; b.classList.remove('done'); }, 2200); }
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(txt).then(ok, function () { w.prompt('Copy this link:', txt); }); }
      else { w.prompt('Copy this link:', txt); }
    });
  });

  /* ---------- Hero dial: how much do you want to delegate? ---------- */
  var dial = $('.dial');
  if (dial) {
    var btns = $$('[data-mode]', dial), knob = $('.knob', dial), modes = btns.map(function (b) { return b.getAttribute('data-mode'); });
    var touched = false;
    var setMode = function (m, fromUser) {
      var i = modes.indexOf(m); if (i < 0) return;
      if (fromUser) touched = true;
      btns.forEach(function (b, k) { b.setAttribute('aria-checked', k === i ? 'true' : 'false'); b.tabIndex = k === i ? 0 : -1; });
      if (knob) knob.style.transform = 'translateX(' + (i * 100) + '%)';
      $$('[data-pane]').forEach(function (p) {
        var hit = p.getAttribute('data-pane') === m;
        if (hit && p.hidden) { p.hidden = false; p.classList.remove('enter'); void p.offsetWidth; p.classList.add('enter'); }
        else if (!hit) p.hidden = true;
      });
      dial.setAttribute('data-current', m);
    };
    btns.forEach(function (b, k) {
      b.addEventListener('click', function () { setMode(b.getAttribute('data-mode'), true); });
      b.addEventListener('keydown', function (e) {
        var n = null;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (k + 1) % btns.length;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (k + btns.length - 1) % btns.length;
        if (n !== null) { e.preventDefault(); setMode(modes[n], true); btns[n].focus(); }
      });
    });
    AA.dial = { set: setMode, touched: function () { return touched; }, current: function () { return dial.getAttribute('data-current'); } };
    setMode(dial.getAttribute('data-current') || modes[0]);
  }
})();
