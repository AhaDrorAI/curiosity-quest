/*
  Cito words: short practice texts with test-style questions.
  All texts and questions are original, written for this site.

  Fields
    id       stable key
    title    shown above the text
    body     paragraphs; a paragraph that is an array is shown as a bulleted list
    qs       questions: q (question), opts (answers, shown as A, B, C, D), a (index of the right answer),
             why (explanation shown after answering), words (ids from words.js to look up)
*/
window.CW_TEXTS = [
  {
    id: 'fietslicht',
    title: 'Pas op in het donker!',
    body: [
      'In de winter is het al vroeg donker als je uit school fietst. Automobilisten zien fietsers zonder licht pas heel laat. Daardoor gebeuren er elk jaar ongelukken.',
      'Zet dus altijd je fietslicht aan! Een lampje kost maar een paar euro. Het is het beste cadeau dat je jezelf kunt geven.'
    ],
    qs: [
      { q: 'Wat is het belangrijkste doel van deze tekst?',
        opts: ['de lezer vermaken met een grappig verhaal', 'de lezer waarschuwen voor gevaar in het donker', 'de lezer uitleggen hoe een fietslamp werkt', 'de lezer vertellen wat een lampje kost'],
        a: 1, words: ['doel', 'waarschuwen'],
        why: 'De schrijver wil dat je oppast ("Pas op!") en je licht aanzet. Dat is waarschuwen. De prijs van een lampje staat er wel in, maar dat is niet het doel van de hele tekst.' },
      { q: 'Lees: "Automobilisten zien fietsers zonder licht pas heel laat. Daardoor gebeuren er ongelukken." Wat is hier de oorzaak?',
        opts: ['Er gebeuren ongelukken.', 'Automobilisten zien fietsers zonder licht pas heel laat.', 'Het is winter.', 'Een lampje kost een paar euro.'],
        a: 1, words: ['oorzaak', 'gevolg'],
        why: 'Eerst komt de oorzaak: auto\'s zien je te laat. Het gevolg is: er gebeuren ongelukken. Het signaalwoord "daardoor" laat dat verband zien.' },
      { q: 'Is deze zin een feit of een mening? "Het is het beste cadeau dat je jezelf kunt geven."',
        opts: ['een feit', 'een mening'],
        a: 1, words: ['feit', 'mening'],
        why: 'Je kunt zeggen: "Ja, maar dat vind jij!" Dan is het een mening. "Het beste" is een oordeel, dat kun je niet nakijken.' }
    ]
  },
  {
    id: 'recensie-fluit',
    title: 'De verdwenen fluit',
    body: [
      'In "De verdwenen fluit" gaat Mila op zoek naar de fluit van haar opa. Die is al vijftig jaar kwijt. Het boek heeft 160 bladzijden en veel mooie illustraties.',
      'Ik vond het verhaal erg spannend, vooral het hoofdstuk in de oude kelder. Jammer genoeg is het einde een beetje saai. Toch raad ik dit boek iedereen vanaf negen jaar aan.',
      'Mijn oordeel: vier van de vijf sterren.'
    ],
    qs: [
      { q: 'Wat voor soort tekst is dit?',
        opts: ['een handleiding', 'een recensie', 'een nieuwsbericht', 'een dagboek'],
        a: 1, words: ['recensie'],
        why: 'De schrijver geeft een oordeel over een boek: wat goed is en wat minder goed is. Zo\'n tekst heet een recensie.' },
      { q: 'Welke zin is een feit?',
        opts: ['Ik vond het verhaal erg spannend.', 'Het boek heeft 160 bladzijden.', 'Het einde is een beetje saai.', 'Het zijn mooie illustraties.'],
        a: 1, words: ['feit', 'mening'],
        why: 'Het aantal bladzijden kun je nakijken. Dat is een feit. Bij de andere zinnen kun je zeggen: "Ja, maar dat vind jij!" Dat zijn meningen.' },
      { q: 'Welk woord laat een tegenstelling zien?',
        opts: ['Toch', 'vooral', 'veel', 'vanaf'],
        a: 0, words: ['tegenstelling'],
        why: 'Het einde is saai, en toch raadt de schrijver het boek aan. "Toch" laat zien dat er iets tegenovergestelds komt.' }
    ]
  },
  {
    id: 'tuinkers',
    title: 'Zo kweek je tuinkers',
    body: [
      'Wat heb je nodig?',
      ['een schoteltje', 'watten', 'tuinkerszaadjes', 'water'],
      'Stap 1. Leg een laagje watten op het schoteltje.',
      'Stap 2. Maak de watten nat, maar niet te nat.',
      'Stap 3. Strooi de zaadjes over de watten.',
      'Stap 4. Zet het schoteltje op een lichte plek, bijvoorbeeld op de vensterbank.',
      'Stap 5. Houd de watten elke dag een beetje vochtig.',
      'Na ongeveer een week kun je de tuinkers knippen en op je boterham doen!'
    ],
    qs: [
      { q: 'Wat is het doel van deze tekst?',
        opts: ['informeren', 'overtuigen', 'instrueren', 'vermaken'],
        a: 2, words: ['instructie', 'handleiding'],
        why: 'De tekst vertelt stap voor stap wat je moet doen. Dat is instrueren. Zo\'n tekst is een instructie of handleiding.' },
      { q: 'Waarom staan de spullen onder elkaar, met een bolletje ervoor?',
        opts: ['Het is een opsomming, zodat je snel ziet wat je nodig hebt.', 'Het is een gedicht.', 'Het is een samenvatting van de tekst.', 'Het is een advertentie voor watten.'],
        a: 0, words: ['opsomming'],
        why: 'Een opsomming zet dingen overzichtelijk onder elkaar. Zo kun je makkelijk alles klaarleggen.' },
      { q: 'Wat is de functie van het woord "bijvoorbeeld" in stap 4?',
        opts: ['Het geeft een voorbeeld van een lichte plek.', 'Het waarschuwt voor gevaar.', 'Het noemt een nadeel.', 'Het geeft de conclusie.'],
        a: 0, words: ['functie', 'voorbeeld'],
        why: 'Na "bijvoorbeeld" komt een voorbeeld: de vensterbank is een lichte plek. Daar is het woord voor, dat is de functie.' }
    ]
  },
  {
    id: 'dagboek-spreekbeurt',
    title: 'Lief dagboek',
    body: [
      'Donderdag',
      'Vandaag was mijn spreekbeurt over schildpadden. Vanochtend kon ik bijna niet eten, zo zenuwachtig was ik. Mijn handen trilden toen ik voor de klas stond.',
      'Maar toen ik begon te praten, ging het steeds beter. Iedereen luisterde en ik kreeg wel tien vragen! Na afloop zei de juf dat het een van de beste spreekbeurten van het jaar was.',
      'Ik ben zo blij dat het voorbij is. En ik ben ook een beetje trots op mezelf.',
      'Groetjes, Noor'
    ],
    qs: [
      { q: 'Hoe voelde Noor zich vóór de spreekbeurt?',
        opts: ['opgelucht', 'zenuwachtig', 'woedend', 'jaloers'],
        a: 1, words: ['zenuwachtig'],
        why: 'Ze kon niet eten en haar handen trilden. Het staat er ook letterlijk: "zo zenuwachtig was ik".' },
      { q: '"Ik ben zo blij dat het voorbij is." Welk woord past het best bij dit gevoel?',
        opts: ['opgelucht', 'verward', 'ongerust', 'eng'],
        a: 0, words: ['opgelucht'],
        why: 'Opgelucht ben je als iets spannends toch goed afloopt. Noor is blij dat het voorbij is en dat het goed ging.' },
      { q: 'Wat voor soort tekst is dit?',
        opts: ['een dagboek', 'een interview', 'een recensie', 'een handleiding'],
        a: 0, words: ['dagboek'],
        why: 'Noor schrijft over haar eigen dag en wat ze voelde. Ze begint met de dag en "Lief dagboek".' }
    ]
  },
  {
    id: 'reclame-ijs',
    title: 'NIEUW: FrisFruit-ijsjes!',
    body: [
      'Heb jij het ook zo warm? Dan is er nu FrisFruit! Ons ijs is gemaakt van echt fruit en is heerlijk fris. Kies uit aardbei, mango of citroen. Alle kinderen zijn er gek op!',
      'Deze week: 2 halen, 1 betalen!',
      'Te koop in jouw supermarkt.'
    ],
    qs: [
      { q: 'Wat wil de schrijver vooral met deze tekst?',
        opts: ['de lezer overhalen om ijsjes te kopen', 'de lezer uitleggen hoe je ijs maakt', 'de lezer waarschuwen voor te veel suiker', 'de lezer vertellen wat voor weer het wordt'],
        a: 0, words: ['reclame', 'overhalen'],
        why: 'Dit is reclame. De schrijver prijst het ijs aan, zodat jij het gaat kopen. Dat heet overhalen.' },
      { q: '"Alle kinderen zijn er gek op!" Wat klopt?',
        opts: ['Dit is een feit, want het staat in de tekst.', 'Dit is een mening, want je kunt zeggen: "Ja, maar dat vind jij."', 'Dit is een instructie.'],
        a: 1, words: ['mening', 'feit'],
        why: 'Niet alle kinderen vinden hetzelfde lekker. De maker wil je overtuigen. Dat een zin in een tekst staat, maakt hem nog geen feit.' },
      { q: 'Wat betekent "gek op" in de zin "Alle kinderen zijn er gek op!"?',
        opts: ['Kinderen worden gek van het ijs.', 'Kinderen vinden het ijs heel lekker.', 'Kinderen zijn bang voor het ijs.'],
        a: 1, words: ['figuurlijk'],
        why: '"Gek op" is figuurlijk: je wordt niet echt gek. Het betekent dat je iets heel leuk of lekker vindt.' }
    ]
  },
  {
    id: 'nieuws-zeehond',
    title: 'Zeehond gered op het strand',
    body: [
      'SCHEVENINGEN – Wandelaars hebben gisteren een jonge zeehond gevonden op het strand. Het dier was mager en had een wondje aan zijn vin. Medewerkers van een zeehondenopvang haalden hem op.',
      '"Het jong is waarschijnlijk zijn moeder kwijtgeraakt tijdens de storm," zegt een verzorger. De zeehond blijft een paar weken in de opvang. Daarna gaat hij terug naar zee.'
    ],
    qs: [
      { q: 'Wat voor soort tekst is dit?',
        opts: ['een nieuwsbericht', 'een gedicht', 'een handleiding', 'een advertentie'],
        a: 0, words: ['nieuwsbericht'],
        why: 'De tekst vertelt over iets dat net gebeurd is ("gisteren"), met de plaatsnaam aan het begin. Dat is een nieuwsbericht.' },
      { q: 'Wat is volgens de verzorger de reden dat de zeehond alleen op het strand lag?',
        opts: ['Hij had honger.', 'Hij is zijn moeder kwijtgeraakt tijdens de storm.', 'Wandelaars hadden hem meegenomen.', 'Hij wilde naar de opvang.'],
        a: 1, words: ['reden'],
        why: 'De verzorger zegt dat het jong waarschijnlijk zijn moeder kwijtraakte tijdens de storm. Dat is de reden.' },
      { q: 'Welke zin is de beste samenvatting van de tekst?',
        opts: ['Een zeehond had een wondje aan zijn vin.', 'Wandelaars vonden een zwakke jonge zeehond. Hij wordt verzorgd en gaat daarna terug naar zee.', 'Er was een storm bij Scheveningen.', 'Zeehonden wonen in de zee.'],
        a: 1, words: ['samenvatting'],
        why: 'Een samenvatting noemt de belangrijkste dingen in het kort. Alleen deze zin vertelt het hele bericht: gevonden, verzorgd, terug naar zee.' }
    ]
  },
  {
    id: 'finale',
    title: 'De grote finale',
    body: [
      'Zaterdag speelde ons team de finale. Het regende pijpenstelen, maar niemand ging naar huis. Onze keeper Daan was een muur: hij hield elke bal tegen.',
      'In de laatste minuut scoorde Fatima. De hele tribune ontplofte van blijdschap. Na de wedstrijd waren we allemaal doornat, maar dat kon ons niets schelen.'
    ],
    qs: [
      { q: '"Onze keeper Daan was een muur." Hoe moet je dit lezen?',
        opts: ['letterlijk: Daan was echt van steen', 'figuurlijk: Daan hield bijna elke bal tegen'],
        a: 1, words: ['figuurlijk', 'letterlijk'],
        why: 'Daan is natuurlijk geen echte muur. Het is figuurlijk: niemand kwam langs hem, net als bij een muur.' },
      { q: 'Welke zin moet je letterlijk lezen?',
        opts: ['Het regende pijpenstelen.', 'De hele tribune ontplofte van blijdschap.', 'In de laatste minuut scoorde Fatima.', 'Daan was een muur.'],
        a: 2, words: ['letterlijk', 'figuurlijk'],
        why: 'Fatima heeft echt gescoord. De andere zinnen zijn figuurlijk: er vielen geen pijpen uit de lucht en de tribune is niet echt ontploft.' },
      { q: 'Wat doet de schrijver vooral in deze tekst?',
        opts: ['vertellen wat er gebeurde bij de finale', 'uitleggen hoe je keeper wordt', 'waarschuwen voor regen', 'reclame maken voor voetbalschoenen'],
        a: 0, words: ['verslag'],
        why: 'De schrijver vertelt wat er gebeurd is. Zo\'n tekst is een verslag.' }
    ]
  },
  {
    id: 'kat-of-hond',
    title: 'Kat of hond?',
    body: [
      'Wil je een huisdier? Dan twijfel je misschien tussen een kat en een hond. Allebei zijn het gezellige dieren die graag bij mensen zijn. Toch zijn er grote verschillen.',
      'Een hond moet je elke dag een paar keer uitlaten, ook als het regent. Dat kost veel tijd. Een kat gaat zelf naar buiten of gebruikt een kattenbak.',
      'Een voordeel van een hond is wel dat je hem kunstjes kunt leren. Een kat doet liever waar hij zelf zin in heeft.'
    ],
    qs: [
      { q: 'Wat is volgens de tekst een overeenkomst tussen een kat en een hond?',
        opts: ['Je moet ze allebei uitlaten.', 'Ze zijn allebei graag bij mensen.', 'Ze kunnen allebei kunstjes leren.', 'Ze gebruiken allebei een kattenbak.'],
        a: 1, words: ['overeenkomst'],
        why: 'Een overeenkomst is wat hetzelfde is. In de tekst staat: "Allebei zijn het gezellige dieren die graag bij mensen zijn."' },
      { q: 'Welk nadeel van een hond noemt de tekst?',
        opts: ['Je moet hem elke dag uitlaten, en dat kost veel tijd.', 'Je kunt hem kunstjes leren.', 'Hij is gezellig.', 'Hij gebruikt een kattenbak.'],
        a: 0, words: ['nadeel', 'voordeel'],
        why: 'Een nadeel is een minder leuke kant. Elke dag uitlaten, ook in de regen, kost veel tijd. Kunstjes leren is juist een voordeel.' },
      { q: 'Wat doet de schrijver vooral in deze tekst?',
        opts: ['een kat en een hond vergelijken', 'een spannend verhaal vertellen', 'uitleggen hoe je een hond wast', 'een feest aankondigen'],
        a: 0, words: ['vergelijken', 'verschil'],
        why: 'De schrijver noemt wat hetzelfde is en wat anders is. Dat is vergelijken.' }
    ]
  },
  {
    id: 'opruimactie',
    title: 'Help mee: het park wordt weer schoon!',
    body: [
      'Op zaterdag 12 april houden we een grote opruimactie in het Wilgenpark. Er ligt veel zwerfafval, zoals blikjes en plastic zakjes. Dat is gevaarlijk voor de eenden en andere dieren. Daarom hebben we jouw hulp nodig!',
      'Kom om 10.00 uur naar de ingang bij de speeltuin. Handschoenen en vuilniszakken krijg je van ons. Na afloop is er limonade voor alle helpers.',
      'Doe je ook mee?'
    ],
    qs: [
      { q: 'Wat voor soort tekst is dit?',
        opts: ['een oproep', 'een recensie', 'een dagboek', 'een raadsel'],
        a: 0, words: ['oproep'],
        why: 'De schrijver vraagt dringend of je meedoet: "Help mee!" en "Doe je ook mee?" Dat is een oproep.' },
      { q: 'Waarom is zwerfafval in het park een probleem, volgens de tekst?',
        opts: ['Het is gevaarlijk voor de dieren.', 'Het park gaat dicht.', 'Er is geen limonade.', 'De speeltuin is kapot.'],
        a: 0, words: ['reden'],
        why: 'In de tekst staat: "Dat is gevaarlijk voor de eenden en andere dieren." Dat is de reden.' },
      { q: 'Welke zin is een aankondiging?',
        opts: ['Op zaterdag 12 april houden we een grote opruimactie in het Wilgenpark.', 'Er ligt veel zwerfafval.', 'Dat is gevaarlijk voor de eenden.', 'Doe je ook mee?'],
        a: 0, words: ['aankondigen'],
        why: 'Aankondigen is vertellen dat er iets gaat gebeuren. Deze zin vertelt wat er gaat gebeuren en wanneer.' }
    ]
  },
  {
    id: 'dolfijnen',
    title: 'Hoe slapen dolfijnen?',
    body: [
      'Dolfijnen zijn zoogdieren. Net als wij moeten ze lucht ademen. Ze kunnen dus niet zomaar urenlang onder water liggen slapen.',
      'Dolfijnen hebben daar iets slims op gevonden. Ze laten maar de helft van hun hersenen slapen. De andere helft blijft wakker. Zo kunnen ze toch naar boven zwemmen om adem te halen, en letten ze op gevaar.',
      'Na een tijdje wisselen ze: dan slaapt de andere helft. Zo krijgen beide helften genoeg rust.'
    ],
    qs: [
      { q: 'Wat is het doel van deze tekst?',
        opts: ['informeren', 'overtuigen', 'instrueren', 'vermaken'],
        a: 0, words: ['informeren', 'weet-tekst'],
        why: 'Dit is een weet-tekst: je leert feiten over dolfijnen. De schrijver wil je informeren.' },
      { q: 'Waar gaat de tweede alinea vooral over?',
        opts: ['dat dolfijnen zoogdieren zijn', 'hoe dolfijnen half slapen en half wakker blijven', 'wat dolfijnen eten', 'waar dolfijnen wonen'],
        a: 1, words: ['alinea'],
        why: 'De tweede alinea begint bij "Dolfijnen hebben daar iets slims op gevonden". Die gaat over de helft die slaapt en de helft die wakker blijft.' },
      { q: 'Welke conclusie past bij de tekst?',
        opts: ['Dolfijnen slapen nooit.', 'Dolfijnen kunnen slapen en toch blijven ademen.', 'Dolfijnen zijn vissen.', 'Dolfijnen slapen op het strand.'],
        a: 1, words: ['conclusie'],
        why: 'Omdat steeds één helft wakker is, kunnen ze ademen terwijl ze slapen. "Ze slapen nooit" klopt niet: ze slapen wel, alleen half.' }
    ]
  },
  {
    id: 'raadsel-klok',
    title: 'Wie ben ik?',
    body: [
      'Ik heb een gezicht, maar geen neus of mond.',
      'Ik heb twee wijzers, maar ik wijs je niet de weg.',
      'Ik tik de hele dag, maar ik heb geen vingers.',
      'Wie ben ik?'
    ],
    qs: [
      { q: 'Wat voor soort tekst is dit?',
        opts: ['een raadsel', 'een nieuwsbericht', 'een verslag', 'een artikel'],
        a: 0, words: ['raadsel'],
        why: 'De tekst is een vraag die je moet oplossen: "Wie ben ik?" Dat is een raadsel.' },
      { q: 'Wat is het antwoord op het raadsel?',
        opts: ['een klok', 'een kompas', 'een computer', 'een robot'],
        a: 0, words: ['raadsel', 'figuurlijk'],
        why: 'Een klok heeft een "gezicht" (de wijzerplaat), twee wijzers en hij tikt. Het "gezicht" is figuurlijk bedoeld.' },
      { q: 'Wat is het doel van deze tekst?',
        opts: ['vermaken', 'waarschuwen', 'informeren', 'instrueren'],
        a: 0, words: ['vermaken'],
        why: 'Een raadsel is een spelletje met woorden. Het wil je vooral plezier geven: vermaken.' }
    ]
  },
  {
    id: 'interview-brandweer',
    title: 'Vraaggesprek met een brandweervrouw',
    body: [
      'Wat doet de brandweer allemaal?',
      '"Natuurlijk blussen we branden. Maar we redden ook dieren en we helpen bij ongelukken op de weg."',
      'Wat is het belangrijkste in uw werk?',
      '"Branden voorkomen! Daarom geven we les op scholen. Een rookmelder in huis maakt het risico op een gevaarlijke brand veel kleiner."',
      'Bent u weleens bang?',
      '"Ja, eerlijk gezegd wel. Maar je leert om rustig te blijven. In paniek raken helpt niemand."'
    ],
    qs: [
      { q: 'Wat voor soort tekst is dit?',
        opts: ['een interview', 'een gedicht', 'een handleiding', 'een advertentie'],
        a: 0, words: ['interview'],
        why: 'Er worden vragen gesteld en de brandweervrouw geeft antwoord. Een interview is een vraaggesprek.' },
      { q: '"Branden voorkomen!" Wat betekent "voorkomen" hier?',
        opts: ['zorgen dat branden niet gebeuren', 'dat branden vaak gebeuren', 'branden blussen', 'over branden praten'],
        a: 0, words: ['voorkomen'],
        why: 'Hier betekent voorKOmen: zorgen dat iets niet gebeurt. Daarom geeft de brandweer les en zijn rookmelders belangrijk.' },
      { q: 'Een rookmelder "maakt het risico op een brand kleiner". Wat betekent dat?',
        opts: ['De kans op iets ergs wordt kleiner.', 'De brand wordt kleiner.', 'De rookmelder wordt kleiner.', 'Het huis wordt kleiner.'],
        a: 0, words: ['risico'],
        why: 'Risico is de kans dat er iets vervelends gebeurt. Met een rookmelder is die kans kleiner.' }
    ]
  }
];
