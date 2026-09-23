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
    situation: 'Sie haben Vitalzeichen gemessen: RR 145/90 mmHg, Puls 92 bpm, Temperatur 37,6 °C. Bei der Inspektion fällt Ihnen eine diskrete Gelbfärbung der Skleren (Augen) auf.',
    instruction: 'Welche strukturierte Meldung geben Sie an die Hausärztin Dr. Weber weiter?',
    choices: [
      {
        id: 'q4_opt',
        question: '„Frau Dr. Weber: Frau Meinhardt hat postprandiale krampfartige Schmerzen im RUQ mit Ausstrahlung in die rechte Schulter, dunklen Urin, entfärbten Stuhl und beginnenden Sklerenikterus. Schmerz aktuell 7/10. V. a. symptomatische Cholezystolithiasis mit Cholestase.“',
        category: 'optimal',
        patientAnswer: 'Dr. Weber: „Hervorragend beobachtet und präzise zusammengefasst! Ich führe sofort die Abdomen-Sonographie durch.“',
        clinicalSignificance: 'Mustergültige strukturierte Übergabe nach fachlichen Kriterien. Schützt die Patientin vor Verzögerungen.',
        diagnosticPoints: 25
      },
      {
        id: 'q4_sub',
        question: '„Frau Doktor, die Patientin hat Bauchweh, bitte einmal drüberschauen.“',
        category: 'unnoetig',
        patientAnswer: 'Dr. Weber: „Welche Vitalwerte? Wo tut es weh? Bitte erheben Sie das nächste Mal die Leitsymptome vorab.“',
        clinicalSignificance: 'Unzureichende Informationsweitergabe; entspricht nicht den PFA-Kompetenzstandards.',
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
