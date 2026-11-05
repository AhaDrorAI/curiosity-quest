/*
  THE CATALOG: the single list of adventures shown on the homepage.
  To add an adventure, add one entry below (and its illustration in assets/img/).
  The homepage layout, dotted trail and language labels update automatically.
  See AGENTS.md for the full checklist.

  Fields
    id            stable, lowercase-with-dashes; never change it once published
    type          "hosted"   = the activity's files live in this site (activities/<id>/)
                  "external" = the activity lives on another website (opens in a new tab)
    url           hosted: path relative to the homepage, ending in "/"; external: full https:// address
    langParam     optional: name of the URL parameter the activity reads to pick its language
                  (e.g. "lang"). Only set it if the activity really supports it.
    subjects      keys from SUBJECTS in i18n.js
    languages     languages the ACTIVITY itself is available in (codes from LANGUAGE_NAMES in i18n.js)
    illustration  path to an SVG/PNG in assets/img/
    fallbackIcon  a single emoji shown if the illustration cannot load
    title, description, cta   text for each hub language: he, en, nl
*/
window.CQ_CATALOG = [
  {
    id: 'space',
    type: 'external',
    url: 'https://ahadrorai.github.io/solar-system-madaim/',
    subjects: ['astronomy'],
    languages: ['he', 'en'],
    illustration: 'assets/img/space.svg',
    fallbackIcon: '🪐',
    title: {
      he: 'הרפתקה בחלל',
      en: 'Space adventure',
      nl: 'Ruimteavontuur'
    },
    description: {
      he: 'סיור במערכת השמש בתלת־ממד: כוכבי לכת, עובדות מפתח והשוואת גדלים.',
      en: 'Tour the Solar System in 3D: planets, key facts and size comparisons.',
      nl: 'Verken het zonnestelsel in 3D: planeten, weetjes en grootte-vergelijkingen.'
    },
    cta: {
      he: 'יוצאים לחלל',
      en: 'Explore space',
      nl: 'Verken de ruimte'
    }
  },
  {
    id: 'western-europe',
    type: 'hosted',
    url: 'activities/western-europe/',
    langParam: 'lang',
    subjects: ['geography', 'dutch'],
    languages: ['he', 'en', 'nl', 'ru'],
    illustration: 'assets/img/europe.svg',
    fallbackIcon: '🗺️',
    title: {
      he: 'מערב אירופה',
      en: 'Western Europe',
      nl: 'West-Europa'
    },
    description: {
      he: '48 מקומות על המפה ושמותיהם בהולנדית, עם כרטיסיות, חידונים ותרגול כתיב.',
      en: '48 places on the map and their Dutch names, with flashcards, quizzes and spelling practice.',
      nl: '48 plaatsen op de kaart met hun Nederlandse namen, met flitskaarten, quizzen en spelling.'
    },
    cta: {
      he: 'יוצאים לאירופה',
      en: 'Explore Europe',
      nl: 'Verken Europa'
    }
  }
];
