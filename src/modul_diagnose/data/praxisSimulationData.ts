import { AnamneseStep } from '../types';

export const anamneseSteps: AnamneseStep[] = [
  {
    id: 'step_welcome',
    stepNumber: 1,
    phaseTitle: 'Phase 1: Ersteinschätzung & Schmerzlokalisation',
    situation: 'Frau Meinhardt (67 J.) sitzt im Behandlungszimmer der Hausarztpraxis. Sie hält sich mit beiden Händen die rechte Bauchseite, atmet vorsichtig flach und wirkt sichtlich erschöpft.',
    instruction: 'Welche Frage stellen Sie als PFA als Erstes, um den Schmerzcharakter und die Lokalisation pflegerisch präzise zu erfassen?',
    choices: [
      {
        id: 'q1_opt',
        question: '„Guten Tag Frau Meinhardt. Wo genau tut es Ihnen weh, wie fühlt sich der Schmerz an (ziehend, krampfartig) und strahlt er irgendwohin aus?“',
        category: 'optimal',
        patientAnswer: '„Es fing gestern Abend plötzlich an... Es ist so ein fürchterlicher krampfartiger Schmerz hier oben rechts unter den Rippen. Zwischendurch zieht es mir bis hoch in die rechte Schulter und in den Rücken!“',
        clinicalSignificance: 'Klassisches Zeichen: Krampfartiger Kolikschmerz im rechten Oberbauch mit Ausstrahlung in die rechten Head-Zonen (Schulter/Dermatome C3-C5).',
        diagnosticPoints: 25
      },
      {
        id: 'q1_sub',
        question: '„Haben Sie vielleicht nur eine Magen-Darm-Grippe oder etwas Falsches gegessen?“',
        category: 'unnoetig',
        patientAnswer: '„Ich weiß nicht... Aber so einen Schmerz hatte ich noch nie. Mir ist zwar schlecht, aber das hier ist viel schlimmer als jeder Magen-Darm-Infekt.“',
        clinicalSignificance: 'Zu voreilig und suggestiv. Frau Meinhardt fühlt sich verunsichert, liefert aber den Hinweis auf atypischen Schmerz.',
        diagnosticPoints: 10
      },
      {
        id: 'q1_irr',
        question: '„Wann waren Sie denn das letzte Mal beim Zahnarzt?“',
        category: 'irrelevant',
        patientAnswer: '„Beim Zahnarzt? Vor zwei Monaten, aber was hat das denn mit meinem Bauch zu tun?“',
        clinicalSignificance: 'Völlig irrelevante Frage in der akuten Abdominalsituation.',
        diagnosticPoints: 0
      }
    ]
  },
  {
    id: 'step_trigger',
    stepNumber: 2,
    phaseTitle: 'Phase 2: Auslöser & Ernährungsanamnese',
    situation: 'Frau Meinhardts Schmerz deutet auf ein Geschehen im rechten Oberbauch hin. Nun geht es um den zeitlichen Zusammenhang mit der Nahrungsaufnahme.',
    instruction: 'Was erfragen Sie bezüglich möglicher Auslöser vor Beginn der Schmerzen?',
    choices: [
      {
        id: 'q2_opt',
        question: '„Hatten Sie vor Schmerzbeginn etwas gegessen – insbesondere etwas Fettiges, Gebratenes oder Schweres?“',
        category: 'optimal',
        patientAnswer: '„Ja! Gestern gab es Familienbraten mit fetter Kruste, Knödeln und reichlich Sauce. Etwa eine Stunde später ging das Stechen und Krampfen los...“',
        clinicalSignificance: 'Volltreffer: Fettiges Essen stimuliert die Cholezystokinin-Ausschüttung, woraufhin die Gallenblase kräftig kontrahiert und Steine einklemmt.',
        diagnosticPoints: 25
      },
      {
        id: 'q2_sub',
        question: '„Haben Sie gestern viel Sport getrieben oder schwere Kisten gehoben?“',
        category: 'unnoetig',
        patientAnswer: '„Nein, überhaupt nicht. Wir saßen nur gemütlich beim Sonntagsessen.“',
        clinicalSignificance: 'Schließt Muskelkater oder Hebetrauma aus, bringt aber wenig differentialdiagnostischen Gewinn.',
        diagnosticPoints: 10
      }
    ]
  },
  {
    id: 'step_excretion',
    stepNumber: 3,
    phaseTitle: 'Phase 3: Ausscheidung & Begleitsymptome (Red Flags)',
    situation: 'Die PFA muss gezielt nach Veränderungen bei Stuhl und Urin fragen, um einen Gallenstau (Cholestase) nicht zu übersehen.',
    instruction: 'Welche gezielte Frage zur Ausscheidung und zu vegetativen Begleitsymptomen stellen Sie?',
    choices: [
      {
        id: 'q3_opt',
        question: '„Frau Meinhardt, ist Ihnen bei den Toilettengängen eine Veränderung aufgefallen – war der Urin auffallend dunkel oder der Stuhl ungewöhnlich hell?“',
        category: 'optimal',
        patientAnswer: '„Jetzt wo Sie es sagen! Heute Morgen sah der Urin ganz dunkelbraun aus, fast wie Malzbier. Und der Stuhlgang war ganz blass, lehmfarben. Zudem war mir speiübel.“',
        clinicalSignificance: 'Kardinalsymptom der Cholestase: Bilirubin staut sich rückwärts über die Leber ins Blut und färbt Urin dunkel; im Darm fehlt die Galle, daher ist der Stuhl hell/entfärbt.',
        diagnosticPoints: 25,
        revealsRedFlag: true
      },
      {
        id: 'q3_sub',
        question: '„Mussten Sie heute schon viel Wasser lassen?“',
        category: 'unnoetig',
        patientAnswer: '„Ganz normal oft, denke ich. Aber die Farbe hat mir Angst gemacht.“',
        clinicalSignificance: 'Erfasst die Quantität, verpasst jedoch die pathologische Qualität der Urinfarbe.',
        diagnosticPoints: 10
      }
    ]
  },
  {
    id: 'step_exam',
    stepNumber: 4,
    phaseTitle: 'Phase 4: PFA-Beobachtung & Vorbereitung der Ärztin',
    situation: 'Sie haben Vitalzeichen gemessen: RR 145/90 mmHg, Puls 92 bpm, Temperatur 37,6 °C. Bei der Inspektion fällt Ihnen eine diskrete Gelbfärbung der Skleren (Augen) auf. Zudem klagt Frau Meinhardt über anhaltende Übelkeit.',
    instruction: 'Welche strukturierte Meldung geben Sie an die Hausärztin Dr. Weber weiter?',
    choices: [
      {
        id: 'q4_sub',
        question: '„Frau Doktor, die Patientin hat Bauchweh, bitte einmal drüberschauen.“',
        category: 'unnoetig',
        patientAnswer: 'Dr. Weber: „Welche Vitalwerte? Wo tut es weh? Bitte erheben Sie das nächste Mal die Leitsymptome vorab strukturiert.“',
        clinicalSignificance: 'Unzureichende Informationsweitergabe; entspricht nicht den PFA-Kompetenzstandards.',
        diagnosticPoints: 5
      },
      {
        id: 'q4_opt',
        question: '„Frau Dr. Weber: Frau Meinhardt (67 J.) hat postprandiale krampfartige Schmerzen im RUQ mit Ausstrahlung in rechte Schulter und Rücken, dunklen Urin, entfärbten Stuhl und beginnenden Sklerenikterus. Schmerz aktuell 7/10. V. a. symptomatische Cholezystolithiasis mit Gallengangsbeteiligung (Cholestase).“',
        category: 'optimal',
        patientAnswer: 'Dr. Weber: „Hervorragend beobachtet und präzise zusammengefasst! Ich führe sofort die Abdomen-Sonographie durch.“',
        clinicalSignificance: 'Mustergültige strukturierte Übergabe nach fachlichen Kriterien. Schützt die Patientin vor Verzögerungen.',
        diagnosticPoints: 25
      }
    ]
  },
  {
    id: 'step_indication_counsel',
    stepNumber: 5,
    phaseTitle: 'Phase 5: Beratung & OP-Indikationsstellung durch die Hausärztin',
    situation: 'Die Sonographie bestätigt mehrere Steine mit Schallschatten, eine verdickte Gallenblasenwand (3,2 mm) und einen aufgestauten Gallengang. Frau Meinhardt fragt ängstlich: „Muss man das denn wirklich operieren? Kann man die Steine nicht einfach mit Medikamenten auflösen oder abwarten?“',
    instruction: 'Wie klären Sie gemeinsam mit der Hausärztin Dr. Weber die Patientin fachgerecht und evidenzbasiert über die OP-Notwendigkeit auf?',
    choices: [
      {
        id: 'q5_opt',
        question: '„Liebe Frau Meinhardt: Stumme Steine ohne Beschwerden muss man nicht operieren. Da Sie aber schwere Koliken und einen Gallestau haben, ist die Gallenblasenentfernung dringend geboten. Medikamente oder Zertrümmerung helfen hier nicht dauerhaft. Die laparoskopische Cholezystektomie schützt Sie vor gefährlichen Entzündungen der Gallenblase, der Bauchspeicheldrüse und vor einer Porzellangallenblase.“',
        category: 'optimal',
        patientAnswer: 'Frau Meinhardt: „Das leuchtet mir ein... Ich hatte gehofft, es geht ohne OP, aber vor noch schlimmeren Schmerzen oder einer Entzündung habe ich noch mehr Angst. Wie läuft die OP ab?“',
        clinicalSignificance: 'Hervorragende pflegerisch-ärztliche Patientenaufklärung: Klare Differenzierung zwischen asymptomatischen Steinen und symptomatischer Kolik mit OP-Indikation gemäß S3-Leitlinie.',
        diagnosticPoints: 25
      },
      {
        id: 'q5_sub1',
        question: '„Ach, wir warten einfach mal ab und trinken viel Kamillentee, vielleicht spülen sich die Steine von selbst aus.“',
        category: 'unnoetig',
        patientAnswer: 'Dr. Weber greift sofort ein: „Nein, Frau Meinhardt, bei einer Kolik mit Cholestasezeichen dürfen wir keinesfalls abwarten – es droht ein Verschluss der Gallengänge oder eine Sepsis!“',
        clinicalSignificance: 'Gefährliche Fehlinformation: Kolikrezidive und lebensbedrohliche Komplikationen werden riskiert.',
        diagnosticPoints: 0
      },
      {
        id: 'q5_sub2',
        question: '„Das müssen Sie ganz allein die Chirurgen im Krankenhaus fragen, dafür ist die Hausarztpraxis nicht zuständig.“',
        category: 'unnoetig',
        patientAnswer: 'Frau Meinhardt wirkt verunsichert und alleingelassen: „Ich dachte, Sie könnten mir hier die Angst nehmen...“',
        clinicalSignificance: 'Fehlende Beratungskompetenz und empathische Begleitung im hausärztlichen Setting.',
        diagnosticPoints: 5
      }
    ]
  }
];

export const sonographieResult = {
  doctorName: 'Dr. med. Elisabeth Weber (Fachärztin für Allgemeinmedizin)',
  date: 'Aktueller Untersuchungstag, 09:15 Uhr',
  findings: [
    'Sonographie Abdomen: Leber homogen, nicht vergrößert.',
    'Gallenblase: Gefüllt, Wanddicke 3,2 mm (gering ödematös verdickt). Im Lumen Nachweis von mehreren Konkrementen bis maximal 14 mm Durchmesser mit deutlichem dorsalen Schallschatten.',
    'Ductus choledochus: Mit 8 mm dilatiert (Gallengangsaufstau). Kein freies abdominelles Exsudat.',
    'Klinisch: Positives Murphy-Zeichen (inspiratorischer Schmerzstopp bei Palpation des rechten Rippenbogens).'
  ],
  conclusion: 'Symptomatische Cholezystolithiasis mit rezidivierenden Koliken und vorübergehendem Gallengangsaufstau.',
  recommendation: 'Dringliche Indikation zur elektiven laparoskopischen Cholezystektomie (Gallenblasenentfernung). Akut: Spasmolytika/Analgetika, strikte Nahrungskarenz, Einweisung in die chirurgische Klinik.'
};
