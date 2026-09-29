import { AnamneseStep } from '../types';

export const anamneseSteps: AnamneseStep[] = [
  {
    id: 'step_welcome',
    stepNumber: 1,
    phaseTitle: 'Phase 1: Anamnese aktueller Beschwerden (Dringlich)',
    situation: 'Frau Carola Meinhardt (67 J.) betritt die Hausarztpraxis von Frau Dr. med. Elisabeth Weber. Sie wirkt unruhig und berichtet über quälende Beschwerden nach den Mahlzeiten. Die Situation ist noch nicht perakut, aber dringlich abklärungsbedürftig.',
    instruction: 'Welche gezielte Frage stellen Sie als Erstes, um die Art, Lokalisation und den zeitlichen Zusammenhang der Beschwerden präzise zu erfassen?',
    choices: [
      {
        id: 'q1_sub',
        question: '„Haben Sie vielleicht nur eine Magenverstimmung oder etwas Verdorbenes gegessen?“',
        category: 'unnoetig',
        patientAnswer: '„Nein, das glaube ich kaum... Das kenne ich ganz anders. Es kommt seit Tagen immer wieder, besonders wenn das Essen etwas fettiger war.“',
        clinicalSignificance: 'Zu voreilig und suggestiv. Versäumt die gezielte Schmerzlokalisation im rechten Oberbauch.',
        diagnosticPoints: 10
      },
      {
        id: 'q1_opt',
        question: '„Guten Tag Frau Meinhardt. Wo genau spüren Sie diese drückenden Beschwerden und treten sie verstärkt nach bestimmten Mahlzeiten oder fettigem Essen auf?“',
        category: 'optimal',
        patientAnswer: '„Es drückt und zwickt vor allem hier oben rechts unter dem Rippenbogen! Besonders nach fettigen Mahlzeiten fühle ich mich elend voll und mir wird übel. Bisher war es noch erträglich, aber heute Morgen wurde es deutlich unangenehmer.“',
        clinicalSignificance: 'Typische Frühsymptome einer Cholezystolithiasis: Postprandiales Druck- und Völlegefühl im rechten oberen Quadranten (RUQ) nach Fettzufuhr.',
        diagnosticPoints: 25
      },
      {
        id: 'q1_irr',
        question: '„Wann waren Sie denn das letzte Mal beim Augenarzt?“',
        category: 'irrelevant',
        patientAnswer: '„Beim Augenarzt? Vor einem halben Jahr, aber was hat das denn mit meinem Magen zu tun?“',
        clinicalSignificance: 'Völlig irrelevante Frage bei abdominellen Beschwerden.',
        diagnosticPoints: 0
      }
    ]
  },
  {
    id: 'step_anamnese_6f',
    stepNumber: 2,
    phaseTitle: 'Phase 2: Diagnosesicherung durch die 6-F-Regel (Aktive Akten-Checkliste)',
    situation: 'Hausärztin Dr. Weber kommt hinzu: „Sehr gut erfasst! Bevor wir weiter untersuchen, prüfen Sie bitte selbstständig Frau Meinhardts Patientenakte oben links. Wählen Sie in der Checkliste alle Kriterien der klassischen 6-F-Regel aus, die Sie in ihren Aktenangaben wiederfinden, um unseren Verdacht auf Gallensteine zu festigen.“',
    instruction: 'Schlagen Sie die Daten in der Patientenakte nach und markieren Sie alle 6 zutreffenden Kriterien der 6-F-Regel in der Checkliste!',
    choices: [
      {
        id: 'q2_opt',
        question: 'Checkliste vollständig ausgefüllt: Alle 6 Kriterien (Female, Forty, Fat, Fertile, Fair, Family) in der Akte identifiziert.',
        category: 'optimal',
        patientAnswer: 'Dr. Weber nickt anerkennend: „Mustergültig ausgewertet! Frau Meinhardt erfüllt alle 6 Faktoren der 6-F-Regel lückenlos. Das untermauert unseren Verdacht auf eine Cholezystolithiasis massiv.“',
        clinicalSignificance: 'Perfekte Anamnese-Auswertung: Frau Meinhardt vereint alle 6 klassischen Kriterien der 6-F-Regel (Female, Fair, Fat, Forty, Fertile, Family).',
        diagnosticPoints: 25
      }
    ]
  },
  {
    id: 'step_excretion_course',
    stepNumber: 3,
    phaseTitle: 'Phase 3: Anamnese der Begleitsymptome (Ikterus & Ausscheidung)',
    situation: 'Sie beobachten Frau Meinhardt genauer. Bei der Inspektion fällt Ihnen eine diskrete Gelbfärbung der Augen (Sklerenikterus) auf. Sie müssen sofort prüfen, ob ein Gallenstau (Cholestase) im Gallengangssystem vorliegt.',
    instruction: 'Welche gezielte Frage zur Ausscheidung und zu Warnsignalen stellen Sie an Frau Meinhardt?',
    choices: [
      {
        id: 'q3_sub',
        question: '„Müssen Sie heute häufiger Wasser lassen als sonst?“',
        category: 'unnoetig',
        patientAnswer: '„Ganz normal oft, denke ich. Aber das Wasserlassen war nicht das Problem.“',
        clinicalSignificance: 'Erfasst nur die Frequenz, übersieht aber die entscheidenden pathologischen Farbveränderungen von Stuhl und Urin.',
        diagnosticPoints: 10
      },
      {
        id: 'q3_opt',
        question: '„Frau Meinhardt, ist Ihnen bei den Toilettengängen etwas Ungewöhnliches aufgefallen – war der Urin auffallend dunkelbraun oder der Stuhl ungewöhnlich hell und lehmfarben?“',
        category: 'optimal',
        patientAnswer: '„Ja, genau! Heute früh sah der Urin ganz dunkelbraun aus, fast wie Malzbier oder Cola. Und der Stuhlgang war ganz blass, fast weißlich-lehmfarben! Zudem ist mir kotzübel.“',
        clinicalSignificance: 'Kardinalsymptom der Cholestase: Bilirubinstau führt zu dunkelbraunem Urin (Bilirubinurie) und entfärbtem acholischem Stuhl (fehlendes Sterkobilin im Darm).',
        diagnosticPoints: 25,
        revealsRedFlag: true
      },
      {
        id: 'q3_irr',
        question: '„Trinken Sie regelmäßig Kamillentee zur Magenberuhigung?“',
        category: 'irrelevant',
        patientAnswer: '„Manchmal, aber das hilft gegen dieses Druckgefühl überhaupt nicht.“',
        clinicalSignificance: 'Keine Relevanz für die Erfassung eines akuten Verschlussikterus.',
        diagnosticPoints: 0
      }
    ]
  },
  {
    id: 'step_trigger_cause',
    stepNumber: 4,
    phaseTitle: 'Phase 4: Akute Gallenkolik tritt auf (Kolik-Kriterien vs. Dauerschmerz)',
    situation: 'Plötzlich verkrampft sich Frau Meinhardt, stöhnt laut auf und krümmt sich vor Schmerz! Sie presst beide Hände krampfartig unter den rechten Rippenbogen, wird aschfahl und kaltschweißig. Die Situation wird akut!',
    instruction: 'Welche Kriterien kennzeichnen die akute Kolik im Unterschied zu den bisherigen dumpfen Gallenstein-Symptomen?',
    choices: [
      {
        id: 'q4_opt',
        question: '„Krampfartiger, wellenförmig an- und abschwellender Wehenschmerz mit extremen Schmerzspitzen im rechten Oberbauch und Ausstrahlung in die rechte Schulter (Head-Zonen), ausgelöst durch rhythmische Wandkontraktion gegen das Konkrement.“',
        category: 'optimal',
        patientAnswer: 'Frau Meinhardt atmet schwer: „Ja... genau so fühlt es sich an! Es kommt in brutalen Wellen und zieht mir krampfartig bis hoch in die Schulter und zwischen die Schulterblätter... unerträglich!“',
        clinicalSignificance: 'Klassische Kriterien der Gallenkolik: Wellenförmiger Wehenschmerz (Hyperperistaltik), Schmerzmaximum im RUQ, Ausstrahlung über N. phrenicus (C3–C5) in die rechte Schulter.',
        diagnosticPoints: 25
      },
      {
        id: 'q4_sub',
        question: '„Ein gleichbleibender, brennender Dauerschmerz im gesamten Unterbauch ohne Schwankungen.“',
        category: 'unnoetig',
        patientAnswer: 'Frau Meinhardt schüttelt mühsam den Kopf: „Nein, es ist nicht im Unterbauch und es brennt nicht – es krampft in heftigen Schüben hier oben rechts!“',
        clinicalSignificance: 'Falscher Schmerzcharakter. Koliken sind rhythmisch und wellenförmig, keine diffusen Dauerschmerzen im Unterbauch.',
        diagnosticPoints: 10
      },
      {
        id: 'q4_irr',
        question: '„Ein stechender Schmerz, der ausschließlich beim Husten in den linken Brustkorb zieht.“',
        category: 'irrelevant',
        patientAnswer: '„Nein, überhaupt nicht! Es ist rechts unter den Rippen.“',
        clinicalSignificance: 'Beschreibt pleuritische oder thorakale Schmerzen, keine biliäre Kolik.',
        diagnosticPoints: 0
      }
    ]
  },
  {
    id: 'step_therapy_hospital',
    stepNumber: 5,
    phaseTitle: 'Phase 5: PFA-Handlungskompetenz bei akutem Abdomen & Einweisung',
    situation: 'Hausärztin Dr. Weber untersucht das Abdomen (positives Murphy-Zeichen) und stellt die Einweisung ins Krankenhaus zur frühzeitigen laparoskopischen Cholezystektomie aus. Frau Meinhardt hat Schmerzen und ist besorgt.',
    instruction: 'Welche pflegerischen Sofortmaßnahmen führen Sie als PFA bei Frau Meinhardt jetzt leitliniengerecht und patientenzentriert durch?',
    choices: [
      {
        id: 'q5_wrong1',
        question: '„Frau Meinhardt ein großes Glas eiskaltes Wasser und eine heiße Wärmflasche auf den Bauch geben, damit sie sich entspannt.“',
        category: 'unnoetig',
        patientAnswer: 'Dr. Weber greift sofort ein: „Stopp! Bei akutem Abdomen niemals Flüssigkeit geben – die Patientin muss für eine zeitnahe OP strikt nüchtern bleiben. Und starke Hitze kann akute Entzündungen verschlimmern!“',
        clinicalSignificance: 'Gefährlicher Pflegefehler: Gefährdet die Nüchternheit vor Narkose und begünstigt Aspiration bei Notfalleingriffen.',
        diagnosticPoints: 0
      },
      {
        id: 'q5_opt',
        question: '„1. Vitalzeichen engmaschig überwachen (RR, Puls, Temperatur, Schmerzskala NRS). 2. Knierolle unterlegen zur Bauchdeckenentspannung. 3. Beruhigen und strikte Nahrungskarenz (Frau Meinhardt muss nüchtern bleiben für Ultraschall/OP). 4. Unterlagen und Einweisung mit Dr. Weber für die Klinikübergabe vorbereiten.“',
        category: 'optimal',
        patientAnswer: 'Frau Meinhardt atmet etwas ruhiger: „Vielen Dank... mit den leicht angewinkelten Beinen lässt sich der Druck im Bauch tatsächlich etwas besser aushalten. Gut, dass Sie mir erklären, warum ich jetzt nüchtern bleiben muss.“',
        clinicalSignificance: 'Lehrbuchmäßige PFA-Erstversorgung: Schmerzlindernde Entlastungslagerung (Knierolle), Vitalparameterkontrolle, Gewährleistung der Nüchternheit für OP und strukturierte Vorbereitung der Klinikeinweisung.',
        diagnosticPoints: 25
      },
      {
        id: 'q5_wrong2',
        question: '„Frau Meinhardt bitten, auf dem Flur zügig Treppen zu steigen, damit sich der Stein durch die Erschütterung von selbst löst.“',
        category: 'irrelevant',
        patientAnswer: 'Frau Meinhardt stöhnt erschöpft: „Ich kann mich vor Schmerzen kaum auf den Beinen halten!“',
        clinicalSignificance: 'Kontraindiziert bei akuter Kolik und vegetativer Kreislaufbelastung.',
        diagnosticPoints: 0
      }
    ]
  }
];

export const sixFChecklistItems = [
  { id: 'f_female', key: 'Female', label: 'Female (Weibliches Geschlecht)', fileFact: 'Geschlecht: weiblich', isCorrect: true },
  { id: 'f_forty', key: 'Forty', label: 'Forty (Alter ≥ 40 Jahre)', fileFact: 'Alter: 67 Jahre', isCorrect: true },
  { id: 'f_fat', key: 'Fat', label: 'Fat (Übergewicht / BMI > 30 kg/m²)', fileFact: '165 cm, 84 kg (BMI 30,9 kg/m²)', isCorrect: true },
  { id: 'f_fertile', key: 'Fertile', label: 'Fertile (Mehrere Schwangerschaften / Kinder)', fileFact: 'Gynäkologie: 2 erwachsene Kinder', isCorrect: true },
  { id: 'f_fair', key: 'Fair', label: 'Fair (Heller Phänotyp / Hauttyp)', fileFact: 'Phänotyp: Heller Teint, blond, blauäugig', isCorrect: true },
  { id: 'f_family', key: 'Family', label: 'Family (Gallensteine in Familie 1. Grades)', fileFact: 'Mutter mit Cholezystektomie bei Steinen', isCorrect: true },
  { id: 'f_fast', key: 'Fast', label: 'Fast (Extremer Ausdauersport)', fileFact: 'Nicht in der Akte dokumentiert', isCorrect: false },
  { id: 'f_foreign', key: 'Foreign', label: 'Foreign (Tropen- oder Fernreiseaufenthalt)', fileFact: 'Nicht in der Akte dokumentiert', isCorrect: false }
];

export const sonographieResult = {
  doctorName: 'Dr. med. Elisabeth Weber (Hausärztin / Fachärztin für Allgemeinmedizin)',
  date: 'Aktueller Untersuchungstag, 09:15 Uhr',
  findings: [
    'Sonographie Abdomen: Leber homogen, nicht vergrößert. Gallenblase prall gefüllt.',
    'Gallenblasenwand: Auf 4,2 mm verdickt mit deutlicher ödematöser Dreischichtung (Wandödem).',
    'Konkremente: Mehrere Konkremente bis max. 14 mm Durchmesser im Infundibulum/Halsbereich mit dorsaler Schallauslöschung.',
    'Gallengänge: Ductus cysticus stenosiert, Ductus choledochus mit 8 mm erweitert (Cholestase).',
    'Klinisch: Positives sonographisches und palpatorisches Murphy-Zeichen (inspiratorischer Schmerzstopp).',
    'Labor-Schnelltest: CRP 82 mg/l (stark erhöht), Leukozyten 13.800/µl (Leukozytose).'
  ],
  conclusion: 'Akute kalkulöse Cholezystitis mit rezidivierenden Gallenkoliken und beginnender Cholestase.',
  recommendation: 'Dringliche Indikation zur stationären Aufnahme und frühzeitigen laparoskopischen Cholezystektomie (lap. CE innerhalb von 24–72 Stunden). Sofortige Maßnahmen: Strikte Nahrungskarenz, i.v.-Zugang, Spasmolyse (Butylscopolamin) & Analgesie (Metamizol), Krankenhauseinweisung mit Patiententransport.'
};
