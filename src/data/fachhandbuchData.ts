export interface FachhandbuchNugget {
  id: string;
  moduleIndex: 1 | 2 | 3 | 4;
  moduleName: string;
  moduleShort: string;
  stationOrDs: string;
  title: string;
  category: string;
  summary: string;
  corePoints: string[];
  clinicalTip: string;
  reference: string;
  storageKey?: string;
  nuggetMatchId?: string;
}

export const FACHHANDBUCH_NUGGETS: FachhandbuchNugget[] = [
  // ================= MODUL 1 =================
  {
    id: 'm1_nugget_station1',
    moduleIndex: 1,
    moduleName: 'Modul 1: Diagnose & Beobachtung',
    moduleShort: 'Modul 1 (DS 1 & 2)',
    stationOrDs: 'Station 1 • Ursachen & Steinarten (Dr. Weigl)',
    title: 'Gallensteine: Ursachen, Steinarten, Charcot-Symptome & Behandlung (Dr. Weigl)',
    category: 'Grundlagen & Notfallerkennung',
    summary: 'Kompakte Zusammenfassung nach Dr. Weigl: Entstehung durch Cholesterinübersättigung, Unterscheidung von Cholesterin- und Pigmentsteinen, Erkennung der lebensgefährlichen Charcot-Trias bei Cholangitis sowie stufenweises therapeutisches Vorgehen von Nahrungskarenz bis zur laparoskopischen Cholezystektomie.',
    corePoints: [
      'Ursachen: Lebergalle (0,5–1 l/Tag) kippt durch zu viel Cholesterin oder Gallensalzmangel; Kristalle fallen wie ungelöster Zucker im Tee aus',
      'Steinarten: Cholesterinsteine (gelb-grünlich, ca. 80%, fett-/stoffwechselbedingt) vs. Pigment-/Bilirubinsteine (schwarz-braun, ca. 10–20%, Hämolyse/Infekte) vs. Gemischte Steine mit Kalk',
      'Charcot-Trias (Gefahr der Cholangitis / eitrigen Gallengangsinfektion): 1. Schmerz rechter Oberbauch, 2. Hohes Fieber mit Schüttelfrost, 3. Gelbsucht (Ikterus) → Sofortige Arztmeldung!',
      'Gallenkolik & Symptome: Wehenartiger Schmerz, Ausstrahlung in rechte Schulter/Rücken, Acholie (heller Lehmstuhl), dunkler Bierbraunurin',
      'Behandlung: Stumme Steine beobachten (Wait & See); akute Kolik mit sofortiger Nahrungskarenz & Spasmolytika; Steine im Gallengang via ERCP; definitive Heilung via laparoskopischer Cholezystektomie'
    ],
    clinicalTip: 'Die Charcot-Trias (Schmerz + Fieber/Schüttelfrost + Ikterus) zeigt eine eitrige Gallengangsinfektion (Cholangitis) an – dies ist für die Pflegefachassistenz ein akuter Notfall mit sofortiger Arztinfo (Sepsisgefahr)!',
    reference: 'Lehrvideo Dr. Weigl & I Care Pflege S. 809–811',
    storageKey: 'gpfa_m1_unlocked_nuggets',
    nuggetMatchId: 'nugget_station1_patho'
  },
  {
    id: 'm1_nugget_station2',
    moduleIndex: 1,
    moduleName: 'Modul 1: Diagnose & Beobachtung',
    moduleShort: 'Modul 1 (DS 1 & 2)',
    stationOrDs: 'Station 2 • Leitlinienwissen',
    title: 'Leitlinienwissen & Epidemiologie (gesund.bund.de)',
    category: 'Epidemiologie & Leitlinien',
    summary: 'Rund 15–20% aller Erwachsenen haben Gallensteine, wobei der Großteil lebenslang beschwerdefrei bleibt. Sobald Symptome auftreten, besteht eine klare Indikation zur operativen Entfernung.',
    corePoints: [
      'Stumme Steine: 75–80% bleiben lebenslang symptomfrei (keine OP oder Therapie erforderlich)',
      'Symptomatische Steine: Rezidivrate >50% binnen 12 Monaten nach Erstkolik -> klare OP-Indikation',
      '6-F-Risikoprofil: Fat, Female, Fertile, Forty, Fair, Family als Leitschiene',
      'Gefahren bei Nichtbehandlung: Akute Cholezystitis, Choledocholithiasis, Biliäre Pankreatitis, Perforation'
    ],
    clinicalTip: 'Nur symptomatische Gallensteine werden operiert. Zufallsbefunde ohne Koliken bedürfen nur der Aufklärung.',
    reference: 'Bundesministerium für Gesundheit (gesund.bund.de) & S3-Leitlinie Gallensteine',
    storageKey: 'gpfa_m1_unlocked_nuggets',
    nuggetMatchId: 'nugget_station2_article'
  },
  {
    id: 'm1_nugget_station3',
    moduleIndex: 1,
    moduleName: 'Modul 1: Diagnose & Beobachtung',
    moduleShort: 'Modul 1 (DS 1 & 2)',
    stationOrDs: 'Station 3 • OP-Standard',
    title: 'Minimal-invasive Laparoskopische Cholezystektomie (lap. CE)',
    category: 'Chirurgische Verfahren',
    summary: 'Die laparoskopische Cholezystektomie ist der weltweite Goldstandard zur Entfernung der Gallenblase. Über 4 kleine Schnitte wird unter Kamerasicht das Calot-Dreieck präpariert und die Gallenblase geborgen.',
    corePoints: [
      'Zugang: 4 Trokare (Nabel für Kamera, 3 Arbeitskanäle) mit CO2-Pneumoperitoneum (ca. 12 mmHg)',
      'Sicherheitszone: Critical View of Safety im Calot-Dreieck schützt den Ductus choledochus',
      'Clipping: Ductus cysticus und Arteria cystica werden doppelt geclippt und durchtrennt',
      'Endobag: Intakte Bergung im Bergebeutel über den Nabelschnitt verhindert Keim- und Galleaustritt'
    ],
    clinicalTip: 'Die schonende Schlüsselloch-Methode ermöglicht eine schnelle Frühmobilisation bereits wenige Stunden post-OP.',
    reference: 'Chirurgische OP-Dokumentation & S3-Leitlinie',
    storageKey: 'gpfa_m1_unlocked_nuggets',
    nuggetMatchId: 'nugget_station3_surgery'
  },
  {
    id: 'm1_nugget_6f',
    moduleIndex: 1,
    moduleName: 'Modul 1: Diagnose & Beobachtung',
    moduleShort: 'Modul 1 (DS 1 & 2)',
    stationOrDs: 'Quiz 1 • Risikofaktoren',
    title: 'Die klassische 6-F-Regel der Gallensteinentstehung',
    category: 'Anamnese & Risikobewertung',
    summary: 'Die 6-F-Regel fasst die sechs empirisch wichtigsten Risikofaktoren für die Bildung von Cholesterinsteinen im Erwachsenenalter zusammen.',
    corePoints: [
      'Female: Weibliches Geschlecht (Östrogene steigern lithogene Gallesättigung)',
      'Forty: Alter ≥ 40 Jahre (verlangsamte Gallenblasenmotilität & Stoffwechsel)',
      'Fat: Übergewicht / Adipositas BMI > 30 kg/m² (erhöhte Cholesterinausscheidung)',
      'Fertile: Mehrere Schwangerschaften / Geburten (Progesteron hemmt Entleerung)',
      'Fair: Heller kaukasischer Hauttyp / Phänotyp (genetische Prädisposition)',
      'Family: Familiäre Häufung von Gallensteinleiden (Verwandte 1. Grades)'
    ],
    clinicalTip: 'Treffen mehrere Fs bei akuten rechtsseitigen Oberbauchschmerzen zu, muss primär an Gallensteine gedacht werden.',
    reference: 'I Care Pflege & Duale Reihe Innere Medizin',
    storageKey: 'gpfa_m1_unlocked_nuggets',
    nuggetMatchId: 'nugget_6f'
  },
  {
    id: 'm1_nugget_symptoms',
    moduleIndex: 1,
    moduleName: 'Modul 1: Diagnose & Beobachtung',
    moduleShort: 'Modul 1 (DS 1 & 2)',
    stationOrDs: 'Quiz 2 • Schmerztopographie',
    title: 'Symptom-Topographie & Head-Zonen bei Gallenerkrankungen',
    category: 'Klinische Untersuchung',
    summary: 'Viszerale Reizungen der Gallenblase übertragen sich über afferente Nervenbahnen des Nervus phrenicus auf segmentale Dermatome (Head-Zonen) am Rücken und an der rechten Schulter.',
    corePoints: [
      'Rechter Oberbauch (RUQ): Druck-, Dehnungs- und Kontraktionsschmerz direkt an der Gallenblase',
      'Rechte Schulter: Schmerzprojektion über Segmente C3–C5 des Nervus phrenicus',
      'Interscapulärraum: Ziehender Schmerz zwischen den Schulterblättern',
      'Vegetative Symptome: Übelkeit, Kaltschweißigkeit, Blässe und Erbrechen'
    ],
    clinicalTip: 'Rechtsseitige Schulterschmerzen ohne Traumahistorie sind bei abdominellem Druckschmerz immer verdächtig auf biliäre Genese!',
    reference: 'Anatomie & Klinische Propädeutik',
    storageKey: 'gpfa_m1_unlocked_nuggets',
    nuggetMatchId: 'nugget_symptoms'
  },
  {
    id: 'm1_nugget_excretion',
    moduleIndex: 1,
    moduleName: 'Modul 1: Diagnose & Beobachtung',
    moduleShort: 'Modul 1 (DS 1 & 2)',
    stationOrDs: 'Quiz 3 • Ausscheidungsbeobachtung',
    title: 'Ausscheidungs-Befunde bei Gallenstau (Cholestase)',
    category: 'Pflegebeobachtung',
    summary: 'Bei einer Verlegung des Ductus choledochus staut sich die Galle in Leber und Blutkreislauf. Dies führt zu charakteristischen, pathognomonischen Verfärbungen von Urin und Stuhl.',
    corePoints: [
      'Dunkelbrauner Urin (Bierbraun): Wasserlösliches konjugiertes Bilirubin tritt ins Blut über und wird renal filtriert',
      'Heller, lehmfarbener Stuhl (Acholischer Stuhl): Durch den Abflusshindernis fehlt Bilirubin im Darm zur Bildung von Sterkobilin',
      'Skleren- & Hautikterus: Gelbfärbung ab einem Serumbilirubinwert von ca. 2–3 mg/dl',
      'Pruritus: Starker Juckreiz durch Ablagerung von Gallensalzen in der Haut'
    ],
    clinicalTip: 'Die gezielte Frage nach Urin- und Stuhlfarbe gehört bei jedem Oberbauchschmerz zur pflegerischen Pflichtanamnese!',
    reference: 'I Care Pflege S. 810 & Pflege Heute',
    storageKey: 'gpfa_m1_unlocked_nuggets',
    nuggetMatchId: 'nugget_excretion'
  },
  {
    id: 'm1_nugget_redflags',
    moduleIndex: 1,
    moduleName: 'Modul 1: Diagnose & Beobachtung',
    moduleShort: 'Modul 1 (DS 1 & 2)',
    stationOrDs: 'Quiz 4 • Notfallzeichen',
    title: 'Red Flags: Wann wird die Gallenkolik zum lebensbedrohlichen Notfall?',
    category: 'Notfallmanagement',
    summary: 'Fieber, Schüttelfrost und anhaltende Dauerschmerzen weisen auf akute Komplikationen hin, die eine sofortige stationäre Notfallversorgung erfordern.',
    corePoints: [
      'Charcot-Trias (Akute eitrige Cholangitis): Rechter Oberbauchschmerz + Fieber/Schüttelfrost + Ikterus',
      'Dauerschmerz > 5–6 Stunden: Verdacht auf akute nekrotisierende Cholezystitis oder Gallenblasenperforation',
      'Biliäre Pankreatitis: Gürtelförmiger Oberbauchschmerz mit Gummibauch und Lipaseanstieg',
      'Akutes Abdomen: Abwehrspannung (Peritonismus), Tachykardie und septischer Schock'
    ],
    clinicalTip: 'Bei Fieber + Ikterus niemals abwarten! Sofort Notarzt / Klinikeinweisung zur Dekompression veranlassen.',
    reference: 'S3-Leitlinie Notfall-Abdomen & CNE',
    storageKey: 'gpfa_m1_unlocked_nuggets',
    nuggetMatchId: 'nugget_redflags'
  },
  {
    id: 'm1_nugget_anatomy',
    moduleIndex: 1,
    moduleName: 'Modul 1: Diagnose & Beobachtung',
    moduleShort: 'Modul 1 (DS 1 & 2)',
    stationOrDs: 'Quiz 6 • Anatomie & Physiologie',
    title: 'Anatomie, Galleproduktion & Speicherfunktion der Gallenblase',
    category: 'Anatomie & Physiologie',
    summary: 'Die Galle wird kontinuierlich in der Leber produziert und in der Gallenblase eingedickt gespeichert, um bei fettigen Mahlzeiten gezielt ins Duodenum abgegeben zu werden.',
    corePoints: [
      'Galleproduktion: Bis zu 1.000 ml tägliche Produktion in den Hepatozyten der Leber',
      'Eindickung: Die Gallenblase (Vesica biliaris) entzieht Wasser und konzentriert die Galle 5- bis 10-fach',
      'Gallengangsystem: Ductus hepaticus + Ductus cysticus bilden den Ductus choledochus zur Papilla Vateri',
      'Emulgierung: Gallensäuren sind amphiphil und emulgieren Nahrungsfette für die Pankreaslipase'
    ],
    clinicalTip: 'Nach einer Cholezystektomie übernimmt der Gallengang die Passage – Patienten können nach kurzer Anpassung meist normal weiteressen.',
    reference: 'Physiologie des Menschen & I Care Pflege',
    storageKey: 'gpfa_m1_unlocked_nuggets',
    nuggetMatchId: 'nugget_anatomy'
  },
  {
    id: 'm1_nugget_therapy',
    moduleIndex: 1,
    moduleName: 'Modul 1: Diagnose & Beobachtung',
    moduleShort: 'Modul 1 (DS 1 & 2)',
    stationOrDs: 'Quiz 7 • PFA-Handlungspfad',
    title: 'PFA-Handlungspfad bei akuter Kolik & Klinikeinweisung',
    category: 'Pflegepraxis & Standards',
    summary: 'Strikte Nahrungskarenz, entlastende Knierollenlagerung und Vitalzeichenüberwachung bilden das Kernfundament der Erstversorgung vor der Krankenhauseinweisung.',
    corePoints: [
      'Absolute Nahrungskarenz: Nichts essen oder trinken (Nüchternheit für Notfallsonographie und OP)',
      'Entlastungslagerung: 30°-Oberkörperhochlage mit Knierolle zur Entspannung der gereizten Bauchdecke',
      'Schmerz- & Spasmolyse: Gabe von Spasmolytika (Butylscopolamin) und Nicht-Opioid-Analgetika (Metamizol)',
      'Vorbereitung Transport: Vitalwerte engmaschig messen, Vorbefunde zusammenstellen, Einweisung übergeben'
    ],
    clinicalTip: 'Reines Morphin ist bei Koliken kontraindiziert, da es Krämpfe am Sphinkter Oddi auslösen kann!',
    reference: 'PFA-Curriculum & Notfallstandards',
    storageKey: 'gpfa_m1_unlocked_nuggets',
    nuggetMatchId: 'nugget_therapy'
  },

  // ================= MODUL 2 =================
  {
    id: 'm2_nugget_furcht_angst',
    moduleIndex: 2,
    moduleName: 'Modul 2: Angst vor der OP',
    moduleShort: 'Modul 2 (DS 3 & 4)',
    stationOrDs: 'DS 3 • Grundlagen',
    title: 'Angst vs. Furcht im klinischen Vergleich',
    category: 'Psychosoziale Pflege',
    summary: 'Furcht richtet sich auf konkrete, gegenwärtige Bedrohungen (Nadelstich, Schmerz). Präoperative Angst (State-Angst) ist diffus, unklar und zukunftsgerichtet.',
    corePoints: [
      'Furcht: Konkretes Objekt (Spritze, Narkosemaske), zeitlich unmittelbar, schwindet nach Reizende',
      'State-Angst: Diffuse Befürchtung vor Kontrollverlust, Nicht-Aufwachen oder bösartigen Befunden',
      'Vegetative Symptome: Herzrasen, feuchte Hände, Zittern, Magenkrämpfe, flache Atmung',
      'Pflegerische Konsequenz: Furcht braucht Information; diffuse Angst braucht emotionale Entlastung und Präsenz'
    ],
    clinicalTip: 'Fragen Sie: „Wovor genau haben Sie im Moment am meisten Sorge?“ Das wandelt diffuse Angst in greifbare Themen um.',
    reference: 'I Care Pflege & Psychologie in der Pflege',
    storageKey: 'gpfa_m2_unlocked_nuggets',
    nuggetMatchId: 'nugget_furcht_angst'
  },
  {
    id: 'm2_nugget_entstehung',
    moduleIndex: 2,
    moduleName: 'Modul 2: Angst vor der OP',
    moduleShort: 'Modul 2 (DS 3 & 4)',
    stationOrDs: 'DS 3 • Neuropsychologie',
    title: 'Die 4 Entstehungsformen präoperativer Angst',
    category: 'Lern- & Neuropsychologie',
    summary: 'OP-Angst entsteht über verschiedene Mechanismen: Eigene negative Vorerfahrungen, Beobachtungslernen bei Mitpatienten, beängstigende Instruktionen oder genetische Veranlagung.',
    corePoints: [
      'Klassische Konditionierung: Negative traumatische Vorerfahrungen bei früheren Klinikaufenthalten',
      'Modelllernen: Beobachtung von panischen oder stöhnenden Mitpatienten im Vorbereitungsraum',
      'Instruktionslernen: Unbedachte ärztliche oder pflegerische Fachbegriffe und Horrorgeschichten aus dem Internet',
      'Evolutionäre Disposition: Angeborene Ängste vor Dunkelheit, Kontrollverlust und motorischer Lähmung'
    ],
    clinicalTip: 'Trennen Sie ängstliche Patienten im Vorbereitungsraum räumlich und akustisch von Notfallpatienten ab.',
    reference: 'Psychologie der Angst & Pflegeforschung',
    storageKey: 'gpfa_m2_unlocked_nuggets',
    nuggetMatchId: 'nugget_entstehung'
  },
  {
    id: 'm2_nugget_physiologie',
    moduleIndex: 2,
    moduleName: 'Modul 2: Angst vor der OP',
    moduleShort: 'Modul 2 (DS 3 & 4)',
    stationOrDs: 'DS 3 • Autonomes Nervensystem',
    title: 'Physiologie des Autonomen Nervensystems (Sympathikus vs. Parasympathikus)',
    category: 'Neurovegetative Steuerung',
    summary: 'Starke präoperative Angst triggert eine sympathische Alarmreaktion (Fight/Flight) oder eine parasympathische Schockstarre (Freeze mit Bradykardie und Synkope).',
    corePoints: [
      'Sympathikus-Aktivierung: Tachykardie (>100 bpm), Hypertonie, Tachypnoe, Pupillenerweiterung (Mydriasis)',
      'Parasympathische Reaktion: Schwindel, plötzlicher Blutdruckabfall, Bradykardie, Übelkeit und vasovagale Synkope',
      'Gefahr für die Narkose: Erhöhter Narkosemittelbedarf bei sympathischer Übererregung',
      'Postoperative Folgen: Höherer Schmerzmittelverbrauch und schlechtere Wundheilung bei chronischem Stress'
    ],
    clinicalTip: 'Beruhigende Atmung (längeres Ausatmen als Einatmen) aktiviert den Nervus vagus und senkt den Puls rasch.',
    reference: 'Anästhesiologie & Vegetative Physiologie',
    storageKey: 'gpfa_m2_unlocked_nuggets',
    nuggetMatchId: 'nugget_physiologie'
  },
  {
    id: 'm2_nugget_kaskade',
    moduleIndex: 2,
    moduleName: 'Modul 2: Angst vor der OP',
    moduleShort: 'Modul 2 (DS 3 & 4)',
    stationOrDs: 'DS 3 • Hirnforschung',
    title: 'Die Neurobiologische Angstkaskade & Stressachse',
    category: 'Neurobiologie',
    summary: 'Sensorische Eindrücke (OP-Gerüche, Instrumentengeklirr) gelangen über den Thalamus direkt zur Amygdala. Die Hypophysen-Nebennierenrinden-Achse schüttet Cortisol und Adrenalin aus.',
    corePoints: [
      'Thalamus: Schnelle Reizfilterung leitet Signale ohne kortikale Zensur an die Amygdala',
      'Amygdala: Das Gefahrenzentrum stuft den Reiz emotional ein und sendet Alarm',
      'Hypothalamus: Aktiviert das vegetative Nervensystem und die Hormonausschüttung',
      'Nebennieren: Sofortige Freisetzung von Adrenalin/Noradrenalin und verzögert Cortisol'
    ],
    clinicalTip: 'Reizabschirmung (Noise-Cancelling-Kopfhörer, ruhiges Zimmer) stoppt die Amygdala-Befeuerung präoperativ wirksam.',
    reference: 'Neurowissenschaften & Klinische Pflege',
    storageKey: 'gpfa_m2_unlocked_nuggets',
    nuggetMatchId: 'nugget_kaskade'
  },
  {
    id: 'm2_nugget_kommunikation',
    moduleIndex: 2,
    moduleName: 'Modul 2: Angst vor der OP',
    moduleShort: 'Modul 2 (DS 3 & 4)',
    stationOrDs: 'DS 4 • Gesprächsführung',
    title: 'Pflegerische Gesprächsführung & Validierung präoperativer Ängste',
    category: 'Pflegerische Kommunikation',
    summary: 'Bagatellisierungen („Ist doch nur ein kleiner Schnitt“) verstärken die Angst. Gezielte Validierung, aktives Zuhören und Transparenz dämpfen die Stressachse spürbar.',
    corePoints: [
      'No-Go Bagatellisierung: „Haben Sie keine Angst, da ist noch nie was passiert“ lässt Patienten allein',
      'Validierende Ansprache: „Ich sehe, wie sehr Sie das beschäftigt. Es ist völlig verständlich, vor einer OP nervös zu sein.“',
      'Transparenz & Orientierung: Den Ablauf Schritt für Schritt erklären, sodass keine bösen Überraschungen drohen',
      'Kontrolle zurückgeben: Patienten aktiv in Vorbereitungen einbinden und Stoppsignale vereinbaren'
    ],
    clinicalTip: 'Bleiben Sie während des Gesprächs auf Augenhöhe und vermeiden Sie Hektik beim Betreten des Patientenzimmers.',
    reference: 'Kommunikation in der Pflege & I Care',
    storageKey: 'gpfa_m2_unlocked_nuggets',
    nuggetMatchId: 'nugget_kommunikation'
  },
  {
    id: 'm2_nugget_notfallkoffer',
    moduleIndex: 2,
    moduleName: 'Modul 2: Angst vor der OP',
    moduleShort: 'Modul 2 (DS 3 & 4)',
    stationOrDs: 'DS 4 • Interventionen',
    title: 'Der Digitale PFA-Notfallkoffer bei Panik & Akutangst',
    category: 'Pflegerische Akutinterventionen',
    summary: 'Nicht-medikamentöse Maßnahmen (Wärmedecken, PMR, 4-7-8 Atemtechnik) und die sichere Verabreichung der ärztlich verordneten Prämedikation lindern akute Zustände schnell.',
    corePoints: [
      'Wärmedecken (WarmTouch): Körperwärme signalisiert dem Gehirn Sicherheit und verhindert präoperatives Shivering',
      'Atemtechnik (4-7-8): 4 Sek. einatmen, 7 Sek. halten, 8 Sek. langsam durch die Lippenbremse ausatmen',
      'Progressive Muskelrelaxation (PMR nach Jacobson): Gezieltes Anspannen und Loslassen der Fuß- und Handmuskeln',
      'Prämedikation (Benzodiazepine wie Midazolam): Ca. 30–45 Min vor OP verabreichen; danach strikte Sturzprophylaxe'
    ],
    clinicalTip: 'Nach Einnahme der Prämedikation darf der Patient das Bett nicht mehr alleine verlassen (Sturzgefahr durch Sedierung)!',
    reference: 'Pflege Heute & Anästhesiologische Standards',
    storageKey: 'gpfa_m2_unlocked_nuggets',
    nuggetMatchId: 'nugget_notfallkoffer'
  },

  // ================= MODUL 3 =================
  {
    id: 'm3_nugget_einteilung',
    moduleIndex: 3,
    moduleName: 'Modul 3: Präoperative Pflege',
    moduleShort: 'Modul 3 (DS 5 & 6)',
    stationOrDs: 'Station 1 • OP-Dringlichkeit',
    title: 'Einteilung von Operationen nach Dringlichkeitsstufen',
    category: 'Organisatorische Grundlagen',
    summary: 'Operationen werden in Notfalleingriffe (sofort ohne Aufschub), dringliche Eingriffe (binnen Stunden/Tagen) und elektive Wahleingriffe eingeteilt.',
    corePoints: [
      'Notfall-OP (Soforteingriff): Lebensgefahr (z. B. Perforation, Massivblutung) -> Nüchternheit wird nachrangig behandelt',
      'Dringliche OP: Durchführung innerhalb 24–72 Stunden (z. B. akute Cholezystitis vor Organperforation)',
      'Elektive OP: Geplanter Wahleingriff mit vollständiger ambulanter und stationärer Vorbereitung',
      'Aufklärungspflicht: Bei elektiven OPs muss die Aufklärung mindestens 24 h vor dem Eingriff erfolgen'
    ],
    clinicalTip: 'Die Aufklärung ist eine nicht-delegierbare ärztliche Pflicht. Die PFA prüft nur die Vollständigkeit der Unterschriften.',
    reference: 'I Care Pflege S. 794 & BGB Patientenrechtegesetz',
    storageKey: 'gpfa_m3_unlocked_nuggets',
    nuggetMatchId: '0'
  },
  {
    id: 'm3_nugget_praehab',
    moduleIndex: 3,
    moduleName: 'Modul 3: Präoperative Pflege',
    moduleShort: 'Modul 3 (DS 5 & 6)',
    stationOrDs: 'Station 2 • Prähabilitation',
    title: 'Prähabilitation: Postoperative Fähigkeiten vorab üben',
    category: 'Patientenedukation',
    summary: 'Techniken wie das En-bloc-Aufstehen, der Umgang mit Atemtrainern und das Gehen mit Hilfsmitteln müssen vor der OP erlernt werden, solange der Patient schmerzfrei ist.',
    corePoints: [
      'Atemtraining (Voldyne / Triflo): Schult tiefe Bauchatmung und verhindert postoperative Atelektasen',
      'En-bloc-Aufstehen: Drehen auf die Seite mit angewinkelten Knien schont die Bauchdecke nach Laparoskopie',
      'Schmerzpumpen-Schulung (PCA): Patient lernt die selbstbestimmte Steuerung vor Narkosebeginn',
      'Hilfsmittelanpassung: Unterarmgehstützen oder Toilettensitzerhöhung werden vorab vermessen'
    ],
    clinicalTip: 'Wer die Bauchdeckenentlastung vor der OP trainiert, hat postoperativ signifikant weniger Schmerzen beim ersten Aufstehen.',
    reference: 'CNE Präoperative Schulung & I Care',
    storageKey: 'gpfa_m3_unlocked_nuggets',
    nuggetMatchId: '1'
  },
  {
    id: 'm3_nugget_nuechtern',
    moduleIndex: 3,
    moduleName: 'Modul 3: Präoperative Pflege',
    moduleShort: 'Modul 3 (DS 5 & 6)',
    stationOrDs: 'Station 3 • Nüchternheit',
    title: 'Nüchternheitsregeln & Aspirationsprophylaxe',
    category: 'Patientensicherheit',
    summary: 'Moderne Leitlinien fordern 6 Stunden Karenz für feste Nahrung und Milchprodukte, erlauben aber klare Flüssigkeiten bis 2 Stunden vor Narkosebeginn.',
    corePoints: [
      'Feste Nahrung & Milch: Mindestens 6 Stunden vor Narkoseeinleitung tabu',
      'Klare Flüssigkeiten (Wasser, Tee ohne Milch): Bis 2 Stunden vor Narkosebeginn ausdrücklich erlaubt (senkt Durst & Angst)',
      'Säuglingsnahrung: 4 Stunden vor OP bei Flaschennahrung / Muttermilch',
      'Mendelson-Syndrom: Aspiration von saurem Magensaft (pH < 2,5) führt zu chemischer Pneumonitis'
    ],
    clinicalTip: 'Kaugummi kauen und Rauchen regen die Magensaftsekretion an und müssen am OP-Morgen unterlassen werden!',
    reference: 'DGAI-Leitlinie Präoperative Nüchternheit',
    storageKey: 'gpfa_m3_unlocked_nuggets',
    nuggetMatchId: '2'
  },
  {
    id: 'm3_nugget_abfuehren',
    moduleIndex: 3,
    moduleName: 'Modul 3: Präoperative Pflege',
    moduleShort: 'Modul 3 (DS 5 & 6)',
    stationOrDs: 'Station 4 • Darmvorbereitung',
    title: 'Präoperatives Abführen: Evidenz vs. Mythos',
    category: 'Pflegestandards',
    summary: 'Routinemäßiges radikales Abführen vor Bauch-OPs ist heute obsolet. Es schwächt den Kreislauf und verzögert die Rückkehr der Darmperistaltik.',
    corePoints: [
      'Keine Routine-Laxanzien: Bei Cholezystektomie reicht eine spontane Darmentleerung meist völlig aus',
      'Gefahr der Dehydratation: Starkes Abführen entzieht Elektrolyte und begünstigt Narkose-Hypotonien',
      'Indikation: Nur bei direkten Eingriffen am Dickdarm (Kolonchirurgie) oder schweren chronischen Obstipationen',
      'Schonende Entleerung: Falls verordnet, genügen kleine Klistiere (z. B. Freka-Clyss) am Vorabend'
    ],
    clinicalTip: 'Fragen Sie nach dem letzten Stuhlgang und dokumentieren Sie diesen in der Kurve, statt unreflektiert abzuführen.',
    reference: 'ERAS-Leitlinien & I Care Pflege S. 797',
    storageKey: 'gpfa_m3_unlocked_nuggets',
    nuggetMatchId: '3'
  },
  {
    id: 'm3_nugget_hautpflege',
    moduleIndex: 3,
    moduleName: 'Modul 3: Präoperative Pflege',
    moduleShort: 'Modul 3 (DS 5 & 6)',
    stationOrDs: 'Station 5 • Infektionsprophylaxe',
    title: 'Hautantiseptik, Schmuck & Haarkürzung (Clipper)',
    category: 'Hygiene & Infektionsprävention',
    summary: 'Rasieren mit Klingen führt zu Mikroläsionen, die sich infizieren. Haare im OP-Gebiet werden ausschließlich mit elektrischen Einmal-Clippern unmittelbar vor dem Eingriff gekürzt.',
    corePoints: [
      'Clippen statt Rasieren: Elektrisches Kürzen auf 1 mm verhindert Mikrotraumata der Hautbarriere',
      'Antiseptische Ganzkörperwaschung: Vorabend oder OP-Morgen zur Reduktion von MRSA und Hautkeimen',
      'Schmuck & Piercings: Müssen zwingend entfernt werden (Verbrennungsgefahr durch elektrochirurgischen Strom)',
      'Nagellack & Make-up: Entfernen, um Pulsoxymetrie und visuelle Zyanosebeobachtung nicht zu behindern'
    ],
    clinicalTip: 'Zahnprothesen vor Transport in die Schleuse entfernen und nass in der beschrifteten Prothesendose lagern (Erstickungsgefahr bei Intubation).',
    reference: 'KRINKO-Empfehlungen zur Prävention postoperativer Wundinfektionen',
    storageKey: 'gpfa_m3_unlocked_nuggets',
    nuggetMatchId: '4'
  },
  {
    id: 'm3_nugget_praemed',
    moduleIndex: 3,
    moduleName: 'Modul 3: Präoperative Pflege',
    moduleShort: 'Modul 3 (DS 5 & 6)',
    stationOrDs: 'Station 6 • Medikation',
    title: 'Prämedikation, Dauermedikation & Patientensicherheit',
    category: 'Pharmakotherapie & Sicherheit',
    summary: 'Die Anästhesie legt fest, welche Dauermedikamente (z. B. Betablocker) morgens mit einem Schluck Wasser eingenommen werden und welche (z. B. Antidiabetika/Blutverdünner) pausieren müssen.',
    corePoints: [
      'Herz-Kreislauf-Medikamente: Werden oft morgens mit 20 ml Wasser eingenommen (z. B. Betablocker, Antihypertensiva)',
      'Antidiabetika & Insulin: Bei Nüchternheit meist pausieren oder reduzieren (Hypoglykämiegefahr)',
      'Antikoagulanzien (NOAKs, Heparin, Marcumar): Müssen nach striktem anästhesiologischem Zeitplan pausiert werden',
      'Prämedikation: Verordneter angstlösender Tranquilizer (z. B. Midazolam) ca. 45 Min vor OP-Abruf'
    ],
    clinicalTip: 'Nach Verabreichung der Prämedikation Bettgitter nach Aufklärung sichern – Patient darf wegen Schwindel nicht mehr aufstehen.',
    reference: 'I Care Pflege & Arzneimittelsicherheit im OP',
    storageKey: 'gpfa_m3_unlocked_nuggets',
    nuggetMatchId: '5'
  },
  {
    id: 'm3_nugget_checklist',
    moduleIndex: 3,
    moduleName: 'Modul 3: Präoperative Pflege',
    moduleShort: 'Modul 3 (DS 5 & 6)',
    stationOrDs: 'Station 7 • Checkliste',
    title: 'Die Präoperative Sicherheits-Checkliste & OP-Schleusenübergabe',
    category: 'Patientensicherheit & Qualitätsmanagement',
    summary: 'Vor dem Verlassen der Bettenstation muss die Sicherheits-Checkliste Punkt für Punkt abgearbeitet und gegengezeichnet werden (Identität, Nüchternheit, Akte, OP-Hemd).',
    corePoints: [
      'Patienten-Identifikationsband: Am Handgelenk auf Lesbarkeit und Name/Geburtsdatum prüfen',
      'Vollständige Akte: Einwilligungserklärung, Anästhesieprotokoll, Laborwerte, EKG und Kurve beifügen',
      'Körperliche Vorbereitung: OP-Hemd angezogen, Unterwäsche entfernt, Blase entleert, Wertsachen verwahrt',
      'Übergabe an der Schleuse: Strukturierter Abgleich von Identität, OP-Art, Nüchternheit und Allergien'
    ],
    clinicalTip: 'Kein Patient wird ohne unterschriebene OP- und Narkoseeinwilligung in die Schleuse transportiert!',
    reference: 'WHO Surgical Safety Checklist & I Care',
    storageKey: 'gpfa_m3_unlocked_nuggets',
    nuggetMatchId: '6'
  },

  // ================= MODUL 4 =================
  {
    id: 'm4_nugget_1',
    moduleIndex: 4,
    moduleName: 'Modul 4: Postoperative Pflege & AWR',
    moduleShort: 'Modul 4 (DS 7 & 8)',
    stationOrDs: 'Schritt 5 • Station 1',
    title: 'Definition & Zeitrahmen der postoperativen Pflege',
    category: 'Grundlagen',
    summary: 'Unter postoperativer Pflege versteht man alle pflegerischen Tätigkeiten nach einer Operation. Sie beginnt mit der Narkoseausleitung im OP-Saal und reicht über den Aufwachraum bis zur Genesung auf der Normalstation.',
    corePoints: [
      'Beginn: Unmittelbar mit Beendigung der Narkose und des chirurgischen Eingriffs',
      'Etappen: AWR (1–2 h) -> Verlegung Normalstation -> Entlassmanagement',
      'Hauptziel: Wiederherstellung der Vitalstabilität, Schmerzfreiheit und Komplikationsprävention'
    ],
    clinicalTip: 'Die ersten zwei Stunden nach der Narkose bergen das höchste Risiko für Atemdepression und Kreislaufabfall.',
    reference: 'I Care Pflege S. 809 (Kapitel 39.4)',
    storageKey: 'gpfa_m4_unlocked_nuggets',
    nuggetMatchId: 'nugget_1'
  },
  {
    id: 'm4_nugget_2',
    moduleIndex: 4,
    moduleName: 'Modul 4: Postoperative Pflege & AWR',
    moduleShort: 'Modul 4 (DS 7 & 8)',
    stationOrDs: 'Schritt 5 • Station 2',
    title: 'Der Aufwachraum (AWR / PACU): Struktur & Ausstattung',
    category: 'Versorgungsstufen',
    summary: 'Der Aufwachraum dient der lückenlosen Überwachung von Vitalfunktionen, Schutzreflexen und Schmerzen unmittelbar nach Allgemein- oder Regionalanästhesie.',
    corePoints: [
      'Spezialbereich in direkter räumlicher Nähe zum OP-Trakt',
      'Vollausstattung: Pulsoxymetrie, EKG, NIBP, Sauerstoff, Absaugung und Notfallmedikamente',
      'Betreuungsschlüssel: Höherer Personalschlüssel durch anästhesiologisch geschulte Pflegekräfte'
    ],
    clinicalTip: 'Erst wenn Schutzreflexe (Schlucken, Husten) vollständig vorhanden sind, sinkt das Aspirationsrisiko.',
    reference: 'I Care Pflege S. 809',
    storageKey: 'gpfa_m4_unlocked_nuggets',
    nuggetMatchId: 'nugget_2'
  },
  {
    id: 'm4_nugget_3',
    moduleIndex: 4,
    moduleName: 'Modul 4: Postoperative Pflege & AWR',
    moduleShort: 'Modul 4 (DS 7 & 8)',
    stationOrDs: 'Schritt 5 • Station 3',
    title: 'Verweildauer & Zeitmanagement im Aufwachraum',
    category: 'Prozessorganisation',
    summary: 'Die Verweildauer beträgt nach unkomplizierten Standardeingriffen meist 1 bis 2 Stunden. Sie richtet sich strikt nach dem klinischen Zustand und standardisierten Scores.',
    corePoints: [
      'Regulär 60 bis 120 Minuten bei stabilen Patienten',
      'Verlängerung bei PONV, Hypothermie (<36,0 °C), Schmerzen (NRS > 3) oder Kreislaufinstabilität',
      'Freigabe: Erfordert ärztliche Visite und Erreichen des Entlass-Scores (z. B. Aldrete-Score ≥ 9)'
    ],
    clinicalTip: 'Niemals einen Patienten überstürzt auf Station verlegen, nur um Platz für den nächsten OP-Saal zu schaffen!',
    reference: 'I Care Pflege S. 809 & CNE S. 2',
    storageKey: 'gpfa_m4_unlocked_nuggets',
    nuggetMatchId: 'nugget_3'
  },
  {
    id: 'm4_nugget_4',
    moduleIndex: 4,
    moduleName: 'Modul 4: Postoperative Pflege & AWR',
    moduleShort: 'Modul 4 (DS 7 & 8)',
    stationOrDs: 'Schritt 5 • Station 4',
    title: 'Verlegungsstufen: Normalstation, IMC oder Intensivstation',
    category: 'Versorgungsstufen',
    summary: 'Je nach Schweregrad der OP und kardiopulmonalen Vorerkrankungen erfolgt die Verlegung auf Normalstation, Intermediate Care (IMC) oder Intensivstation.',
    corePoints: [
      'Normalstation: Stabile Patienten mit regelrechtem Bewusstsein und komplikationsloser OP',
      'IMC (Intermediate Care): Engmaschiges kontinuierliches Monitoring bei schweren Begleiterkrankungen',
      'Intensivstation: Notwendigkeit von Beatmung, Katecholaminen oder bei akuten Komplikationen'
    ],
    clinicalTip: 'Die Verlegungsentscheidung treffen Anästhesist und Operateur gemeinsam mit der AWR-Pflege.',
    reference: 'I Care Pflege S. 809',
    storageKey: 'gpfa_m4_unlocked_nuggets',
    nuggetMatchId: 'nugget_4'
  },
  {
    id: 'm4_nugget_5',
    moduleIndex: 4,
    moduleName: 'Modul 4: Postoperative Pflege & AWR',
    moduleShort: 'Modul 4 (DS 7 & 8)',
    stationOrDs: 'Schritt 5 • Station 5',
    title: 'Die 4 Säulen der AWR-Überwachung',
    category: 'Klinische Überwachung',
    summary: 'Im AWR stehen vier Bereiche im Fokus: Vigilanz (Reflexe), Vitalfunktionen (RR, Puls, SpO2, AF), Schmerztherapie (NRS) und Wund-/Drainagenkontrolle.',
    corePoints: [
      'Vigilanz: Weckbarkeit, Orientierung zu Person und Raum, Pupillenreaktion',
      'Atmung: Atemfrequenz, Atemmechanik, Sauerstoffsättigung (SpO2 > 95%)',
      'Kreislauf: Blutdruck, Herzfrequenz, Hautkolorit und Rekapillarisierungszeit',
      'Wunde & Drainagen: Verbandskontrolle auf Durchblutung und Sekretverlust'
    ],
    clinicalTip: 'Schläfrige Patienten neigen zu Zungengrundobstruktion (Schnarchen) – Kopf überstrecken oder Esmarch-Handgriff anwenden!',
    reference: 'I Care Pflege S. 809',
    storageKey: 'gpfa_m4_unlocked_nuggets',
    nuggetMatchId: 'nugget_5'
  },
  {
    id: 'm4_nugget_6',
    moduleIndex: 4,
    moduleName: 'Modul 4: Postoperative Pflege & AWR',
    moduleShort: 'Modul 4 (DS 7 & 8)',
    stationOrDs: 'Schritt 5 • Station 6',
    title: 'Transport- & Abholstandards: Schnittstelle AWR -> Station',
    category: 'Patientensicherheit',
    summary: 'Die Abholung erfolgt immer durch qualifiziertes Pflegepersonal. Während des Transports im Fahrstuhl müssen Notfallausstattung und Begleitung gewährleistet sein.',
    corePoints: [
      'Mindestens eine Pflegefachperson holt die Patientin im AWR ab',
      'Kurve, AWR-Verlaufsprotokoll und Medikamentenanordnung vor Abfahrt prüfen',
      'Lagerung: Flach oder leicht erhöht, Infusionen gesichert, Drainagen unter Bettniveau',
      'Fahrstuhltransport: Nie allein lassen; Notfallklingel kennen'
    ],
    clinicalTip: 'Bei Schwindel im Fahrstuhl sofort Bett flach stellen und Beine hochlagern (Autotransfusion).',
    reference: 'I Care Pflege S. 810',
    storageKey: 'gpfa_m4_unlocked_nuggets',
    nuggetMatchId: 'nugget_6'
  },
  {
    id: 'm4_nugget_7',
    moduleIndex: 4,
    moduleName: 'Modul 4: Postoperative Pflege & AWR',
    moduleShort: 'Modul 4 (DS 7 & 8)',
    stationOrDs: 'Schritt 5 • Station 7',
    title: 'Das Postaggressionssyndrom: Stressstoffwechsel nach Narkose',
    category: 'Pathophysiologie',
    summary: 'Der chirurgische Gewebereiz löst eine neuroendokrine Stressantwort aus: Katabolismus, Blutzuckeranstieg, Flüssigkeitsretention und Tachykardie prägen die ersten Tage.',
    corePoints: [
      'Hormonausschüttung: Cortisol, Adrenalin und Glukagon steigen an -> postoperativer Stressdiabetes',
      'Aldosteron & ADH: Führen zur Wasser- und Natriumretention (Oligurie in den ersten 24 h)',
      'Proteinabbau: Gesteigerter Eiweißabbau zur Wundheilung erfordert baldigen Kostaufbau',
      'Symptome: Leichte Tachykardie, subfebrile Temperatur (Resorptionsfieber bis 38,0 °C)'
    ],
    clinicalTip: 'Resorptionsfieber am 1.–2. Tag ist physiologisch. Erst Fieber ab dem 3. Tag deutet auf Wund- oder Lungeninfekte hin!',
    reference: 'I Care Pflege S. 811 (Abb. 39.9)',
    storageKey: 'gpfa_m4_unlocked_nuggets',
    nuggetMatchId: 'nugget_7'
  },
  {
    id: 'm4_nugget_8',
    moduleIndex: 4,
    moduleName: 'Modul 4: Postoperative Pflege & AWR',
    moduleShort: 'Modul 4 (DS 7 & 8)',
    stationOrDs: 'Schritt 5 • Station 8',
    title: 'Atemwegsmanagement & Obstruktionen im AWR',
    category: 'Notfallmanagement',
    summary: 'Narkoseüberhänge führen zu Muskelrelaxierung des Zungengrunds. Schnarchende Atemgeräusche erfordern sofortiges Handeln zur Abwendung von Hypoxie.',
    corePoints: [
      'Gefahr: Zurücksinken der Zunge verlegt den Hypopharynx',
      'Erste Maßnahme: Kopf sanft überstrecken und Unterkiefer nach vorne ziehen (Esmarch-Handgriff)',
      'Hilfsmittel: Wendl-Tubus (nasal) oder Guedel-Tubus (oral nur bei tief Sedierten ohne Würgereiz)',
      'Sauerstoffgabe: 2–4 l/min über Nasenbrille bei SpO2 < 94%'
    ],
    clinicalTip: 'Schnarchen nach Narkose ist kein Zeichen von Schlaf, sondern von akuter Atemwegsverlegung!',
    reference: 'I Care Pflege S. 812',
    storageKey: 'gpfa_m4_unlocked_nuggets',
    nuggetMatchId: 'nugget_8'
  },
  {
    id: 'm4_nugget_9',
    moduleIndex: 4,
    moduleName: 'Modul 4: Postoperative Pflege & AWR',
    moduleShort: 'Modul 4 (DS 7 & 8)',
    stationOrDs: 'Schritt 5 • Station 9',
    title: 'Vitalparameter-Grenzwerte & Monitoring-Rhythmen',
    category: 'Klinische Überwachung',
    summary: 'Engmaschige Messintervalle (alle 15 Min. im AWR, nach Verlegung alle 2–4 h) sichern das rechtzeitige Erkennen von Nachblutungen und Hypoxien.',
    corePoints: [
      'Blutdruck: Abfall um >20% des Ausgangswerts oder RR systolisch < 90 mmHg erfordert ärztliche Meldung',
      'Puls: Tachykardie (>100 bpm) ist oft das erste Zeichen von Schmerz, Hypovolämie oder Blutung',
      'Atemfrequenz: AF < 8/min zeigt Opiatüberhang; AF > 25/min deutet auf Schmerz oder Atelektasen',
      'Temperatur: Hypothermie (<36,0 °C) erhöht Wundinfektionsrate und verstärkt Nachblutungen'
    ],
    clinicalTip: 'Vor der Gabe von Metamizol immer Blutdruck prüfen – Metamizol i.v. kann rasche Blutdruckabfälle verursachen!',
    reference: 'I Care Pflege S. 812–813',
    storageKey: 'gpfa_m4_unlocked_nuggets',
    nuggetMatchId: 'nugget_9'
  },
  {
    id: 'm4_nugget_10',
    moduleIndex: 4,
    moduleName: 'Modul 4: Postoperative Pflege & AWR',
    moduleShort: 'Modul 4 (DS 7 & 8)',
    stationOrDs: 'Schritt 5 • Station 10',
    title: 'Akute Schmerztherapie & NRS-Assessment',
    category: 'Schmerzmanagement',
    summary: 'Schmerzen müssen nach standardisierter Skala (NRS 0–10) erfasst und leitliniengerecht behandelt werden. Schmerzfreiheit ist Voraussetzung für Frühmobilisation und tiefe Atmung.',
    corePoints: [
      'Interventionsgrenze: Bei NRS > 3 in Ruhe oder > 4 bei Bewegung wird Bedarfsmedikation gegeben',
      'Stufenschema: Kombination aus Nicht-Opioiden (z. B. Metamizol, Paracetamol) und Opioiden (z. B. Piritramid)',
      'Wirkungskontrolle: Re-Assessment ca. 30 Minuten nach i.v.-Gabe und 60 Minuten nach oraler Gabe',
      'Schmerzspitzen vorbeugen: Frühzeitige Gabe vor Transfers oder Verbandswechseln'
    ],
    clinicalTip: 'Unzureichende Schmerztherapie führt zu Schonatmung, Pneumonien und chronischen Schmerzsyndromen.',
    reference: 'S3-Leitlinie Behandlung akuter perioperativer Schmerzen & I Care',
    storageKey: 'gpfa_m4_unlocked_nuggets',
    nuggetMatchId: 'nugget_10'
  },
  {
    id: 'm4_nugget_11',
    moduleIndex: 4,
    moduleName: 'Modul 4: Postoperative Pflege & AWR',
    moduleShort: 'Modul 4 (DS 7 & 8)',
    stationOrDs: 'Schritt 5 • Station 11',
    title: 'Frühmobilisation & Positionierung nach Bauchchirurgie',
    category: 'Pflegepraxis & Mobilisation',
    summary: 'Nach laparoskopischer Cholezystektomie entspannt eine 30°-Oberkörper-Hochpositionierung mit Knierolle die Bauchdecke. Eine Frühmobilisation an die Bettkante regt Darm und Kreislauf an.',
    corePoints: [
      'Bauchdeckenentspannung: 30° Oberkörper hoch + Knierolle (Fowler-Position) senkt Zug auf OP-Wunden',
      'Mobilisation: Am OP-Tag schrittweise über die Seite (En-bloc) an die Bettkante mobilisieren',
      'Dekubitusprophylaxe: Druckentlastung der Fersen und des Kreuzbeins durch regelmäßige Positionswechsel',
      'Kreislaufsicherung: Vor dem Aufstehen Vitalwerte messen und Beine im Bett kreisen lassen'
    ],
    clinicalTip: 'Bei laparoskopischen OPs klagen Patienten oft über Schulterschmerzen durch verbliebenes CO2-Gas – Oberkörperhochlagerung entlastet!',
    reference: 'I Care Pflege S. 813 & Expertenstandard Dekubitus',
    storageKey: 'gpfa_m4_unlocked_nuggets',
    nuggetMatchId: 'nugget_11'
  },
  {
    id: 'm4_nugget_12',
    moduleIndex: 4,
    moduleName: 'Modul 4: Postoperative Pflege & AWR',
    moduleShort: 'Modul 4 (DS 7 & 8)',
    stationOrDs: 'Schritt 5 • Station 12',
    title: 'Wundkontrolle, Verbandswechsel & Drainagenmanagement',
    category: 'Wundmanagement',
    summary: 'Verbände werden engmaschig auf Durchblutung, Nachblutung und Sekretbildung inspiziert. Drainagen müssen stets unter Wundniveau hängen und auf Fördermenge kontrolliert werden.',
    corePoints: [
      'Erster Verband: Bleibt in der Regel 24–48 h steril geschlossen, sofern er trocken ist',
      'Durchbluteter Verband: Nicht sofort abreißen, sondern steril überverbinden und Arzt informieren',
      'Drainagen (z. B. Easy-Flow / Redon): Fördermenge, Farbe (serös, hämorrhagisch, biliär) dokumentieren',
      'Verdacht Biliom: Gallefarbene Sekretion aus der Wunddrainage erfordert sofortigen Operateur-Notruf'
    ],
    clinicalTip: 'Drainagenbeutel niemals über Wundniveau anheben, um Reflux von Wundsekret und Keimen zu verhindern!',
    reference: 'I Care Pflege S. 814',
    storageKey: 'gpfa_m4_unlocked_nuggets',
    nuggetMatchId: 'nugget_12'
  },
  {
    id: 'm4_nugget_13',
    moduleIndex: 4,
    moduleName: 'Modul 4: Postoperative Pflege & AWR',
    moduleShort: 'Modul 4 (DS 7 & 8)',
    stationOrDs: 'Schritt 5 • Station 13',
    title: 'Häufige postoperative Komplikationen: PONV, Blutung & Infekt',
    category: 'Komplikationsmanagement',
    summary: 'Postoperative Nausea and Vomiting (PONV), Nachblutungen, reflektorischer Harnverhalt und Wundinfektionen sind die Hauptkomplikationen nach Cholezystektomien.',
    corePoints: [
      'PONV: Übelkeit und Erbrechen belasten die frische Bauchdecke (Gabe von Antiemetika wie Ondansetron)',
      'Nachblutung: Blässe, Tachykardie, Blutdruckabfall und harter Bauch als Leitsymptome',
      'Harnverhalt: Reflektorische Spasmen des Blasensphinkters nach Narkose und Opioiden',
      'Resorptionsfieber vs. Infektion: Fieber ab Tag 3 weist auf Wund-, Lungen- oder Harnwegsinfekt hin'
    ],
    clinicalTip: 'Bei Erbrechen Patientin sofort auf die Seite drehen oder Kopf zur Seite halten (Aspirationsschutz)!',
    reference: 'I Care Pflege S. 814–815',
    storageKey: 'gpfa_m4_unlocked_nuggets',
    nuggetMatchId: 'nugget_13'
  },
  {
    id: 'm4_nugget_14',
    moduleIndex: 4,
    moduleName: 'Modul 4: Postoperative Pflege & AWR',
    moduleShort: 'Modul 4 (DS 7 & 8)',
    stationOrDs: 'Schritt 5 • Station 14',
    title: 'Standardisierte Beobachtungskategorien nach I Care (Abb. 39.8)',
    category: 'Klinische Standards',
    summary: 'Die postoperative Pflege stützt sich auf strukturierte Kategorien: Postaggressionssyndrom, Kreislauf & Atmung, Wunde & Drainagen, Temperatur sowie Flüssigkeitshaushalt.',
    corePoints: [
      'Kategorie 1: Postaggressionssyndrom (Stressstoffwechsel, Blutzucker, Tachykardie)',
      'Kategorie 2: Kreislauf & Atmung (RR, Puls, Hypoxiezeichen, Atemmuster)',
      'Kategorie 3: Wundverband & Drainagen (Sekretfarbe, Fördermenge, Nachblutung)',
      'Kategorie 4: Körpertemperatur (Resorptionsfieber vs. septischer Temperaturanstieg)',
      'Kategorie 5: Flüssigkeitshaushalt & Ausscheidung (Infusionen, Diurese, Miktion)'
    ],
    clinicalTip: 'Die Kategorien strukturieren jede Übergabe und verhindern das Übersehen kritischer Details.',
    reference: 'I Care Pflege S. 811 (Abb. 39.8)',
    storageKey: 'gpfa_m4_unlocked_nuggets',
    nuggetMatchId: 'nugget_14'
  },
  {
    id: 'm4_nugget_15',
    moduleIndex: 4,
    moduleName: 'Modul 4: Postoperative Pflege & AWR',
    moduleShort: 'Modul 4 (DS 7 & 8)',
    stationOrDs: 'Schritt 5 • Station 15',
    title: 'Infusionsmanagement & Vorbereitung von Schwerkraftinfusionen',
    category: 'Pflegetechnik',
    summary: 'Flüssigkeitsausgleich ist postoperativ essenziell. Beim Richten einer Schwerkraftinfusion müssen Tropfkammerfüllung, vollständige Entlüftung und Aseptik beachtet werden.',
    corePoints: [
      'Tropfkammer zu 1/3 bis 1/2 füllen, um Tropfenrate optisch kontrollieren zu können',
      'Infusionsleitung vollständig luftblasenfrei entlüften (Prävention von Luftembolien)',
      'Rollklemme vor Einstechen in den Beutel schließen',
      'Aseptischer Umgang mit Zuspritzports und sterile Abdeckung des Luer-Lock-Konnektors'
    ],
    clinicalTip: 'Laufende Infusionen bei Verlegung stets abstöpseln oder an einem mobilen Infusionsständer sicher fixieren.',
    reference: 'I Care Pflege S. 815 & Pflegestandards',
    storageKey: 'gpfa_m4_unlocked_nuggets',
    nuggetMatchId: 'nugget_15'
  },
  {
    id: 'm4_nugget_16',
    moduleIndex: 4,
    moduleName: 'Modul 4: Postoperative Pflege & AWR',
    moduleShort: 'Modul 4 (DS 7 & 8)',
    stationOrDs: 'Schritt 5 • Station 16',
    title: 'Ausscheidung & Miktionsbeobachtung: Postoperativer Harnverhalt',
    category: 'Pflegepraxis',
    summary: 'Patienten sollten innerhalb von ca. 6 Stunden nach Narkoseende spontan urinieren. Bei schmerzhafter Überdehnung der Blase droht ein akuter Harnverhalt.',
    corePoints: [
      'Miktionszeitfenster: Spontanmiktion binnen 6–8 Stunden postoperativ erwarten',
      'Reflektorische Ursachen: Narkotika, Opioide, Schmerzen und ungewohnte Bettlage blockieren den Sphinkter',
      'Erste Maßnahmen: Intimsphäre wahren, Wasserhahn plätschern lassen, Mobilisation auf Toilettenstuhl',
      'Intervention: Blasenultraschall; bei Füllung > 500 ml Einmalkatheterismus nach ärztlicher Anordnung'
    ],
    clinicalTip: 'Das Bereitstellen eines Toilettenstuhls ermöglicht vielen Patienten die Miktion im Sitzen ohne weite Wege.',
    reference: 'I Care Pflege S. 815',
    storageKey: 'gpfa_m4_unlocked_nuggets',
    nuggetMatchId: 'nugget_16'
  },
  {
    id: 'm4_nugget_17',
    moduleIndex: 4,
    moduleName: 'Modul 4: Postoperative Pflege & AWR',
    moduleShort: 'Modul 4 (DS 7 & 8)',
    stationOrDs: 'Schritt 5 • Station 17',
    title: 'Pneumonie- & Thromboseprophylaxe postoperativ',
    category: 'Prophylaxen',
    summary: 'Schonatmung und Immobilität begünstigen Atelektasen und Beinvenenthrombosen. Atemübungen, Antikoagulation und medizinische Kompressionsstrümpfe schützen.',
    corePoints: [
      'Atemgymnastik (SMI / Atemtrainer): Fördert Belüftung der basalen Lungenabschnitte',
      'Medizinische Thrombosestrümpfe (MTPS): Werden vor OP angepasst und postoperativ getragen',
      'Niedermolekulares Heparin (NMH): Zeitgerechte subkutane Injektion nach ärztlichem Schema',
      'Frühmobilisation: Das wirksamste Mittel gegen Thrombose, Pneumonie und Obstipation'
    ],
    clinicalTip: 'Zeigen Sie der Patientin, wie sie ihre Hand sanft auf die OP-Narbe legen kann, um schmerzfrei tief einzuatmen.',
    reference: 'Expertenstandards Dekubitus/Pneumonie & I Care',
    storageKey: 'gpfa_m4_unlocked_nuggets',
    nuggetMatchId: 'nugget_17'
  },
  {
    id: 'm4_nugget_18',
    moduleIndex: 4,
    moduleName: 'Modul 4: Postoperative Pflege & AWR',
    moduleShort: 'Modul 4 (DS 7 & 8)',
    stationOrDs: 'Schritt 5 • Station 18',
    title: 'Das ISBAR-Übergabeschema: Patientensicherheit an Schnittstellen',
    category: 'Kommunikation & Patientensicherheit',
    summary: 'Strukturierte Übergaben nach dem ISBAR-Format (Identify, Situation, Background, Assessment, Recommendation) verhindern Informationsverluste zwischen OP, AWR und Station.',
    corePoints: [
      'I - Identify: Name, Alter, Zimmernummer, Bezugspflegekraft',
      'S - Situation: Durchgeführte Operation (laparoskopische Cholezystektomie) und aktueller Zustand',
      'B - Background: Vorerkrankungen, Allergien (z. B. Pflaster, Penicillin), intraoperativer Verlauf',
      'A - Assessment: Letzte Vitalwerte, Schmerzscore (NRS), Wundverband, Drainagen, Infusionen',
      'R - Recommendation: Anstehende Aufgaben (z. B. RR in 30 Min, Kostaufbau, Bedarfsmedikation)'
    ],
    clinicalTip: 'Übergaben niemals zwischen Tür und Angel machen – ungeteilte Aufmerksamkeit beider Pflegekräfte ist Pflicht.',
    reference: 'WHO Patient Safety Guidelines & ISBAR Standard',
    storageKey: 'gpfa_m4_unlocked_nuggets',
    nuggetMatchId: 'nugget_18'
  },
  {
    id: 'm4_nugget_19',
    moduleIndex: 4,
    moduleName: 'Modul 4: Postoperative Pflege & AWR',
    moduleShort: 'Modul 4 (DS 7 & 8)',
    stationOrDs: 'Schritt 5 • Station 19',
    title: 'Entlasskriterien aus dem AWR: Der Aldrete-Score',
    category: 'Qualitätsmanagement & Scores',
    summary: 'Der Aldrete-Score beurteilt Motorik, Atmung, Kreislauf, Bewusstsein und Sauerstoffsättigung. Erst ab einem Score von ≥ 9 von 10 Punkten darf verlegt werden.',
    corePoints: [
      'Aktivität / Motorik: Spontane Bewegung aller 4 Extremitäten auf Aufforderung (2 Pkt.)',
      'Atmung: Tiefe Atemzüge und kräftiges Husten möglich (2 Pkt.)',
      'Kreislauf: Blutdruck weicht weniger als 20% vom präoperativen Ausgangswert ab (2 Pkt.)',
      'Bewusstsein: Voll ansprechbar und zeitlich/örtlich orientiert (2 Pkt.)',
      'Sättigung: SpO2 > 92% bei Raumluft ohne zusätzlichen Sauerstoff (2 Pkt.)'
    ],
    clinicalTip: 'Die abschließende Verlegungsfreigabe erfolgt immer mit Unterschrift des verantwortlichen Anästhesisten.',
    reference: 'Aldrete JA: The post-anesthesia recovery score revisited & I Care',
    storageKey: 'gpfa_m4_unlocked_nuggets',
    nuggetMatchId: 'nugget_19'
  }
];
