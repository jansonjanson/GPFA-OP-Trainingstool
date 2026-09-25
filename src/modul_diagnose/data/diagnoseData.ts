import { SixFItem, Hotspot, RedFlagCard, PfaActionItem } from '../types';

export const diagnoseMedia = {
  videoMain: {
    title: 'Gallensteine & Gallenkolik: Entstehung & Ursachen',
    url: 'https://www.youtube.com/embed/DD8ZivE-VAc',
    externalUrl: 'https://youtu.be/DD8ZivE-VAc?si=urime4Ot79TqSp4V',
    duration: 'ca. 13:30 Min.',
    speaker: 'Dr. Weigl',
    description: 'Kompakte Veranschaulichung der Pathophysiologie: Wie Cholesterinkristalle entstehen, Gallengänge verlegen und krampfartige Koliken auslösen.'
  },
  sourceGesundBund: {
    title: 'Fachartikel der Bundesregierung (gesund.bund.de)',
    url: 'https://gesund.bund.de/gallensteine',
    source: 'gesund.bund.de • Offizielles Gesundheitsportal',
    description: 'Gleiche Kerninhalte wie das Lehrvideo zur Wiederholung und dauerhaften Ergebnissicherung: Risikofaktoren, Symptomatik und OP-Indikation.'
  },
  videoSurgerySim: {
    title: 'OP-Dokumentation: Laparoskopische Cholezystektomie (lap. CE)',
    url: 'https://youtu.be/hueATDhHfLg?si=-4l67NOoye-Ub1-Q',
    externalUrl: 'https://youtu.be/hueATDhHfLg?si=-4l67NOoye-Ub1-Q',
    duration: 'ca. 15:00 Min.',
    description: 'Exemplarischer filmischer Ablauf einer laparoskopischen Cholezystektomie (minimal-invasive 4-Trokar-Technik).'
  }
};

export const cholezystoOverview = {
  definition: 'Eine Cholezystolithiasis bezeichnet das Vorhandensein von Gallensteinen in der Gallenblase. Sind auch die Gallengänge verlegt, spricht man von Choledocholithiasis.',
  symptoms: [
    'Plötzliche, krampfartige und stechende Schmerzen im rechten Oberbauch (Gallenkolik, 15–60 Min.)',
    'Reflektorische Schmerzausstrahlung in den Rücken und die rechte Schulter (N. phrenicus)',
    'Vegetative Begleitsymptome: Übelkeit, reflektorisches Erbrechen, Völlegefühl und Meteorismus',
    'Gelbfärbung von Skleren und Haut (Ikterus) bei Verstopfung des Gallengangs (Bilirubinstau)',
    'Dunkler Bierbraunurin und heller, entfärbter Lehmstuhl (Acholie)'
  ],
  riskFactorsTitle: 'Die 6-F-Regel der Risikofaktoren',
  treatment: 'Bei akuter Kolik: Absolute Nahrungskarenz (Nulldiät), Analgetika (NSAR) und Spasmolytika. Bei rezidivierenden Koliken oder Komplikationen: Laparoskopische Cholezystektomie.'
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
    explanation: 'Frauen sind 2- bis 3-mal häufiger betroffen als Männer. Östrogene steigern die Cholesterinsekretion und senken die Gallensalzkonzentration.'
  },
  {
    id: 'f_fertile',
    term: 'Fertile',
    germanDescription: 'Fruchtbar / Schwangerschaft',
    explanation: 'Schwangerschaften und hohe Progesteronspiegel senken die Motilität der Gallenblasenwand und begünstigen das Eindicken der Galle.'
  },
  {
    id: 'f_forty',
    term: 'Forty',
    germanDescription: 'Alter ab dem 40. Lebensjahr',
    explanation: 'Mit zunehmendem Alter steigt die Neigung zur Steinbildung (Lithogenität) der Galle kontinuierlich an. Forty steht für den Altersfaktor ab 40 Jahren.'
  },
  {
    id: 'f_fair',
    term: 'Fair',
    germanDescription: 'Hellhäutiger Phänotyp',
    explanation: 'Epidemiologische Studien belegen ein gehäuftes Auftreten von Cholesterinsteinen bei Menschen mit hellhäutigem Phänotyp.'
  },
  {
    id: 'f_family',
    term: 'Family',
    germanDescription: 'Genetische Disposition / Familie',
    explanation: 'Eine familiäre Vorbelastung erhöht das Risiko signifikant. Mutationen in Gallensalztransportern und familiäre Stoffwechselmuster begünstigen Gallensteine.'
  }
];

export const hotspots: Hotspot[] = [
  {
    id: 'hs_ruq',
    title: 'Rechter Oberbauch',
    bodyPart: 'Rechter Oberbauch (RUQ unter Rippenbogen)',
    xPercent: 41,
    yPercent: 40,
    symptomName: 'Krampfartige Kolik-Schmerzen (15–60 Min.)',
    description: 'Hier liegt die Gallenblase unterhalb der Leber. Wenn sich die Gallenblase krampfartig zusammenzieht, um Galle gegen einen verklemmten Stein zu pressen, entsteht der typische stechende Kolikschmerz.',
    clinicalNote: 'Typischer Kolikverlauf: Schmerz schwillt wellenförmig an, dauert meist 15–60 Minuten und flaut dann wieder ab.'
  },
  {
    id: 'hs_shoulder',
    title: 'Rechte Schulter & Rücken',
    bodyPart: 'Rechte Schulter & Skapula (Head-Zonen)',
    xPercent: 32,
    yPercent: 26,
    symptomName: 'Reflektorische Ausstrahlung (N. phrenicus)',
    description: 'Über sensible Fasern des Nervus phrenicus (Segmente C3–C5) strahlt der Kolikschmerz reflektorisch in die rechte Schulter und das rechte Schulterblatt aus.',
    clinicalNote: 'Viele Patientinnen vermuten fälschlich ein orthopädisches Leiden, obwohl die Ursache im Gallensystem liegt.'
  },
  {
    id: 'hs_eyes',
    title: 'Augen (Skleren) & Gesicht',
    bodyPart: 'Skleren (Augenweiß) & Haut',
    xPercent: 50,
    yPercent: 12,
    symptomName: 'Gelbsucht (Sklerenikterus & Ikterus bei Gallengangsverstopfung)',
    description: 'Verstopft ein Gallenstein den Hauptgallengang (Ductus choledochus), staut sich die Galle bis in die Leber zurück. Der Gallenfarbstoff Bilirubin kann nicht in den Darm abfließen, tritt ins Blut über und färbt das Augenweiß und die Haut gelb.',
    clinicalNote: 'Leitsymptom des mechanischen Abflusshindernisses (Cholestase). Begleitend entsteht dunkelbierbrauner Urin und entfärbter Lehmstuhl!'
  },
  {
    id: 'hs_gi',
    title: 'Magen-Darm-Trakt',
    bodyPart: 'Zentrales Abdomen (Vegetativum)',
    xPercent: 50,
    yPercent: 49,
    symptomName: 'Übelkeit, Erbrechen & Meteorismus',
    description: 'Der viszerale Dehnungsreiz im Gallengangssystem löst reflektorisch starke Übelkeit, Erbrechen, Völlegefühl und Blähungen aus.',
    clinicalNote: 'Wichtiger Pflegehinweis: Erbrechen führt bei einer Gallenkolik im Unterschied zur Gastroenteritis zu keiner spürbaren Schmerzentlastung!'
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
    step: 'Stumme Gallensteine (Asymptomatische Steinträger)',
    solution: 'Keine OP-Indikation / Abwartendes Verhalten (Watchful Waiting)',
    explanation: 'Rund 75–80 % aller Steinträger bleiben dauerhaft beschwerdefrei; ein präventiver Eingriff ohne Symptome ist laut Leitlinie nicht indiziert.'
  },
  {
    id: 'th2',
    step: 'Akute unkomplizierte Gallenkolik (Krampfschmerz im RUQ)',
    solution: 'Nahrungskarenz (Nulldiät) + Spasmolytika & Analgetika',
    explanation: 'Verhindert weitere Cholezystokinin-Ausschüttung; Krampflöser und Schmerzmittel (z. B. Butylscopolamin & Metamizol/NSAR) durchbrechen den Spasmus.'
  },
  {
    id: 'th3',
    step: 'Symptomatische Cholezystolithiasis (rezidivierende Koliken)',
    solution: 'Elektive laparoskopische Cholezystektomie (lap. CE)',
    explanation: 'Minimal-invasiver Goldstandard zur dauerhaften Beseitigung des Steinleidens im beschwerdefreien Intervall innerhalb weniger Wochen.'
  },
  {
    id: 'th4',
    step: 'Porzellangallenblase (Verkalkung der Gallenblasenwand)',
    solution: 'Prophylaktische Cholezystektomie wegen Karzinomrisiko',
    explanation: 'Wegen des signifikant erhöhten Entartungsrisikos zum Gallenblasenkarzinom ist auch bei Beschwerdefreiheit eine operative Entfernung indiziert.'
  },
  {
    id: 'th5',
    step: 'Bakterielle Cholezystitis / Cholangitis mit Fieber',
    solution: 'Stationäre Aufnahme, i.v. Antibiose & zeitnahe Cholezystektomie',
    explanation: 'Gezielte systemische Antibiose und zeitnahe chirurgische Sanierung zur Verhinderung von Gallenblasenperforation und Sepsis.'
  }
];
