export interface PostOpVideo {
  id: string;
  stepNumber: number;
  title: string;
  source: string;
  embedUrl: string;
  externalUrl: string;
  description: string;
  clinicalFocus: string;
  duration: string;
  isRestrictedEmbed?: boolean;
}

export interface PostOpPdfResource {
  id: string;
  title: string;
  subtitle: string;
  downloadUrl: string;
  source: string;
  pages: string;
  keyTopics: string[];
  summary: string;
}

export type QuizType = 'single_choice' | 'multiple_choice' | 'cloze' | 'ordering' | 'reflection';

export interface QuizOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface ClozePart {
  type: 'text' | 'blank';
  value: string; // text or correct answer
  options?: string[]; // for dropdown or hint
}

export interface PostOpQuiz {
  id: string;
  number: number;
  title: string;
  type: QuizType;
  question: string;
  instructions?: string;
  options?: QuizOption[];
  clozeParts?: ClozePart[];
  reflectionSolution?: string;
  reflectionKeywords?: string[];
  explanation: string;
  nuggetId: string;
  specialMedia?: {
    type: 'video' | 'tip' | 'diagram';
    title: string;
    content: string;
    videoUrl?: string;
    externalUrl?: string;
  };
}

export interface LearningNugget {
  id: string;
  number: number;
  title: string;
  category: string;
  summary: string;
  corePoints: string[];
  clinicalTip: string;
  reference: string;
}

export const postOpVideos: PostOpVideo[] = [
  {
    id: 'video_narkose',
    stepNumber: 1,
    title: 'Narkose – Das passiert nach einer OP',
    source: 'DIAKOVERE',
    embedUrl: 'https://www.youtube-nocookie.com/embed/FAZv49rHiTI',
    externalUrl: 'https://www.youtube.com/watch?v=FAZv49rHiTI',
    description: 'Frau Meinhardt wurde erfolgreich operiert und kann aus dem OP-Saal in den Aufwachraum verlegt werden. Erfahren Sie, wie das Aufwachen und die engmaschige Überwachung im AWR ablaufen.',
    clinicalFocus: 'Vigilanz-Kontrolle, Schutzreflexe, Kreislaufstabilität und AWR-Monitoring',
    duration: 'ca. 4 Min.'
  },
  {
    id: 'video_abholung',
    stepNumber: 2,
    title: 'Abholung aus dem Aufwachraum',
    source: 'Klinik-Tutorial',
    embedUrl: 'https://www.youtube-nocookie.com/embed/xUAOwQ2QNIM',
    externalUrl: 'https://www.youtube.com/watch?v=xUAOwQ2QNIM',
    description: 'Geht es der Person im Überwachsungszeitraum entsprechend gut, kann sie auf die Station zurückverlegt werden. Sehen Sie, wie die sichere Übergabe an der Schnittstelle AWR/Station erfolgt.',
    clinicalFocus: 'Übergabegespräch, Schmerzerfassung, Drainagenkontrolle, 4-Augen-Prinzip',
    duration: 'ca. 5 Min.'
  },
  {
    id: 'video_massnahmen',
    stepNumber: 3,
    title: 'Post-OP Maßnahmen auf Station',
    source: 'Pflege-Tutorial',
    embedUrl: 'https://www.youtube-nocookie.com/embed/3sQ_vJtUstk',
    externalUrl: 'https://youtu.be/3sQ_vJtUstk?si=fm08Pct6_bYyXP-n',
    description: 'Bereits bei der Abholung im Aufwachraum übernimmt das Stationsteam Anteile der postoperativen Pflege, die auf Station weiter fortgeführt wird.',
    clinicalFocus: 'Erstversorgung auf Station, Vitalzeichenmessung, Lagerung, Frühmobilisation',
    duration: 'ca. 6 Min.'
  }
];

export const postOpPdfResources: PostOpPdfResource[] = [
  {
    id: 'pdf_postop',
    title: 'I Care Pflege: Postoperative Pflege (Kapitel 39.4)',
    subtitle: 'Thieme Verlag • Fachstandard für generalistische & PFA Pflege',
    downloadUrl: 'https://elearn.zfg-ms.de/pluginfile.php/287995/mod_folder/content/0/ICare%20Pflege%20postOP%20Kapitel%20-%20Reduced.pdf?forcedownload=1',
    source: 'Thieme I Care Pflege (Kapitel 39.4, S. 809–813)',
    pages: 'S. 809 – 813',
    keyTopics: [
      'Aufgaben im Aufwachraum & Verlegungskriterien',
      'Kategorien der postoperativen Beobachtung (Postaggressionssyndrom)',
      'DMS-Kontrolle & Frühmobilisation',
      'Schmerztherapie & PCA-Pumpe',
      'Kostaufbau & Flüssigkeitshaushalt'
    ],
    summary: 'Grundlagenwerk zur postoperativen Phase: Detaillierte Kriterien zur Übernahme auf Normalstation, Komplikationsfrüherkennung (Fieber, Nachblutung, Miktionssperre) und pflegerische Interventionen.'
  },
  {
    id: 'pdf_praeop',
    title: 'I Care Pflege: Präoperative Pflege (Kapitel 39.1 – 39.3)',
    subtitle: 'Thieme Verlag • Ergänzendes Begleitkapitel',
    downloadUrl: 'https://elearn.zfg-ms.de/pluginfile.php/287995/mod_folder/content/0/ICare%20Pflege%20pr%C3%A4%20OP%20Kapitel%20-%20Reduced.pdf?forcedownload=1',
    source: 'Thieme I Care Pflege (Kapitel 39.1–39.3, S. 800–808)',
    pages: 'S. 800 – 808',
    keyTopics: [
      'Nüchternheitszeiten (2h klare Flüssigkeit, 6h feste Nahrung)',
      'Präoperative Hautreinigung & Haarentfernung',
      'Prämedikation & Patientensicherheit'
    ],
    summary: 'Wichtiges Hintergrundwissen: Der postoperative Wasser- und Elektrolythaushalt hängt maßgeblich von der korrekten präoperativen Vorbereitung ab.'
  }
];

export const postOpQuizzes: PostOpQuiz[] = [
  {
    id: 'quiz_1',
    number: 1,
    title: 'Definition: Postoperative Pflege',
    type: 'cloze',
    question: 'Füllen Sie den folgenden Lückentext zur grundlegenden Definition aus:',
    clozeParts: [
      { type: 'text', value: 'Unter dem Begriff „postoperative Pflege“ versteht man alle ' },
      { type: 'blank', value: 'pflegerischen Tätigkeiten', options: ['pflegerischen Tätigkeiten', 'ärztlichen Verordnungen', 'chirurgischen Schnitte', 'diagnostischen Befunde'] },
      { type: 'text', value: ' und Handlungen, die ' },
      { type: 'blank', value: 'nach', options: ['nach', 'während', 'vor', 'anstelle'] },
      { type: 'text', value: ' einer Operation durchgeführt werden.' }
    ],
    explanation: 'Sehr gut! Die postoperative Pflege beginnt unmittelbar nach Beendigung der OP im OP-Saal und umfasst alle pflegerischen Handlungen im Aufwachraum und auf Normalstation bis zur Genesung.',
    nuggetId: 'nugget_1'
  },
  {
    id: 'quiz_2',
    number: 2,
    title: 'Regulärer Verlegungsort nach OP',
    type: 'single_choice',
    question: 'Nach abgeschlossener und komplikationsfreier Operation wird die Person regulär wohin verlegt?',
    options: [
      { id: 'opt_station', text: 'Direkt auf die chirurgische Bettenstation', isCorrect: false },
      { id: 'opt_awr', text: 'In den Aufwachraum (AWR)', isCorrect: true },
      { id: 'opt_its', text: 'Auf die Intensivstation (ITS)', isCorrect: false },
      { id: 'opt_not', text: 'In die Notaufnahme', isCorrect: false }
    ],
    explanation: 'Richtig! Unmittelbar nach der Narkoseausleitung wird der Patient regulär in den Aufwachraum verlegt, um die Wiedererlangung des vollen Bewusstseins und stabile Vitalfunktionen zu überwachen.',
    nuggetId: 'nugget_2'
  },
  {
    id: 'quiz_3',
    number: 3,
    title: 'Gewöhnliche Verweildauer im Aufwachraum',
    type: 'single_choice',
    question: 'Wie lange dauert die gewöhnliche Verweildauer in einem Aufwachraum nach einer herkömmlichen Operation?',
    options: [
      { id: 'opt_1_2', text: '1 – 2 Stunden', isCorrect: true },
      { id: 'opt_2_3', text: '2 – 3 Stunden', isCorrect: false },
      { id: 'opt_15_4', text: '1,5 – 4 Stunden', isCorrect: false },
      { id: 'opt_2_5', text: '2 – 5 Stunden', isCorrect: false }
    ],
    explanation: 'Korrekt! Nach herkömmlichen, komplikationslosen Operationen verweilen Patienten im Schnitt 1 bis 2 Stunden im Aufwachraum, bis alle Kriterien für eine Stationsverlegung erfüllt sind.',
    nuggetId: 'nugget_3'
  },
  {
    id: 'quiz_4',
    number: 4,
    title: 'Verlegung bei Komplikationen oder schweren Vorerkrankungen',
    type: 'multiple_choice',
    question: 'Verlief die Operation mit Komplikationen, hat sehr lange angedauert oder wurde an einer Person mit schweren Vorerkrankungen durchgeführt, ist die Verlegung auf welche Bereiche unter Anordnung der zuständigen Ärzt:innen notwendig? (Mehrfachauswahl möglich)',
    options: [
      { id: 'opt_notaufnahme', text: 'Notaufnahme', isCorrect: false },
      { id: 'opt_imc', text: 'Intermediate Care Station (IMC)', isCorrect: true },
      { id: 'opt_fachstation', text: 'Chirurgische Fachstation', isCorrect: false },
      { id: 'opt_its', text: 'Intensivstation (ITS)', isCorrect: true },
      { id: 'opt_privat', text: 'Privatstation', isCorrect: false }
    ],
    explanation: 'Ausgezeichnet! Bei instabilen Vitalwerten, schweren Vorerkrankungen oder aufwändigen OP-Verläufen ist eine Verlegung auf die IMC (Überwachungsstation) oder Intensivstation (Beatmung/Organunterstützung) zwingend erforderlich.',
    nuggetId: 'nugget_4'
  },
  {
    id: 'quiz_5',
    number: 5,
    title: 'Primäre Überwachungsbereiche im Aufwachraum',
    type: 'multiple_choice',
    question: 'In der postoperativen Phase im Aufwachraum überwachen Pflegefachkräfte primär die Patient:innen. Welche 4 Kernaspekte stehen dabei an oberster Stelle? (Wählen Sie die 4 zutreffenden)',
    options: [
      { id: 'opt_vigilanz', text: 'Bewusstseinslage (Vigilanz & Schutzreflexe)', isCorrect: true },
      { id: 'opt_kreislauf', text: 'Atem- und Kreislauffunktionen (Vitalzeichen)', isCorrect: true },
      { id: 'opt_reha', text: 'Entlassungsplanung & Reha-Antrag', isCorrect: false },
      { id: 'opt_schmerz', text: 'Postoperative Schmerztherapie (NRS-Wert & Analgetika)', isCorrect: true },
      { id: 'opt_blutung', text: 'Komplikationen und Nachblutungen (Verband & Drainagen)', isCorrect: true },
      { id: 'opt_kost', text: 'Bestellung des Mittagessens', isCorrect: false }
    ],
    explanation: 'Exakt! Die vier Säulen im AWR sind: Bewusstsein (Reflexe), Atmung & Kreislauf (Vitalparameter), Schmerztherapie und die Überwachung von Wunde/Drainagen auf Nachblutungen.',
    nuggetId: 'nugget_5'
  },
  {
    id: 'quiz_6',
    number: 6,
    title: 'Regeln für die Abholung aus dem Aufwachraum',
    type: 'multiple_choice',
    question: 'Welche Regeln gelten verbindlich für die Abholung der Patient:innen aus dem Aufwachraum? (Mehrfachauswahl)',
    options: [
      { id: 'opt_schnell', text: 'Möglichst schnelle Abholung erforderlich, Zeitdruck hat Vorrang', isCorrect: false },
      { id: 'opt_zwei_personen', text: 'Möglichst mit zwei Pflegepersonen abholen', isCorrect: true },
      { id: 'opt_examinierte', text: 'Es muss mindestens eine examinierte Pflegefachkraft dabei sein', isCorrect: true },
      { id: 'opt_azubi_allein', text: 'Die Abholung kann durch Auszubildende alleine durchgeführt werden', isCorrect: false }
    ],
    explanation: 'Richtig! Zur Patientensicherheit (Sturzgefahr, akute Kreislaufkrise beim Transport) erfolgt der Transfer idealerweise zu zweit. Eine examinierte Fachkraft muss dabei sein; Azubis dürfen den Transfer keinesfalls alleine durchführen.',
    nuggetId: 'nugget_6'
  },
  {
    id: 'quiz_7',
    number: 7,
    title: 'Inhalte der Übergabe von AWR zu Station',
    type: 'multiple_choice',
    question: 'Welche Fragen und Inhalte müssen bei der Übergabe vom Aufwachraum an das Stationsteam zwingend besprochen werden? (Wählen Sie die 4 wichtigsten Fachaspekte)',
    options: [
      { id: 'opt_op_verlauf', text: 'Perioperativer Verlauf (OP-Verfahren & intraoperative Besonderheiten)', isCorrect: true },
      { id: 'opt_med_analgesie', text: 'Im AWR verabreichte Medikamente (Analgetika, Infusionen, Antiemetika)', isCorrect: true },
      { id: 'opt_urlaub', text: 'Urlaubsplanung des Operationsteams', isCorrect: false },
      { id: 'opt_vitals_status', text: 'Aktuelle Vitalwerte, Bewusstseinslage und Schmerzscore (NRS)', isCorrect: true },
      { id: 'opt_drains_dress', text: 'Zustand des Wundverbands, Drainagenfüllstand & Miktion', isCorrect: true }
    ],
    explanation: 'Hervorragend! Eine lückenlose Übergabe umfasst: OP-Verfahren/Besonderheiten, AWR-Medikation/Schmerzscore, aktuelle Vitalwerte sowie Verband/Drainagen/Miktionsstatus.',
    nuggetId: 'nugget_7'
  },
  {
    id: 'quiz_8',
    number: 8,
    title: 'Bedeutung der Kontrollen vor Stationsverlegung',
    type: 'single_choice',
    question: 'Aus welchen Gründen ist die Kontrolle von Bewusstsein, Wundverband und Befinden VOR dem Verlassen des Aufwachraums so entscheidend?',
    options: [
      { id: 'opt_zeit', text: 'Um das Bett möglichst schnell für den nächsten Patienten freizumachen', isCorrect: false },
      { id: 'opt_sicherheit', text: 'Zur Gewährleistung der Patientensicherheit und eindeutigen Klärung der Verantwortungsübergabe (Schnittstellensicherheit)', isCorrect: true },
      { id: 'opt_formal', text: 'Nur aus abrechnungstechnischen Gründen für die Krankenkasse', isCorrect: false },
      { id: 'opt_arzt', text: 'Damit kein Arzt mehr hinzugezogen werden muss', isCorrect: false }
    ],
    explanation: 'Richtig! An der Schnittstelle geht die medizinisch-pflegerische Verantwortung auf das Stationsteam über. Ein instabiler oder blutender Patient darf den AWR nicht verlassen.',
    nuggetId: 'nugget_8'
  },
  {
    id: 'quiz_9',
    number: 9,
    title: 'Kriterien für die Stationsübernahme',
    type: 'multiple_choice',
    question: 'Eine Übernahme der Patient:innen aus dem Aufwachraum auf die Station sollte erst erfolgen, wenn: (Wählen Sie die 3 korrekten Entlassungskriterien)',
    options: [
      { id: 'opt_klar', text: 'das Bewusstsein klar und die Person orientiert ist', isCorrect: true },
      { id: 'opt_getrunken', text: 'die Person die ersten Schlucke Kaffee getrunken hat', isCorrect: false },
      { id: 'opt_stabil', text: 'die Herz-Kreislaufsituation stabil ist (Blutdruck, Puls im Normbereich)', isCorrect: true },
      { id: 'opt_urin', text: 'die Person bereits mindestens 500 ml Spontanurin gelassen hat', isCorrect: false },
      { id: 'opt_atmung', text: 'eine ausreichende Spontanatmung und Schutzreflexe vorliegen', isCorrect: true }
    ],
    explanation: 'Exakt! Klare Vigilanz, stabile Kreislaufverhältnisse und freie Spontanatmung mit Schutzreflexen sind unverzichtbare Voraussetzungen für die Rückverlegung.',
    nuggetId: 'nugget_9',
    specialMedia: {
      type: 'tip',
      title: 'Tipp: Hol- und Bringdienste & Informationsverlust',
      content: 'In vielen Kliniken übernehmen Hol- und Bringdienste den Patiententransport. CAVE: Hierbei besteht ein hohes Risiko für Informationsverluste an Schnittstellen! Die pflegerische Übergabe und Erstkontrolle vor Ort darf niemals entfallen. Bei Auffälligkeiten muss unverzüglich die examinierte Pflegekraft intervenieren.'
    }
  },
  {
    id: 'quiz_10',
    number: 10,
    title: 'Erstversorgung nach Ankunft auf Station',
    type: 'multiple_choice',
    question: 'Was zählt zur unmittelbaren Erstversorgung nach einer Operation bei Ankunft im Patientenzimmer auf Station? (Wählen Sie alle richtigen Maßnahmen)',
    options: [
      { id: 'opt_vital', text: 'Vitalparameter messen (RR, Puls, SpO2, Atmung)', isCorrect: true },
      { id: 'opt_haut', text: 'Hautinspektion (Druckstellen durch OP-Lagerung prüfen)', isCorrect: true },
      { id: 'opt_speisekarte', text: 'Abfrage der Menüwünsche für die kommende Woche', isCorrect: false },
      { id: 'opt_systeme', text: 'Inspektion & Erhebung sämtlicher Zu- und Ableitungssysteme', isCorrect: true },
      { id: 'opt_beratung', text: 'Ausführliches Beratungsgespräch zu postoperativen Langzeitfolgen', isCorrect: false },
      { id: 'opt_schmerz', text: 'Schmerzerfassung & Schmerzmanagement (NRS erheben)', isCorrect: true },
      { id: 'opt_verband', text: 'Inspektion des Wundverbandes auf Nachblutung oder Durchfeuchtung', isCorrect: true },
      { id: 'opt_entlassung', text: 'Ausfüllen des Entlassungsmanagements', isCorrect: false }
    ],
    explanation: 'Perfekt gelöst! Die Erstversorgung umfasst Vitalzeichen, Wundverband, Schmerzstatus, Zu-/Ableitungen und Hautinspektion. Umfangreiche Beratungen oder Essenswünsche sind in der Akutphase kontraproduktiv.',
    nuggetId: 'nugget_10'
  },
  {
    id: 'quiz_11',
    number: 11,
    title: 'Postoperative Lagerung nach Eingriff',
    type: 'multiple_choice',
    question: 'Welche Aussagen zur operierten Patientin Frau Meinhardt (laparoskopische Cholezystektomie) und allgemeinen Lagerungsregeln sind fachlich korrekt? (2 Antworten)',
    options: [
      { id: 'opt_bauchlage', text: 'Frau Meinhardt sollte zur Schonung der Bauchdecke sofort flach auf den Bauch gelegt werden', isCorrect: false },
      { id: 'opt_30grad', text: 'Oberkörper leicht erhöht (ca. 30°) und Knie leicht angewinkelt (Bauchdeckenentspannung & Aspirationsprophylaxe)', isCorrect: true },
      { id: 'opt_steil', text: 'Steile Sitzposition 90° mit herabhängenden Beinen ab der ersten Minute', isCorrect: false },
      { id: 'opt_schock', text: 'Trendelenburg-Lagerung (Kopftieflagerung) ist Standard für jede Bauch-OP', isCorrect: false },
      { id: 'opt_extremitaet', text: 'Bei Extremitäten-Eingriffen (z. B. Frakturen) wird das operierte Glied weich hochgelagert zur Ödemprophylaxe', isCorrect: true }
    ],
    explanation: 'Richtig! Bei Abdominal-Eingriffen entspannt eine 30°-Oberkörperhochlagerung mit Knierolle die Bauchmuskulatur und senkt die Belastung auf die Trokar-Wunden.',
    nuggetId: 'nugget_11'
  },
  {
    id: 'quiz_12',
    number: 12,
    title: 'Postoperativer Wasser- und Elektrolythaushalt',
    type: 'cloze',
    question: 'Vervollständigen Sie den Fachtext zum Flüssigkeitshaushalt:',
    clozeParts: [
      { type: 'text', value: 'Ein ausgewogener Wasser- und ' },
      { type: 'blank', value: 'Elektrolythaushalt', options: ['Elektrolythaushalt', 'Säuregehalt', 'Vitaminspiegel', 'Zuckerhaushalt'] },
      { type: 'text', value: ' ist für den ' },
      { type: 'blank', value: 'Allgemeinzustand', options: ['Allgemeinzustand', 'Blutdruckabfall', 'Narkosebedarf', 'Klinikaufenthalt'] },
      { type: 'text', value: ' der Patient:innen in der postoperativen Phase von besonderer Bedeutung. Prophylaktisch sollte also schon in der ' },
      { type: 'blank', value: 'präoperativen', options: ['präoperativen', 'postoperativen', 'rehabilitativen', 'ambulanten'] },
      { type: 'text', value: ' Phase darauf geachtet werden, dass die Patient:innen in eine gute Ausgangslage gebracht werden.' }
    ],
    explanation: 'Klasse! Bereits präoperativ muss auf ausreichende Hydrierung geachtet werden (klare Flüssigkeiten bis 2h vor OP erlaubt), um postoperative Hypovolämie und Nierenfunktionsstörungen zu vermeiden.',
    nuggetId: 'nugget_12',
    specialMedia: {
      type: 'tip',
      title: 'Infusionsmanagement: Vorbereitung einer Schwerkraftinfusion',
      content: 'In der Regel erhalten Patienten intra- und postoperativ i.v. Flüssigkeit. Achten Sie beim Richten der Schwerkraftinfusion auf: Tropfkammer zu 1/3 bis 1/2 füllen, Infusionsschlauch vollständig luftblasenfrei entlüften, Rollklemme schließen und aseptisch anbinden!'
    }
  },
  {
    id: 'quiz_13',
    number: 13,
    title: 'Häufige postoperative Komplikationen',
    type: 'multiple_choice',
    question: 'Welche der folgenden klinischen Erscheinungen zählen zu den typischen und häufigen postoperativen Komplikationen? (Wählen Sie die 4 korrekten)',
    options: [
      { id: 'opt_fieber', text: 'Fieber (z. B. Resorptionsfieber in den ersten Tagen)', isCorrect: true },
      { id: 'opt_erbrechen', text: 'Erbrechen & Übelkeit (PONV – Postoperative Nausea and Vomiting)', isCorrect: true },
      { id: 'opt_harnverhalt', text: 'Harnverhalt (reflektorische Miktionssperre nach Narkose)', isCorrect: true },
      { id: 'opt_apnoe', text: 'Dauerhafte Apnoe als Normalbefund', isCorrect: false },
      { id: 'opt_wundheilung', text: 'Wundheilungsstörungen (Hämatome, Serome, Wundinfektion)', isCorrect: true },
      { id: 'opt_ikterus', text: 'Akuter Ikterus als reguläre Begleiterscheinung jeder OP', isCorrect: false }
    ],
    explanation: 'Richtig! PONV, Resorptionsfieber, reflektorischer Harnverhalt und Wundinfekte/Nachblutungen sind die häufigsten postoperativen Komplikationen, die engmaschig überwacht werden müssen.',
    nuggetId: 'nugget_13'
  },
  {
    id: 'quiz_14',
    number: 14,
    title: 'Kategorien der postoperativen Überwachung',
    type: 'multiple_choice',
    question: 'Nach dem Fachbuch I Care (Abb. 39.8) stützen sich Pflegefachkräfte auf standardisierte Beobachtungskategorien. Welche gehören dazu? (Wählen Sie die 4 korrekten Kategorien)',
    options: [
      { id: 'opt_kat_postaggression', text: 'Postaggressionssyndrom (Stressstoffwechsel & Tachykardie)', isCorrect: true },
      { id: 'opt_kat_kreislauf', text: 'Kreislaufsituation & Atmung (Puls, RR, Hypoxie-Zeichen)', isCorrect: true },
      { id: 'opt_kat_horoskop', text: 'Biorhythmus- und Mondphasenanalyse', isCorrect: false },
      { id: 'opt_kat_verband', text: 'Wundverband und Drainagen (Blutung, Sekretfarbe, Fördermenge)', isCorrect: true },
      { id: 'opt_kat_temp', text: 'Körpertemperatur (Resorptions- vs. septisches Fieber)', isCorrect: true }
    ],
    explanation: 'Exzellent! Die Kernkategorien umfassen Postaggressionssyndrom, Kreislauf/Atmung, Wunde/Drainagen, Temperatur sowie Flüssigkeit/Miktion.',
    nuggetId: 'nugget_14'
  },
  {
    id: 'quiz_15',
    number: 15,
    title: 'DMS-Kontrolle Kriterien',
    type: 'single_choice',
    question: 'Welche Kriterien werden bei der klassischen DMS-Kontrolle geprüft?',
    options: [
      { id: 'opt_dms_1', text: 'Durchblutung, Mimik, Sensibilität', isCorrect: false },
      { id: 'opt_dms_2', text: 'Durchflussrate, Motorik, Sedativa', isCorrect: false },
      { id: 'opt_dms_3', text: 'Durchblutung, Motorik, Sensibilität', isCorrect: true },
      { id: 'opt_dms_4', text: 'Durchgängigkeit, Muskeltonus, Sensibilität', isCorrect: false }
    ],
    explanation: 'Vollkommen richtig! DMS steht für Durchblutung (Puls, Rekapillarisierungszeit, Hautkolorit), Motorik (aktive Beweglichkeit) und Sensibilität (Gefühlsempfinden, Taubheit/Kribbeln).',
    nuggetId: 'nugget_15',
    specialMedia: {
      type: 'video',
      title: 'Erklärvideo: DMS-Kontrolle am Praxisbeispiel',
      content: 'Sehen Sie sich die strukturierte Durchführung einer DMS-Kontrolle im folgenden Lehrvideo von BIGEST an:',
      videoUrl: 'https://www.youtube-nocookie.com/embed/-XFKp8ttxXg',
      externalUrl: 'https://www.youtube.com/watch?v=-XFKp8ttxXg&ab_channel=BIGEST'
    }
  },
  {
    id: 'quiz_16',
    number: 16,
    title: 'Postoperative Frühmobilisation',
    type: 'multiple_choice',
    question: 'Was ist unter einer postoperativen Frühmobilisation zu verstehen und worauf muss geachtet werden? (Wählen Sie die 3 korrekten Aussagen)',
    options: [
      { id: 'opt_zeitpunkt', text: 'Beginnt idealerweise am OP-Tag oder spätestens am 1. postoperativen Tag morgens', isCorrect: true },
      { id: 'opt_prophylaxe', text: 'Wirkt effektiv gegen Thrombosen, Pneumonien, Obstipation und Kreislaufschwäche', isCorrect: true },
      { id: 'opt_allein', text: 'Die Patientin darf beim ersten Aufstehen zur Förderung der Selbstständigkeit ganz alleine losgehen', isCorrect: false },
      { id: 'opt_vitals_check', text: 'Vor dem Aufstehen müssen Vitalwerte (RR/Puls) kontrolliert werden; Mobilisation erfolgt stets zu zweit', isCorrect: true },
      { id: 'opt_bettruhe', text: 'Nach einer Gallen-OP gilt grundsätzlich 7 Tage strenge Bettruhe', isCorrect: false }
    ],
    explanation: 'Sehr gut! Frühmobilisation ist ein zentraler Eckpfeiler (Fast-Track). Vor dem Aufstehen stets Vitalwerte messen, zu zweit unterstützen und bei Schwindel oder Kollapsneigung sofort abbrechen.',
    nuggetId: 'nugget_16'
  },
  {
    id: 'quiz_17',
    number: 17,
    title: 'Patientenkontrollierte Analgesie (PCA)',
    type: 'cloze',
    question: 'Füllen Sie den Lückentext zur Schmerztherapie aus:',
    clozeParts: [
      { type: 'text', value: 'Die Patient:innen können sich mit Hilfe der PCA das ' },
      { type: 'blank', value: 'Schmerzmittel', options: ['Schmerzmittel', 'Schlafmittel', 'Antibiotikum', 'Narkosegas'] },
      { type: 'text', value: ' selbst verabreichen, indem bei Bedarf der Handschalter der ' },
      { type: 'blank', value: 'PCA-Pumpe', options: ['PCA-Pumpe', 'Infusionswaage', 'Vakuumglocke', 'Drainageflasche'] },
      { type: 'text', value: ' gedrückt wird.' }
    ],
    explanation: 'Richtig! Die PCA erlaubt es dem Patienten, bei Schmerzspitzen selbst per Knopfdruck einen Bolus abzurufen. Ein elektronisches Sperrintervall (Lockout-Time) schützt zuverlässig vor einer Überdosierung.',
    nuggetId: 'nugget_17',
    specialMedia: {
      type: 'video',
      title: 'Erklärvideo: Die Patientenkontrollierte Schmerzpumpe (PCA)',
      content: 'Lernen Sie Funktionsweise und Sicherheitsmerkmale der PCA-Pumpe im Video der Thieme Compliance GmbH kennen:',
      videoUrl: 'https://www.youtube-nocookie.com/embed/PB0GXH19AEY',
      externalUrl: 'https://www.youtube.com/watch?v=PB0GXH19AEY&ab_channel=ThiemeComplianceGmbH'
    }
  },
  {
    id: 'quiz_18',
    number: 18,
    title: 'Zeitpunkt für Essen und Trinken',
    type: 'single_choice',
    question: 'Wonach richtet sich in der klinischen Praxis häufig der Zeitpunkt, ab dem Patient:innen nach einer Operation wieder schluckweise trinken und essen dürfen?',
    options: [
      { id: 'opt_anästhesie', text: 'Ausschließlich nach telefonischer Freigabe durch den Chefarzt', isCorrect: false },
      { id: 'opt_uhrzeit', text: 'Erst nach genau 24 Stunden um Punkt 12:00 Uhr', isCorrect: false },
      { id: 'opt_standard_urin', text: 'Nach hausinternen Standards und häufig nach dem ersten Spontanurin (Miktion)', isCorrect: true },
      { id: 'opt_hunger', text: 'Sobald die Patientin Hunger äußert, direkt feste Schnitzelportion', isCorrect: false }
    ],
    explanation: 'Korrekt! Neben hausinternen Standards (Fast-Track vs. konservativ) gilt in der Praxis das erfolgreiche erste Wasserlassen (Ausschluss eines Harnverhalts und Zeichen wiederkehrender autonomer Regulation) als klassischer Meilenstein für die orale Zufuhr.',
    nuggetId: 'nugget_18'
  },
  {
    id: 'quiz_19',
    number: 19,
    title: 'Grundsätze des Kostaufbaus',
    type: 'multiple_choice',
    question: 'Wonach richtet sich der weitere Kostaufbau im Verlauf nach der Operation aus? (Wählen Sie die 3 korrekten Kriterien)',
    options: [
      { id: 'opt_eingriff_art', text: 'Nach Art und Ausmaß der Operation (insb. ob am Magen-Darm-Trakt operiert wurde)', isCorrect: true },
      { id: 'opt_darm_peristaltik', text: 'Nach dem Vorhandensein von Darmgeräuschen / Peristaltik und erstem Windeabgang', isCorrect: true },
      { id: 'opt_beschwerdefrei', text: 'Nach der Beschwerdefreiheit der Patientin (kein Erbrechen, keine Übelkeit)', isCorrect: true },
      { id: 'opt_sofort_vollkost', text: 'Es gibt nach Bauchoperationen grundsätzlich sofort fettreiches Schweinefleisch', isCorrect: false }
    ],
    explanation: 'Perfekt! Der Kostaufbau erfolgt stufenweise: Nach schluckweiser Flüssigkeit folgt Tee/Zwieback, dann Suppe/Breikost und schließlich leichte Vollkost, abhängig von der Darmfunktion.',
    nuggetId: 'nugget_19'
  }
];

export const learningNuggets: LearningNugget[] = [
  {
    id: 'nugget_1',
    number: 1,
    title: 'Definition & Zeitrahmen der postoperativen Pflege',
    category: 'Grundlagen',
    summary: 'Unter postoperativer Pflege versteht man alle pflegerischen Tätigkeiten und Handlungen nach einer Operation. Sie beginnt mit der Ausleitung im OP-Saal und reicht über den Aufwachraum bis zur Genesung auf Station.',
    corePoints: [
      'Beginn: Unmittelbar mit Beendigung des chirurgischen Eingriffs',
      'Etappen: AWR (1–2 h) -> Normalstation -> Entlassung',
      'Hauptziel: Wiederherstellung der physiologischen Homöostase und Schmerzfreiheit'
    ],
    clinicalTip: 'Die ersten Stunden nach der Narkose sind die vulnerabelste Phase für Atem- und Kreislaufzwischenfälle.',
    reference: 'I Care Pflege S. 809 (Kapitel 39.4)'
  },
  {
    id: 'nugget_2',
    number: 2,
    title: 'Der Aufwachraum (AWR / PACU)',
    category: 'Versorgungsstufen',
    summary: 'Der Aufwachraum dient der lückenlosen Überwachung von Vitalfunktionen, Bewusstsein und Schmerzen unmittelbar nach Allgemein- oder Regionalanästhesie.',
    corePoints: [
      'Spezialbereich in unmittelbarer OP-Nähe',
      'Ausstattung mit Monitoren, Sauerstoff, Absaugung und Notfallmedikamenten',
      'Betreuung durch anästhesiologisch geschulte Pflegekräfte'
    ],
    clinicalTip: 'Erst wenn die Schutzreflexe (Schlucken, Husten) vollständig wiederkehren, sinkt das Aspirationsrisiko deutlich.',
    reference: 'I Care Pflege S. 809'
  },
  {
    id: 'nugget_3',
    number: 3,
    title: 'Verweildauer & Zeitmanagement im AWR',
    category: 'Prozessorganisation',
    summary: 'Die Verweildauer beträgt nach unkomplizierten Eingriffen meist 1 bis 2 Stunden. Sie richtet sich nicht starr nach der Uhr, sondern nach dem klinischen Zustand.',
    corePoints: [
      'Regulär 60 bis 120 Minuten bei ambulanten und stationären Standard-OPs',
      'Verlängerung bei PONV, Hypothermie, starken Schmerzen oder Blutdruckinstabilität',
      'Dokumentation über standardisierte Entlassungs-Scores (z. B. Aldrete-Score)'
    ],
    clinicalTip: 'Niemals einen Patienten überstürzt auf Station verlegen, nur um Bettenkapazität im AWR zu schaffen!',
    reference: 'I Care Pflege S. 809 & CNE S. 2'
  },
  {
    id: 'nugget_4',
    number: 4,
    title: 'Verlegungsstufen: Station, IMC oder Intensivstation',
    category: 'Versorgungsstufen',
    summary: 'Je nach Schweregrad der OP und kardiopulmonalen Vorerkrankungen erfolgt die Zuweisung auf Normalstation, IMC (Intermediate Care) oder Intensivstation (ITS).',
    corePoints: [
      'Normalstation: Stabile Patienten mit unkompliziertem Verlauf',
      'IMC: Engmaschiges Monitoring bei Vorerkrankungen (z. B. schwere Herzinsuffizienz)',
      'Intensivstation: Notwendigkeit von Beatmung, Katecholaminen oder bei akuten Komplikationen'
    ],
    clinicalTip: 'Die Entscheidung trifft immer der Anästhesist gemeinsam mit dem Operateur.',
    reference: 'I Care Pflege S. 809'
  },
  {
    id: 'nugget_5',
    number: 5,
    title: 'Die 4 Säulen der AWR-Überwachung',
    category: 'Klinische Überwachung',
    summary: 'Im AWR stehen vier Bereiche im Fokus: Vigilanz (Reflexe), Vitalfunktionen (RR, HF, SpO2, AF), Schmerztherapie (NRS) und Wundkontrolle (Nachblutungen).',
    corePoints: [
      'Vigilanz: Weckbarkeit, Pupillenreaktion, Orientierung zu Person und Ort',
      'Atmung: Atemfrequenz, Atemtiefe, Sauerstoffsättigung (SpO2 > 95%)',
      'Kreislauf: Blutdruck, Pulsfrequenz, Herzrhythmus',
      'Wunde/Drainagen: Verbandskontrolle auf Durchblutung und Sekretverlust'
    ],
    clinicalTip: 'Schläfrige Patienten neigen zu Zungengrundobstruktion (Schnarchen) – Kopf überstrecken oder Esmarch-Handgriff anwenden!',
    reference: 'I Care Pflege S. 809'
  },
  {
    id: 'nugget_6',
    number: 6,
    title: 'Transport- & Abholstandards: Schnittstelle AWR -> Station',
    category: 'Patientensicherheit',
    summary: 'Der Transfer auf Station erfolgt idealtypisch zu zweit und unter Beteiligung einer examinierten Pflegekraft. Auszubildende dürfen den Transfer keinesfalls allein durchführen.',
    corePoints: [
      '2-Personen-Prinzip beim Bettentransport',
      'Mindestens 1 examinierte Pflegefachkraft',
      'Ablauf vor dem Transport: Kurze Kontaktaufnahme mit dem Patienten, Vitalwerte prüfen',
      'Sicherung von Infusionen, Drainagen und Kathetern gegen Zug'
    ],
    clinicalTip: 'Während des Transfers im Fahrstuhl kann es durch die Lageveränderung zu akuter orthostatischer Hypotonie oder Erbrechen kommen.',
    reference: 'I Care Pflege S. 809 & CNE S. 2'
  },
  {
    id: 'nugget_7',
    number: 7,
    title: 'Strukturierte Übergabe (ISBAR-Prinzip an Schnittstellen)',
    category: 'Kommunikation',
    summary: 'Die Übergabe vom AWR an das Stationsteam umfasst: OP-Verfahren, verabreichte Analgetika/Flüssigkeiten, aktuelle Vitalwerte, Wundzustand, Drainagen und Miktion.',
    corePoints: [
      'OP-Verlauf: Gab es intraoperative Besonderheiten oder Blutverluste?',
      'Medikation: Wann wurde welches Schmerzmittel verabreicht? Was ist als Reserve angeordnet?',
      'Vitalstatus: Letzte Messung vor Verlassen des AWR',
      'Katheter & Drainagen: Zu- und Ableitungen, Restmengen in Infusionen'
    ],
    clinicalTip: 'Lassen Sie sich bei Unklarheiten die Kurve und die ärztlichen Post-OP-Anordnungen zeigen und gegenzeichnen.',
    reference: 'CNE S. 2 & I Care S. 809'
  },
  {
    id: 'nugget_8',
    number: 8,
    title: 'Sicherheits-Check vor Verlassen des AWR',
    category: 'Patientensicherheit',
    summary: 'Vor Verlassen des AWR prüfen abgebende und übernehmende Pflegekräfte gemeinsam Wundverband, Schläuche und Bewusstsein, um Haftungs- und Behandlungsfehler auszuschließen.',
    corePoints: [
      'Klärung: Ist die Patientin transportfähig?',
      'Vermeidung von Nachblutungs-Überraschungen auf dem Flur',
      'Rechtlicher Verantwortungsübergang an der Schleuse'
    ],
    clinicalTip: 'Ein durchbluteter Wundverband wird vor dem Verlassen des AWR dokumentiert und ggf. neu versorgt – nicht erst auf Station!',
    reference: 'I Care Pflege S. 809'
  },
  {
    id: 'nugget_9',
    number: 9,
    title: 'Kriterien für die Stationsübernahme (Aldrete-Score)',
    category: 'Klinische Standards',
    summary: 'Voraussetzungen für die Verlegung auf Normalstation sind: stabiler Kreislauf, freie Spontanatmung, klares Bewusstsein, adäquate Schmerzkontrolle und Normothermie.',
    corePoints: [
      'Klares Bewusstsein: Patientin reagiert prompt auf Ansprache',
      'Stabile Vitalwerte: Blutdruck im patientenindividuellen Zielbereich, SpO2 stabil',
      'Schmerzlevel: NRS <= 3 unter Ruhebedingungen',
      'Keine aktive, unstillbare Übelkeit (PONV)'
    ],
    clinicalTip: 'Tipp-Box: Bei Einsatz von Hol- und Bringdiensten muss eine schriftliche Freigabe des AWR-Teams vorliegen, um Informationsverlust zu vermeiden.',
    reference: 'I Care Pflege S. 809'
  },
  {
    id: 'nugget_10',
    number: 10,
    title: 'Strukturierte Erstversorgung auf Station',
    category: 'Stationspflege',
    summary: 'Sobald die Patientin im Zimmer eintrifft, erfolgen umgehend: Vitalzeichenmessung, Hautinspektion (Dekubitusprophylaxe), Wundkontrolle, Überprüfung aller Schläuche und Schmerzerfassung.',
    corePoints: [
      'Sofortige Vitalwertmessung als Ausgangswert für den Stationsverlauf',
      'Hautinspektion: Lagerungsschäden vom OP-Tisch sofort dokumentieren',
      'Zu- und Ableitungen: Infusionen entlüftet und mit korrekter Tropfrate, Drainagen ohne Zug',
      'Klingel in Reichweite der dominanten Hand ablegen'
    ],
    clinicalTip: 'Informieren Sie die Patientin ruhig: "Sie sind jetzt sicher auf Ihrem Zimmer angekommen, die OP ist gut verlaufen."',
    reference: 'CNE S. 3 "Erstversorgung auf der Station"'
  },
  {
    id: 'nugget_11',
    number: 11,
    title: 'Postoperative Lagerung: Abdomen & Extremitäten',
    category: 'Lagerungskonzepte',
    summary: 'Nach Bauch-OPs (wie Frau Meinhardts Cholezystektomie) erfolgt eine 30°-Oberkörperhochlagerung mit Knierolle zur Bauchdeckenentspannung. Extremitäten werden weich hochgelagert.',
    corePoints: [
      'Laparoskopische Cholezystektomie: Leichte Oberkörperhochlagerung (30°) entlastet Zwerchfell und Bauchmuskeln',
      'Knierolle / Bettknick: Reduziert Zugspannung auf den Trokar-Einstichstellen',
      'Extremitäten-Eingriffe: Hochlagerung auf Schiene fördert venösen Rückfluss und mindert Schwellungsschmerz'
    ],
    clinicalTip: 'Keine steile 90°-Sitzposition in den ersten Stunden: Gefahr von Kreislaufkollaps und erhöhtem intraabdominellem Druck!',
    reference: 'I Care Pflege S. 809'
  },
  {
    id: 'nugget_12',
    number: 12,
    title: 'Wasser- und Elektrolythaushalt & Infusionsmanagement',
    category: 'Flüssigkeitsmanagement',
    summary: 'Eine ausgeglichene Flüssigkeitsbilanz ist für Nierenperfusion und Kreislauf unerlässlich. Schwerkraftinfusionen müssen exakt vorbereitet und frei von Luftblasen sein.',
    corePoints: [
      'Präoperativ: Minimierung der Nüchternzeiten (klare Flüssigkeiten bis 2 h vor OP)',
      'Intra- & Postoperativ: Ausgleich von Nüchternphase, Blut- und Perspiratio-Verlusten',
      'Schwerkraftinfusion: Tropfkammer zu 1/3 füllen, vollständig entlüften, Einlaufgeschwindigkeit überwachen'
    ],
    clinicalTip: 'Prüfen Sie vor dem Anschließen immer die 6-R-Regel (Richtiger Patient, Richtiges Medikament/Lösung, Richtige Dosierung, Richtige Applikationsart, Richtige Zeit, Richtige Dokumentation)!',
    reference: 'CNE S. 4 & I Care S. 810'
  },
  {
    id: 'nugget_13',
    number: 13,
    title: 'Typische postoperative Komplikationen erkennen',
    category: 'Komplikationsmanagement',
    summary: 'Zu den häufigsten Komplikationen zählen PONV (Übelkeit/Erbrechen), Resorptionsfieber, Nachblutungen, reflektorischer Harnverhalt und Wundinfektionen.',
    corePoints: [
      'PONV: Risikofaktoren weiblich, Nichtraucher, Kinetose, Opioide; Bedarfsmedikation (z. B. Ondansetron)',
      'Resorptionsfieber: Leichtes Fieber bis 38,5°C in den ersten 1–3 Tagen durch Abbau von Gewebstrümmern meist unbedenklich',
      'Harnverhalt: Nach Narkose und Blasenkatheterentfernung; Miktionskontrolle spätestens nach 6–8 Stunden',
      'Nachblutung: Blässe, Kaltschweißigkeit, Tachykardie, RR-Abfall, pralle Bauchdecke'
    ],
    clinicalTip: 'Ein plötzlicher Blutdruckabfall bei gleichzeitigem Pulsanstieg ist das Leitsymptom eines beginnenden hämorrhagischen Schocks!',
    reference: 'I Care Pflege S. 810 & CNE S. 8'
  },
  {
    id: 'nugget_14',
    number: 14,
    title: 'Kategorien der postoperativen Beobachtung (I Care Abb. 39.8)',
    category: 'Klinische Überwachung',
    summary: 'Das standardisierte Überwachungsschema nach I Care gliedert die postoperative Pflege in 6 zentrale Beobachtungsfelder.',
    corePoints: [
      '1. Postaggressionssyndrom: Stresshormon-Ausschüttung (Adrenalin, Cortisol) führt zu Hyperglykämie und Tachykardie',
      '2. Kreislauf & Atmung: Puls, Blutdruck, Atemfrequenz, Sauerstoffversorgung',
      '3. Orientierung & Bewusstsein: Narkoseüberhang oder postoperatives Delir',
      '4. Wundverband & Drainagen: Fördermenge, Blutfarbe, Verbandssitz',
      '5. Flüssigkeit & Ausscheidung: Urinausscheidung >= 0,5 ml/kg/h',
      '6. Körpertemperatur: Unterkühlung (Hypothermie) vs. Resorptionsfieber vs. Infektion'
    ],
    clinicalTip: 'Prägen Sie sich die 6 Kategorien ein – sie bilden das Gerüst jeder professionellen Pflegevisite!',
    reference: 'I Care Pflege S. 810, Abb. 39.8'
  },
  {
    id: 'nugget_15',
    number: 15,
    title: 'DMS-Kontrolle (Durchblutung, Motorik, Sensibilität)',
    category: 'Untersuchungstechnik',
    summary: 'Die DMS-Kontrolle dient der schnellen Erfassung von Durchblutungsstörungen, Nervenschäden oder Kompartmentsyndromen, insbesondere nach Operationen an Extremitäten oder nach Lagerungen.',
    corePoints: [
      'Durchblutung (D): Rekapillarisierungszeit (< 2 Sek.), Hautfarbe (rosig vs. blass/zyanotisch), Hauttemperatur, peripherer Puls',
      'Motorik (M): Zehen/Finger aktiv spreizen, anziehen, beugen lassen',
      'Sensibilität (S): Bestreichen der Haut; Patientin fragen: "Spüren Sie die Berührung auf beiden Seiten gleichmäßig?"'
    ],
    clinicalTip: 'Vergleichen Sie bei der DMS-Kontrolle immer beide Extremitäten miteinander (Seitenvergleich)!',
    reference: 'I Care Pflege S. 811 & BIGEST Lehrvideo'
  },
  {
    id: 'nugget_16',
    number: 16,
    title: 'Frühmobilisation & Sturzprophylaxe',
    category: 'Mobilisation',
    summary: 'Frühmobilisation ist der Schlüssel zur Vermeidung postoperativer Lungenentzündungen, Thrombosen und Darmatonien. Sie erfordert eine sorgfältige Vorbereitung zu zweit.',
    corePoints: [
      'Beginn: Am OP-Tag abends oder 1. postoperativer Tag morgens',
      'Stufenweises Vorgehen: Kopfteil aufstellen -> Sitzen an Bettkante (Fußkontakt zum Boden) -> Stand -> Schritte',
      'Sicherheitsregel: Vitalwerte vorab messen, Mobilisation immer zu zweit durchführen',
      'Abbruchkriterien: Schwindel, Kaltschweißigkeit, Nausea, Zyanose'
    ],
    clinicalTip: 'Lassen Sie frisch operierte Patienten NIEMALS allein zur Toilette gehen – auch wenn sie beteuern: "Es geht mir schon super!"',
    reference: 'I Care Pflege S. 811 & CNE S. 6'
  },
  {
    id: 'nugget_17',
    number: 17,
    title: 'Patientenkontrollierte Analgesie (PCA) & Schmerztherapie',
    category: 'Schmerzmanagement',
    summary: 'Mit der PCA-Pumpe steuern Patienten ihre Schmerztherapie selbst. Ein elektronisches Sperrintervall verhindert eine versehentliche Überdosierung.',
    corePoints: [
      'Funktionsprinzip: Patientin drückt Taster bei Schmerzen -> voreingestellter Bolus (z. B. Piritramid oder Morphin)',
      'Sperrzeit (Lockout): Z. B. 10–15 Minuten Pause, in denen Tastendrücke registriert, aber kein Wirkstoff abgegeben wird',
      'Sicherheit: Nur die Patientin selbst darf den Knopf drücken (NIEMALS Angehörige oder Pflegepersonal!)',
      'Überwachung: Schmerzskala (NRS), Atemfrequenz (Gefahr der Atemdepression!), Vigilanz'
    ],
    clinicalTip: 'Wenn die Atemfrequenz unter 10/min sinkt oder die Patientin schwer weckbar ist, muss die PCA sofort gestoppt und der Dienstarzt alarmiert werden (Gegengift Naloxon bereitstellen)!',
    reference: 'I Care Pflege S. 811 & Thieme Compliance Video'
  },
  {
    id: 'nugget_18',
    number: 18,
    title: 'Miktion & Zeitpunkt für orale Nahrungsaufnahme',
    category: 'Ausscheidung & Kost',
    summary: 'Das erste erfolgreiche Wasserlassen (Spontanmiktion) zeigt an, dass vegetative Reflexe und Blaseninnervation nach der Narkose intakt sind. Es ist ein klassischer Meilenstein für die orale Kost.',
    corePoints: [
      'Spontanurin innerhalb von 6 bis 8 Stunden nach Blasenkatheter-Entfernung oder OP',
      'Erste Flüssigkeitszufuhr: Schluckweise stilles Wasser oder lauwarmer Tee nach AWR-Freigabe',
      'Miktionsförderung: Intimsphäre wahren, Wasserhahn plätschern lassen, aufrechte Sitzposition'
    ],
    clinicalTip: 'Klopfen Sie bei fehlender Miktion vorsichtig den Unterbauch ab oder nutzen Sie einen mobilen Blasenscanner, um einen schmerzlosen Harnverhalt zu erkennen.',
    reference: 'I Care Pflege S. 812'
  },
  {
    id: 'nugget_19',
    number: 19,
    title: 'Stufenweiser Kostaufbau nach Cholezystektomie',
    category: 'Ernährung',
    summary: 'Nach laparoskopischer Cholezystektomie folgt ein zügiger, aber schonender Kostaufbau von klarer Flüssigkeit über leichte Kost zur leichten Vollkost.',
    corePoints: [
      'Stufe 1 (OP-Tag): Schluckweise klares Wasser/Tee bei fehlender Nausea',
      'Stufe 2 (1. Tag p.o.): Zwieback, Haferschleim, leichte Suppe',
      'Stufe 3: Leichte Vollkost (fettarm, blähungsarm, kleine Portionen)',
      'Vermeidung: Sehr fettige, frittierte oder stark gewürzte Speisen in den ersten Wochen (Gallefluss muss sich adaptieren)'
    ],
    clinicalTip: 'Darmgeräusche mit dem Stethoskop in allen 4 Quadranten auskultieren – Gluckern und Gurren signalisieren erwachende Peristaltik!',
    reference: 'I Care Pflege S. 812 & CNE S. 7'
  }
];
