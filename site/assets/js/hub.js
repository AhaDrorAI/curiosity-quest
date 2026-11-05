/*
  Curiosity Quest hub: applies the chosen language and draws one card per catalog entry.
  Reads:  window.CQ_CATALOG (catalog.js), window.CQ_TEXT etc. (i18n.js)
*/
(function () {
  'use strict';

  var LANGS = window.CQ_HUB_LANGUAGES;
  var TEXT = window.CQ_TEXT;
  var STORAGE_KEY = 'cq_lang';

  // Browser storage can be blocked (private windows, embeds). Never let that break the page.
  var storage = {
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  var currentLang = LANGS.indexOf(window.CQ_START_LANG) > -1 ? window.CQ_START_LANG : 'en';

  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (attrs[k] === null || attrs[k] === undefined || attrs[k] === false) return;
      if (k === 'text') node.textContent = attrs[k];
      else node.setAttribute(k, attrs[k] === true ? '' : attrs[k]);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(c); });
    return node;
  }

  function svg(markup) {
    var wrap = document.createElement('span');
    wrap.innerHTML = markup; // fixed icon markup written in this file, never visitor data
    return wrap.firstChild;
  }

  var ICON_ARROW = '<svg class="icon-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var ICON_EXTERNAL = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var PIN = '<svg class="dest-pin" viewBox="0 0 30 30" aria-hidden="true" focusable="false"><circle cx="15" cy="15" r="11" fill="#FFC845" stroke="#0E2240" stroke-width="3"/><circle cx="15" cy="15" r="4" fill="#0E2240"/></svg>';

  function pick(map, lang) { return (map && (map[lang] || map.en)) || ''; }

  function activityHref(entry, lang) {
    if (entry.type === 'hosted' && entry.langParam && entry.languages.indexOf(lang) > -1) {
      return entry.url + '?' + encodeURIComponent(entry.langParam) + '=' + encodeURIComponent(lang);
    }
    return entry.url;
  }

  function renderCard(entry, lang, t) {
    var titleId = 'dest-title-' + entry.id;
    var isExternal = entry.type === 'external';

    var img = el('img', { src: entry.illustration, alt: '', width: '400', height: '289', loading: 'lazy', decoding: 'async' });
    var fallback = el('span', { class: 'dest-fallback', hidden: true, 'aria-hidden': 'true' }, [
      el('span', { text: entry.fallbackIcon || '✨' }),
      el('span', { text: pick(entry.title, lang) })
    ]);
    // If the illustration can't load, show the icon and title instead of a broken image
    img.addEventListener('error', function () { img.hidden = true; fallback.hidden = false; });

    var subjects = el('ul', { class: 'chips' }, (entry.subjects || []).map(function (s) {
      return el('li', { text: pick(window.CQ_SUBJECTS[s], lang) || s });
    }));
    var languages = el('ul', { class: 'chips' }, entry.languages.map(function (code) {
      // Each language name is written in its own language and isolated with <bdi>,
      // so Hebrew and Latin names don't scramble each other's order.
      var item = el('li', { lang: code });
      item.appendChild(el('bdi', { text: window.CQ_LANGUAGE_NAMES[code] || code }));
      return item;
    }));

    var cta = el('a', {
      class: 'dest-cta',
      href: activityHref(entry, lang),
      target: isExternal ? '_blank' : null,
      rel: isExternal ? 'noopener' : null,
      'aria-describedby': titleId
    }, [el('span', { text: pick(entry.cta, lang) })]);
    if (isExternal) {
      cta.appendChild(el('span', { class: 'visually-hidden', text: t.newTab }));
      cta.appendChild(svg(ICON_EXTERNAL));
    } else {
      cta.appendChild(svg(ICON_ARROW));
    }

    return el('li', { class: 'destination', 'data-id': entry.id }, [
      el('article', { class: 'dest-card', 'aria-labelledby': titleId }, [
        svg(PIN),
        el('div', { class: 'dest-window' }, [img, fallback]),
        el('div', { class: 'dest-body' }, [
          el('h3', { class: 'dest-title', id: titleId, text: pick(entry.title, lang) }),
          el('p', { class: 'dest-desc', text: pick(entry.description, lang) }),
          el('dl', { class: 'dest-facts' }, [
            el('div', null, [el('dt', { text: t.subjectsLabel }), el('dd', null, [subjects])]),
            el('div', null, [el('dt', { text: t.languagesLabel }), el('dd', null, [languages])])
          ]),
          cta
        ])
      ])
    ]);
  }

  function renderLanguageSwitch(lang) {
    var box = document.getElementById('lang-switch');
    if (!box.children.length) {
      LANGS.forEach(function (code) {
        var b = el('button', { type: 'button', lang: code, 'data-lang': code });
        b.appendChild(el('bdi', { text: window.CQ_LANGUAGE_NAMES[code] }));
        b.addEventListener('click', function () {
          storage.set(STORAGE_KEY, code); // remember only choices the visitor makes
          apply(code);
        });
        box.appendChild(b);
      });
    }
    Array.prototype.forEach.call(box.children, function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });
  }

  function apply(lang) {
    currentLang = lang;
    var t = TEXT[lang];
    var root = document.documentElement;
    root.lang = lang;
    root.dir = window.CQ_RTL.indexOf(lang) > -1 ? 'rtl' : 'ltr';
    document.title = t.pageTitle;
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute('content', t.metaDescription);

    document.querySelectorAll('[data-i18n]').forEach(function (node) {
      node.textContent = t[node.getAttribute('data-i18n')];
    });
    document.querySelectorAll('[data-i18n-aria]').forEach(function (node) {
      node.setAttribute('aria-label', t[node.getAttribute('data-i18n-aria')]);
    });

    var about = document.getElementById('about-body');
    about.replaceChildren.apply(about, t.aboutBody.map(function (p) { return el('p', { text: p }); }));

    var list = document.getElementById('destinations');
    list.replaceChildren.apply(list, window.CQ_CATALOG.map(function (entry) { return renderCard(entry, lang, t); }));

    renderLanguageSwitch(lang);
    root.classList.remove('cq-pending');
  }

  apply(currentLang);
})();
