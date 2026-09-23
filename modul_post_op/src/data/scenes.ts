import { Scene } from '../types';

export const initialVitals = {
  hr: 78,
  bp: '135/85',
  spo2: 98,
  nrs: 0,
  vig: 'Wach'
};

export const scenes: Record<string, Scene> = {
  'prep': {
    id: 'prep',
    location: 'Stationszimmer - Vorbereitung',
    time: '10:25',
    title: 'Vorbereitung des Bettplatzes',
    sceneType: 'inventory',
    text: `<p>Frau Meinhardt wird laut OP Plan gegen 10:30 Uhr im AWR ankommen. Meist bleiben die Patient:innen dort für eine Stunde zur Überwachung. Es ist Zeit Frau Meinhardts Bettenplatz vorzubereiten.</p>
           <p class="mt-4 font-bold text-teal-700">Wie bereiten Sie das Zimmer korrekt vor. Wählen Sie das Material für Frau Meinhardts Bettenplatz aus:</p>`,
    inventoryItems: [
      { id: 'iv_pole', name: 'Infusionsständer', icon: 'Activity', description: '', isCorrect: true },
      { id: 'basin', name: 'Nierenschale', icon: 'Trash2', description: '', isCorrect: true },
      { id: 'zellstoff', name: 'Zellstoff', icon: 'FileText', description: '', isCorrect: true },
      { id: 'attends', name: 'Saugfähige Unterlage', icon: 'Square', description: '', isCorrect: true },
      { id: 'toilet_chair', name: 'Toilettenstuhl', icon: 'Monitor', description: '', isCorrect: true },
      { id: 'steckbecken', name: 'Steckbecken', icon: 'Square', description: '', isCorrect: true },
      { id: 'coffee', name: 'Kaffeebecher', icon: 'Coffee', description: '', isCorrect: false }
    ],
    choices: [
      {
        id: 'c1',
        text: "Zimmer ist fertig vorbereitet.",
        type: 'success',
        scoreChange: 0,
        categoryImpact: { voraussicht: 10 },
        feedback: {
          title: "Vorbereitung",
          text: "Ein gut vorbereiteter Bettplatz unterstützt eine systematische Arbeitsweise.",
          source: "CNE: Postoperativ pflegen, S. 2"
        },
        next: 'prep_call'
      }
    ]
  },
  'prep_call': {
    id: 'prep_call',
    location: 'Stationszimmer',
    time: '10:30',
    title: 'Der Anruf',
    text: `<p>Das Telefon klingelt:</p>
           <div class="bg-slate-50 border-l-4 border-teal-500 p-5 my-6 italic text-slate-700 rounded-r-xl">
             "Hallo Station 4, hier AWR. Frau Meinhardt ist stabil. Könnt ihr sie abholen?"
           </div>`,
    choices: [
      {
        id: 'c1',
        text: "Gemeinsam mit der Auszubildenden abholen.",
        type: 'success',
        scoreChange: 10,
        categoryImpact: { fachwissen: 5, patientenzentrierung: 5 },
        feedback: {
          title: "Goldstandard",
          text: "Die Abholung zu zweit (inkl. Fachkraft) ist für den sicheren Transport essenziell.",
          source: "Thiemes Pflege, S. 809"
        },
        next: 'prep_transport'
      },
      {
        id: 'c2',
        text: "Schnell alleine losgehen, die Auszubildende soll auf die Klingeln achten.",
        type: 'warning',
        scoreChange: -10,
        categoryImpact: { fachwissen: -10, voraussicht: -5 },
        feedback: {
          title: "Transport-Risiko",
          text: "Postoperative Patienten sollten möglichst zu zweit abgeholt werden, um bei Notfällen (Kreislauf, Erbrechen) sofort reagieren zu können.",
          source: "Thieme I care Pflege, S. 809"
        },
        next: 'prep_transport'
      },
      {
        id: 'c3',
        text: "Auszubildende (1. Lehrjahr) vorschicken. Sie soll das schon mal lernen.",
        type: 'danger',
        scoreChange: -20,
        categoryImpact: { fachwissen: -20, voraussicht: -10 },
        feedback: {
          title: "Gefährliche Delegation",
          text: "Eine examinierte Pflegefachkraft muss zwingend bei der Abholung dabei sein, um den Zustand fachgerecht zu beurteilen und die Übergabe entgegenzunehmen.",
          source: "Thieme I care Pflege, S. 809"
        },
        next: 'prep_transport'
      }
    ]
  },
  'prep_transport': {
    id: 'prep_transport',
    location: 'Flur',
    time: '10:32',
    title: 'Transport vorbereiten',
    sceneType: 'inventory',
    text: `<p>Bevor Sie zum Aufwachraum gehen, müssen Sie noch das Equipment für den Transport zusammenstellen.</p>
           <p class="mt-4 font-bold text-teal-700">Wählen Sie aus, was Sie mitnehmen:</p>`,
    inventoryItems: [
      { id: 'ambu', name: 'Ambu-Beutel', icon: 'Briefcase', description: '', isCorrect: true },
      { id: 'tube', name: 'Guedel-/Wendel-Tubus', icon: 'Pipette', description: '', isCorrect: true },
      { id: 'phone', name: 'Diensttelefon', icon: 'Phone', description: '', isCorrect: true },
      { id: 'pulsoxy', name: 'Mobiles Pulsoxymeter', icon: 'HeartPulse', description: '', isCorrect: true },
      { id: 'bp_cuff', name: 'Blutdruckmanschette & Stethoskop', icon: 'Stethoscope', description: '', isCorrect: true },
      { id: 'mandrin', name: 'Mandrin für i.v. Zugang', icon: 'Syringe', description: '', isCorrect: false },
      { id: 'infusion', name: 'Infusionslösung', icon: 'Droplets', description: '', isCorrect: false },
      { id: 'bandage', name: 'Verbandmaterial', icon: 'Package', description: '', isCorrect: false }
    ],
    choices: [
      {
        id: 'c1',
        text: "Equipment bestätigt, auf zum AWR.",
        type: 'success',
        scoreChange: 0,
        categoryImpact: { voraussicht: 5 },
        feedback: {
          title: "Ausrüstung",
          text: "Standardmäßig werden Ambu-Beutel und Guedel-/Wendel-Tubus für Notfälle mitgenommen. Das Diensttelefon ist zwingend erforderlich, um Hilfe rufen zu können. Blutdruckmanschette und Verbandmaterial verbleiben in der Regel auf der Station.",
          source: "Notfallmanagement"
        },
        next: 'awr_arrival'
      }
    ]
  },
  'awr_arrival': {
    id: 'awr_arrival',
    location: 'Aufwachraum',
    time: '10:40',
    title: 'Übergabe im Aufwachraum',
    timeLimit: 45,
    timeoutPenalty: -15,
    updateVitals: { bp: '--/--', hr: '--', spo2: '--', nrs: '--', vig: 'Somnolent' },
    text: `<p>Frau Meinhardt ist ansprechbar, auf Ansprache erweckbar und wirkt aktuell noch sehr müde. Der Pfleger übergibt Ihnen die Kurve. <em>"Sie hat vor 15 Minuten etwas Piritramid bekommen. Nimmst du sie?"</em></p>`,
    choices: [
      {
        id: 'c_pain_manager',
        text: "Kurve annehmen, nachfragen wie das postoperative Schmerzkonzept (Novalgin-Schema) aussieht und die Vigilanz prüfen.",
        type: 'success',
        scoreChange: 20,
        action: 'openRecord',
        forbiddenItems: ['coffee'],
        categoryImpact: { fachwissen: 15, voraussicht: 15 },
        feedback: {
          title: "Ausgezeichnetes Schmerzmanagement",
          text: "Die frühzeitige Klärung des Schmerzkonzepts beugt späteren Unsicherheiten auf der Station vor. Der Pfleger erklärt Ihnen das Novalgin-Schema.",
          source: "Expertenstandard Schmerzmanagement"
        },
        next: 'awr_vigilanz'
      },
      {
        id: 'c1',
        text: "Kurve annehmen, nachfragen und Vigilanz aktiv prüfen.",
        type: 'success',
        scoreChange: 15,
        forbiddenItems: ['coffee'],
        categoryImpact: { fachwissen: 10, voraussicht: 10 },
        feedback: {
          title: "Sehr umsichtig",
          text: "Sich nicht mit der knappen Übergabe zufriedenzugeben ist wichtig, um den genauen Zustand der Patientin zu ermitteln. Sie haben die Hände frei und können die Kurve prüfen.",
          source: "Thiemes Pflege, S. 811"
        },
        next: 'awr_vigilanz'
      },
      {
        id: 'c_coffee',
        text: "Kaffeebecher abstellen, Kurve annehmen, nachfragen und Vigilanz aktiv prüfen.",
        type: 'warning',
        scoreChange: 5,
        energyChange: -10,
        requiredItems: ['coffee'],
        categoryImpact: { voraussicht: -10, fachwissen: 10 },
        feedback: {
          title: "Unpraktisch",
          text: "Sich nicht mit der knappen Übergabe zufriedenzugeben ist wichtig. Allerdings stört der Kaffeebecher im AWR enorm, da Sie beide Hände für die Patientin und die Akten benötigen.",
          source: "Thiemes Pflege, S. 811"
        },
        next: 'awr_vigilanz'
      },
      {
        id: 'c2',
        text: "Kurz zunicken, Papiere schnappen und direkt zum Fahrstuhl. Zeit ist knapp.",
        type: 'danger',
        scoreChange: -15,
        energyChange: -10,
        categoryImpact: { fachwissen: -15, patientenzentrierung: -10 },
        feedback: {
          title: "Fatale Übergabe",
          text: "Sie haben den Patienten übernommen, ohne das Bewusstsein, den Verband, Drainagen oder ärztliche Anordnungen zu prüfen.",
          source: "Thieme I care Pflege, S. 809"
        },
        next: 'elevator_crisis_severe'
      },
      {
        id: 'c3',
        text: "Frau Meinhardt anschauen und sie weiterschlafen lassen, sie braucht ja Ruhe.",
        type: 'warning',
        scoreChange: -10,
        categoryImpact: { fachwissen: -10 },
        feedback: {
          title: "Fehlende Kontrolle",
          text: "Ruhe ist wichtig, aber eine aktive Kontrolle der Vigilanz und der Vitalwerte nach Opiatgabe im AWR ist zwingend erforderlich, bevor Sie den Transport beginnen.",
          source: "Thieme I care Pflege, S. 809"
        },
        next: 'elevator_crisis_severe'
      }
    ]
  },
  'awr_vigilanz': {
    id: 'awr_vigilanz',
    location: 'Aufwachraum',
    time: '10:42',
    title: 'Vigilanzprüfung',
    text: `<p>Sie sprechen Frau Meinhardt lauter an. Sie reagiert verlangsamt, wirkt etwas schläfrig, ist aber auf Ansprache weckbar und orientiert. Sie haben noch nicht in die Kurve/Akte geschaut.</p>`,
    choices: [
      {
        id: 'c1',
        text: "Blutdruck messen und die Patientenakte (Kurve) des AWR auf Auffälligkeiten prüfen.",
        type: 'success',
        scoreChange: 10,
        action: 'openRecord',
        categoryImpact: { voraussicht: 10 },
        feedback: {
          title: "Klinischer Blick",
          text: "Die schläfrige Wirkung beruht nicht nur auf der aktuellen Piritramid-Gabe, sondern auch auf den Nachwirkungen der Narkotika, Sedativa und allgemeinen OP-Nachwirkungen. Eine genaue Kontrolle der Hämodynamik und die Überwachung auf mögliche Komplikationen ist zwingend erforderlich.",
          source: "Pharmakologie & Postoperative Überwachung"
        },
        next: 'awr_evaluate'
      },
      {
        id: 'c2',
        text: "Sie ist ja ansprechbar und stabil. Wir können auf Station fahren.",
        type: 'warning',
        scoreChange: -10,
        categoryImpact: { voraussicht: -10 },
        setFlags: ['awr_careless'],
        feedback: {
          title: "Unvollständige Prüfung",
          text: "Nur die Vigilanz zu prüfen reicht nicht aus. Nach Opiatgabe müssen auch Kreislauf und Atmung gesichert sein. Dies kann sich später rächen.",
          source: "Postoperative Überwachung"
        },
        next: 'elevator_crisis_severe'
      }
    ]
  },
  'awr_evaluate': {
    id: 'awr_evaluate',
    location: 'Aufwachraum',
    time: '10:45',
    title: 'Die Patientenakte',
    updateVitals: { bp: '105/60', hr: 85, spo2: 97, nrs: 3, vig: 'Wach' },
    text: `<p>Sie öffnen die Patientenakte. Ihnen fällt der AWR-Verlauf auf: Der Blutdruck war zwischenzeitlich auf 95/55 mmHg abgefallen. Aktuell bei 105/60 mmHg.</p>`,
    choices: [
      {
        id: 'c1',
        text: "Pfleger auf den Blutdruck ansprechen, Infusionsgeschwindigkeit nach ärztlicher Anordnung leicht erhöhen und Patientin genau im Blick behalten.",
        type: 'success',
        scoreChange: 15,
        categoryImpact: { voraussicht: 15, fachwissen: 10 },
        feedback: {
          title: "Prävention",
          text: "Sie haben die drohende Hypotonie frühzeitig erkannt und präventiv gehandelt.",
          source: "Hämodynamisches Monitoring"
        },
        next: 'elevator_nausea'
      },
      {
        id: 'c2',
        text: "Ignorieren. Ein RR von 105 systolisch reicht völlig für den Transport.",
        type: 'warning',
        scoreChange: -10,
        categoryImpact: { voraussicht: -15 },
        setFlags: ['ignored_hypotension'],
        feedback: {
          title: "Fehleinschätzung",
          text: "Postoperativ und nach Gabe von Opiaten kann der Blutdruck bei einem Lagewechsel rasch abstürzen. Dieser Fehler wird sich später rächen.",
          source: "Pharmakologie"
        },
        next: 'elevator_crisis_severe'
      }
    ]
  },
  'elevator_crisis_severe': {
    id: 'elevator_crisis_severe',
    location: 'Fahrstuhl',
    time: '10:48',
    title: 'Schock im Fahrstuhl',
    timeLimit: 20,
    timeoutPenalty: -20,
    updateVitals: { bp: '80/40', hr: 125, spo2: 89, vig: 'Somnolent' },
    text: `<p>Im Fahrstuhl sackt Frau Meinhardt plötzlich zusammen. Sie ist kaltschweißig, nicht ansprechbar. Der Kreislauf dekompensiert massiv!</p>`,
    choices: [
      {
        id: 'c_phone',
        text: "Sofort Schocklagerung (Beine hoch), Infusion voll aufdrehen, per Telefon Hilfe rufen!",
        type: 'success',
        scoreChange: 15,
        energyChange: -20,
        requiredItems: ['phone'],
        categoryImpact: { fachwissen: 10, voraussicht: 15 },
        feedback: {
          title: "Perfekte Rettung",
          text: "Das mitgebrachte Telefon und die schnelle Schocklagerung retten die Situation.",
          source: "Notfallmanagement"
        },
        next: 'ward_arrival'
      },
      {
        id: 'c_run',
        text: "Fahrstuhl anhalten, Pat. flach lagern und schnell zum AWR zurückrennen um Hilfe zu holen.",
        type: 'warning',
        scoreChange: -5,
        energyChange: -30,
        forbiddenItems: ['phone'],
        categoryImpact: { voraussicht: -15, zeitmanagement: -20 },
        feedback: {
          title: "Zeitverzögerung",
          text: "Da Sie kein Telefon haben, müssen Sie die Patientin kurz allein lassen. Wertvolle Zeit verstreicht, aber Hilfe kommt.",
          source: "Fehlende Ausrüstung"
        },
        next: 'ward_arrival'
      },
      {
        id: 'c_wrong',
        text: "Flach lagern und schnell weiterfahren auf Station.",
        type: 'danger',
        scoreChange: -100,
        categoryImpact: { fachwissen: -40 },
        feedback: {
          title: "Kreislaufversagen",
          text: "Die Patientin befindet sich im beginnenden Schock. Reines Abwarten führt zur Bewusstlosigkeit.",
          source: "Hypovolämischer Schock"
        },
        next: 'end_reanimation'
      }
    ]
  },
  'elevator_nausea': {
    id: 'elevator_nausea',
    location: 'Fahrstuhl',
    time: '10:48',
    title: 'Plötzliche Übelkeit',
    text: `<p>Im Fahrstuhl wird Frau Meinhardt plötzlich bleich und würgt. "Mir ist schrecklich schlecht...", flüstert sie.</p>`,
    choices: [
      {
        id: 'c1',
        text: "Vom AWR mitgegebene Nierenschale anreichen, Kopfteil sofort hochstellen und zügig weiterfahren.",
        type: 'success',
        scoreChange: 15,
        categoryImpact: { patientenzentrierung: 15, fachwissen: 10 },
        feedback: {
          title: "Sicherer Transport & PONV",
          text: "Durch das proaktive Entgegenwirken (Kopfteil hoch) und das Reichen der Nierenschale mindern Sie die Aspirationsgefahr bei postoperativer Übelkeit und Erbrechen (PONV) perfekt.",
          source: "Thieme I care Pflege, S. 811"
        },
        next: 'ward_arrival'
      },
      {
        id: 'c_flat',
        text: "Patientin beruhigen und komplett flach hinlegen, damit der Kreislauf stabil bleibt.",
        type: 'danger',
        scoreChange: -100,
        categoryImpact: { fachwissen: -25, patientenzentrierung: -10 },
        feedback: {
          title: "Absolute Aspirationsgefahr!",
          text: "Bei postoperativer Übelkeit und Erbrechen (PONV) darf die Patientin niemals flach gelagert werden! Erbrochenes ist in die Luftröhre gelangt (Aspiration).",
          source: "Thieme I care Pflege, S. 811"
        },
        next: 'end_aspiration'
      },
      {
        id: 'c_ignore',
        text: "Zureden und schnell weiterfahren. Gleich sind wir da.",
        type: 'warning',
        scoreChange: -15,
        energyChange: -20,
        categoryImpact: { voraussicht: -15, zeitmanagement: -15 },
        feedback: {
          title: "Ignorierte Symptome",
          text: "Das Ignorieren von Übelkeit kann zu Erbrechen und Aspiration führen. Zum Glück passiert es diesmal nicht, aber die Patientin fühlt sich extrem unwohl.",
          source: "Pflegeorganisation"
        },
        next: 'ward_arrival'
      }
    ]
  },
  'ward_arrival': {
    id: 'ward_arrival',
    location: 'Patientenzimmer',
    time: '11:00',
    title: 'Ankunft auf Station',
    updateVitals: { bp: '115/65', hr: 88, spo2: 98, nrs: 4, vig: 'Wach' },
    text: `<p>Sie kommen im Zimmer an. Frau Meinhardt liegt nun in ihrem Bett auf der Station. Was ist Ihr erster Schritt in der Erstversorgung?</p>`,
    choices: [
      {
        id: 'c1',
        text: "Infusion an den vorbereiteten Infusionsständer hängen, dann Wundverband, Drainagen und Vitalwerte prüfen.",
        type: 'success',
        scoreChange: 15,
        requiredItems: ['iv_pole'],
        categoryImpact: { fachwissen: 15, voraussicht: 10 },
        feedback: {
          title: "Priorisierung & Vorbereitung",
          text: "Korrekt. Sie können die Infusion sofort am vorbereiteten Ständer befestigen und dann die Erstversorgung (Vigilanz, Schmerz, Wunde, Vitalwerte) durchführen.",
          source: "CNE: Postoperativ pflegen, S. 3"
        },
        next: 'ward_acute_care'
      },
      {
        id: 'c_noiv',
        text: "Infusion notgedrungen ins Bett legen (kein Ständer da), dann Vitalwerte und Wunde prüfen.",
        type: 'warning',
        scoreChange: 0,
        energyChange: -15,
        forbiddenItems: ['iv_pole'],
        categoryImpact: { voraussicht: -15, fachwissen: 10 },
        feedback: {
          title: "Material vergessen",
          text: "Weil der Infusionsständer fehlt, liegt die Infusion unsicher im Bett. Die Vitalzeichenkontrolle ist korrekt, aber die Vorbereitung war mangelhaft.",
          source: "Arbeitsorganisation"
        },
        next: 'ward_acute_care'
      },
      {
        id: 'c2',
        text: "Erstmal ankommen lassen, in Ruhe dokumentieren und Schmerzmittel richten.",
        type: 'warning',
        scoreChange: -10,
        categoryImpact: { zeitmanagement: -10, fachwissen: -10 },
        feedback: {
          title: "Falsche Priorität",
          text: "Die Patientendokumentation ist wichtig, aber der Patientenzustand (Vitalparameter, Wunde) hat nach der Übernahme absolute Priorität.",
          source: "CNE: Postoperativ pflegen, S. 3"
        },
        next: 'ward_acute_care'
      },
      {
        id: 'c3',
        text: "Gleich auf die Bettkante mobilisieren, damit der Kreislauf in Schwung kommt.",
        type: 'danger',
        scoreChange: -15,
        categoryImpact: { fachwissen: -15, patientenzentrierung: -10 },
        feedback: {
          title: "Gefahr",
          text: "Bevor Sie mobilisieren, MÜSSEN Sie zwingend die Vitalwerte, das Bewusstsein und Schmerzen prüfen. Die Patientin weigert sich wegen starker Schmerzen.",
          source: "CNE: Postoperativ pflegen, S. 6"
        },
        next: 'ward_acute_care'
      }
    ]
  },
  'ward_acute_care': {
    id: 'ward_acute_care',
    location: 'Patientenzimmer',
    time: '11:15',
    title: 'Schmerzmanagement & Medikamentensicherheit',
    text: `<p>Frau Meinhardt klagt über Schmerzen im Operationsgebiet (NRS 6/10). In der ärztlichen Kurve steht als Bedarfsmedikation: <strong>Metamizol (Novalgin) 1g als Kurzinfusion</strong> bei Schmerzen > NRS 4.</p>`,
    choices: [
      {
        id: 'c1',
        text: "Ich lege die Metamizol-Kurzinfusion direkt an, um die starken Schmerzen schnell zu lindern.",
        type: 'danger',
        scoreChange: -20,
        requiredFlags: ['ignored_hypotension'],
        setFlags: ['novalgin_fast'],
        categoryImpact: { fachwissen: -20, voraussicht: -15 },
        feedback: {
          title: "Kritischer Blutdruckabfall!",
          text: "Gefährliche Medikamentengabe! Sie haben den kritischen Blutdruck aus dem AWR ignoriert und nun wieder nicht nachgemessen. Metamizol senkt den Blutdruck weiter. Frau Meinhardt wird aschfahl und der Kreislauf kollabiert.",
          source: "Pharmakologie / Medikamentensicherheit"
        },
        next: 'ward_wound_check'
      },
      {
        id: 'c2',
        text: "Ich lege die Metamizol-Kurzinfusion direkt an, um die starken Schmerzen schnell zu lindern.",
        type: 'warning',
        scoreChange: -10,
        forbiddenFlags: ['ignored_hypotension'],
        setFlags: ['novalgin_fast'],
        categoryImpact: { fachwissen: -10, voraussicht: -10 },
        feedback: {
          title: "Fehlende Vitalwertekontrolle",
          text: "Sie sollten Metamizol (Novalgin) niemals i.v. verabreichen, ohne vorher den Blutdruck zu messen. Es wirkt blutdrucksenkend. Zum Glück ist ihr Kreislauf hier stabil genug, ihr wird aber sehr schwindelig.",
          source: "Pharmakologie"
        },
        next: 'ward_wound_check'
      },
      {
        id: 'c3',
        text: "Vor der Gabe von Metamizol zwingend die Vitalwerte (insbesondere Blutdruck) messen.",
        type: 'success',
        scoreChange: 15,
        categoryImpact: { fachwissen: 15, voraussicht: 15 },
        action: 'measure',
        feedback: {
          title: "Gutes Critical Thinking",
          text: "Korrekt! Ein Mitdenken ist hier essenziell. Metamizol i.v. kann einen akuten Blutdruckabfall (Hypotension) verursachen. Sie messen den Blutdruck, der bei 100/60 mmHg liegt, und verabreichen die Infusion daraufhin stark verlangsamt und unter Beobachtung.",
          source: "4-Augen-Prinzip / Pharmakologie"
        },
        next: 'ward_wound_check'
      }
    ]
  },
  'ward_wound_check': {
    id: 'ward_wound_check',
    location: 'Patientenzimmer',
    time: '11:45',
    title: 'Verbandskontrolle & Palpation',
    text: (inventory) => inventory.includes('phone') 
      ? `<p>Sie haben Ihre keimarmen Handschuhe angezogen und bereits begonnen, den Bauchraum abzutasten, da <strong>klingelt Ihr Diensttelefon ohrenbetäubend laut in Ihrer Kasack-Tasche</strong>.</p>`
      : `<p>Sie haben Ihre keimarmen Handschuhe angezogen und beginnen konzentriert, den Bauchraum abzutasten, um ein akutes Abdomen auszuschließen. Ohne das Diensttelefon können Sie bei dieser Untersuchung zwar nicht gestört werden, allerdings sind Sie auch auf sich allein gestellt.</p>`,
    choices: [
      {
        id: 'c_phone_ignore',
        text: "Klingeln ignorieren, sich auf die Patientin fokussieren und die Palpation (Abtasten) auf Abwehrspannung durchführen.",
        type: 'success',
        scoreChange: 15,
        energyChange: 0,
        requiredItems: ['phone'],
        categoryImpact: { patientenzentrierung: 15, fachwissen: 20 },
        feedback: {
          title: "Fokus bewahrt",
          text: "Gut entschieden. Die sterile/hygienische Tätigkeit und die Patientin vor Ihnen haben in diesem kritischen Moment Priorität. Die Palpation ist entscheidend, um ein akutes Abdomen auszuschließen.",
          source: "Interruption Management / Hygiene"
        },
        next: 'ward_isbar_doctor'
      },
      {
        id: 'c_phone_answer_dirty',
        text: "Mit den angezogenen Handschuhen sofort ans Telefon gehen, es könnte wichtig sein.",
        type: 'danger',
        scoreChange: -20,
        energyChange: -5,
        requiredItems: ['phone'],
        categoryImpact: { fachwissen: -20 },
        feedback: {
          title: "Hygienefehler",
          text: "Kritischer Fehler! Sie kontaminieren Ihr Telefon und im Anschluss die Patientin. Tätigkeiten am Patienten dürfen nicht kontaminiert durchführt werden.",
          source: "Basishygiene"
        },
        next: 'ward_isbar_doctor'
      },
      {
        id: 'c_phone_answer_clean',
        text: "Handschuhe ausziehen, Hände desinfizieren, ans Telefon gehen.",
        type: 'warning',
        scoreChange: -5,
        energyChange: -15,
        requiredItems: ['phone'],
        categoryImpact: { zeitmanagement: -15, patientenzentrierung: -10 },
        feedback: {
          title: "Sicher, aber unangebracht",
          text: "Hygienisch korrekt, aber die Unterbrechung kostet Sie viel Zeit und Energie. Frau Meinhardt liegt ängstlich vor Ihnen. Die Untersuchung hätte Priorität gehabt.",
          source: "Patientenzentrierung"
        },
        next: 'ward_isbar_doctor'
      },
      {
        id: 'c_nophone_continue',
        text: "Palpation (Abtasten) auf Abwehrspannung konzentriert durchführen.",
        type: 'success',
        scoreChange: 15,
        energyChange: 0,
        forbiddenItems: ['phone'],
        categoryImpact: { patientenzentrierung: 15, fachwissen: 20 },
        feedback: {
          title: "Vollkommener Fokus",
          text: "Sie lassen sich nicht ablenken und führen die sterile/hygienische Tätigkeit konzentriert zu Ende. Die Untersuchung zeigt deutliche Abwehrspannung.",
          source: "Pflegediagnostik"
        },
        next: 'ward_isbar_doctor'
      }
    ]
  },
  'ward_isbar_doctor': {
    id: 'ward_isbar_doctor',
    location: 'Patientenzimmer',
    time: '12:00',
    title: 'Arztanruf (ISBAR)',
    sceneType: 'isbar_puzzle',
    text: `<p>Sie haben den Verband kontrolliert und eine frische Nachblutung festgestellt. Sie rufen die diensthabende Chirurgin an. Strukturieren Sie Ihre Meldung nach dem SBAR/ISBAR-Schema.</p>`,
    puzzleItems: [
      { id: 'i', text: 'Hier ist [Ihr Name]. Es geht um Frau Meinhardt, Zimmer 4. Z.n. LCE.', correctIndex: 0 },
      { id: 's', text: 'Es gibt eine frische, stetige Nachblutung aus dem Nabeltrokar-Zugang.', correctIndex: 1 },
      { id: 'b', text: 'OP war heute Morgen. Bisher war der Verband komplett trocken.', correctIndex: 2 },
      { id: 'a', text: 'Vitalwerte sind noch stabil (RR 110/70, Puls 85). Der Bauch ist dort zunehmend druckdolent.', correctIndex: 3 },
      { id: 'r', text: 'Könnten Sie bitte zeitnah zur Wundkontrolle und ärztlichen Beurteilung vorbeikommen?', correctIndex: 4 }
    ],
    choices: [
      {
        id: 'c1',
        text: "Arzt ist informiert.",
        type: 'success',
        scoreChange: 15,
        categoryImpact: { fachwissen: 10, zeitmanagement: 10 },
        feedback: {
          title: "Gute Kommunikation",
          text: "Klare, strukturierte Kommunikation stellt sicher, dass die Ärztin den Ernst der Lage richtig einschätzt.",
          source: "SBAR-Kommunikation"
        },
        next: 'ward_diet'
      }
    ]
  },
  'ward_diet': {
    id: 'ward_diet',
    location: 'Patientenzimmer',
    time: '14:00',
    title: 'Kostaufbau',
    text: `<p>Die Chirurgin war da, die Blutung konnte gestoppt werden. Frau Meinhardt fragt: <em>"Darf ich etwas trinken? Ich habe so einen trockenen Hals."</em></p>`,
    choices: [
      {
        id: 'c1',
        text: "Schluckweise Wasser oder ungesüßten Tee anbieten.",
        type: 'success',
        scoreChange: 15,
        forbiddenFlags: ['ignored_hypotension'],
        categoryImpact: { fachwissen: 10, patientenzentrierung: 15 },
        feedback: {
          title: "Moderner Kostaufbau",
          text: "Sehr gut! Ein früher Kostaufbau nach dem Fast-Track-Konzept fördert die Darmperistaltik und das Wohlbefinden. Langes Nüchternbleiben ist obsolet.",
          source: "Fast-Track-Chirurgie"
        },
        next: 'ward_urinary_retention'
      },
      {
        id: 'c1_fail',
        text: "Schluckweise Wasser oder ungesüßten Tee anbieten.",
        type: 'danger',
        scoreChange: -20,
        requiredFlags: ['ignored_hypotension'],
        categoryImpact: { fachwissen: -10, voraussicht: -15 },
        feedback: {
          title: "Verzögerter Kreislaufkollaps",
          text: "Frau Meinhardt setzt sich zum Trinken leicht auf. Aufgrund der ignorierten Hypotonie (Blutdruckabfall) aus dem AWR wird ihr nun massiv schwindelig, sie verschluckt sich schwer und erbricht. Der Fehler im Aufwachraum fordert jetzt seinen Tribut!",
          source: "Kardiologie / PONV"
        },
        next: 'ward_urinary_retention'
      },
      {
        id: 'c2',
        text: "Erstmal strikt nüchtern bleiben, bis morgen früh.",
        type: 'warning',
        scoreChange: -5,
        categoryImpact: { fachwissen: -5, patientenzentrierung: -10 },
        feedback: {
          title: "Zu konservativ",
          text: "Nach modernen ERAS-Konzepten (Enhanced Recovery After Surgery) dürfen Patienten nach einer komplikationslosen laparoskopischen Cholezystektomie (LCE) zügig schluckweise trinken, wenn sie wach sind.",
          source: "ERAS Guidelines"
        },
        next: 'ward_urinary_retention'
      }
    ]
  },
  'ward_urinary_retention': {
    id: 'ward_urinary_retention',
    location: 'Patientenzimmer',
    time: '15:30',
    title: 'Harnverhalt?',
    text: `<p>Es ist mittlerweile Nachmittag (ca. 4,5 Stunden nach der OP). Normalerweise ist in diesem Zeitfenster eine ausbleibende Miktion noch kein akuter Notfall, doch Frau Meinhardt klingelt und berichtet, dass sie starken Harndrang verspürt, heftige Unterbauchschmerzen hat und nicht urinieren kann.</p>`,
    choices: [
      {
        id: 'c1',
        text: "Die Blase palpieren (abtasten), die Patientin nach Schmerzcharakter befragen und zunächst pflegerisch-konservative Maßnahmen (z. B. Wasserhahn laufen lassen, Wärme) ausprobieren.",
        type: 'success',
        scoreChange: 15,
        categoryImpact: { fachwissen: 15, patientenzentrierung: 10 },
        feedback: {
          title: "Stufenweises Vorgehen",
          text: "Sehr gut! Ein postoperativer Harnverhalt ist häufig. Zuerst wird die Blasenfüllung verifiziert und mit konservativen Mitteln (z.B. Wärme, fließendes Wasser) versucht, die Miktion anzuregen.",
          source: "Pflegerische Interventionen"
        },
        next: 'ward_mobi_decision'
      },
      {
        id: 'c2',
        text: "Sofort einen Einmalkatheter legen, um die Blase zu entlasten.",
        type: 'danger',
        scoreChange: -15,
        categoryImpact: { fachwissen: -15, patientenzentrierung: -10 },
        feedback: {
          title: "Zu invasiv",
          text: "Ein Katheterismus ist eine ärztliche Anordnung und birgt ein hohes Infektionsrisiko. Er ist immer die Ultima Ratio, nachdem konservative Methoden versagt haben.",
          source: "Infektionsschutz / Pflegestandards"
        },
        next: 'ward_mobi_decision'
      },
      {
        id: 'c3',
        text: "Beruhigen und abwarten. Sie hat ja Infusionen bekommen, das kommt noch.",
        type: 'warning',
        scoreChange: -10,
        categoryImpact: { voraussicht: -15 },
        feedback: {
          title: "Gefahr der Überdehnung",
          text: "Nur abzuwarten ist riskant. Eine Überdehnung der Harnblase kann zu dauerhaften Schäden des Detrusormuskels führen. Die Symptome müssen ernst genommen werden.",
          source: "Urologie / Pflege"
        },
        next: 'ward_mobi_decision'
      }
    ]
  },
  'ward_mobi_decision': {
    id: 'ward_mobi_decision',
    location: 'Patientenzimmer',
    time: '16:00',
    title: 'Frühmobilisation - Entscheidung',
    text: `<p>Nach ärztlicher Anordnung steht die Frühmobilisation an. Frau Meinhardt liegt noch im Bett.</p>`,
    choices: [
      {
        id: 'c1_novalgin',
        text: "Gemeinsam auf die Bettkante mobilisieren und ein paar Schritte versuchen.",
        type: 'danger',
        scoreChange: -25,
        requiredFlags: ['novalgin_fast'],
        categoryImpact: { fachwissen: -20, voraussicht: -20 },
        feedback: {
          title: "Kreislaufkollaps durch Medikamentenfehler!",
          text: "Sie haben die aktuellen Vitalwerte nicht gemessen! Durch die vorangegangene, unkontrollierte Novalgin-Gabe ist ihr Blutdruck massiv im Keller. Beim Aufstehen kollabiert sie sofort. Ein klassischer Fehler der Medikamentensicherheit beim Mobilisieren!",
          source: "Pharmakologie / Mobilisation"
        },
        next: 'shift_end'
      },
      {
        id: 'c1',
        text: "Gemeinsam auf die Bettkante mobilisieren und ein paar Schritte versuchen.",
        type: 'danger',
        scoreChange: -20,
        forbiddenFlags: ['novalgin_fast'],
        categoryImpact: { fachwissen: -15, voraussicht: -20 },
        feedback: {
          title: "Sturzgefahr - Kritischer Fehler",
          text: "Sie haben die aktuellen Vitalwerte nicht gemessen! Die Patientin ist noch hypoton und kollabiert beim Aufstehen fast. Sie können sie gerade noch auffangen.",
          source: "CNE: Postoperativ pflegen"
        },
        next: 'shift_end'
      },
      {
        id: 'c2_novalgin',
        text: "Patientin auffordern, selbstständig aufzustehen und ins Bad zu gehen.",
        type: 'danger',
        scoreChange: -30,
        requiredFlags: ['novalgin_fast'],
        categoryImpact: { fachwissen: -25, voraussicht: -25 },
        feedback: {
          title: "Sturz durch Medikamentenfehler!",
          text: "Der erste Mobilisationsversuch muss zwingend in Begleitung einer Pflegekraft erfolgen! Durch die unkontrollierte Novalgin-Gabe ist ihr Blutdruck massiv im Keller. Sie stürzt auf dem Weg ins Bad.",
          source: "CNE: Postoperativ pflegen / Pharmakologie"
        },
        next: 'shift_end'
      },
      {
        id: 'c2',
        text: "Patientin auffordern, selbstständig aufzustehen und ins Bad zu gehen.",
        type: 'danger',
        scoreChange: -25,
        forbiddenFlags: ['novalgin_fast'],
        categoryImpact: { fachwissen: -20, voraussicht: -20 },
        feedback: {
          title: "Sturzgefahr - Kritischer Fehler",
          text: "Der erste Mobilisationsversuch muss zwingend in Begleitung einer Pflegekraft erfolgen und die Vitalwerte müssen geprüft sein! Die Patientin stürzt beinahe.",
          source: "CNE: Postoperativ pflegen, S. 6"
        },
        next: 'shift_end'
      },
      {
        id: 'c3',
        text: "Kreislaufsituation beurteilen: Zuerst Vitalwerte (Blutdruck & Puls) kontrollieren.",
        type: 'success',
        scoreChange: 15,
        categoryImpact: { voraussicht: 15, fachwissen: 10 },
        feedback: {
          title: "Vorbildliche Patientensicherheit",
          text: "Bevor Sie die Patientin an die Bettkante setzen, müssen Sie zwingend die Kreislaufsituation beurteilen.",
          source: "Pflegerische Interventionen"
        },
        next: 'ward_mobi_measure'
      }
    ]
  },
  'ward_mobi_measure': {
    id: 'ward_mobi_measure',
    location: 'Patientenzimmer',
    time: '16:05',
    title: 'Frühmobilisation - Vorbereitung',
    sceneType: 'measurement',
    text: `<p>Messen Sie nur die erforderlichen Werte, um zu prüfen, ob die Kreislaufsituation eine Mobilisation zulässt.</p>`,
    choices: [
      {
        id: 'c_measure_incomplete',
        text: "Werte unvollständig",
        type: 'danger',
        scoreChange: -20,
        action: 'measure',
        categoryImpact: { fachwissen: -15, voraussicht: -20 },
        feedback: {
          title: "Vitalwerte unvollständig",
          text: "Sie haben die Kreislaufwerte (Blutdruck und/oder Puls) nicht vollständig erhoben! Das ist vor der ersten Mobilisation fahrlässig. Die Patientin kollabiert beim Versuch aufzustehen.",
          source: "Pflegerische Interventionen / Sturzprophylaxe"
        },
        next: 'shift_end'
      },
      {
        id: 'c_measure_novalgin',
        text: "Werte ermittelt",
        type: 'danger',
        scoreChange: -20,
        action: 'measure',
        categoryImpact: { fachwissen: -20, voraussicht: 10 },
        feedback: {
          title: "Kritische Werte entdeckt!",
          text: "Die Messung zeigt 90/55 mmHg! Durch die ungeprüfte Novalgin-Gabe ist ihr Blutdruck massiv abgefallen. Ein Glück, dass Sie jetzt vor der Mobilisation gemessen haben! Die Mobi muss sofort abgebrochen werden. Ein klassischer Fehler der Medikamentensicherheit.",
          source: "Pharmakologie / Mobilisation"
        },
        next: 'shift_end'
      },
      {
        id: 'c_measure',
        text: "Werte ermittelt",
        type: 'success',
        scoreChange: 10,
        action: 'measure',
        categoryImpact: { voraussicht: 10 },
        feedback: {
          title: "Sicherheit zuerst",
          text: "Gut. Die Messung zeigt normotone Werte (120/80 mmHg, HF 85/min). Jetzt kann die Patientin schrittweise mobilisiert werden.",
          source: "Pflegerische Interventionen"
        },
        next: 'ward_mobi_action'
      }
    ]
  },
  'ward_mobi_action': {
    id: 'ward_mobi_action',
    location: 'Patientenzimmer',
    time: '16:15',
    title: 'Frühmobilisation - Die Ablehnung',
    text: `<p>Die Kreislaufwerte sind stabil. Sie bitten Frau Meinhardt, sich mit Ihrer Hilfe an die Bettkante zu setzen. Sie lehnt jedoch ab: <em>"Nein, bitte nicht! Das zieht so wahnsinnig im Bauch, ich möchte liegen bleiben. Aber ich muss so furchtbar dringend auf Toilette!"</em></p>`,
    choices: [
      {
        id: 'c_walk',
        text: "Ich mobilisiere sie schonend, aber bestimmt unter Schmerzen ins Badezimmer. Die Frühmobilisation ist ärztlich angeordnet.",
        type: 'danger',
        scoreChange: -20,
        energyChange: -25,
        categoryImpact: { patientenzentrierung: -25, fachwissen: -10 },
        feedback: {
          title: "Empathielos & Gefährlich",
          text: "Sie dürfen eine Patientin nicht gegen ihren Willen (und unter starken Schmerzen) zum Laufen zwingen! Das führt zu Stress, Blutdruckspitzen und starkem Vertrauensverlust. Eine alternative, schonendere Ausscheidungsmethode wäre hier zwingend geboten.",
          source: "Pflegeethik / Patientenrechte"
        },
        next: 'shift_end'
      },
      {
        id: 'c_chair',
        text: "Ich stelle den vorbereiteten Toilettenstuhl direkt ans Bett, sodass sie sich nur kurz und gestützt aufsetzen muss.",
        type: 'success',
        scoreChange: 15,
        requiredItems: ['toilet_chair'],
        categoryImpact: { voraussicht: 15, patientenzentrierung: 15 },
        feedback: {
          title: "Perfekte Vorbereitung",
          text: "Da Sie den Toilettenstuhl vorausschauend bereitgestellt haben, bieten Sie einen guten Kompromiss: Frau Meinhardt wird kurz an die Bettkante mobilisiert (fördert Kreislauf), aber der weite, schmerzhafte Weg ins Bad bleibt ihr erspart. Sie ist sehr dankbar.",
          source: "Patientenbeobachtung & Empathie"
        },
        next: 'shift_end'
      },
      {
        id: 'c_steckbecken',
        text: "Ich schiebe ihr schonend das vorbereitete Steckbecken (Bettpfanne) unter. So muss sie nicht aufstehen.",
        type: 'success',
        scoreChange: 10,
        requiredItems: ['steckbecken'],
        categoryImpact: { voraussicht: 10, patientenzentrierung: 15 },
        feedback: {
          title: "Schonende Alternative",
          text: "Gute Lösung. Da sie das Aufstehen wegen Schmerzen ablehnt, ist das Steckbecken die schonendste Variante. Die eigentliche 'Frühmobilisation' muss dann aber später, nach besserer Schmerztherapie, nachgeholt werden.",
          source: "Pflegepraxis"
        },
        next: 'shift_end'
      },
      {
        id: 'c_fetch',
        text: "Ich gehe schnell ins unreine Arbeitszimmer und hole einen Toilettenstuhl oder ein Steckbecken.",
        type: 'warning',
        scoreChange: -10,
        energyChange: -20,
        forbiddenItems: ['toilet_chair', 'steckbecken'],
        categoryImpact: { voraussicht: -15, zeitmanagement: -15 },
        feedback: {
          title: "Mangelnde Vorbereitung",
          text: "Frau Meinhardt leidet unter Schmerzen und starkem Harndrang, während Sie über den halben Flur hetzen müssen, um Material zu besorgen. Das kostet Sie enorm viel Energie und Zeit. Hätten Sie das Material bei der Zimmer-Vorbereitung bedacht, wäre das erspart geblieben.",
          source: "Arbeitsorganisation"
        },
        next: 'shift_end'
      }
    ]
  },
  'shift_end': {
    id: 'shift_end',
    location: 'Dienstzimmer',
    time: '20:15',
    title: 'Schichtende: Übergabe',
    sceneType: 'isbar_puzzle',
    text: `<p>Die Spätschicht neigt sich dem Ende. Frau Meinhardt ist stabil, die Blutung konnte gestoppt werden, sie konnte urinieren. Strukturieren Sie die finale Übergabe an den Nachtdienst nach dem ISBAR-Schema.</p>`,
    puzzleItems: [
      { id: 'i', text: 'Frau Meinhardt, 67, Zustand nach laparoskopischer Cholezystektomie (LCE) heute Morgen.', correctIndex: 0 },
      { id: 's', text: 'Aktuell kreislaufstabil, leichte Nachblutung am Nachmittag, welche gestillt wurde.', correctIndex: 1 },
      { id: 'b', text: 'Postoperative Schläfrigkeit, temporäre Hypotonie und Übelkeit, Blasenfunktion mittlerweile intakt.', correctIndex: 2 },
      { id: 'a', text: 'RR 130/80, Puls 74, SpO2 97%, NRS 2. Verband trocken, Kostaufbau läuft.', correctIndex: 3 },
      { id: 'r', text: 'Verbandskontrolle in der Nacht, Flüssigkeitsbilanzierung fortführen.', correctIndex: 4 }
    ],
    choices: [
      {
        id: 'c1',
        text: "Übergabe abschließen.",
        type: 'success',
        scoreChange: 15,
        categoryImpact: { fachwissen: 10, patientenzentrierung: 10 },
        feedback: {
          title: "Übergabe erfolgreich",
          text: "Sie haben die Schicht erfolgreich und sicher beendet.",
          source: "Übergabestandards"
        },
        next: 'end'
      }
    ]
  },
  'end_reanimation': {
    id: 'end_reanimation',
    location: 'Intensivstation',
    time: '18:00',
    title: 'SIMULATION ABGEBROCHEN',
    updateVitals: { bp: '--/--', hr: '--', spo2: '--', vig: 'Bewusstlos' },
    text: '<p>Der Zustand der Patientin ist lebensbedrohlich instabil geworden. Sie musste reanimiert werden.</p>',
    isEnd: true
  },
  'end_aspiration': {
    id: 'end_aspiration',
    location: 'Intensivstation',
    time: '13:10',
    title: 'SCHWERER FEHLER (ASPIRATION)',
    updateVitals: { spo2: 78, hr: 140, bp: '150/90', vig: 'Somnolent' },
    text: '<p>Die Patientin hat erbrochen, während sie flach auf dem Rücken lag. Der saure Mageninhalt ist in die Luftröhre und Lunge gelangt (Aspiration). Sie entwickelt eine akute respiratorische Insuffizienz. Dies ist ein absoluter Notfall und ein schwerer Pflegefehler.</p>',
    isEnd: true
  },
  'end': {
    id: 'end',
    location: '',
    time: '',
    title: 'ENDE',
    text: '',
    isEnd: true
  }
};
