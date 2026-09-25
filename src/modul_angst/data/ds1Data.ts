import { BasketItem, MatchingPair, CascadeStep, SwipeCard } from '../types';

export const ds1Videos = {
  original: {
    title: 'Originale Fassung (Volle Länge)',
    url: 'https://www.youtube.com/embed/FCiPzseEtgg',
    externalUrl: 'https://youtu.be/FCiPzseEtgg?si=DGOEg6TtwCzK64CW',
    description: 'Ausführliche psychologische und physiologische Grundlagen der menschlichen Angstentwicklung.'
  },
  shortened: {
    title: 'Gekürzte Fassung (Kompakt)',
    url: 'https://www.youtube.com/embed/ZC6pej-QRak',
    externalUrl: 'https://youtu.be/ZC6pej-QRak',
    description: 'Fokussierte Zusammenfassung der Kernmechanismen für den Pflegeunterricht.'
  }
};

export const definitions = {
  angst: {
    title: 'Angst (State-Angst)',
    quote: 'State-Angst ist ein vorübergehender, oft belastender emotionaler Ausnahmezustand, der in die Zukunft gerichtet ist. Sie entsteht durch die Antizipation einer potenziellen Bedrohung, ist gekennzeichnet durch Anspannung, Besorgtheit und innere Unruhe, und tritt meist ohne konkreten, greifbaren Auslöser auf.',
    sources: 'In Anlehnung an Spielberger (1972) & Riemann (2009)',
    keyPoints: [
      'Zukunftsgerichtet (Antizipation)',
      'Diffuser, unklarer Auslöser',
      'Erhöhte Wachsamkeit (Vigilanz)',
      'Subjektiv empfundenes Bedrohungsgefühl'
    ]
  },
  furcht: {
    title: 'Furcht (Fear)',
    quote: 'Furcht ist eine evolutionär verankerte Basisemotion. Sie ist die unmittelbare und überlebensnotwendige Reaktion auf eine akut präsente, konkrete und greifbare Gefahr. Sie löst instinktive Verhaltensweisen (wie Kampf oder Flucht) aus und klingt ab, sobald die Bedrohung vorüber ist.',
    sources: 'In Anlehnung an Ekman (2010) & Asendorpf & Caspar (2021)',
    keyPoints: [
      'Akut & greifbar präsent (z. B. Nadel, Sturz)',
      'Unmittelbares Überleben (Fight or Flight)',
      'Evolutionäre Schutzfunktion',
      'Endet meist sofort nach Beseitigung der Gefahr'
    ]
  }
};

export const quiz1BasketItems: BasketItem[] = [
  {
    id: 'b1',
    text: 'Frau Müller sieht im Aufwachraum die dicke Nadel der Blutentnahme auf sich zukommen und weicht reflexartig zurück.',
    target: 'furcht',
    explanation: 'Richtig! Hier liegt ein konkretes, unmittelbar präsentes Objekt (die Nadel) vor. Das reflexartige Zurückweichen ist eine akute Schutzreaktion auf eine greifbare Gefahr.'
  },
  {
    id: 'b2',
    text: 'Herr Schmidt aus der ambulanten Pflege wartet seit drei Tagen auf den Anruf des Arztes wegen seiner Biopsie-Ergebnisse und kann nachts nicht schlafen.',
    target: 'angst',
    explanation: 'Richtig! Es handelt sich um State-Angst: Der Auslöser ist zukunftsgerichtet und diffus. Die Bedrohung wird antizipiert, ohne dass jetzt im Moment eine akute physische Gefahr vorliegt.'
  },
  {
    id: 'b3',
    text: 'Der demente Herr Klein steht im Flur des Altenheims, plötzlich fällt ein lautes Tablett mit Geschirr direkt neben ihm scheppernd zu Boden. Er zuckt zusammen.',
    target: 'furcht',
    explanation: 'Richtig! Das plötzliche, akute Scheppern löst eine unmittelbare, reflexive Schreck- und Furchtreaktion auf einen greifbaren Außenreiz aus.'
  },
  {
    id: 'b4',
    text: 'Sie bereiten Frau Meinhardt auf die Gallen-OP morgen vor. Sie sagt mit zittriger Stimme: „Ich kann gar nicht genau benennen, wovor eigentlich... mir schnürt es einfach die Kehle zu und ich habe so ein beklemmendes Gefühl und Unruhe tief in mir, wenn ich an morgen denke.“',
    target: 'angst',
    explanation: 'Richtig! Typisches Merkmal von Angst: Ein unklares, zukunftsgerichtetes Bedrohungsgefühl ohne konkretes, akut physisches Objekt vor Ort.'
  }
];

export const quiz2MatchingPairs: MatchingPair[] = [
  {
    id: 'm1',
    scenarioTitle: 'Szenario Krankenhaus',
    scenario: 'Frau Y. hat bei ihrer letzten Operation im Aufwachraum starke Schmerzen erlitten. Als sie nun wieder für eine OP vorbereitet wird und das OP-Hemd anziehen soll, fängt sie sofort an zu zittern und zu weinen.',
    term: 'Erlernte Angst / Konditionierung',
    explanation: 'Richtig! Eine persönliche, negative Vorerfahrung (starke Schmerzen) hat sich mit einem Reiz (OP-Hemd/Vorbereitung) verknüpft und löst nun automatisch die Angstreaktion aus.'
  },
  {
    id: 'm2',
    scenarioTitle: 'Szenario Altenheim',
    scenario: 'Bewohner Herr L. hat gesehen, wie sein Zimmernachbar im Bad schwer gestürzt ist und sich die Hüfte gebrochen hat. Seitdem weigert sich Herr L., alleine ins Bad zu gehen.',
    term: 'Beobachtungslernen',
    explanation: 'Richtig! Herr L. hat selbst keinen Sturz erlitten, aber durch das Miterleben des schweren Unfalls bei einer anderen Person eine massive Vermeidungsangst entwickelt.'
  },
  {
    id: 'm3',
    scenarioTitle: 'Szenario Ambulante Pflege',
    scenario: 'Die Tochter von Frau S. hat ihrer Mutter immer wieder Horrorgeschichten über die Nebenwirkungen von Schmerzmitteln erzählt und sie davor gewarnt. Frau S. verweigert nun panisch ihre ärztlich angeordnete Medikation.',
    term: 'Instruktionslernen',
    explanation: 'Richtig! Die Angst wurde durch verbale Warnungen, Schilderungen und Instruktionen Dritter erzeugt, ohne eigene Erfahrung oder eigene Beobachtung.'
  },
  {
    id: 'm4',
    scenarioTitle: 'Szenario Allgemein',
    scenario: 'Ein neuer Patient weigert sich, im fensterlosen, engen Behandlungszimmer auf den Arzt zu warten, und bekommt Schweißausbrüche. Er sagt: „Ich halte es in solchen Höhlen nicht aus.“',
    term: 'Veranlagung / Genetik',
    explanation: 'Richtig! Ängste vor engen Räumen (Klaustrophobie), Höhen oder Dunkelheit sind evolutionär tief in unserer Genetik verankert, da sie unseren Urahnen das Überleben sicherten.'
  }
];

export const quiz3ClozeText = {
  intro: 'Wählen Sie die korrekten Fachbegriffe aus den Dropdowns, um die physiologischen Reaktionen von Frau Meinhardt und anderen Patienten fachlich korrekt zu beschreiben:',
  parts: [
    { text: 'Sie begleiten Frau Meinhardt in den OP-Vorraum. Sie ist sehr aufgeregt. Da Wegrennen für sie in dieser Situation keine Option ist, aber ihr Körper auf eine aktive Angstreaktion programmiert ist (Fight or Flight), wird der ' },
    { key: 'nervensystem', correct: 'Sympathikus', options: ['Sympathikus', 'Parasympathikus', 'Nervus vagus'] },
    { text: ' aktiviert. Sie bemerken dies an ihren Vitalwerten: Ihre ' },
    { key: 'vitalwert', correct: 'Herzfrequenz', options: ['Herzfrequenz', 'Körpertemperatur', 'Sauerstoffsättigung'] },
    { text: ' steigt an und ihre Atmung wird schneller. Gleichzeitig werden in diesem Moment unwichtigere Körperfunktionen, wie die ' },
    { key: 'organe', correct: 'Verdauung', options: ['Verdauung', 'Muskelanspannung', 'Wachsamkeit'] },
    { text: ' oder die Blasentätigkeit, heruntergefahren. Da Frau Meinhardt feuchte Hände hat, wissen Sie, dass auch ihre ' },
    { key: 'haut', correct: 'Schweißproduktion', options: ['Schweißproduktion', 'Talgdrüsenaktivität', 'Schmerzempfindlichkeit'] },
    { text: ' gesteigert ist. Ein anderer Patient hingegen reagiert auf die Nachricht einer schweren Diagnose völlig passiv. Er erstarrt regelrecht (' },
    { key: 'starre', correct: 'Freezing', options: ['Freezing', 'Fainting', 'Fighting'] },
    { text: '). In diesem Fall wird der Gegenspieler, der ' },
    { key: 'gegenspieler', correct: 'Parasympathikus', options: ['Parasympathikus', 'Sympathikus', 'Thalamus'] },
    { text: ', aktiv. Bei diesem Patienten fällt der Blutdruck ab, sein Puls wird langsamer und es droht eine ' },
    { key: 'folge', correct: 'Ohnmacht', options: ['Ohnmacht', 'Tachykardie', 'Hypertonie'] },
    { text: '.' }
  ]
};

export const quiz4CascadeSteps: CascadeStep[] = [
  {
    id: 's1',
    stepNumber: 1,
    title: 'Sinnesreiz (Sensorische Wahrnehmung)',
    description: 'Herr K. sieht den Verbandswagen und hört das Klappern der Instrumente.',
    details: 'Die Sinnesorgane (Augen, Ohren) nehmen die Reize der Umwelt auf und leiten sie über sensorische Nervenbahnen ins Gehirn weiter.'
  },
  {
    id: 's2',
    stepNumber: 2,
    title: 'Amygdala (Mandelkern / Emotionale Bewertung)',
    description: 'Seh- und Höreindrücke laufen zusammen und werden emotional bewertet.',
    details: 'Hier wird der Reiz blitzschnell mit den Erinnerungen an die starken Schmerzen des letzten Verbandwechsels abgeglichen. Das Alarmsignal wird ausgelöst.'
  },
  {
    id: 's3',
    stepNumber: 3,
    title: 'Hypothalamus (Vegetative Steuerzentrale)',
    description: 'Steuerungszentrum für hormonelle und vegetative Prozesse wird aktiviert.',
    details: 'Der Hypothalamus empfängt den Notruf der Amygdala und schaltet das vegetative Nervensystem (Sympathikus) sowie die hormonelle Stressachse scharf.'
  },
  {
    id: 's4',
    stepNumber: 4,
    title: 'Nebennieren (Ausschüttung von Stresshormonen)',
    description: 'Ausschüttung von Stresshormonen (Adrenalin & Noradrenalin) in die Blutbahn.',
    details: 'Über neuronale Impulse stimulieren die Nebennieren die Ausschüttung von Katecholaminen, die sich rasend schnell im gesamten Kreislaufsystem verteilen.'
  },
  {
    id: 's5',
    stepNumber: 5,
    title: 'Vegetative Angstreaktion (Körperliche Alarmbereitschaft)',
    description: 'Körper in Alarmbereitschaft mit vegetativen und muskulären Symptomen.',
    details: 'Herz rast, Blutdruck steigt, Schweißausbrüche, flache Tachypnoe und hoher Muskeltonus – Herr K. gerät in sichtbare Panik.'
  }
];

export const quiz5SwipeCards: SwipeCard[] = [
  {
    id: 'c1',
    statement: 'Wenn eine Patientin aus Angst vor der OP erweiterte Pupillen hat und schnell atmet, zeigt sie eine passive Angstreaktion.',
    isCorrect: false,
    explanation: 'FALSCH! Geweitete Pupillen (Mydriasis), schnelle Atmung (Tachypnoe) und beschleunigter Puls gehören zur AKTIVEN Angstreaktion (Fight or Flight) und werden vom Sympathikus gesteuert.'
  },
  {
    id: 'c2',
    statement: 'Wenn der Patient auf eine Angst auslösende Situation (z. B. das Legen eines Blasenkatheters) mit einem starken Blutdruckabfall reagiert, ist der Parasympathikus aktiv.',
    isCorrect: true,
    explanation: 'WAHR! Eine parasympathische Übererregung führt zu Vasodilatation, Bradykardie, Blutdruckabfall und drohender Synkope (Ohnmacht). Dies ist typisch für die passive Erstarrungsreaktion (Freezing).'
  },
  {
    id: 'c3',
    statement: 'Ein Patient kann nur dann Angst vor einer OP-Narkose haben, wenn er selbst schon einmal eine schlechte Erfahrung mit einer Narkose gemacht hat.',
    isCorrect: false,
    explanation: 'FALSCH! Angst entsteht nicht nur durch Konditionierung/eigene Erfahrung, sondern sehr häufig auch durch Instruktionslernen (Warnungen/Horrorgeschichten anderer) oder Beobachtungslernen.'
  }
];
