import { SixFItem, Hotspot, RedFlagCard, PfaActionItem } from '../types';

export const diagnoseMedia = {
  videoMain: {
    title: 'Gallensteine & Gallenkolik: Entstehung & Ursachen',
    url: 'https://www.youtube.com/embed/DD8ZivE-VAc',
    externalUrl: 'https://youtu.be/DD8ZivE-VAc?si=urime4Ot79TqSp4V',
    description: 'Kompakte Veranschaulichung der Pathophysiologie: Wie Cholesterinkristalle entstehen und die Gallenwege verlegen.'
  },
  sourceGesundBund: {
    title: 'Gallensteine: Ursachen und Behandlung',
    url: 'https://gesund.bund.de/gallensteine',
    source: 'gesund.bund.de (Bundesministerium für Gesundheit)',
    description: 'Evidenzbasierte Leitlinieninformationen zu Symptomen, Häufigkeit, Risikofaktoren und Indikationen zur Cholezystektomie.'
  },
  videoSurgerySim: {
    title: 'OP-Simulation: Laparoskopische Cholezystektomie',
    url: 'https://www.youtube-nocookie.com/embed/xNdtvBmrvCQ',
    externalUrl: 'https://youtu.be/xNdtvBmrvCQ?si=atRkzw5y_n6UWJki',
    description: 'Eindrucksvolle 3D-Simulation des minimal-invasiven Eingriffs (Schlüsselloch-OP) zur operativen Entfernung der Gallenblase.'
  }
};

export const cholezystoOverview = {
  definition: 'Eine Cholezystolithiasis bezeichnet das Vorhandensein von Gallensteinen (Konkrementen) in der Gallenblase. Sind auch die Gallengänge betroffen, spricht man von Choledocholithiasis.',
  symptoms: [
    'Plötzliche, krampfartige Schmerzen im rechten Oberbauch (Gallenkolik)',
    'Schmerzausstrahlung in die rechte Schulter und das rechte Schulterblatt',
    'Übelkeit, Erbrechen, Völlegefühl und Meteorismus (Blähungen)',
    'Gelbfärbung von Skleren und Haut (Ikterus) bei Abflussbehinderung des Bilirubins',
    'Dunkler Bierharn (Urin) und heller, entfärbter Lehmstuhl'
  ],
  riskFactorsTitle: 'Die 6-F-Regel der Risikofaktoren',
  treatment: 'Bei akuter Kolik: Sofortige Nahrungskarenz (Nulldiät), Spasmolytika und Analgetika. Bei wiederholten Beschwerden: Elektive laparoskopische Cholezystektomie.'
};

export const sixFItems: SixFItem[] = [
  {
    id: 'f_fat',
    term: 'Fat',
    germanDescription: 'Adipositas / starkes Übergewicht',
    explanation: 'Übergewicht führt zu einer erhöhten Cholesterinausscheidung in die Galle, wodurch die Galle mit Cholesterin übersättigt wird und Kristalle ausfallen.'
  },
  {
    id: 'f_female',
    term: 'Female',
    germanDescription: 'Weibliches Geschlecht',
    explanation: 'Frauen sind 2- bis 3-mal häufiger betroffen als Männer. Östrogene steigern die Cholesterinsekretion und verringern die Gallensalzkonzentration.'
  },
  {
    id: 'f_fertile',
    term: 'Fertile',
    germanDescription: 'Fruchtbar / Schwangerschaft',
    explanation: 'Mehrere Schwangerschaften und hohe Progesteronspiegel senken die Beweglichkeit (Motilität) der Gallenblasenwand und begünstigen den Gallestau.'
  },
  {
    id: 'f_forty',
    term: 'Forty',
    germanDescription: 'Alter über 40 Jahre',
    explanation: 'Mit zunehmendem Alter steigt die Lithogenität (Neigung zur Steinbildung) der Galle kontinuierlich an.'
  },
  {
    id: 'f_fair',
    term: 'Fair',
    germanDescription: 'Hellhäutiger Hauttyp',
    explanation: 'Epidemiologische Studien belegen ein gehäuftes Auftreten von Cholesterinsteinen bei Menschen mit mitteleuropäisch-kaukasischem Phänotyp.'
  },
  {
    id: 'f_family',
    term: 'Family',
    germanDescription: 'Genetische Veranlagung / Familie',
    explanation: 'Eine positive Familienanamnese verdoppelt das Erkrankungsrisiko. Mutationen in Gallensalztransportern (z. B. ABCB4) werden vererbt.'
  }
];

export const hotspots: Hotspot[] = [
  {
    id: 'hs_ruq',
    title: 'Rechter Oberbauch',
    bodyPart: 'Oberbauch (Epigastrium / RUQ)',
    xPercent: 44,
    yPercent: 44,
    symptomName: 'Krampfartige Kolik-Schmerzen',
    description: 'Hier sitzt die Gallenblase unmittelbar unterhalb der Leber. Wenn sich die Gallenblase gegen einen eingeklemmten Stein zusammenzieht, entsteht der typische kolikartige Wellenschmerz.',
    clinicalNote: 'Die Schmerzen nehmen oft nach fettreichen Mahlzeiten binnen 1-2 Stunden dramatisch zu.'
  },
  {
    id: 'hs_shoulder',
    title: 'Rechte Schulter & Rücken',
    bodyPart: 'Rechte Schulter (Head-Zonen)',
    xPercent: 32,
    yPercent: 24,
    symptomName: 'Ausstrahlungsschmerz',
    description: 'Die Schmerzen der Gallenkolik können über den Nervus phrenicus (Segmente C3-C5) reflektorisch in die rechte Schulter und das rechte Schulterblatt ausstrahlen.',
    clinicalNote: 'Patienten klagen oft über ziehende Schulterschmerzen, obwohl die Ursache im Abdomen liegt!'
  },
  {
    id: 'hs_eyes',
    title: 'Augen (Skleren)',
    bodyPart: 'Augen / Gesicht',
    xPercent: 50,
    yPercent: 12,
    symptomName: 'Gelbfärbung (Sklerenikterus)',
    description: 'Ein blockierter Hauptgallengang führt dazu, dass der Gallenfarbstoff Bilirubin nicht in den Darm abfließen kann, ins Blut übergeht und das Augenweiß gelb färbt.',
    clinicalNote: 'Warnsignal (Red Flag): Deutet auf einen akuten Verschluss des Ductus choledochus hin!'
  },
  {
    id: 'hs_gi',
    title: 'Magen-Darm-Trakt',
    bodyPart: 'Abdomen / Gastrointestinaltrakt',
    xPercent: 52,
    yPercent: 52,
    symptomName: 'Übelkeit, Erbrechen & Völlegefühl',
    description: 'Der Rückstau von Galle und die Entzündungsreizung führen zu vegetativen Begleitsymptomen wie starkem Brechreiz, Inappetenz und Blähungen.',
    clinicalNote: 'Erbrechen bringt bei einer Gallenkolik im Gegensatz zur Gastroenteritis meist keine Schmerzerleichterung.'
  }
];

export const redFlagCards: RedFlagCard[] = [
  {
    id: 'rf1',
    scenario: 'Ein Patient erzählt Ihnen beiläufig, dass bei ihm vor drei Jahren Gallensteine im Ultraschall entdeckt wurden, er aber nie Schmerzen oder Beschwerden hatte.',
    isEmergency: false,
    category: 'Asymptomatische Cholezystolithiasis',
    explanation: 'NORMAL / HARMLOS: Ca. 75-80 % aller Gallensteinträger bleiben lebenslang beschwerdefrei (sog. „stumme Steine“). Eine Therapie oder OP ist hier in der Regel nicht indiziert.'
  },
  {
    id: 'rf2',
    scenario: 'Eine Patientin krümmt sich vor krampfartigen Schmerzen im rechten Oberbauch, die in Wellen kommen und von starker Übelkeit begleitet sind.',
    isEmergency: true,
    category: 'Akute Gallenkolik',
    explanation: 'NOTFALL / GALLENKOLIK! Der Ausführungsgang ist durch einen Stein blockiert; die Gallenblasenmuskulatur zieht sich krampfhaft zusammen. Sofortige Schmerztherapie & Nahrungskarenz nötig!'
  },
  {
    id: 'rf3',
    scenario: 'Die Patientin mit Oberbauchschmerzen entwickelt plötzlich hohes Fieber mit Schüttelfrost und ihre Haut und Augen färben sich leicht gelblich.',
    isEmergency: true,
    category: 'Charcot-Trias (Akute Cholangitis)',
    explanation: 'LEBENSGEFÄHRLICHER NOTFALL! Dies ist die klassische Charcot-Trias (rechtsseitiger Oberbauchschmerz + Fieber/Schüttelfrost + Ikterus). Es droht eine bakterielle Entzündung der Gallenwege bis zur biliären Sepsis!'
  },
  {
    id: 'rf4',
    scenario: 'Die starken Schmerzen der Patientin im Oberbauch halten ununterbrochen seit über 5 Stunden an und werden gürtelförmig intensiver.',
    isEmergency: true,
    category: 'Komplikation (Pankreatitis / Cholezystitis)',
    explanation: 'SCHWERER NOTFALL! Kolikschmerzen, die länger als 5 Stunden anhalten, weisen auf eine akute Cholezystitis oder eine biliäre Pankreatitis (Bauchspeicheldrüsenentzündung) hin!'
  }
];

export const pfaActions: PfaActionItem[] = [
  {
    id: 'act1',
    actionText: 'Sie bringen dem Patienten mit akuter Gallenkolik zur Stärkung eine leichte, warme Gemüsesuppe ans Bett.',
    isCorrect: false,
    explanation: 'FALSCH! Bei einer akuten Kolik gilt absolute Nulldiät (Nahrungskarenz). Jede Nahrungsaufnahme regt das Hormon Cholezystokinin an, wodurch sich die Gallenblase noch stärker kontrahiert und die Schmerzen eskalieren!'
  },
  {
    id: 'act2',
    actionText: 'Sie informieren unverzüglich die Pflegefachkraft und den Arzt und bitten um ärztlich angeordnete Spasmolytika (Krampflöser) und Analgetika.',
    isCorrect: true,
    explanation: 'RICHTIG! Die Kombination aus Krampflösern (z. B. Butylscopolamin) und starken Schmerzmitteln (z. B. Metamizol oder NSAR) durchbricht den Muskelkrampf und lindert die Qualen des Patienten.'
  }
];

export const clozeAnatomy = {
  intro: 'Setzen Sie die medizinisch und physiologisch korrekten Begriffe in die Lücken ein:',
  parts: [
    { text: 'Gallenflüssigkeit wird täglich in der ' },
    { key: 'organ1', correct: 'Leber', options: ['Leber', 'Bauchspeicheldrüse', 'Milz'] },
    { text: ' gebildet und fließt in den Darm. Die restliche Flüssigkeit wird in der ' },
    { key: 'organ2', correct: 'Gallenblase', options: ['Gallenblase', 'Harnblase', 'Niere'] },
    { text: ' gespeichert und eingedickt. Die Galle ist besonders wichtig für die Verdauung von ' },
    { key: 'stoff', correct: 'Fetten', options: ['Fetten', 'Eiweißen', 'Kohlenhydraten'] },
    { text: '. Wenn der Abfluss gestört ist, können sich aus den Bestandteilen (zu 80 % aus ' },
    { key: 'substanz', correct: 'Cholesterin', options: ['Cholesterin', 'Harnsäure', 'Kalziumoxalat'] },
    { text: ') feste Kristalle und Steine bilden. Befinden sich diese in der Gallenblase, spricht man von einer ' },
    { key: 'diagnose', correct: 'Cholezystolithiasis', options: ['Cholezystolithiasis', 'Appendizitis', 'Nephrolithiasis'] },
    { text: '.' }
  ]
};

export const therapyMatching = [
  {
    id: 'th1',
    step: 'Maßnahme bei akuter Kolik',
    solution: 'Absolute Nulldiät (Nahrungskarenz)',
    explanation: 'Verhindert weitere Reizung und Cholezystokinin-Ausschüttung.'
  },
  {
    id: 'th2',
    step: 'Medikamentöse Schmerzlinderung',
    solution: 'Analgetika (NSAR) & Spasmolytika (Krampflöser)',
    explanation: 'Entspannt den Schließmuskel und dämpft den Schmerzreiz effektiv.'
  },
  {
    id: 'th3',
    step: 'Operative Entfernung der Gallenblase',
    solution: 'Laparoskopische Cholezystektomie',
    explanation: 'Minimal-invasiver Goldstandard zur dauerhaften Beseitigung des Steinleidens.'
  },
  {
    id: 'th4',
    step: 'Behandlung bei bakterieller Entzündung',
    solution: 'Antibiotika',
    explanation: 'Gezielte systemische Antibiose zur Verhinderung einer Keimvermehrung und Sepsis.'
  }
];
