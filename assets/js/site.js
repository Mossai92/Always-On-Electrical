/* Always On Electrical — navigation toggle and the callout request form. No dependencies. */
(function () {
  'use strict';

  // ---- mobile navigation ----
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) { nav.classList.remove('is-open'); toggle.setAttribute('aria-expanded', 'false'); toggle.focus(); }
    });
  }

  // ---- availability rule: weekdays are evenings only, weekends are any window ----
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function parseDate(value) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || '');
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; // local date, avoids UTC shifting the weekday
  }
  function isWeekend(d) { var n = d.getDay(); return n === 0 || n === 6; }
  function allowedWindows(d) { return isWeekend(d) ? ['any', 'morning', 'afternoon', 'evening'] : ['evening']; }

  function setupDateBlock(block) {
    var input = block.querySelector('input[type="date"]');
    var note = block.querySelector('[data-note]');
    var chips = Array.prototype.slice.call(block.querySelectorAll('.chip'));
    if (!input) return;
    if (block.aoeApply) { block.aoeApply(); return; } // already wired: just re-apply after a reset
    var today = new Date();
    input.min = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

    function paint() {
      chips.forEach(function (chip) {
        var radio = chip.querySelector('input');
        chip.classList.toggle('is-checked', radio.checked);
      });
    }
    function apply() {
      var d = parseDate(input.value);
      if (!d) {
        chips.forEach(function (chip) { chip.classList.remove('is-off'); chip.querySelector('input').disabled = false; });
        note.textContent = 'Pick a date to see the windows for that day.';
        note.classList.remove('is-weekday');
        paint();
        return;
      }
      var allowed = allowedWindows(d);
      var weekend = isWeekend(d);
      var anyChecked = false;
      chips.forEach(function (chip) {
        var radio = chip.querySelector('input');
        var ok = allowed.indexOf(radio.value) !== -1;
        radio.disabled = !ok;
        chip.classList.toggle('is-off', !ok);
        if (!ok && radio.checked) radio.checked = false;
        if (radio.checked) anyChecked = true;
      });
      if (!anyChecked) {
        var pick = weekend ? 'any' : 'evening';
        chips.forEach(function (chip) { var r = chip.querySelector('input'); if (r.value === pick) r.checked = true; });
      }
      note.textContent = DAYS[d.getDay()] + (weekend ? ' is a weekend day, so any window works.' : ' is a weekday, so evenings only.');
      note.classList.toggle('is-weekday', !weekend);
      paint();
    }
    block.aoeApply = apply;
    input.addEventListener('change', apply);
    input.addEventListener('input', apply);
    chips.forEach(function (chip) {
      var radio = chip.querySelector('input');
      radio.addEventListener('change', paint);
      radio.addEventListener('focus', function () { chip.classList.add('is-focus'); });
      radio.addEventListener('blur', function () { chip.classList.remove('is-focus'); });
    });
    apply();
  }

  // ---- the request form ----
  var form = document.querySelector('[data-request-form]');
  if (form) {
    Array.prototype.forEach.call(form.querySelectorAll('.date-block'), setupDateBlock);

    var ts = form.querySelector('[data-ts]');
    if (ts) ts.value = String(Date.now());

    var photos = form.querySelector('[data-photos]');
    var names = form.querySelector('[data-photo-names]');
    if (photos && names) {
      photos.addEventListener('change', function () {
        var list = Array.prototype.map.call(photos.files, function (f) { return f.name; });
        names.textContent = list.length ? 'Attached: ' + list.join(', ') : '';
      });
    }

    var status = form.querySelector('[data-status]');
    function showStatus(kind, text) {
      if (!status) return;
      status.hidden = false;
      status.className = 'form__status is-' + kind;
      status.textContent = text;
      status.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    function validate() {
      var bad = [];
      Array.prototype.forEach.call(form.querySelectorAll('[required]'), function (el) {
        var ok = el.type === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(el.value.trim()) : el.value.trim() !== '';
        el.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (!ok) bad.push(el);
      });
      // each chosen date needs an allowed window
      Array.prototype.forEach.call(form.querySelectorAll('.date-block'), function (block) {
        var input = block.querySelector('input[type="date"]');
        var d = parseDate(input.value);
        if (!d) return;
        var checked = block.querySelector('input[type="radio"]:checked');
        if (!checked || allowedWindows(d).indexOf(checked.value) === -1) bad.push(input);
      });
      return bad;
    }

    form.addEventListener('submit', function (e) {
      var bad = validate();
      if (bad.length) {
        e.preventDefault();
        bad[0].focus();
        showStatus('error', 'A few details are missing or need a look: the highlighted fields.');
        return;
      }
      if (document.body.getAttribute('data-demo') === 'true') {
        // preview build: nothing is sent
        e.preventDefault();
        showStatus('ok', 'This is a preview, so nothing was sent. On the live site this request goes straight to Peter by email (and text), and you get a confirmation email.');
        return;
      }
      if (!window.fetch || !window.FormData) return; // plain submit; the handler redirects to thank-you.html
      e.preventDefault();
      var button = form.querySelector('button[type="submit"]');
      button.disabled = true;
      var label = button.textContent;
      button.textContent = 'Sending…';
      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { 'Accept': 'application/json' } })
        .then(function (r) { return r.json().then(function (data) { return { ok: r.ok, data: data }; }); })
        .then(function (res) {
          if (res.ok && res.data && res.data.ok) {
            form.reset();
            Array.prototype.forEach.call(form.querySelectorAll('.date-block'), setupDateBlock);
            if (names) names.textContent = '';
            showStatus('ok', 'Request received. Peter will be in touch by call or text to confirm the day, and a confirmation is on its way to your email.');
          } else {
            var msg = (res.data && res.data.error) || 'Something went wrong sending that. Please try again, or call ' + (form.dataset.phone || 'the number at the top of the page') + '.';
            showStatus('error', msg);
          }
        })
        .catch(function () {
          showStatus('error', 'The request could not be sent just now. Please try again in a moment, or call the number at the top of the page.');
        })
        .then(function () { button.disabled = false; button.textContent = label; });
    });
  }
})();
