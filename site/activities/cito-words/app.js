/*
  Cito words: interface and practice logic.
  Reads: window.CW_WORDS, CW_GROUPS, CW_CONFUSABLE, CW_SAME_MEANING (words.js), window.CW_TEXTS (texts.js).
  The words and texts are always Dutch (the test language). Buttons and instructions follow the chosen
  interface language: Dutch, Hebrew or English.
  Stored in the browser only: the language the visitor clicked, and the words starred for review.
*/
(function () {
  'use strict';

  var WORDS = window.CW_WORDS;
  var GROUPS = window.CW_GROUPS;
  var TEXTS = window.CW_TEXTS;
  var BY_ID = {};
  WORDS.forEach(function (w) { BY_ID[w.id] = w; });
  var LANGS = ['nl', 'he', 'en'];
  var LANG_KEY = 'cito_words_lang';
  var STAR_KEY = 'cito_words_review';
  var ROUND_SIZE = 10;

  // ---------- Interface text ----------
  var UI = {
    nl: {
      pageTitle: 'Cito-woorden · Curiosity Quest',
      skipLink: 'Naar de oefeningen', back: 'Alle avonturen', langLabel: 'Taal',
      title: 'Cito-woorden', subtitle: 'Woorden die vaak in Cito-toetsen begrijpend lezen staan',
      sections: 'Onderdelen', tabGroups: 'Woordgroepen', tabCards: 'Flitskaarten', tabQuiz: 'Quiz', tabTexts: 'Teksten',
      groupsIntro: 'Tik op een woord voor de betekenis, een voorbeeld en een vertaling.',
      practiseGroup: 'Oefen deze groep', wordsCount: '{n} woorden',
      whichWords: 'Welke woorden?', allWords: 'Alle woorden ({n})', starredWords: '★ Om te herhalen ({n})',
      emptyStarred: 'Je hebt nog geen woorden gemarkeerd. Druk bij een woord op ★ "Markeer om te herhalen", of kies "Alle woorden".',
      shuffle: 'Schudden', flip: 'Omdraaien', flipBack: 'Terugdraaien', prev: 'Vorige', next: 'Volgende',
      flipHint: 'Weet je wat het betekent? Draai de kaart om.',
      counter: '{i} van {n}', star: 'Markeer om te herhalen', starred: 'gemarkeerd',
      meaning: 'Betekenis', example: 'Voorbeeld', tip: 'Let op', translation: 'Vertaling',
      showTranslation: 'Vertaling tonen', hideTranslation: 'Vertaling verbergen',
      quizMode: 'Soort vraag', modeMeaning: 'Kies de betekenis', modeWord: 'Kies het woord', modeType: 'Typ het woord',
      askMeaning: 'Wat betekent dit woord?', askWord: 'Welk woord hoort bij deze betekenis?', askType: 'Typ het woord dat bij deze betekenis hoort.',
      typeLabel: 'Het woord', check: 'Controleer', hint: 'Hint', hintText: 'Begint met "{l}" en heeft {n} letters.',
      emptyAnswer: 'Typ eerst een woord.',
      progress: 'Vraag {i} van {n}', score: 'Goed: {s}',
      correct: 'Goed zo!', wrong: 'Helaas.', rightAnswer: 'Het goede antwoord:',
      alsoRight: 'Ook goed! "{w}" betekent bijna hetzelfde.', spelling: 'Bijna goed! Let op de spelling: {w}',
      nextQuestion: 'Volgende vraag', seeResult: 'Bekijk je score',
      roundDone: 'Klaar! {s} van de {n} goed.', allRight: 'Alles goed. Knap gedaan!',
      missedTitle: 'Kijk nog eens naar:', starMissed: 'Markeer deze woorden om te herhalen', starredDone: 'Gemarkeerd',
      retryMissed: 'Oefen je fouten opnieuw', newRound: 'Nieuwe ronde',
      textsIntro: 'Lees een korte tekst en beantwoord vragen zoals in de toets. Lees eerst de tekst, dan de vraag.',
      questionsCount: '{n} vragen', read: 'Lezen', allTexts: 'Alle teksten', textLabel: 'Tekst',
      why: 'Waarom?', lookUp: 'Woorden uit deze vraag',
      textDone: 'Tekst klaar: {s} van de {n} goed.', nextText: 'Volgende tekst', readAgain: 'Opnieuw',
      close: 'Sluiten',
      word: 'Woord', listenWord: 'Luister naar het woord', listenMeaning: 'Luister naar de betekenis', listenExample: 'Luister naar het voorbeeld',
      listenQuestion: 'Lees de vraag en de antwoorden voor', listenWhy: 'Lees de uitleg voor', readText: 'Lees de tekst voor', stop: 'Stop met voorlezen',
      noVoice: 'Voorlezen werkt hier niet: dit apparaat heeft geen eigen Nederlandse stem. Je kunt er een toevoegen in de instellingen van je apparaat, bij Spraak of Tekst-naar-spraak.',
      source: 'De woorden en hun betekenissen komen uit een woordenlijst van school. De voorbeeldzinnen, vertalingen, tips en oefenteksten zijn voor deze site geschreven. Dit is geen officieel materiaal van Cito.'
    },
    he: {
      pageTitle: 'מילים למבחן הסיטו · Curiosity Quest',
      skipLink: 'דלגו לתרגול', back: 'כל ההרפתקאות', langLabel: 'שפה',
      title: 'מילים למבחן הסיטו', subtitle: 'המילים שחוזרות שוב ושוב במבחני הבנת הנקרא בהולנדית',
      sections: 'חלקים', tabGroups: 'קבוצות מילים', tabCards: 'כרטיסיות', tabQuiz: 'חידון', tabTexts: 'טקסטים',
      groupsIntro: 'לחצו על מילה כדי לראות את הפירוש, משפט לדוגמה ותרגום.',
      practiseGroup: 'לתרגל את הקבוצה', wordsCount: '{n} מילים',
      whichWords: 'אילו מילים?', allWords: 'כל המילים ({n})', starredWords: '★ לחזרה ({n})',
      emptyStarred: 'עוד לא סימנתם מילים לחזרה. לחצו על ★ "סמנו לחזרה" ליד מילה, או בחרו "כל המילים".',
      shuffle: 'ערבוב', flip: 'הפכו', flipBack: 'הפכו בחזרה', prev: 'הקודמת', next: 'הבאה',
      flipHint: 'יודעים מה זה אומר? הפכו את הכרטיס.',
      counter: '{i} מתוך {n}', star: 'סמנו לחזרה', starred: 'מסומנת לחזרה',
      meaning: 'פירוש', example: 'דוגמה', tip: 'שימו לב', translation: 'תרגום',
      showTranslation: 'הצגת תרגום', hideTranslation: 'הסתרת תרגום',
      quizMode: 'סוג שאלה', modeMeaning: 'בחרו את הפירוש', modeWord: 'בחרו את המילה', modeType: 'הקלידו את המילה',
      askMeaning: 'מה פירוש המילה?', askWord: 'איזו מילה מתאימה לפירוש הזה?', askType: 'הקלידו את המילה ההולנדית שמתאימה לפירוש.',
      typeLabel: 'המילה', check: 'בדיקה', hint: 'רמז', hintText: 'מתחילה ב־"{l}" ויש בה {n} אותיות.',
      emptyAnswer: 'קודם הקלידו מילה.',
      progress: 'שאלה {i} מתוך {n}', score: 'נכונות: {s}',
      correct: 'נכון!', wrong: 'לא בדיוק.', rightAnswer: 'התשובה הנכונה:',
      alsoRight: 'גם נכון! "{w}" אומרת כמעט אותו דבר.', spelling: 'כמעט! שימו לב לאיות: {w}',
      nextQuestion: 'לשאלה הבאה', seeResult: 'לתוצאה',
      roundDone: 'סיימתם! {s} מתוך {n} נכונות.', allRight: 'הכול נכון. כל הכבוד!',
      missedTitle: 'כדאי לחזור על:', starMissed: 'סמנו את המילים האלה לחזרה', starredDone: 'סומנו',
      retryMissed: 'לתרגל שוב את הטעויות', newRound: 'סבב חדש',
      textsIntro: 'קראו טקסט קצר בהולנדית וענו על שאלות כמו במבחן. קודם קוראים את הטקסט, אחר כך את השאלה.',
      questionsCount: '{n} שאלות', read: 'לקריאה', allTexts: 'כל הטקסטים', textLabel: 'טקסט',
      why: 'למה?', lookUp: 'מילים מהשאלה',
      textDone: 'סיימתם את הטקסט: {s} מתוך {n} נכונות.', nextText: 'לטקסט הבא', readAgain: 'שוב',
      close: 'סגירה',
      word: 'מילה', listenWord: 'השמעת המילה', listenMeaning: 'השמעת הפירוש', listenExample: 'השמעת הדוגמה',
      listenQuestion: 'הקראת השאלה והתשובות', listenWhy: 'הקראת ההסבר', readText: 'הקראת הטקסט', stop: 'עצירת ההקראה',
      noVoice: 'ההקראה לא עובדת כאן: אין במכשיר הזה קול מובנה בהולנדית. אפשר להוסיף קול בהגדרות המכשיר, בחלק של דיבור או המרת טקסט לדיבור.',
      source: 'המילים והפירושים שלהן לקוחים מרשימת מילים של בית הספר. משפטי הדוגמה, התרגומים, הטיפים והטקסטים נכתבו לאתר הזה. זה לא חומר רשמי של Cito.'
    },
    en: {
      pageTitle: 'Cito test words · Curiosity Quest',
      skipLink: 'Skip to the practice', back: 'All adventures', langLabel: 'Language',
      title: 'Cito test words', subtitle: 'The words that keep coming up in Dutch reading tests',
      sections: 'Sections', tabGroups: 'Word groups', tabCards: 'Flashcards', tabQuiz: 'Quiz', tabTexts: 'Texts',
      groupsIntro: 'Tap a word to see its meaning, an example and a translation.',
      practiseGroup: 'Practise this group', wordsCount: '{n} words',
      whichWords: 'Which words?', allWords: 'All words ({n})', starredWords: '★ To review ({n})',
      emptyStarred: 'You haven\'t marked any words yet. Press ★ "Mark for review" next to a word, or choose "All words".',
      shuffle: 'Shuffle', flip: 'Flip', flipBack: 'Flip back', prev: 'Previous', next: 'Next',
      flipHint: 'Do you know what it means? Flip the card.',
      counter: '{i} of {n}', star: 'Mark for review', starred: 'marked for review',
      meaning: 'Meaning', example: 'Example', tip: 'Watch out', translation: 'Translation',
      showTranslation: 'Show translation', hideTranslation: 'Hide translation',
      quizMode: 'Question type', modeMeaning: 'Pick the meaning', modeWord: 'Pick the word', modeType: 'Type the word',
      askMeaning: 'What does this word mean?', askWord: 'Which word has this meaning?', askType: 'Type the Dutch word that has this meaning.',
      typeLabel: 'The word', check: 'Check', hint: 'Hint', hintText: 'Starts with "{l}" and has {n} letters.',
      emptyAnswer: 'Type a word first.',
      progress: 'Question {i} of {n}', score: 'Right: {s}',
      correct: 'Correct!', wrong: 'Not quite.', rightAnswer: 'The right answer:',
      alsoRight: 'Also right! "{w}" means almost the same.', spelling: 'Almost! Check the spelling: {w}',
      nextQuestion: 'Next question', seeResult: 'See your score',
      roundDone: 'Done! {s} of {n} right.', allRight: 'All right. Well done!',
      missedTitle: 'Worth another look:', starMissed: 'Mark these words for review', starredDone: 'Marked',
      retryMissed: 'Practise the ones you missed', newRound: 'New round',
      textsIntro: 'Read a short Dutch text and answer test-style questions. Read the text first, then the question.',
      questionsCount: '{n} questions', read: 'Read', allTexts: 'All texts', textLabel: 'Text',
      why: 'Why?', lookUp: 'Words in this question',
      textDone: 'Text finished: {s} of {n} right.', nextText: 'Next text', readAgain: 'Again',
      close: 'Close',
      word: 'Word', listenWord: 'Listen to the word', listenMeaning: 'Listen to the meaning', listenExample: 'Listen to the example',
      listenQuestion: 'Read the question and answers aloud', listenWhy: 'Read the explanation aloud', readText: 'Read the text aloud', stop: 'Stop reading',
      noVoice: 'Read-aloud doesn\'t work here: this device has no Dutch voice of its own. You can add one in your device settings, under Speech or Text-to-speech.',
      source: 'The words and their meanings come from a school word list. The example sentences, translations, tips and practice texts were written for this site. This is not official Cito material.'
    }
  };

  // ---------- Small helpers ----------
  var storage = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var lang = LANGS.indexOf(window.CW_START_LANG) > -1 ? window.CW_START_LANG : 'nl';
  function t(key, vars) {
    var s = (UI[lang] && UI[lang][key]) || UI.nl[key] || '';
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split('{' + k + '}').join(vars[k]); });
    return s;
  }
  function $(id) { return document.getElementById(id); }
  function el(tag, attrs, children) {
    var node = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      var v = attrs[k];
      if (v === null || v === undefined || v === false) return;
      if (k === 'text') node.textContent = v;
      else if (k === 'on') Object.keys(v).forEach(function (ev) { node.addEventListener(ev, v[ev]); });
      else node.setAttribute(k, v === true ? '' : v);
    });
    (children || []).forEach(function (c) { if (c) node.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); });
    return node;
  }
  function nl(tag, attrs, children) { // an element holding Dutch content, always left-to-right
    attrs = attrs || {}; attrs.lang = 'nl'; attrs.dir = 'ltr';
    return el(tag, attrs, children);
  }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }
  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var x = a[i]; a[i] = a[j]; a[j] = x; }
    return a;
  }
  function display(w) { return (w.art ? w.art + ' ' : '') + w.w; }
  // For read-aloud: "informeren / informatie" and "uitleg(gen)" are spoken as their separate forms, without slash or brackets
  function spoken(w) { return (w.art ? w.art + ' ' : '') + (/[\/()]/.test(w.w) && w.alt ? w.alt.join(', ') : w.w); }

  // ---------- Stars ("needs review") ----------
  var stars = (function () {
    try { var v = JSON.parse(storage.get(STAR_KEY) || '[]'); return Array.isArray(v) ? v.filter(function (id) { return BY_ID[id]; }) : []; }
    catch (e) { return []; }
  })();
  function isStarred(id) { return stars.indexOf(id) > -1; }
  function setStar(id, on) {
    var i = stars.indexOf(id);
    if (on && i < 0) stars.push(id);
    if (!on && i > -1) stars.splice(i, 1);
    storage.set(STAR_KEY, JSON.stringify(stars));
    refreshFilters();
    if (currentTab === 'groups') renderGroups();
  }
  function syncStarButton(btn, id) {
    btn.setAttribute('aria-pressed', isStarred(id) ? 'true' : 'false');
  }

  // ---------- Which words ----------
  function pool(filter) {
    if (filter === 'starred') return WORDS.filter(function (w) { return isStarred(w.id); });
    if (filter && filter.indexOf('g:') === 0) { var g = filter.slice(2); return WORDS.filter(function (w) { return w.g === g; }); }
    return WORDS.slice();
  }
  function fillFilter(select) {
    var value = select.value || 'all';
    clear(select);
    select.appendChild(el('option', { value: 'all', text: t('allWords', { n: WORDS.length }) }));
    select.appendChild(el('option', { value: 'starred', text: t('starredWords', { n: stars.length }) }));
    Object.keys(GROUPS).forEach(function (g) {
      select.appendChild(el('option', { value: 'g:' + g, text: GROUPS[g][lang] + ' (' + pool('g:' + g).length + ')' }));
    });
    select.value = value;
  }
  function refreshFilters() { fillFilter($('cards-filter')); fillFilter($('quiz-filter')); }

  // Confusable words are never each other's wrong answers.
  function confusable(a, b) {
    return window.CW_CONFUSABLE.some(function (fam) { return fam.indexOf(a) > -1 && fam.indexOf(b) > -1; });
  }
  function sameMeaning(a, b) {
    return window.CW_SAME_MEANING.some(function (fam) { return fam.indexOf(a) > -1 && fam.indexOf(b) > -1; });
  }

  // ---------- Read aloud (device voices only) ----------
  // Only voices that run on the device itself are used (localService). Online voices, such as Chrome's
  // "Google Nederlands", send the text to another company, so they are never chosen. Without a device
  // voice the speaker buttons stay hidden and a note says how to add one.
  var speech = {
    synth: ('speechSynthesis' in window && typeof window.SpeechSynthesisUtterance === 'function') ? window.speechSynthesis : null,
    voice: null, checked: false, button: null, kind: null
  };
  var ICON_SPEAK = '<svg class="i-play" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 9h4l5-4v14l-5-4H4z" fill="currentColor"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
    '<svg class="i-stop" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="6" y="6" width="12" height="12" rx="2" fill="currentColor"/></svg>';
  function pickVoice() {
    var voices = [];
    try { voices = speech.synth.getVoices() || []; } catch (e) { voices = []; }
    var local = voices.filter(function (v) { return v.localService === true && /^nl([-_]|$)/i.test(v.lang || ''); });
    local.sort(function (a, b) { return (/^nl[-_]nl/i.test(a.lang) ? 0 : 1) - (/^nl[-_]nl/i.test(b.lang) ? 0 : 1); });
    return local[0] || null;
  }
  function updateVoice(final) {
    speech.voice = speech.synth ? pickVoice() : null;
    if (speech.voice || final) speech.checked = true;
    document.documentElement.classList.toggle('cw-can-speak', !!speech.voice);
    $('speech-note').hidden = !(speech.checked && !speech.voice);
    if (!speech.voice) stopSpeaking();
  }
  function setPlaying(btn, on) {
    btn.setAttribute('aria-pressed', on ? 'true' : 'false');
    var label = on ? t('stop') : btn.getAttribute('data-label');
    var visible = btn.querySelector('.speak-label');
    if (visible) visible.textContent = label; else btn.setAttribute('aria-label', label);
    btn.title = label;
  }
  function stopSpeaking() {
    if (speech.synth) { try { speech.synth.cancel(); } catch (e) {} }
    if (speech.button) setPlaying(speech.button, false);
    speech.button = null; speech.kind = null;
  }
  function speak(text, btn, kind) {
    if (!speech.synth || !speech.voice) return;
    var same = speech.button === btn;
    stopSpeaking();
    if (same) return; // a second press on the same button stops
    var u = new window.SpeechSynthesisUtterance(text);
    u.voice = speech.voice; u.lang = speech.voice.lang; u.rate = 0.9;
    u.onend = u.onerror = function () { if (speech.button === btn) { setPlaying(btn, false); speech.button = null; speech.kind = null; } };
    speech.button = btn; speech.kind = kind;
    setPlaying(btn, true);
    try { speech.synth.speak(u); } catch (e) { stopSpeaking(); }
  }
  // A speaker button. kind: 'word' (stops on any change), 'question' (stops when the question changes),
  // 'text' (keeps reading while the visitor answers questions about the same text).
  function speakButton(getText, labelKey, kind, wide) {
    var label = t(labelKey);
    var btn = el('button', { type: 'button', class: 'speak' + (wide ? ' speak-wide' : ''), lang: lang, dir: lang === 'he' ? 'rtl' : 'ltr',
      'aria-pressed': 'false', 'data-label': label, 'data-kind': kind || 'word', title: label, 'aria-label': wide ? null : label });
    btn.innerHTML = ICON_SPEAK; // fixed icon markup from this file, never visitor data
    if (wide) btn.appendChild(el('span', { class: 'speak-label', text: label }));
    btn.addEventListener('click', function () { speak(getText(), btn, kind || 'word'); });
    return btn;
  }
  function fillSlot(id, btn) { var s = $(id); clear(s); s.appendChild(btn); }

  // ---------- Word details (used by flashcards, the word dialog and quiz feedback) ----------
  function translations(w) {
    var langs = lang === 'nl' ? ['he', 'en'] : [lang];
    return langs.map(function (l) {
      return el('span', { class: 'trans-item', lang: l, dir: l === 'he' ? 'rtl' : 'ltr' }, [el('bdi', { text: w[l] })]);
    });
  }
  function wordDetails(w, opts) {
    opts = opts || {};
    var box = el('dl', { class: 'word-details' });
    box.appendChild(el('dt', { text: t('meaning') }));
    box.appendChild(nl('dd', { class: 'def' }, [el('span', { text: w.def }), speakButton(function () { return w.def; }, 'listenMeaning')]));
    box.appendChild(el('dt', { text: t('example') }));
    box.appendChild(nl('dd', { class: 'example' }, [el('span', { text: w.ex }), speakButton(function () { return w.ex; }, 'listenExample')]));
    if (w.tip) {
      box.appendChild(el('dt', { class: 'tip-label', text: t('tip') }));
      box.appendChild(nl('dd', { class: 'tip', text: w.tip }));
    }
    box.appendChild(el('dt', { text: t('translation') }));
    var dd = el('dd', { class: 'trans' });
    if (opts.hideTranslation) {
      var items = el('span', { class: 'trans-items', hidden: true }, translations(w));
      var toggle = el('button', { type: 'button', class: 'btn btn-small', 'aria-expanded': 'false', text: t('showTranslation') });
      toggle.addEventListener('click', function () {
        var open = items.hidden;
        items.hidden = !open;
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.textContent = open ? t('hideTranslation') : t('showTranslation');
      });
      dd.appendChild(toggle); dd.appendChild(items);
    } else {
      translations(w).forEach(function (n) { dd.appendChild(n); });
    }
    box.appendChild(dd);
    return box;
  }
  function wordChip(w) {
    return el('button', { type: 'button', class: 'word-chip' + (isStarred(w.id) ? ' is-starred' : ''), lang: 'nl', dir: 'ltr', 'data-id': w.id,
      on: { click: function () { openWord(w.id); } } },
      [w.w, isStarred(w.id) ? el('span', { class: 'chip-star' }, [
        el('span', { 'aria-hidden': 'true', text: ' ★' }),
        el('span', { class: 'visually-hidden', lang: lang, text: ' (' + t('starred') + ')' })
      ]) : null]);
  }

  // ---------- Word dialog ----------
  var dialogWord = null, dialogReturn = null;
  function openWord(id) {
    var w = BY_ID[id]; if (!w) return;
    dialogWord = w; dialogReturn = document.activeElement;
    $('dlg-group').textContent = GROUPS[w.g][lang];
    $('dlg-word').textContent = display(w);
    stopSpeaking();
    fillSlot('dlg-speak', speakButton(function () { return spoken(w); }, 'listenWord'));
    var d = $('dlg-details'); clear(d); d.appendChild(wordDetails(w));
    syncStarButton($('dlg-star'), w.id);
    var dlg = $('word-dialog');
    if (typeof dlg.showModal === 'function') { if (!dlg.open) dlg.showModal(); } else dlg.setAttribute('open', '');
    $('dlg-close').focus();
  }
  function closeWord() {
    stopSpeaking();
    var dlg = $('word-dialog');
    if (typeof dlg.close === 'function') { if (dlg.open) dlg.close(); } else dlg.removeAttribute('open');
  }

  // ---------- Tabs ----------
  var currentTab = 'groups';
  function showTab(tab) {
    stopSpeaking();
    currentTab = tab;
    Array.prototype.forEach.call(document.querySelectorAll('#tabs button'), function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-tab') === tab ? 'true' : 'false');
    });
    ['groups', 'cards', 'quiz', 'texts'].forEach(function (p) { $('panel-' + p).hidden = p !== tab; });
    if (tab === 'groups') renderGroups();
    if (tab === 'cards') renderCard();
    if (tab === 'quiz' && !quiz.round) startRound();
    if (tab === 'quiz') renderQuiz();
    if (tab === 'texts') renderTexts();
  }

  // ---------- Word groups ----------
  function renderGroups() {
    var box = $('groups-list'); clear(box);
    Object.keys(GROUPS).forEach(function (g) {
      var list = pool('g:' + g);
      var headingId = 'group-' + g;
      var section = el('section', { class: 'group', 'aria-labelledby': headingId }, [
        el('div', { class: 'group-head' }, [
          el('h3', { id: headingId }, [GROUPS[g][lang] + ' ', el('span', { class: 'count', text: t('wordsCount', { n: list.length }) })]),
          el('button', { type: 'button', class: 'btn btn-small', 'data-practise': g, text: t('practiseGroup'),
            on: { click: function () { $('cards-filter').value = 'g:' + g; cards.order = null; cards.index = 0; showTab('cards'); } } })
        ]),
        el('ul', { class: 'chips' }, list.map(function (w) { return el('li', null, [wordChip(w)]); }))
      ]);
      box.appendChild(section);
    });
  }

  // ---------- Flashcards ----------
  var cards = { order: null, index: 0, flipped: false };
  function cardList() {
    var list = pool($('cards-filter').value);
    if (!cards.order) cards.order = list.map(function (w) { return w.id; });
    // keep the visitor's shuffled order, but follow the current filter
    var ids = list.map(function (w) { return w.id; });
    cards.order = cards.order.filter(function (id) { return ids.indexOf(id) > -1; });
    ids.forEach(function (id) { if (cards.order.indexOf(id) < 0) cards.order.push(id); });
    return cards.order.map(function (id) { return BY_ID[id]; });
  }
  function renderCard() {
    var list = cardList();
    var empty = list.length === 0;
    $('cards-empty').hidden = !empty;
    $('cards-area').hidden = empty;
    $('cards-shuffle').disabled = empty;
    if (empty) { $('cards-empty').textContent = t('emptyStarred'); return; }
    if (cards.index >= list.length) cards.index = list.length - 1;
    if (cards.index < 0) cards.index = 0;
    var w = list[cards.index];
    stopSpeaking();
    $('card-word').textContent = display(w);
    $('card-word-small').textContent = display(w);
    fillSlot('card-word-speak', speakButton(function () { return spoken(w); }, 'listenWord'));
    fillSlot('card-small-speak', speakButton(function () { return spoken(w); }, 'listenWord'));
    var d = $('card-details'); clear(d); d.appendChild(wordDetails(w, { hideTranslation: true }));
    $('card-front').hidden = cards.flipped;
    $('card-back').hidden = !cards.flipped;
    $('flashcard').classList.toggle('is-flipped', cards.flipped);
    $('card-flip').textContent = cards.flipped ? t('flipBack') : t('flip');
    $('card-flip').setAttribute('aria-expanded', cards.flipped ? 'true' : 'false');
    $('card-counter').textContent = t('counter', { i: cards.index + 1, n: list.length });
    $('card-prev').disabled = cards.index === 0;
    $('card-next').disabled = cards.index === list.length - 1;
    syncStarButton($('card-star'), w.id);
  }
  function moveCard(step) { cards.index += step; cards.flipped = false; renderCard(); }

  // ---------- Quiz ----------
  var quiz = { mode: 'meaning', round: null, i: 0, score: 0, answered: false, missed: [], options: null, hintShown: false };
  function startRound(ids) {
    var list = ids ? ids.map(function (id) { return BY_ID[id]; }) : pool($('quiz-filter').value);
    quiz.round = shuffle(list).slice(0, ROUND_SIZE);
    quiz.i = 0; quiz.score = 0; quiz.answered = false; quiz.missed = []; quiz.options = null; quiz.hintShown = false;
  }
  function distractors(target) {
    var others = WORDS.filter(function (w) {
      return w.id !== target.id && !confusable(w.id, target.id) && w.def !== target.def;
    });
    var same = shuffle(others.filter(function (w) { return w.g === target.g; }));
    var rest = shuffle(others.filter(function (w) { return w.g !== target.g; }));
    var picked = same.slice(0, 2);
    var pickedIds = picked.map(function (w) { return w.id; });
    rest.concat(same.slice(2)).forEach(function (w) {
      if (picked.length < 3 && pickedIds.indexOf(w.id) < 0) { picked.push(w); pickedIds.push(w.id); }
    });
    return picked;
  }
  function normalise(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[.,!?;:"'()]/g, ' ').replace(/\s+/g, ' ').trim().replace(/^(de|het|een) /, '');
  }
  function accepted(w) { return (w.alt || [w.w]).concat([w.id]).map(normalise); }
  function distance(a, b) {
    var m = a.length, n = b.length, d = [], i, j;
    for (i = 0; i <= m; i++) { d[i] = [i]; }
    for (j = 0; j <= n; j++) { d[0][j] = j; }
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++) {
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    }
    return d[m][n];
  }
  // Returns { ok, note } for a typed answer
  function judgeTyped(target, typed) {
    var v = normalise(typed);
    if (accepted(target).indexOf(v) > -1) return { ok: true };
    var twin = WORDS.filter(function (w) { return w.id !== target.id && sameMeaning(w.id, target.id) && accepted(w).indexOf(v) > -1; })[0];
    if (twin) return { ok: true, note: t('alsoRight', { w: twin.w }) };
    var close = accepted(target).some(function (a) { return a.length >= 5 && distance(a, v) === 1; });
    if (close) return { ok: true, note: t('spelling', { w: target.w }) };
    return { ok: false };
  }

  function renderQuiz() {
    stopSpeaking();
    var area = $('quiz-area'); clear(area);
    var empty = quiz.round.length === 0;
    $('quiz-empty').hidden = !empty;
    if (empty) { $('quiz-empty').textContent = t('emptyStarred'); return; }
    if (quiz.i >= quiz.round.length) { renderRoundDone(area); return; }

    var w = quiz.round[quiz.i];
    area.appendChild(el('p', { class: 'progress' }, [
      el('span', { text: t('progress', { i: quiz.i + 1, n: quiz.round.length }) }),
      el('span', { text: t('score', { s: quiz.score }) })
    ]));
    var card = el('div', { class: 'question-card' });
    area.appendChild(card);
    var feedback = el('div', { class: 'feedback', id: 'quiz-feedback', 'aria-live': 'polite' });

    if (quiz.mode === 'meaning' || quiz.mode === 'word') {
      if (!quiz.options) quiz.options = shuffle([w].concat(distractors(w))).map(function (o) { return o.id; });
      var asksMeaning = quiz.mode === 'meaning';
      card.appendChild(el('p', { class: 'ask', id: 'quiz-ask', text: t(asksMeaning ? 'askMeaning' : 'askWord') }));
      var promptText = asksMeaning ? display(w) : w.def;
      var sayText = asksMeaning ? spoken(w) : w.def;
      card.appendChild(nl('div', { class: asksMeaning ? 'prompt prompt-word' : 'prompt prompt-def' }, [
        el('p', { id: 'quiz-prompt', text: promptText }),
        speakButton(function () { return sayText; }, asksMeaning ? 'listenWord' : 'listenMeaning')
      ]));
      var list = nl('ul', { class: 'options', id: 'quiz-options', 'aria-labelledby': 'quiz-ask' });
      quiz.options.forEach(function (id, n) {
        var o = BY_ID[id];
        var btn = el('button', { type: 'button', class: 'option', 'data-id': id, 'data-correct': id === w.id ? 'true' : null },
          [el('span', { class: 'letter', 'aria-hidden': 'true', text: 'ABCD'.charAt(n) }), el('span', { class: 'option-text', text: asksMeaning ? o.def : o.w })]);
        btn.addEventListener('click', function () { answerChoice(btn, id === w.id, w); });
        list.appendChild(el('li', null, [btn]));
      });
      card.appendChild(list);
    } else {
      card.appendChild(el('p', { class: 'ask', id: 'quiz-ask', text: t('askType') }));
      card.appendChild(nl('div', { class: 'prompt prompt-def' }, [
        el('p', { id: 'quiz-prompt', text: w.def }),
        speakButton(function () { return w.def; }, 'listenMeaning')
      ]));
      var input = nl('input', { type: 'text', id: 'quiz-input', autocomplete: 'off', autocapitalize: 'off', spellcheck: 'false', 'aria-describedby': 'quiz-prompt' });
      var form = el('form', { class: 'type-form', id: 'quiz-form', novalidate: true }, [
        el('label', { for: 'quiz-input', text: t('typeLabel') }), input,
        el('div', { class: 'type-actions' }, [
          el('button', { type: 'submit', class: 'btn btn-primary', id: 'quiz-check', text: t('check') }),
          el('button', { type: 'button', class: 'btn btn-quiet', id: 'quiz-hint', text: t('hint'), on: { click: function () {
            quiz.hintShown = true;
            var first = (w.alt ? w.alt[0] : w.w);
            hintText.textContent = t('hintText', { l: first.charAt(0), n: first.replace(/[^a-zA-Zéëïü]/g, '').length });
            hintText.hidden = false;
          } } })
        ])
      ]);
      var hintText = el('p', { class: 'hint-text', id: 'quiz-hint-text', hidden: true });
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (quiz.answered) return;
        if (!normalise(input.value)) { feedback.textContent = t('emptyAnswer'); input.focus(); return; }
        answerTyped(input, w, feedback);
      });
      card.appendChild(form);
      card.appendChild(hintText);
    }
    card.appendChild(feedback);
  }

  function showAnswerFeedback(ok, w, note) {
    var fb = $('quiz-feedback'); clear(fb);
    fb.className = 'feedback ' + (ok ? 'is-right' : 'is-wrong');
    fb.appendChild(el('p', { class: 'verdict' }, [
      el('span', { 'aria-hidden': 'true', text: ok ? '✓ ' : '✗ ' }), t(ok ? 'correct' : 'wrong'),
      note ? el('span', { class: 'note', text: ' ' + note }) : null
    ]));
    // In the choice modes the right answer is already highlighted in green; only typing needs it spelled out
    var sayWord = speakButton(function () { return spoken(w); }, 'listenWord');
    if (quiz.mode === 'type' && (!ok || note)) fb.appendChild(el('p', { class: 'answer-word' }, [t('rightAnswer') + ' ', nl('strong', { text: display(w) }), sayWord]));
    else fb.appendChild(el('p', { class: 'answer-word' }, [t('word') + ': ', nl('strong', { text: display(w) }), sayWord]));
    fb.appendChild(wordDetails(w));
    var last = quiz.i === quiz.round.length - 1;
    var next = el('button', { type: 'button', class: 'btn btn-primary', id: 'quiz-next', text: t(last ? 'seeResult' : 'nextQuestion'),
      on: { click: function () { quiz.i += 1; quiz.answered = false; quiz.options = null; quiz.hintShown = false; renderQuiz(); focusQuiz(); } } });
    var actions = el('div', { class: 'feedback-actions' }, [next]);
    if (!ok) {
      var star = el('button', { type: 'button', class: 'btn btn-star', 'aria-pressed': isStarred(w.id) ? 'true' : 'false' },
        [el('span', { 'aria-hidden': 'true', text: '★' }), ' ' + t('star')]);
      star.addEventListener('click', function () { setStar(w.id, !isStarred(w.id)); syncStarButton(star, w.id); });
      actions.appendChild(star);
    }
    fb.appendChild(actions);
    next.focus();
  }
  function record(ok, w) {
    quiz.answered = true;
    if (ok) quiz.score += 1; else quiz.missed.push(w.id);
  }
  function answerChoice(btn, ok, w) {
    if (quiz.answered) return;
    record(ok, w);
    Array.prototype.forEach.call(document.querySelectorAll('#quiz-options .option'), function (b) {
      b.disabled = true;
      if (b.getAttribute('data-correct') === 'true') b.classList.add('is-right');
    });
    if (!ok) btn.classList.add('is-wrong');
    btn.classList.add('is-chosen');
    showAnswerFeedback(ok, w);
  }
  function answerTyped(input, w) {
    var res = judgeTyped(w, input.value);
    record(res.ok, w);
    input.readOnly = true;
    input.classList.add(res.ok ? 'is-right' : 'is-wrong');
    $('quiz-check').disabled = true; $('quiz-hint').disabled = true;
    showAnswerFeedback(res.ok, w, res.note);
  }
  function focusQuiz() {
    var target = document.querySelector('#quiz-options .option') || $('quiz-input') || document.querySelector('#quiz-area .btn');
    if (target) target.focus();
  }
  function renderRoundDone(area) {
    var box = el('div', { class: 'done-card' });
    box.appendChild(el('p', { class: 'done-score', text: t('roundDone', { s: quiz.score, n: quiz.round.length }) }));
    var missed = quiz.missed.filter(function (id, i, a) { return a.indexOf(id) === i; });
    if (!missed.length) box.appendChild(el('p', { text: t('allRight') }));
    else {
      box.appendChild(el('p', { class: 'missed-title', text: t('missedTitle') }));
      box.appendChild(el('ul', { class: 'chips' }, missed.map(function (id) { return el('li', null, [wordChip(BY_ID[id])]); })));
    }
    var actions = el('div', { class: 'feedback-actions' });
    if (missed.length) {
      var starAll = el('button', { type: 'button', class: 'btn btn-star', id: 'quiz-star-missed' }, [el('span', { 'aria-hidden': 'true', text: '★' }), ' ' + t('starMissed')]);
      if (missed.every(isStarred)) { starAll.disabled = true; starAll.lastChild.textContent = ' ' + t('starredDone'); }
      starAll.addEventListener('click', function () {
        missed.forEach(function (id) { setStar(id, true); });
        starAll.disabled = true; starAll.lastChild.textContent = ' ' + t('starredDone');
      });
      actions.appendChild(starAll);
      actions.appendChild(el('button', { type: 'button', class: 'btn', id: 'quiz-retry', text: t('retryMissed'),
        on: { click: function () { startRound(missed); renderQuiz(); focusQuiz(); } } }));
    }
    actions.appendChild(el('button', { type: 'button', class: 'btn btn-primary', id: 'quiz-new', text: t('newRound'),
      on: { click: function () { startRound(); renderQuiz(); focusQuiz(); } } }));
    box.appendChild(actions);
    area.appendChild(box);
  }

  // ---------- Mini texts ----------
  var reader = { textIndex: null, q: 0, score: 0, answered: false, orders: [] };
  function renderTexts() {
    stopSpeaking();
    var area = $('texts-area'); clear(area);
    if (reader.textIndex === null) {
      area.appendChild(el('p', { class: 'panel-intro', text: t('textsIntro') }));
      var list = el('ol', { class: 'text-list' });
      TEXTS.forEach(function (tx, i) {
        list.appendChild(el('li', { class: 'text-item' }, [
          el('div', null, [
            el('span', { class: 'text-num', text: t('textLabel') + ' ' + (i + 1) }),
            nl('h3', { text: tx.title }),
            el('span', { class: 'count', text: t('questionsCount', { n: tx.qs.length }) })
          ]),
          el('button', { type: 'button', class: 'btn btn-primary', 'data-text': tx.id, 'aria-label': t('read') + ': ' + tx.title,
            text: t('read'), on: { click: function () { openText(i); } } })
        ]));
      });
      area.appendChild(list);
      return;
    }
    var tx = TEXTS[reader.textIndex];
    area.appendChild(el('button', { type: 'button', class: 'btn btn-quiet', id: 'texts-back',
      on: { click: function () { reader.textIndex = null; renderTexts(); var first = document.querySelector('.text-list button'); if (first) first.focus(); } } },
      [el('span', { class: 'back-arrow', 'aria-hidden': 'true', text: '← ' }), t('allTexts')]));
    var layout = el('div', { class: 'reader' });
    var article = nl('article', { class: 'reading', 'aria-labelledby': 'reading-title' }, [nl('h3', { id: 'reading-title', text: tx.title })]);
    article.appendChild(speakButton(function () {
      return [tx.title].concat(tx.body.map(function (p) { return Array.isArray(p) ? p.join(', ') + '.' : p; })).join('\n');
    }, 'readText', 'text', true));
    tx.body.forEach(function (p) {
      if (Array.isArray(p)) article.appendChild(el('ul', { class: 'reading-list' }, p.map(function (li) { return el('li', { text: li }); })));
      else article.appendChild(el('p', { text: p }));
    });
    layout.appendChild(article);
    var qbox = el('div', { class: 'reader-questions', id: 'reader-questions' });
    layout.appendChild(qbox);
    area.appendChild(layout);
    renderTextQuestion();
  }
  function openText(i) {
    reader.textIndex = i; reader.q = 0; reader.score = 0; reader.answered = false;
    // answers appear in a new order each time, so the right one is not always in the same place
    reader.orders = TEXTS[i].qs.map(function (q) { return shuffle(q.opts.map(function (o, n) { return n; })); });
    renderTexts();
    var h = $('reading-title'); if (h) { h.setAttribute('tabindex', '-1'); h.focus(); }
  }
  function renderTextQuestion() {
    if (speech.kind === 'question') stopSpeaking(); // a text being read aloud keeps going
    var box = $('reader-questions'); clear(box);
    var tx = TEXTS[reader.textIndex];
    if (reader.q >= tx.qs.length) {
      var done = el('div', { class: 'done-card' }, [el('p', { class: 'done-score', id: 'text-done', text: t('textDone', { s: reader.score, n: tx.qs.length }) })]);
      var actions = el('div', { class: 'feedback-actions' }, [
        el('button', { type: 'button', class: 'btn', id: 'text-again', text: t('readAgain'), on: { click: function () { openText(reader.textIndex); } } })
      ]);
      if (reader.textIndex < TEXTS.length - 1) {
        actions.appendChild(el('button', { type: 'button', class: 'btn btn-primary', id: 'text-next', text: t('nextText'),
          on: { click: function () { openText(reader.textIndex + 1); } } }));
      } else {
        actions.appendChild(el('button', { type: 'button', class: 'btn btn-primary', id: 'text-list', text: t('allTexts'),
          on: { click: function () { reader.textIndex = null; renderTexts(); } } }));
      }
      done.appendChild(actions);
      box.appendChild(done);
      return;
    }
    var q = tx.qs[reader.q];
    box.appendChild(el('p', { class: 'progress' }, [
      el('span', { text: t('progress', { i: reader.q + 1, n: tx.qs.length }) }),
      el('span', { text: t('score', { s: reader.score }) })
    ]));
    var card = el('div', { class: 'question-card' });
    var list = nl('ul', { class: 'options', id: 'text-options', 'aria-labelledby': 'text-q' });
    var feedback = el('div', { class: 'feedback', id: 'text-feedback', 'aria-live': 'polite' });
    var order = reader.orders[reader.q] || q.opts.map(function (o, n) { return n; });
    card.appendChild(nl('div', { class: 'word-line q-line' }, [
      el('p', { class: 'text-question', id: 'text-q', text: q.q }),
      speakButton(function () {
        return q.q + '\n' + order.map(function (n, pos) { return 'ABCD'.charAt(pos) + ': ' + q.opts[n]; }).join('.\n') + '.';
      }, 'listenQuestion', 'question')
    ]));
    var rightLetter = 'ABCD'.charAt(order.indexOf(q.a));
    order.forEach(function (n, pos) {
      var o = q.opts[n];
      var btn = el('button', { type: 'button', class: 'option', 'data-index': n, 'data-correct': n === q.a ? 'true' : null },
        [el('span', { class: 'letter', 'aria-hidden': 'true', text: 'ABCD'.charAt(pos) }), el('span', { class: 'option-text', text: o })]);
      btn.addEventListener('click', function () {
        if (reader.answered) return;
        reader.answered = true;
        var ok = n === q.a;
        if (ok) reader.score += 1;
        Array.prototype.forEach.call(list.querySelectorAll('.option'), function (b) {
          b.disabled = true;
          if (b.getAttribute('data-correct') === 'true') b.classList.add('is-right');
        });
        if (!ok) btn.classList.add('is-wrong');
        btn.classList.add('is-chosen');
        clear(feedback);
        feedback.className = 'feedback ' + (ok ? 'is-right' : 'is-wrong');
        feedback.appendChild(el('p', { class: 'verdict' }, [el('span', { 'aria-hidden': 'true', text: ok ? '✓ ' : '✗ ' }), t(ok ? 'correct' : 'wrong')]));
        if (!ok) feedback.appendChild(el('p', null, [t('rightAnswer') + ' ', nl('strong', { text: rightLetter + '. ' + q.opts[q.a] })]));
        feedback.appendChild(el('p', { class: 'why-label', text: t('why') }));
        feedback.appendChild(nl('div', { class: 'word-line' }, [
          el('p', { class: 'why', text: q.why }),
          speakButton(function () { return q.why; }, 'listenWhy', 'question')
        ]));
        if (q.words && q.words.length) {
          feedback.appendChild(el('p', { class: 'why-label', text: t('lookUp') }));
          feedback.appendChild(el('ul', { class: 'chips' }, q.words.map(function (id) { return el('li', null, [wordChip(BY_ID[id])]); })));
        }
        var last = reader.q === tx.qs.length - 1;
        var next = el('button', { type: 'button', class: 'btn btn-primary', id: 'text-next-q', text: t(last ? 'seeResult' : 'nextQuestion'),
          on: { click: function () {
            reader.q += 1; reader.answered = false; renderTextQuestion();
            var f = document.querySelector('#text-options .option') || document.querySelector('#reader-questions .btn-primary');
            if (f) f.focus();
          } } });
        feedback.appendChild(el('div', { class: 'feedback-actions' }, [next]));
        next.focus();
      });
      list.appendChild(el('li', null, [btn]));
    });
    card.appendChild(list);
    card.appendChild(feedback);
    box.appendChild(card);
  }

  // ---------- Language ----------
  function applyLanguage() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
    document.title = t('pageTitle');
    Array.prototype.forEach.call(document.querySelectorAll('[data-t]'), function (n) { n.textContent = t(n.getAttribute('data-t')); });
    Array.prototype.forEach.call(document.querySelectorAll('[data-t-aria]'), function (n) { n.setAttribute('aria-label', t(n.getAttribute('data-t-aria'))); });
    Array.prototype.forEach.call(document.querySelectorAll('#lang-switch button'), function (b) {
      b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false');
    });
    // keep the hub in the same language when going back
    $('back-to-hub').setAttribute('href', '../../?lang=' + lang);
    refreshFilters();
    showTab(currentTab);
    if (dialogWord && $('word-dialog').open) openWord(dialogWord.id);
  }

  // ---------- Start ----------
  function init() {
    Array.prototype.forEach.call(document.querySelectorAll('#lang-switch button'), function (b) {
      b.addEventListener('click', function () {
        lang = b.getAttribute('data-lang');
        storage.set(LANG_KEY, lang); // only an explicit click saves the choice
        applyLanguage();
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll('#tabs button'), function (b) {
      b.addEventListener('click', function () { showTab(b.getAttribute('data-tab')); });
    });
    $('cards-filter').addEventListener('change', function () { cards.index = 0; cards.flipped = false; renderCard(); });
    $('cards-shuffle').addEventListener('click', function () {
      cards.order = shuffle(pool($('cards-filter').value).map(function (w) { return w.id; }));
      cards.index = 0; cards.flipped = false; renderCard();
    });
    $('card-prev').addEventListener('click', function () { moveCard(-1); });
    $('card-next').addEventListener('click', function () { moveCard(1); });
    $('card-flip').addEventListener('click', function () { cards.flipped = !cards.flipped; renderCard(); });
    $('card-star').addEventListener('click', function () {
      var w = cardList()[cards.index]; if (!w) return;
      setStar(w.id, !isStarred(w.id));
      // a word un-starred under the "to review" filter leaves the list; renderCard shows the next one or the empty state
      renderCard();
    });
    $('quiz-filter').addEventListener('change', function () { startRound(); renderQuiz(); });
    Array.prototype.forEach.call(document.querySelectorAll('#quiz-modes button'), function (b) {
      b.addEventListener('click', function () {
        quiz.mode = b.getAttribute('data-mode');
        Array.prototype.forEach.call(document.querySelectorAll('#quiz-modes button'), function (x) {
          x.setAttribute('aria-pressed', x === b ? 'true' : 'false');
        });
        startRound(); renderQuiz();
      });
    });
    $('dlg-close').addEventListener('click', closeWord);
    $('dlg-star').addEventListener('click', function () {
      if (!dialogWord) return;
      setStar(dialogWord.id, !isStarred(dialogWord.id));
      syncStarButton($('dlg-star'), dialogWord.id);
    });
    var dlg = $('word-dialog');
    dlg.addEventListener('click', function (e) { if (e.target === dlg) closeWord(); }); // click on the backdrop
    dlg.addEventListener('close', function () {
      if (currentTab === 'cards') renderCard();
      if (dialogReturn && document.body.contains(dialogReturn)) { dialogReturn.focus(); return; }
      // the chip was redrawn (its star changed): focus the new chip for the same word
      var again = dialogWord && document.querySelector('.panel:not([hidden]) .word-chip[data-id="' + dialogWord.id + '"]');
      if (again) again.focus(); else $('main').focus();
    });

    // Voices often arrive a moment after the page loads; decide "no Dutch voice" only after waiting a little
    if (speech.synth) {
      if (typeof speech.synth.addEventListener === 'function') speech.synth.addEventListener('voiceschanged', function () { updateVoice(false); });
      setTimeout(function () { updateVoice(true); }, 2000);
    }
    window.addEventListener('pagehide', stopSpeaking); // some browsers keep talking after the page is left

    applyLanguage();
    updateVoice(!speech.synth);
    document.documentElement.classList.remove('cw-pending');
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
