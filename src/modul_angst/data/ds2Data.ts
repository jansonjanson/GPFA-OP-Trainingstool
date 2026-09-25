import { CommunicationItem, MatchingPair, MatrixItem, ErrorRadarItem, NotfallkofferItem } from '../types';

export const ds2Fachtext = {
  title: 'CNE-Fachtext: Pflegerische Angstreduktion vor Operationen',
  url: 'https://elearn.zfg-ms.de/mod/resource/view.php?id=229043',
  source: 'Zentrum für Gesundheitsberufe (ZfG) - E-Learning Plattform',
  description: 'Fachartikel zu evidenzbasierten pflegerischen Interventionen, verbaler und nonverbaler Deeskalation sowie dem gezielten Einsatz von Entspannungsmethoden.'
};

export const notfallkofferItems: NotfallkofferItem[] = [
  {
    id: 'k1',
    category: 'Kommunikation',
    title: 'Sicherheit & Transparenz',
    subtitle: 'Orientierung geben & Kontrolle zurückgeben',
    iconName: 'MessageSquareHeart',
    color: 'from-blue-500 to-indigo-600',
    description: 'Angst schrumpft durch Vorhersehbarkeit. Klare, strukturierte und empathische Kommunikation ist die wirkungsvollste non-medikamentöse Maßnahme.',
    dos: [
      'Sich mit Namen und klarer Rolle vorstellen („Ich begleite Sie heute durch die Vorbereitung“).',
      'Entscheidungsspielräume bieten („Möchten Sie links oder rechts sitzen? Welcher Arm für den RR?“).',
      'Kurze, verständliche Schritte ankündigen – ohne medizinisches Fachchinesisch.',
      'Symptome offen und wertschätzend ansprechen („Ich sehe, dass Sie sehr aufgeregt sind, das ist völlig normal“).'
    ],
    donts: [
      'Bagatellisieren („Ist doch nur ein kleiner Schnitt“, „Stellen Sie sich nicht so an“).',
      'Mit Fachdetails und Risikokaskaden überfordern.',
      'Eigene Unsicherheit durch kalte, unnahbare Routine überspielen.'
    ],
    practicalTips: 'Nutzen Sie die 3-Sekunden-Pause: Geben Sie dem Patienten nach jeder Information kurz Zeit zum Verarbeiten.',
    clinicalRationale: 'Stärkt die Selbstwirksamkeit und dämpft die Überaktivität der Amygdala durch frontale Aktivierung.'
  },
  {
    id: 'k2',
    category: 'Umgebung',
    title: 'Reizabschirmung & Ruhezone',
    subtitle: 'Stressoren im Krankenzimmer minimieren',
    iconName: 'ShieldAlert',
    color: 'from-amber-500 to-orange-600',
    description: 'Das OP-Umfeld ist voll von bedrohlichen Reizen: metallisches Klappern, Alarme, Hektik und fremde Gerüche.',
    dos: [
      'Zimmertür anlehnen, um Ganggeräusche zu dämpfen.',
      'Grelles Deckenlicht dimmen oder indirektes Licht einschalten.',
      'Verbandswagen oder Spritzen nicht demonstrativ offen vor dem Patienten platzieren.',
      'Auf eine angenehme Raumtemperatur achten (21-22°C).'
    ],
    donts: [
      'Instrumente oder Nadeln geräuschvoll auf Edelstahltabletts ablegen.',
      'Flurgespräche über andere Notfälle oder Komplikationen in Hörweite führen.'
    ],
    practicalTips: 'Bitten Sie Mitpatienten im Mehrbettzimmer kurz um gegenseitige Rücksichtnahme während der Vorbereitung.',
    clinicalRationale: 'Verhindert die ständige sensorische Triggerung der Amygdala über akustische und optische Reize.'
  },
  {
    id: 'k3',
    category: 'Körperlich',
    title: 'Thermische & Vegetative Entlastung',
    subtitle: 'Wärme spenden & Vitalwerte stabilisieren',
    iconName: 'Flame',
    color: 'from-rose-500 to-red-600',
    description: 'Angstpatienten frieren und zittern häufig durch periphere Vasokonstriktion (sympathikusvermittelt).',
    dos: [
      'Vorgewärmte Decken aus dem Wärmeschrank anbieten (extrem beruhigend!).',
      'Vitalzeichen (Puls, RR, Atemfrequenz) engmaschig, aber unaufgeregt erfassen.',
      'Zur tiefen Bauchatmung (4 Sekunden ein, 6 Sekunden aus) anleiten.',
      'Lagerungskissen zur Entlastung von Rücken und Bauchdecke einsetzen.'
    ],
    donts: [
      'Ungeprüfte Hausmittel wie Kirschkernkissen in der Stationsmikrowelle erhitzen (Hygienemangel, Verbrennungsrisiko!).',
      'Alarmiert auf hohe Pulswerte reagieren („Oh Gott, Ihr Puls ist bei 130!“).'
    ],
    practicalTips: 'Langsames Ausatmen stimuliert den Nervus vagus und senkt die Herzfrequenz messbar innerhalb von 2 Minuten.',
    clinicalRationale: 'Wärme und verlangsamte Exspiration aktivieren den Parasympathikus und senken den Muskeltonus.'
  },
  {
    id: 'k4',
    category: 'Angehörige',
    title: 'Angehörige als Ressource',
    subtitle: 'Begleitpersonen gezielt einbeziehen',
    iconName: 'Users',
    color: 'from-emerald-500 to-teal-600',
    description: 'Vertraute Bezugspersonen können der wichtigste Anker sein – vorausgesetzt, sie strahlen selbst Ruhe aus.',
    dos: [
      'Vorab prüfen: Wirkt die Begleitperson stabil und unterstützend?',
      'Telefonkontakt ermöglichen, falls Angehörige nicht persönlich anwesend sein können.',
      'Klare Aufgaben geben („Halten Sie gerne ihre Hand, während wir den Zugang vorbereiten“).'
    ],
    donts: [
      'Angehörige ans Bett holen, die selbst in Panik, Tränen oder Wut sind (Gefahr der emotionalen Ansteckung!).',
      'Angehörige unvorbereitet in Notfallsituationen oder Schleusenbereiche mitnehmen.'
    ],
    practicalTips: 'Ein kurzes Gespräch vor der Zimmertür („Sie helfen Ihrer Mutter am meisten, wenn Sie tief durchatmen“) wirkt Wunder.',
    clinicalRationale: 'Oxytocinausschüttung durch vertrauten Körper- und Blickkontakt hemmt physiologisch das Stresszentrum.'
  },
  {
    id: 'k5',
    category: 'Ablenkung',
    title: 'Fokussierte Ablenkung & PMR',
    subtitle: 'Kopf frei bekommen im Stationsalltag',
    iconName: 'Headphones',
    color: 'from-violet-500 to-purple-600',
    description: 'Im hektischen Klinikalltag sind Fantasiereisen oft unrealistisch. Moderne, patientengerechte Ablenkung funktioniert besser.',
    dos: [
      'Kopfhörer anbieten: Lieblingsmusik, Hörbuch oder Podcast über das eigene Smartphone hören.',
      'Bei mobilen Patienten: Kleiner Spaziergang über die Station oder den Stationsbalkon gegen den Bewegungsdrang.',
      'Progressive Muskelentspannung (PMR nach Jacobson) anbieten, wenn bekannt.',
      'Ablenkendes, neutrales Gespräch über Hobbys oder Haustiere führen.'
    ],
    donts: [
      'Patienten nach bereits erhaltener Prämedikation alleine aufstehen lassen (akute Sturzgefahr!).',
      'Komplexe, neue Meditationsübungen in akuten Panikmomenten erzwingen wollen.'
    ],
    practicalTips: 'Fragen Sie: „Haben Sie Ihr Smartphone und Kopfhörer dabei? Wollen Sie Ihre Lieblingsmusik anmachen?“',
    clinicalRationale: 'Kognitive Umfokussierung entzieht der angstbesetzten Gedankenschleife die Aufmerksamkeit.'
  },
  {
    id: 'k6',
    category: 'Prämedikation',
    title: 'Medikamentöse Anxiolyse',
    subtitle: 'Benzodiazepine & Sicherheitsregeln',
    iconName: 'Pill',
    color: 'from-sky-500 to-cyan-600',
    description: 'Ärztlich angeordnete Prämedikation nimmt die Spitze der Angst, erfordert aber höchste pflegerische Sorgfalt.',
    dos: [
      'Wirkstoffe kennen: Midazolam (kurzwirksam), Lorazepam, Diazepam, Oxazepam.',
      'Gabe ca. 45 Minuten vor Abruf in den OP terminieren.',
      'Bettgitter nach Absprache hochstellen, Klingel in unmittelbare Reichweite legen.',
      'Patient instruieren: Ab jetzt nicht mehr alleine aufstehen!'
    ],
    donts: [
      'Die Gefahr von paradoxen Reaktionen (Unruhe, Delir) bei geriatrischen Patienten unterschätzen.',
      'Medikament zu spät geben, sodass die Wirkung erst im OP oder gar postoperativ einsetzt.'
    ],
    practicalTips: 'Vor der Medikamentengabe den Patienten noch einmal bitten, die Blase auf der Toilette zu entleeren.',
    clinicalRationale: 'Benzodiazepine verstärken die GABA-erge Hemmung im ZNS und wirken anxiolytisch, sedierend und muskelrelaxierend.'
  }
];

export const quiz1CommunicationItems: CommunicationItem[] = [
  {
    id: 'comm1',
    text: 'Dem Patienten ausreichend Zeit für eigene Entscheidungen einräumen.',
    type: 'action',
    category: 'do',
    explanation: 'Richtig (DO)! Das Gefühl von Kontrollverlust verstärkt Ängste massiv. Entscheidungszeit fördert Selbstbestimmung und Sicherheit.'
  },
  {
    id: 'comm2',
    text: '„Das ist doch nur ein kleiner Routineeingriff, stellen Sie sich nicht so an!“',
    type: 'statement',
    category: 'dont',
    explanation: 'Richtig (DON\'T)! Eine klassische Bagatellisierung. Der Patient fühlt sich beschämt, missverstanden und zieht sich emotional zurück.'
  },
  {
    id: 'comm3',
    text: '„Welchen Arm soll ich für die Blutdruckmanschette nehmen?“',
    type: 'statement',
    category: 'do',
    explanation: 'Richtig (DO)! Auch kleine Wahlmöglichkeiten geben dem Patienten das Gefühl von Mitbestimmung und Kontrolle im fremden Ablauf zurück.'
  },
  {
    id: 'comm4',
    text: '„Wir leiten jetzt die Narkose ein, dann intubieren wir Sie, legen einen ZVK und schneiden dann...“',
    type: 'statement',
    category: 'dont',
    explanation: 'Richtig (DON\'T)! Reizüberflutung und invasive Detailbeschreibungen aktivieren zusätzliche Ängste. Infos müssen dosiert, verständlich und bedarfsgerecht sein.'
  },
  {
    id: 'comm5',
    text: '„Ich bin heute für Sie da, ich führe Sie durch den Ablauf und begleite Sie Schritt für Schritt.“',
    type: 'statement',
    category: 'do',
    explanation: 'Richtig (DO)! Feste Bezugsperson, Transparenz und Verlässlichkeit reduzieren die Unberechenbarkeit der Situation maßgeblich.'
  }
];

export const quiz2PremedCloze = {
  intro: 'Vervollständigen Sie die Fachinformationen zur medikamentösen Prämedikation vor der Operation:',
  parts: [
    { text: 'Um Patienten die Angst zu nehmen (Anxiolyse), wird oft eine medikamentöse Prämedikation verabreicht. Hierfür werden meist Medikamente aus der Gruppe der ' },
    { key: 'stoffgruppe', correct: 'Benzodiazepine', options: ['Barbiturate', 'Benzodiazepine', 'Neuroleptika'] },
    { text: ' eingesetzt. Typische Wirkstoffe sind Midazolam, Lorazepam, ' },
    { key: 'wirkstoff', correct: 'Diazepam', options: ['Morphin', 'Paracetamol', 'Diazepam'] },
    { text: ' oder Oxazepam. Diese Medikamente wirken nicht nur angstlösend, sondern oft auch beruhigend (sedativ), schlaffördernd und ' },
    { key: 'wirkung', correct: 'muskelentspannend', options: ['blutdrucksteigernd', 'muskelentspannend', 'atemantreibend'] },
    { text: '. Damit das Medikament optimal wirkt, sollte es ca. ' },
    { key: 'zeitpunkt', correct: '45 Minuten', options: ['5 Minuten', '45 Minuten', '4 Stunden'] },
    { text: ' vor dem Eingriff verabreicht werden. Besondere Vorsicht ist jedoch bei der Gabe an ältere Menschen und Kinder geboten, da hier die Gefahr eines ' },
    { key: 'risiko', correct: 'Delirs', options: ['Komas', 'Delirs', 'Schocks'] },
    { text: ' (paradoxe Erregung) besteht.' }
  ]
};

export const quiz3DistractionMatching: MatchingPair[] = [
  {
    id: 'dist1',
    scenarioTitle: 'Herr T. (körperlich agil, unruhig)',
    scenario: 'Herr T. ist körperlich fit, wird aber erst am späten Nachmittag operiert. Er tigert nervös und voller Bewegungsdrang über den Flur.',
    term: 'Spaziergang über Station / Park',
    explanation: 'Richtig! Bewegung baut die ausgeschütteten Stresshormone (Adrenalin) körperlich ab und reduziert die motorische Unruhe.'
  },
  {
    id: 'dist2',
    scenarioTitle: 'Frau K. (bereits prämediziert im Bett)',
    scenario: 'Frau K. liegt bereits mit Prämedikation im Bett, darf wegen akuter Sturzgefahr nicht mehr aufstehen, kann aber vor Gedankenkreisen nicht abschalten.',
    term: 'Medien (Podcast / Radio / Lesen)',
    explanation: 'Richtig! Bei Liegepflicht sind auditive Medien oder Lesestoff ideal, um die Gedanken von der bevorstehenden Narkose abzulenken.'
  },
  {
    id: 'dist3',
    scenarioTitle: 'Herr M. (stark muskulär verspannt)',
    scenario: 'Herr M. liegt im Bett und seine Nacken- und Schultermuskulatur ist durch die extreme Angstanspannung sichtlich verkrampft.',
    term: 'PMR nach Jacobson anleiten',
    explanation: 'Richtig! Die Progressive Muskelentspannung nach Jacobson nutzt das gezielte Anspannen und Loslassen zur schnellen Tonussenkung.'
  },
  {
    id: 'dist4',
    scenarioTitle: 'Frau S. (isoliert und besorgt)',
    scenario: 'Frau S. fühlt sich im fremden Krankenhauszimmer sehr isoliert und hat große Angst vor der drohenden Diagnose.',
    term: 'Kontakt zu Angehörigen herstellen',
    explanation: 'Richtig! Telefonat, Videocall oder der Besuch einer vertrauten, ruhigen Begleitperson spendet emotionalen Halt und senkt das Einsamkeitsgefühl.'
  }
];

export const quiz4MatrixItems: MatrixItem[] = [
  {
    id: 'mat1',
    text: 'Dem frierenden und zitternden Patienten eine vorgewärmte Decke anbieten.',
    targetCategory: 'symptom',
    explanation: 'Richtig! Thermische Anwendung gegen die vegetative Vasokonstriktion (Symptomorientierte Hilfe).'
  },
  {
    id: 'mat2',
    text: 'In der Akte prüfen, ob der Patient bekannte Trigger oder negative Vorerfahrungen mit Narkosen hat.',
    targetCategory: 'info',
    explanation: 'Richtig! Gezielte Vorab-Recherche zur Vermeidung von konditionierten Reizen (Informationssammlung).'
  },
  {
    id: 'mat3',
    text: 'Sicherstellen, dass die Begleitperson des Patienten selbst ruhig ist und die Situation nicht verschärft.',
    targetCategory: 'angehoerige',
    explanation: 'Richtig! Angehörige können nur dann eine Ressource sein, wenn sie keine Panik übertragen (Angehörige als Ressource).'
  },
  {
    id: 'mat4',
    text: 'Puls und Blutdruck engmaschig messen, um die körperliche Stressreaktion objektiv zu überwachen.',
    targetCategory: 'symptom',
    explanation: 'Richtig! Überwachung des Herz-Kreislauf-Systems auf sympathische Überlastung (Symptomorientierte Hilfe).'
  },
  {
    id: 'mat5',
    text: 'Körperliche Symptome wie Herzklopfen oder Übelkeit offen ansprechen, um sie emotional zu entlasten.',
    targetCategory: 'symptom',
    explanation: 'Richtig! Validierung der körperlichen Gefühle nimmt das Gefühl des Ausgeliefertseins (Symptomorientierte Hilfe).'
  }
];

export const quiz5ErrorRadarItems: ErrorRadarItem[] = [
  {
    id: 'err1',
    title: 'Um ihm Wärme zu spenden, wärmen Sie schnell ein Kirschkernkissen in der Stationsmikrowelle auf und legen es ihm auf den Bauch.',
    isError: true,
    explanation: 'GEFÄHRLICHER FEHLER! Ein Kirschkernkissen birgt im Krankenhaus massive Hygienerisiken (Keimverschleppung, nicht desinfizierbar) und eine erhebliche Verbrennungsgefahr. Im Krankenhaus dürfen nur geprüfte Wärmedecken oder medizinische Packs nach Standard verwendet werden!'
  },
  {
    id: 'err2',
    title: 'Sie reduzieren die Anzahl der Pflegenden, die in sein Zimmer gehen, um den Ansprechpartnerkreis klein zu halten.',
    isError: false,
    explanation: 'KORREKTE MASSNAHME! Kontinuität und eine feste Bezugsperson reduzieren Unruhe und schaffen eine verlässliche Vertrauensbasis.'
  },
  {
    id: 'err3',
    title: 'Da er Angst hat, rufen Sie seine Ehefrau an, obwohl diese am Telefon selbst völlig in Panik ausbricht, und schicken sie zu ihm ans Bett.',
    isError: true,
    explanation: 'SCHWERER FEHLER! Eine Begleitperson muss selbst emotional gefasst sein. Überträgt die Ehefrau ihre eigene Panik auf den Patienten, eskaliert die Angstkaskade weiter.'
  },
  {
    id: 'err4',
    title: 'Sie überspielen Ihre eigene Unsicherheit und tun extrem kühl-routiniert, ohne jemals eigene Gefühle zu zeigen.',
    isError: true,
    explanation: 'FEHLER! Eine rein kühle, distanzierte Abfertigung wirkt abweisend. Authentizität, echtes Zuhören und dosierte Empathie bauen Vertrauen auf.'
  }
];
