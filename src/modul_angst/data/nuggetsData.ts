import { LearningNugget } from '../types';

export const learningNuggetsList: LearningNugget[] = [
  {
    id: 'nugget_furcht_angst',
    ds: 1,
    title: 'Angst vs. Furcht im klinischen Vergleich',
    subtitle: 'Folie 1: Differenzierung nach Auslöser, Funktion & zeitlichem Aspekt',
    category: 'Theorie & Definition',
    icon: 'Scale',
    unlockedByQuizId: 'ds1_quiz1',
    slideType: 'angst_vs_furcht',
    summary: 'Furcht richtet sich auf akute, greifbare Bedrohungen (Nadel, Sturz). Angst (State-Angst) ist diffus, unklar und zukunftsgerichtet (Warten auf OP). Beide aktivieren das vegetative Nervensystem.'
  },
  {
    id: 'nugget_entstehung',
    ds: 1,
    title: 'Die 4 Entstehungsformen der Angst',
    subtitle: 'Folie 2: Erlernte Angst, Beobachtung, Instruktion & Genetik',
    category: 'Neuropsychologie',
    icon: 'BrainCircuit',
    unlockedByQuizId: 'ds1_quiz2',
    slideType: 'entstehungsformen',
    summary: 'Angst vor Eingriffen entsteht nicht zufällig: Vorerfahrungen (Konditionierung), Beobachten von Notfällen, Warnungen Dritter (Instruktion) oder evolutionäre Veranlagung (Klaustrophobie) prägen das Erleben.'
  },
  {
    id: 'nugget_physiologie',
    ds: 1,
    title: 'Physiologie des Autonomen Nervensystems',
    subtitle: 'Folie 3: Sympathikus (Fight/Flight) vs. Parasympathikus (Freeze)',
    category: 'Körperliche Reaktionen',
    icon: 'Activity',
    unlockedByQuizId: 'ds1_quiz3',
    slideType: 'physiologie',
    summary: 'Aktive Angstreaktion: Tachykardie, Mydriasis, Schwitzen, Tachypnoe. Passive Angstreaktion: Bradykardie, Hypotension, drohende Synkope und motorische Erstarrung.'
  },
  {
    id: 'nugget_kaskade',
    ds: 1,
    title: 'Die Neurobiologische Angstkaskade',
    subtitle: 'Folie 4: Reiz ➔ Amygdala ➔ Hypothalamus ➔ Nebennieren ➔ Reaktion',
    category: 'Hirnforschung & Stressachse',
    icon: 'GitCommit',
    unlockedByQuizId: 'ds1_quiz4',
    slideType: 'angstkaskade',
    summary: 'Sensorische Reize erreichen über Thalamus die Amygdala zur emotionalen Gefahrenbewertung. Der Hypothalamus aktiviert die Stresshormonausschüttung (Adrenalin) der Nebennieren.'
  },
  {
    id: 'nugget_kommunikation',
    ds: 2,
    title: 'Pflegerische Gesprächsführung & Deeskalation',
    subtitle: 'Dos & Don\'ts in der präoperativen Kommunikation',
    category: 'Pflegepraxis',
    icon: 'MessageSquare',
    unlockedByQuizId: 'ds2_quiz1',
    slideType: 'kommunikation',
    summary: 'Keine Bagatellisierung („Nur ein kleiner Schnitt“). Transparenz, Selbstbestimmung und feste Bezugspersonen dämpfen die physiologische Stressachse des Patienten.'
  },
  {
    id: 'nugget_notfallkoffer',
    ds: 2,
    title: 'Der Digitale PFA-Notfallkoffer',
    subtitle: 'Evidenzbasierte Interventionen von Wärme bis Prämedikation',
    category: 'Akutmaßnahmen',
    icon: 'BriefcaseMedical',
    unlockedByQuizId: 'ds2_quiz4',
    slideType: 'notfallkoffer',
    summary: 'Schnelle Handlungsoptionen: Vorgewärmte Decken, PMR nach Jacobson, Reizabschirmung, Begleitpersonen steuern und sichere Gabe von Benzodiazepinen (ca. 45 Min vor OP).'
  }
];
