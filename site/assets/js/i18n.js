/*
  Hub text in Hebrew (he), English (en) and Dutch (nl).
  Every key must exist in all three languages; `npm run check` verifies this.
*/
window.CQ_HUB_LANGUAGES = ['he', 'en', 'nl'];
window.CQ_RTL = ['he'];

// Each language written in its own script, so a reader can always find their language.
window.CQ_LANGUAGE_NAMES = {
  he: 'עברית',
  en: 'English',
  nl: 'Nederlands',
  ru: 'Русский'
};

window.CQ_SUBJECTS = {
  astronomy: { he: 'אסטרונומיה', en: 'Astronomy', nl: 'Sterrenkunde' },
  geography: { he: 'גיאוגרפיה', en: 'Geography', nl: 'Aardrijkskunde' },
  dutch: { he: 'השפה ההולנדית', en: 'Dutch language', nl: 'Nederlandse taal' }
};

window.CQ_TEXT = {
  he: {
    pageTitle: 'Curiosity Quest: הרפתקאות למידה לילדים סקרנים',
    metaDescription: 'הרפתקאות למידה חינמיות בעברית, באנגלית ובהולנדית. בלי חשבונות, בלי פרסומות ובלי מעקב.',
    skipLink: 'דלגו להרפתקאות',
    languageSwitch: 'שפת האתר',
    tagline: 'נבנה בשביל הילדים שלי. פתוח לכל מי שסקרן.',
    headline: 'לאן הסקרנות תיקח אתכם?',
    lead: 'בחרו הרפתקה. גלו משהו חדש.',
    listLabel: 'הרפתקאות',
    subjectsLabel: 'נושאים',
    languagesLabel: 'שפות',
    newTab: '(נפתח בכרטיסייה חדשה)',
    footerLine: 'נבנה למשפחה שלנו. משותף גם עם שלכם.',
    aboutTitle: 'על הפרויקט',
    aboutBody: [
      'Curiosity Quest הוא אוסף קטן ומתפתח של פעילויות למידה שהורה בונה בשביל הילדים שלו, ומשתף עם כולם.',
      'כל הפעילויות חינמיות ופועלות בדפדפן. אין חשבונות, אין פרסומות ואין מעקב. בחירת השפה נשמרת רק בדפדפן שלכם.',
      'מדי פעם מתווספות הרפתקאות חדשות.'
    ],
    credits: 'גבולות המפה: Natural Earth (נחלת הכלל). העובדות על כוכבי הלכת בהרפתקת החלל מבוססות על נתוני נאס"א.',
    noScript: 'כדי לראות את ההרפתקאות צריך להפעיל JavaScript. אפשר גם להיכנס ישירות:'
  },
  en: {
    pageTitle: 'Curiosity Quest: learning adventures for curious kids',
    metaDescription: 'Free learning adventures in Hebrew, English and Dutch. No accounts, no ads, no tracking.',
    skipLink: 'Skip to the adventures',
    languageSwitch: 'Site language',
    tagline: 'Made for my kids. Open to every curious mind.',
    headline: 'Where will curiosity take you?',
    lead: 'Pick an adventure. Explore something new.',
    listLabel: 'Adventures',
    subjectsLabel: 'Topics',
    languagesLabel: 'Languages',
    newTab: '(opens in a new tab)',
    footerLine: 'Built for our family. Shared with yours.',
    aboutTitle: 'About this project',
    aboutBody: [
      'Curiosity Quest is a small, growing collection of learning activities that a parent builds for their own children and shares with everyone.',
      'Every activity is free and runs in the browser. There are no accounts, no ads and no tracking. Your language choice is saved only in your own browser.',
      'New adventures are added from time to time.'
    ],
    credits: 'Map borders: Natural Earth (public domain). Planet facts in the space adventure are based on NASA data.',
    noScript: 'JavaScript is needed to show the adventures. You can also open them directly:'
  },
  nl: {
    pageTitle: 'Curiosity Quest: leeravonturen voor nieuwsgierige kinderen',
    metaDescription: 'Gratis leeravonturen in het Hebreeuws, Engels en Nederlands. Geen accounts, geen advertenties, geen tracking.',
    skipLink: 'Naar de avonturen',
    languageSwitch: 'Taal van de site',
    tagline: 'Gemaakt voor mijn kinderen. Open voor iedereen die nieuwsgierig is.',
    headline: 'Waar brengt je nieuwsgierigheid je naartoe?',
    lead: 'Kies een avontuur. Ontdek iets nieuws.',
    listLabel: 'Avonturen',
    subjectsLabel: 'Onderwerpen',
    languagesLabel: 'Talen',
    newTab: '(opent in een nieuw tabblad)',
    footerLine: 'Gemaakt voor ons gezin. Gedeeld met het jouwe.',
    aboutTitle: 'Over dit project',
    aboutBody: [
      'Curiosity Quest is een kleine, groeiende verzameling leeractiviteiten die een ouder voor de eigen kinderen maakt en met iedereen deelt.',
      'Alle activiteiten zijn gratis en werken in de browser. Er zijn geen accounts, geen advertenties en geen tracking. Je taalkeuze wordt alleen in je eigen browser bewaard.',
      'Af en toe komen er nieuwe avonturen bij.'
    ],
    credits: 'Kaartgrenzen: Natural Earth (publiek domein). De weetjes over planeten in het ruimteavontuur zijn gebaseerd op gegevens van NASA.',
    noScript: 'JavaScript is nodig om de avonturen te tonen. Je kunt ze ook direct openen:'
  }
};
