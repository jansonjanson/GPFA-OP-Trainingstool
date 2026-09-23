import { Scenario, Quiz } from './types';

export const quizzes: Record<string, Quiz> = {
  q1: {
    id: 'q1',
    question: 'Es ist 6:30 Uhr. Die OP startet um 8:30 Uhr. Darf der Patient jetzt noch einen Kaffee mit einem Schuss Milch trinken?',
    options: [
      { text: 'Ja, Flüssigkeit ist noch erlaubt.', isCorrect: false },
      { text: 'Nein, Milch zählt als feste Nahrung.', isCorrect: true }
    ],
    feedbackCorrect: 'Richtig! Milch gilt als feste Nahrung. Die Karenzzeit beträgt 4-6 Stunden.',
    feedbackIncorrect: 'Falsch. Milch zählt als feste Nahrung und darf nicht mehr getrunken werden.'
  },
  q2: {
    id: 'q2',
    question: 'Ein festsitzender Ehering darf für die OP mit Pflaster abgeklebt werden, wenn er nicht ab geht.',
    options: [
      { text: 'Wahr', isCorrect: false },
      { text: 'Falsch', isCorrect: true }
    ],
    feedbackCorrect: 'Richtig! Der Ring muss ab (Verbrennungsgefahr bei HF-Chirurgie).',
    feedbackIncorrect: 'Falsch. Abkleben reicht nicht. Strom fließt trotzdem (Verbrennungsgefahr).'
  },
  q3: {
    id: 'q3',
    question: 'In der OP-Schleuse (Team-Time-Out) fragen Sie den Patienten: "Sind Sie Frau Meier?"',
    options: [
      { text: 'Ja, das reicht zur Identifikation.', isCorrect: false },
      { text: 'Nein, immer aktiv nach Name und Geburtsdatum fragen lassen.', isCorrect: true }
    ],
    feedbackCorrect: 'Richtig! Keine Suggestivfragen stellen.',
    feedbackIncorrect: 'Falsch. Patienten stimmen aus Aufregung oft vorschnell zu. Immer aktiv fragen lassen.'
  },
  q4: {
    id: 'q4',
    question: 'Der Transport in den OP steht an. Darf der Patient seine lockere Zahnteilprothese im Mund behalten?',
    options: [
      { text: 'Nein, sie muss raus (Aspirations-/Verletzungsgefahr).', isCorrect: true },
      { text: 'Ja, aus kosmetischen Gründen bis zur Narkose.', isCorrect: false }
    ],
    feedbackCorrect: 'Richtig! Die Prothese könnte bei der Intubation in die Atemwege rutschen.',
    feedbackIncorrect: 'Falsch. Die Prothese ist ein lebensgefährliches Risiko bei der Intubation.'
  }
};

export const scenarios: Scenario[] = [
  {
    id: 1,
    category: 'Nüchternheit',
    title: 'Der Kaffee-Wunsch',
    text: 'Es ist 06:30 Uhr. Sie betreten das Zimmer. Frau Meinhardt sitzt auf der Bettkante: "Schwester, mein Mund ist so trocken und ich habe schreckliche Kopfschmerzen ohne meinen Morgenkaffee. Darf ich wenigstens einen kleinen Schluck trinken? Oder ein Glas Wasser?" Die OP ist für 08:30 Uhr angesetzt.',
    hint: 'Feste Nahrung: 6h. Klare Flüssigkeiten: 2h. Rechne nach! Milch zählt als fest.',
    options: [
      {
        label: 'Kaffee erlauben (nur ein kleiner Schluck)',
        scoreChange: -30,
        feedbackTitle: 'Kritischer Fehler!',
        feedbackText: 'Kaffee (oft mit Milch) gilt als feste Nahrung. Die Karenzzeit für feste Nahrung beträgt 6 Stunden. Dies führt zur Absage der OP wegen Aspirationsgefahr (Mendelson-Syndrom).',
        correct: false,
        timeCost: 5,
        nervousnessChange: 5
      },
      {
        label: 'Ein Glas Wasser erlauben',
        scoreChange: -10,
        feedbackTitle: 'Risiko!',
        feedbackText: 'Klare Flüssigkeiten sind bis 2 Stunden vor OP erlaubt. Da es jetzt genau 06:30 Uhr ist und der Transport und die Einleitung Zeit brauchen, ist dies grenzwertig. Das Magenvolumen könnte bei Narkoseeinleitung erhöht sein.',
        correct: false,
        timeCost: 5,
        nervousnessChange: -5
      },
      {
        label: 'Strikt ablehnen (Mundpflege anbieten)',
        scoreChange: 10,
        feedbackTitle: 'Korrekt!',
        feedbackText: 'Sie wahren die Sicherheit. Die 2-Stunden-Grenze für klare Flüssigkeiten ist jetzt erreicht. Kaffee ist absolut verboten. Sie bieten stattdessen Mundpflege zum Anfeuchten der Lippen an.',
        correct: true,
        timeCost: 5,
        nervousnessChange: -10
      }
    ]
  },
  {
    id: 2,
    category: 'Abführen & Ausscheidung',
    title: 'Die Frage nach dem Zäpfchen',
    text: '06:45 Uhr. Frau Meinhardt wirkt unruhig. "Meine Bettnachbarin hat gerade ein Zäpfchen bekommen. Brauche ich das für meine Galle nicht auch noch? Und ich spüre so einen Druck..." Laut Kurve wurde gestern Abend ein Klistier verabreicht.',
    hint: 'Bei Gallen-OPs reicht meist die Entleerung am Vorabend. Aber vor der Beruhigungspille muss die Blase leer sein!',
    options: [
      {
        label: 'Erneutes Klistier verabreichen',
        scoreChange: -10,
        feedbackTitle: 'Nicht indiziert',
        feedbackText: 'Ohne ärztliche Anordnung und bei erfolgter Vorbereitung am Vorabend ist ein Klistier am OP-Morgen nicht Standard. Es kostet unnötig Zeit und belastet den Kreislauf.',
        correct: false,
        timeCost: 15,
        nervousnessChange: 10
      },
      {
        label: 'Zur Toilette schicken (Blase/Darm entleeren)',
        scoreChange: 10,
        feedbackTitle: 'Richtig!',
        feedbackText: 'Vor der Gabe der Prämedikation ist der Toilettengang essenziell. Eine leere Blase und ein leerer Darm verhindern intraoperative Inkontinenz und senken das Risiko.',
        correct: true,
        timeCost: 10,
        nervousnessChange: -10
      },
      {
        label: 'Sagen, dass für die Galle keine Entleerung nötig ist',
        scoreChange: -15,
        feedbackTitle: 'Fachlich falsch',
        feedbackText: 'Bei Eingriffen im oberen Intestinaltrakt (Galle) ist eine Darmentleerung (meist Klistier am Vorabend) Standard, um bei versehentlichen Verletzungen das Peritonitis-Risiko zu senken.',
        correct: false,
        timeCost: 2,
        nervousnessChange: 15
      }
    ]
  },
  {
    id: 3,
    category: 'Vorbereitung',
    title: 'Styling & Schmuck',
    text: 'Frau Meinhardt kommt von der Toilette zurück. Sie blicken auf ihre Hände. Sie trägt dunkelroten Nagellack und ihren goldenen Ehering, der sehr fest sitzt. "Den Ring bekomme ich kaum ab, und die Nägel habe ich extra gestern gemacht. Das ist doch nur eine Bauch-OP, das stört doch nicht, oder?"',
    hint: 'Sauerstoffsättigung am Finger? Und was passiert mit Metall, wenn im OP mit Strom geschnitten wird?',
    options: [
      {
        label: 'Alles muss ab: Lack entfernen, Ring mit Seife lösen',
        scoreChange: 10,
        feedbackTitle: 'Sehr gut!',
        feedbackText: 'Nagellack verfälscht die Ergebnisse der Pulsoxymetrie. Metallische Gegenstände (Ring) bergen die Gefahr von Verbrennungen bei Nutzung von HF-Chirurgiegeräten (Elektrokauter) und können abschnüren.',
        correct: true,
        timeCost: 10,
        nervousnessChange: 5
      },
      {
        label: 'Ring muss ab, Nagellack kann bleiben',
        scoreChange: -15,
        feedbackTitle: 'Fehler',
        feedbackText: 'Der Ring ist korrekt entfernt, aber der Nagellack muss zwingend entfernt werden. Der Anästhesist benötigt unverfälschte Sättigungswerte und Sicht auf das Nagelbett (Zyanose-Check).',
        correct: false,
        timeCost: 5,
        nervousnessChange: 0
      },
      {
        label: 'Alles dranlassen, wir kleben den Ring ab',
        scoreChange: -30,
        feedbackTitle: 'Gefährlich!',
        feedbackText: 'Abkleben reicht nicht! Strom fließt trotzdem durch Metall (Verbrennungsgefahr). Der Lack verhindert das Monitoring. Dies ist ein Verstoß gegen elementare Sicherheitsstandards.',
        correct: false,
        timeCost: 5,
        nervousnessChange: 0
      }
    ]
  },
  {
    id: 4,
    category: 'Hautvorbereitung',
    title: 'Haare im OP-Feld',
    text: 'Frau Meinhardt ist nun abgeschminkt und schmucklos. Sie kontrollieren das OP-Gebiet (Abdomen). Es sind feine Härchen sichtbar. Der Assistenzarzt hatte "Haarentfernung bei Bedarf" angeordnet. Welches Werkzeug wählen Sie?',
    hint: 'Denk an die RKI-Richtlinien zur Vermeidung von Mikroläsionen auf der Haut.',
    options: [
      {
        label: 'Einwegrasierer (Nassrasur)',
        scoreChange: -20,
        feedbackTitle: 'Veralteter Standard!',
        feedbackText: 'Eine Rasur verursacht mikroskopische Hautverletzungen. Diese können sich bis zum OP-Beginn mit Keimen besiedeln und das Risiko für Wundinfektionen (SSI) erhöhen.',
        correct: false,
        timeCost: 10,
        nervousnessChange: 5
      },
      {
        label: 'Elektrischer Clipper',
        scoreChange: 10,
        feedbackTitle: 'Perfekt!',
        feedbackText: 'Der Clipper kürzt die Haare hautschonend ohne die Hautbarriere zu verletzen. Das ist der aktuelle Goldstandard zur Infektionsprophylaxe (RKI-Empfehlung).',
        correct: true,
        timeCost: 5,
        nervousnessChange: -5
      },
      {
        label: 'Keine Entfernung (trotz Behaarung)',
        scoreChange: -5,
        feedbackTitle: 'Ungünstig',
        feedbackText: 'Wenn Haare im Bereich der Inzision oder des Pflasters liegen, sollten sie entfernt werden (Clipper), da sonst der Verband nicht hält oder Haare in die Wunde gelangen können.',
        correct: false,
        timeCost: 2,
        nervousnessChange: 0
      }
    ]
  },
  {
    id: 5,
    category: 'Unterlagen',
    title: 'Die Patientenmappe',
    text: 'Der Transportdienst hat sich für gleich angekündigt. Sie packen die Unterlagen zusammen. Sie schauen auf Ihre Kitteltaschenkarte. Welche Dokumente müssen zwingend mit?',
    hint: 'Ohne Einwilligungen passiert nichts! Was ist noch wichtig für Narkose/OP?',
    options: [
      {
        label: 'Patientenkurve, aktuelle Laborwerte, OP-Checkliste und alte Arztbriefe.',
        scoreChange: -20,
        feedbackTitle: 'Fehler!',
        feedbackText: 'Weiter gehts zur Übergabe...',
        correct: false,
        stateEffects: { consentMissing: true },
        timeCost: 5,
        nervousnessChange: 5
      },
      {
        label: 'Unterschriebene Einverständniserklärungen (OP & Anästhesie), Kurve, Labor/EKG, Checkliste.',
        scoreChange: 10,
        feedbackTitle: 'Korrekt!',
        feedbackText: 'Weiter gehts zur Übergabe...',
        correct: true,
        stateEffects: { consentMissing: false },
        timeCost: 10,
        nervousnessChange: -5
      },
      {
        label: 'Nur die OP-Checkliste und das Patientenarmband, der Rest ist digital.',
        scoreChange: -20,
        feedbackTitle: 'Gefährlich!',
        feedbackText: 'Weiter gehts zur Übergabe...',
        correct: false,
        stateEffects: { consentMissing: true },
        timeCost: 5,
        nervousnessChange: 10
      }
    ]
  },
  {
    id: 6,
    category: 'Sicherheit',
    title: 'Toilette nach Prämedikation',
    text: 'Sie haben Frau Meinhardt die verordnete Prämedikation (Midazolam) gegeben. Zehn Minuten später klingelt sie. Als Sie reinkommen, versucht sie gerade aufzustehen: "Ich muss doch noch mal auf die Toilette, ich war so aufgeregt vorhin."',
    hint: 'Nach der Prämedikation besteht erhöhte Sturzgefahr. Darf sie alleine gehen?',
    options: [
      {
        label: 'Ihr sagen, sie soll vorsichtig alleine zur Toilette gehen.',
        scoreChange: -25,
        feedbackTitle: 'Sicherheitsrisiko!',
        feedbackText: 'Midazolam (Benzodiazepin) wirkt sedierend und beeinträchtigt die Koordination. Das Sturzrisiko ist extrem hoch!',
        correct: false,
        timeCost: 5,
        nervousnessChange: 20
      },
      {
        label: 'Ihr ein Steckbecken (Schieber) ins Bett geben.',
        scoreChange: -5,
        feedbackTitle: 'Unangenehm',
        feedbackText: 'Sicher, aber sehr unangenehm für die Patientin. Wenn sie noch kreislaufstabil ist, kann sie in Begleitung zur Toilette.',
        correct: false,
        timeCost: 15,
        nervousnessChange: 15
      },
      {
        label: 'Sie persönlich zur Toilette stützen und begleiten.',
        scoreChange: 10,
        feedbackTitle: 'Richtig gehandelt!',
        feedbackText: 'Sie verhindern Stürze durch Begleitung und wahren gleichzeitig die Würde der Patientin.',
        correct: true,
        timeCost: 10,
        nervousnessChange: -10
      }
    ]
  },
  {
    id: 7,
    category: 'Transport & Hilfsmittel',
    title: 'Der Abholdienst ist da',
    text: 'Der Transportdienst steht bereit. Frau Meinhardt hat ihre Brille auf der Nase und ihr Hörgerät im Ohr. "Bitte lassen Sie mir das, ich habe Angst, sonst nichts zu verstehen, wenn die Ärzte mit mir reden." Der Fahrer drängelt.',
    hint: 'Was hilft der Kommunikation und Orientierung, um Angst zu reduzieren?',
    options: [
      {
        label: 'Alles abnehmen und im Nachttisch verschließen',
        scoreChange: -10,
        feedbackTitle: 'Zu früh',
        feedbackText: 'Ohne Brille und Hörgerät ist die Patientin orientierungslos und isoliert, was die Angst verstärkt. Hilfsmittel sollten so lange wie möglich beim Patienten bleiben.',
        correct: false,
        timeCost: 5,
        nervousnessChange: 20
      },
      {
        label: 'Brille und Hörgerät belassen (mitgeben)',
        scoreChange: 10,
        feedbackTitle: 'Empathisch und Richtig',
        feedbackText: 'Hilfsmittel werden erst in der Schleuse entfernt, um die Kommunikation und Sicherheit der Patientin bis zur Einleitung zu gewährleisten. Sie informieren die Schleuse darüber.',
        correct: true,
        timeCost: 5,
        nervousnessChange: -15
      },
      {
        label: 'Nur Hörgerät erlauben, Brille muss weg',
        scoreChange: -5,
        feedbackTitle: 'Ungünstig',
        feedbackText: 'Auch die Brille gibt Sicherheit. Wenn möglich, sollte beides bis zur Schleuse mitgegeben werden.',
        correct: false,
        timeCost: 5,
        nervousnessChange: 5
      }
    ]
  },
  {
    id: 8,
    category: 'Transport & Hilfsmittel',
    title: 'Der letzte Blick',
    text: 'Frau Meinhardt liegt abfahrbereit im Bett. Was überprüfen Sie am Körper der Patientin ein allerletztes Mal, bevor das Bett das Zimmer verlässt?',
    hint: 'Gibt es Fremdkörper im Mund, die gefährlich werden könnten? Wer ist die Patientin überhaupt?',
    options: [
      {
        label: 'Ob sie ihr Gebiss herausgenommen hat und ein Patientenidentifikationsarmband trägt.',
        scoreChange: 10,
        feedbackTitle: 'Perfekt!',
        feedbackText: 'Laut Checkliste muss das Armband angelegt und die Prothese entfernt sein.',
        correct: true,
        timeCost: 5,
        nervousnessChange: -5
      },
      {
        label: 'Ob sie noch Durst hat.',
        scoreChange: -10,
        feedbackTitle: 'Fehler!',
        feedbackText: 'Die Nüchternheitsgrenze ist längst überschritten. Es besteht Aspirationsgefahr, wenn sie jetzt noch trinkt.',
        correct: false,
        timeCost: 2,
        nervousnessChange: 5
      }
    ]
  },
  {
    id: 9,
    category: 'Übergabe',
    title: 'Die Schleusen-Übergabe',
    text: 'Sie kommen in der Schleuse an. Die Anästhesie-Pflegekraft blättert hektisch in der Mappe und wird laut: "Wo ist die unterschriebene Einverständniserklärung zur OP und Narkose?! Ohne die leite ich hier gar nichts ein! Haben Sie das auf Station nicht laut Checkliste geprüft?"',
    hint: 'Ein kritischer Fehler in der Vorbereitung!',
    requiresState: { key: 'consentMissing', value: true },
    options: [
      {
        label: 'Panisch auf Station anrufen und bitten, dass jemand sucht.',
        scoreChange: -10,
        feedbackTitle: 'Kritischer Fehler!',
        feedbackText: 'Nach langem Suchen finden Sie den Bogen ganz hinten in der Mappe. Die Anästhesie ist extrem genervt. Lerneffekt: Laut OP-Checkliste muss das VOR dem Transport geprüft werden. Das hätte zur OP-Absage geführt!',
        correct: false,
        timeCost: 25,
        nervousnessChange: 30
      },
      {
        label: 'Zusammen mit der Anästhesie die Mappe komplett zerlegen.',
        scoreChange: 0,
        feedbackTitle: 'Kritischer Fehler!',
        feedbackText: 'Nach langem Suchen finden Sie den Bogen ganz hinten in der Mappe. Die Anästhesie ist extrem genervt. Lerneffekt: Laut OP-Checkliste muss das VOR dem Transport geprüft werden. Das hätte zur OP-Absage geführt!',
        correct: false,
        timeCost: 20,
        nervousnessChange: 30
      }
    ]
  },
  {
    id: 10,
    category: 'Übergabe',
    title: 'Die Schleusen-Übergabe',
    text: 'Sie kommen in der Schleuse an. Sie übergeben Frau Meinhardt. Die Anästhesie-Pflegekraft prüft die Mappe: "Einverständnis ist da, Labor passt. Armband ist dran. Super vorbereitet, danke!"',
    hint: 'Fast geschafft!',
    requiresState: { key: 'consentMissing', value: false },
    options: [
      {
        label: 'Weiter',
        scoreChange: 10,
        feedbackTitle: 'Hervorragend!',
        feedbackText: 'Perfekt! Die Übergabe lief reibungslos. Dank Ihrer guten Vorbereitung kann Frau Meinhardt sicher operiert werden.',
        correct: true,
        timeCost: 10,
        nervousnessChange: -10
      }
    ]
  }
];
