// Global Gamification & LocalStorage Persistence System for GPFA OP-Trainingstool

export interface Achievement {
  id: string;
  module: 1 | 2 | 3 | 4 | 'global';
  title: string;
  description: string;
  iconName: string;
  unlockedAt?: string;
}

export const ALL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'ki_helfer_used',
    module: 'global',
    title: 'Virtuelle Praxisanleitung',
    description: 'KI-Helfer (NotebookLM) zum ersten Mal konsultiert.',
    iconName: 'Bot'
  },
  {
    id: 'curriculum_roadmap',
    module: 'global',
    title: 'Kurs-Pionier',
    description: 'Curriculum-Fahrplan über alle 8 Doppelstunden erkundet.',
    iconName: 'BookOpen'
  },
  {
    id: 'modul1_theorie',
    module: 1,
    title: 'Diagnostiker der 6-F',
    description: 'Alle 7 Wissens-Quizzes in DS 1 (Diagnose & Beobachtung) gelöst.',
    iconName: 'Stethoscope'
  },
  {
    id: 'modul1_simulation',
    module: 1,
    title: 'Klinischer Detektiv',
    description: 'Hausärztliche Anamnese bei Frau Meinhardt & OP-Indikation gestellt.',
    iconName: 'Search'
  },
  {
    id: 'modul2_theorie',
    module: 2,
    title: 'Neurobiologie-Experte',
    description: 'Vegetative Stresskaskade und Entstehungsformen präoperativer Angst verstanden.',
    iconName: 'Brain'
  },
  {
    id: 'modul2_simulation',
    module: 2,
    title: 'Empathie-Profi',
    description: 'Digitalen Notfallkoffer eingesetzt und Frau Meinhardt deeskaliert.',
    iconName: 'HeartHandshake'
  },
  {
    id: 'modul3_nuggets',
    module: 3,
    title: 'Prä-OP Wissensmeister',
    description: 'Alle 7 Nuggets in Modul 3 zur präoperativen Vorbereitung gesammelt.',
    iconName: 'CheckCircle2'
  },
  {
    id: 'modul3_simulation',
    module: 3,
    title: 'Sicherheits-Champion',
    description: 'OP-Vorbereitungs-Simulator ohne kritische Fehler absolviert.',
    iconName: 'ShieldCheck'
  },
  {
    id: 'modul4_ds7_quizzes',
    module: 4,
    title: 'Aufwachraum-Expertise',
    description: 'Alle 19 Quiz-Stationen zur postoperativen Überwachung gemeistert.',
    iconName: 'Activity'
  },
  {
    id: 'modul4_simulation',
    module: 4,
    title: 'Lebensretter im AWR',
    description: 'Kritische Vitalwerte stabilisiert und ISBAR-Übergabe erfolgreich durchgeführt.',
    iconName: 'HeartPulse'
  },
  {
    id: 'curriculum_complete',
    module: 'global',
    title: 'OP-Pflege PFA Meister',
    description: 'Alle 4 Module und 8 Doppelstunden des OP-Trainings abgeschlossen.',
    iconName: 'Award'
  }
];

// LocalStorage helpers
export const StorageKeys = {
  UNLOCKED_ACHIEVEMENTS: 'gpfa_achievements',
  FREE_NAV_MODE: 'gpfa_free_navigation_mode',
  WELCOME_SEEN: 'gpfa_curriculum_welcome_seen',
  MODUL1_NUGGETS: 'gpfa_m1_unlocked_nuggets',
  MODUL1_QUIZZES: 'gpfa_m1_completed_quizzes',
  MODUL2_NUGGETS: 'gpfa_m2_unlocked_nuggets',
  MODUL2_QUIZZES: 'gpfa_m2_completed_quizzes',
  MODUL3_NUGGETS: 'gpfa_m3_unlocked_nuggets',
  MODUL4_NUGGETS: 'gpfa_m4_unlocked_nuggets',
  MODUL4_QUIZZES: 'gpfa_m4_completed_quizzes',
  ACTIVE_MODULE: 'gpfa_last_active_module',
  ADMIN_UNLOCKED: 'gpfa_admin_unlocked',
  TUTORIAL_SEEN: 'gpfa_hud_tutorial_seen',
};

export function getLocal<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch (e) {
    console.warn(`[storage] Could not read ${key}`, e);
    return defaultValue;
  }
}

export function setLocal<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.warn(`[storage] Could not write ${key}`, e);
  }
}

// Check if admin mode is active
export function isAdminUnlocked(): boolean {
  return getLocal<boolean>(StorageKeys.ADMIN_UNLOCKED, false);
}

// Check if free navigation is enabled
export function isFreeNavigationMode(): boolean {
  return getLocal<boolean>(StorageKeys.FREE_NAV_MODE, false) || isAdminUnlocked();
}

// Module Progression Logic
// Modul 1: always open
// Modul 2: unlocked if Modul 1 simulation completed
// Modul 3: unlocked if Modul 2 simulation completed
// Modul 4: unlocked if Modul 3 simulation completed
export function isModuleUnlocked(moduleNum: 1 | 2 | 3 | 4): boolean {
  if (moduleNum === 1) return true;
  if (isFreeNavigationMode()) return true;

  if (moduleNum === 2) {
    return isAchievementUnlocked('modul1_simulation');
  }
  if (moduleNum === 3) {
    return isAchievementUnlocked('modul2_simulation');
  }
  if (moduleNum === 4) {
    return isAchievementUnlocked('modul3_simulation');
  }
  return false;
}

// Admin unlock with password "Janson"
export const ADMIN_PASSWORD = 'Janson';

export function unlockAllWithAdminPassword(password: string): boolean {
  if (password.trim() !== ADMIN_PASSWORD) {
    return false;
  }

  // Set flags
  setLocal(StorageKeys.ADMIN_UNLOCKED, true);
  setLocal(StorageKeys.FREE_NAV_MODE, true);

  // Unlock all achievements
  const allIds = ALL_ACHIEVEMENTS.map(a => a.id);
  setLocal(StorageKeys.UNLOCKED_ACHIEVEMENTS, allIds);

  // Unlock all nuggets
  setLocal(StorageKeys.MODUL1_NUGGETS, [
    'nugget_6f', 'nugget_symptome', 'nugget_ausscheidung', 'nugget_redflags',
    'nugget_handeln', 'nugget_anatomie', 'nugget_therapie'
  ]);
  setLocal(StorageKeys.MODUL2_NUGGETS, [
    'ds1_quiz1', 'ds1_quiz2', 'ds1_quiz3', 'ds2_quiz1', 'ds2_quiz2', 'ds2_quiz3'
  ]);
  setLocal(StorageKeys.MODUL3_NUGGETS, [
    'praeop_nugget_basics', 'praeop_nugget_standard', 'praeop_nugget_safety', 'praeop_nugget_simulation'
  ]);
  setLocal(StorageKeys.MODUL4_NUGGETS, Array.from({ length: 19 }, (_, i) => `station-${i + 1}`));

  return true;
}

// Reset all training progress completely
export function resetEntireTrainingProgress(): void {
  try {
    Object.values(StorageKeys).forEach(k => {
      localStorage.removeItem(k);
    });
    // Remove all gpfa and simLab keys, or clear entirely
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {
      // fallback if restricted
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('gpfa_') || key.startsWith('simLab'))) {
          localStorage.removeItem(key);
        }
      }
    }

    // Notify all active components immediately
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new CustomEvent('gpfa_global_reset'));
  } catch (e) {
    console.error('Error resetting progress:', e);
  }
}

// Global Achievement Dispatcher
type AchievementListener = (achievement: Achievement) => void;
const listeners: Set<AchievementListener> = new Set();

export function onAchievementUnlocked(listener: AchievementListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function unlockAchievement(achievementId: string): void {
  const current = getLocal<string[]>(StorageKeys.UNLOCKED_ACHIEVEMENTS, []);
  if (current.includes(achievementId)) return;

  const target = ALL_ACHIEVEMENTS.find(a => a.id === achievementId);
  if (!target) return;

  const updated = [...current, achievementId];
  setLocal(StorageKeys.UNLOCKED_ACHIEVEMENTS, updated);

  const unlockedAch: Achievement = {
    ...target,
    unlockedAt: new Date().toISOString()
  };

  setTimeout(() => {
    listeners.forEach(fn => {
      try {
        fn(unlockedAch);
      } catch (e) {
        console.error('Error in achievement listener:', e);
      }
    });
  }, 0);
}

export function isAchievementUnlocked(achievementId: string): boolean {
  const current = getLocal<string[]>(StorageKeys.UNLOCKED_ACHIEVEMENTS, []);
  return current.includes(achievementId);
}

export function getUnlockedAchievementsCount(): { unlocked: number; total: number } {
  const current = getLocal<string[]>(StorageKeys.UNLOCKED_ACHIEVEMENTS, []);
  return {
    unlocked: current.length,
    total: ALL_ACHIEVEMENTS.length
  };
}

// ==========================================
// Global Learning Nugget Unlock Dispatcher
// ==========================================
export interface NuggetUnlockNotification {
  id: string;
  title: string;
  moduleNumber: 1 | 2 | 3 | 4;
  moduleName: string;
  category?: string;
  unlockedAt?: string;
}

type NuggetListener = (notification: NuggetUnlockNotification) => void;
const nuggetListeners: Set<NuggetListener> = new Set();

export function onNuggetUnlocked(listener: NuggetListener): () => void {
  nuggetListeners.add(listener);
  return () => {
    nuggetListeners.delete(listener);
  };
}

const MODULE_NAMES: Record<number, string> = {
  1: 'Modul 1: Diagnose & Beobachtung',
  2: 'Modul 2: Angst vor der OP',
  3: 'Modul 3: Präoperative Vorbereitung',
  4: 'Modul 4: Postoperative Pflege & AWR'
};

const KNOWN_NUGGET_TITLES: Record<string, { title: string; category?: string }> = {
  // Modul 1
  m1_nugget_station1: { title: 'Station 1: Ursachen, Steinarten & Charcot-Symptome (Dr. Weigl)', category: 'Grundlagen & Notfallerkennung' },
  nugget_station1_patho: { title: 'Station 1: Ursachen, Steinarten & Charcot-Symptome (Dr. Weigl)', category: 'Grundlagen & Notfallerkennung' },
  m1_nugget_station2: { title: 'Station 2: Leitlinienwissen & Epidemiologie (gesund.bund.de)', category: 'Epidemiologie & Leitlinien' },
  nugget_station2_article: { title: 'Station 2: Leitlinienwissen & Epidemiologie (gesund.bund.de)', category: 'Epidemiologie & Leitlinien' },
  m1_nugget_station3: { title: 'Station 3: OP-Ablauf & Laparoskopische Cholezystektomie', category: 'Chirurgische Verfahren' },
  nugget_station3_surgery: { title: 'Station 3: OP-Ablauf & Laparoskopische Cholezystektomie', category: 'Chirurgische Verfahren' },
  nugget_6f: { title: 'Die 6-F-Regel der Gallensteinentstehung', category: 'Diagnostik' },
  nugget_symptoms: { title: 'Symptom-Topographie & Schmerzausstrahlung (Head-Zonen)', category: 'Klinische Beobachtung' },
  nugget_excretion: { title: 'Ausscheidungs-Befunde bei Gallenstau (Cholestase)', category: 'Ausscheidungsbeobachtung' },
  nugget_redflags: { title: 'Red Flags: Wann wird die Kolik zum Notfall?', category: 'Notfallmanagement' },
  nugget_anatomy: { title: 'Anatomie, Gallebildung & Cholesterin', category: 'Anatomie & Physiologie' },
  nugget_therapy: { title: 'PFA-Handlungspfad & Cholezystektomie', category: 'Pflegepraxis & Erstmaßnahmen' },

  // Modul 2
  nugget_furcht_angst: { title: 'Angst vs. Furcht im klinischen Vergleich', category: 'Psychosoziale Pflege' },
  m2_nugget_furcht_angst: { title: 'Angst vs. Furcht im klinischen Vergleich', category: 'Psychosoziale Pflege' },
  nugget_entstehung: { title: 'Die 4 Entstehungsformen präoperativer Angst', category: 'Lern- & Neuropsychologie' },
  m2_nugget_entstehung: { title: 'Die 4 Entstehungsformen präoperativer Angst', category: 'Lern- & Neuropsychologie' },
  nugget_physiologie: { title: 'Physiologie des Autonomen Nervensystems (Sympathikus vs. Parasympathikus)', category: 'Neurovegetative Steuerung' },
  m2_nugget_physiologie: { title: 'Physiologie des Autonomen Nervensystems (Sympathikus vs. Parasympathikus)', category: 'Neurovegetative Steuerung' },
  nugget_kaskade: { title: 'Die Neurobiologische Angstkaskade & Stressachse', category: 'Neurobiologie' },
  m2_nugget_kaskade: { title: 'Die Neurobiologische Angstkaskade & Stressachse', category: 'Neurobiologie' },
  nugget_kommunikation: { title: 'Pflegerische Gesprächsführung & Validierung', category: 'Pflegerische Kommunikation' },
  m2_nugget_kommunikation: { title: 'Pflegerische Gesprächsführung & Validierung', category: 'Pflegerische Kommunikation' },
  nugget_notfallkoffer: { title: 'Der Digitale PFA-Notfallkoffer bei Panik & Akutangst', category: 'Pflegerische Akutinterventionen' },
  m2_nugget_notfallkoffer: { title: 'Der Digitale PFA-Notfallkoffer bei Panik & Akutangst', category: 'Pflegerische Akutinterventionen' },

  ds1_step1_video: { title: 'Facheinführung: Perioperative Angst & Neuropsychologie', category: 'Einführung & Video' },
  ds1_step2_def: { title: 'Definition & Abgrenzung von Furcht und Angst', category: 'Theorie & Definition' },
  ds1_quiz1: { title: 'Angst vs. Furcht & Relevanz für die Pflege', category: 'Theorie & Grundlagen' },
  ds1_quiz2: { title: 'Die 4 Entstehungsformen der Angst (Matching)', category: 'Neuropsychologie' },
  ds1_quiz3: { title: 'Physiologie: Sympathikus vs. Parasympathikus', category: 'Vegetatives Nervensystem' },
  ds1_quiz4: { title: 'Die Neurobiologische Angstkaskade', category: 'Hirnforschung & Stressachse' },
  ds1_quiz5: { title: 'Wahr oder Falsch – Symptom- & Praxis-Check', category: 'Klinische Beobachtung' },

  ds2_step1_text: { title: 'Fachartikel: Evidenzbasierte Pflege bei Angstpatienten', category: 'Fachliteratur CNE' },
  ds2_step2_koffer: { title: 'Interaktiver PFA-Notfallkoffer: Methoden & Materialien', category: 'Praxisinterventionen' },
  ds2_quiz1: { title: 'Pflegerische Gesprächsführung & Deeskalation (Do vs. Don\'t)', category: 'Pflegerische Kommunikation' },
  ds2_quiz2: { title: 'Wirkstoff-Tafel zur medikamentösen Prämedikation', category: 'Medikamentenmanagement' },
  ds2_quiz3: { title: 'Ablenkungs- & Entspannungsmethoden (Matching)', category: 'Pflegepraxis' },
  ds2_quiz4: { title: 'Die 3-Säulen-Matrix: Pflegerische Maßnahmen zuordnen', category: 'Praxistransfer' },
  ds2_quiz5: { title: 'Fehler-Radar im Patientenzimmer (Hygiene & Troubleshooting)', category: 'Patientensicherheit' },

  // Modul 4 Videos & Steps
  video_narkose: { title: 'Narkoseausleitung & Überwachung im Aufwachraum', category: 'AWR-Monitoring' },
  video_abholung: { title: 'Schnittstelle Aufwachraum / Station: Die sichere Übergabe', category: 'Patientensicherheit' },
  video_massnahmen: { title: 'Postoperative Pflegemaßnahmen auf Normalstation', category: 'Stationsversorgung' },
  ds7_step1_video: { title: 'Narkoseausleitung & Überwachung im Aufwachraum', category: 'AWR-Monitoring' },
  ds7_step2_video: { title: 'Schnittstelle Aufwachraum / Station: Die sichere Übergabe', category: 'Patientensicherheit' },
  ds7_step3_video: { title: 'Postoperative Pflegemaßnahmen auf Normalstation', category: 'Stationsversorgung' },

  // Modul 3
  '0': { title: 'Einteilung von Operationen nach Dringlichkeitsstufen', category: 'Organisatorische Grundlagen' },
  '1': { title: 'Prähabilitation: Postoperative Fähigkeiten vorab üben', category: 'Patientenedukation' },
  '2': { title: 'Nüchternheitsregeln & Aspirationsprophylaxe', category: 'Patientensicherheit' },
  '3': { title: 'Präoperatives Abführen: Evidenz vs. Mythos', category: 'Pflegestandards' },
  '4': { title: 'Hautantiseptik, Schmuck & Haarkürzung (Clipper)', category: 'Hygiene & Infektionsprävention' },
  '5': { title: 'Prämedikation, Dauermedikation & Patientensicherheit', category: 'Pharmakotherapie & Sicherheit' },
  '6': { title: 'Die Präoperative Sicherheits-Checkliste & OP-Schleusenübergabe', category: 'Patientensicherheit & Qualitätsmanagement' },

  m3_nugget_einteilung: { title: 'Einteilung von Operationen nach Dringlichkeitsstufen', category: 'Organisatorische Grundlagen' },
  m3_nugget_praehab: { title: 'Prähabilitation: Postoperative Fähigkeiten vorab üben', category: 'Patientenedukation' },
  m3_nugget_nuechtern: { title: 'Nüchternheitsregeln & Aspirationsprophylaxe', category: 'Patientensicherheit' },
  m3_nugget_abfuehren: { title: 'Präoperatives Abführen: Evidenz vs. Mythos', category: 'Pflegestandards' },
  m3_nugget_hautpflege: { title: 'Hautantiseptik, Schmuck & Haarkürzung (Clipper)', category: 'Hygiene & Infektionsprävention' },
  m3_nugget_praemed: { title: 'Prämedikation, Dauermedikation & Patientensicherheit', category: 'Pharmakotherapie & Sicherheit' },
  m3_nugget_checklist: { title: 'Präoperative Checkliste & OP-Schleusenübergabe', category: 'Patientensicherheit' },

  'station-1': { title: 'Einteilung von Operationen nach Dringlichkeitsstufen', category: 'Organisatorische Grundlagen' },
  'station-2': { title: 'Prähabilitation (Atemtrainer, En-bloc-Aufstehen)', category: 'Patientenedukation' },
  'station-3': { title: 'Nüchternheitsgrenzen (2h Flüssigkeit, 6h Nahrung)', category: 'Patientensicherheit' },
  'station-4': { title: 'Darmvorbereitung & Abführen vor der OP', category: 'Pflegestandards' },
  'station-5': { title: 'Hautvorbereitung & Haarkürzung (Clipper)', category: 'Infektionsprophylaxe' },
  'station-6': { title: 'Prämedikation & Sedierung am OP-Morgen', category: 'Medikamentenmanagement' },
  'station-7': { title: 'Präoperative Checkliste & OP-Schleusenübergabe', category: 'Patientensicherheit' },

  // Modul 4 Stationen 1 bis 19
  'nugget_1': { title: 'Komplikations-Monitoring im AWR', category: 'AWR-Monitoring' },
  'nugget_2': { title: 'Vigilanz- und Bewusstseinsbeurteilung', category: 'Neurologische Überwachung' },
  'nugget_3': { title: 'Atemwegs- und Lungenüberwachung', category: 'Respiratorische Überwachung' },
  'nugget_4': { title: 'Kardiovaskuläres Monitoring', category: 'Hämodynamik' },
  'nugget_5': { title: 'Körpertemperatur & Hypothermie-Prävention', category: 'Thermoregulation' },
  'nugget_6': { title: 'Wundverband- und Nachblutungskontrolle', category: 'Wundmanagement' },
  'nugget_7': { title: 'Drainagen-Management & Sekretbeobachtung', category: 'Drainagen' },
  'nugget_8': { title: 'Postoperative Schmerzerfassung (NRS)', category: 'Schmerzmanagement' },
  'nugget_9': { title: 'PONV: Prävention & Akutintervention', category: 'Symptomkontrolle' },
  'nugget_10': { title: 'Infusionsmanagement & Bilanzierung', category: 'Flüssigkeitshaushalt' },
  'nugget_11': { title: 'Ausscheidung & Miktionskontrolle', category: 'Urologische Überwachung' },
  'nugget_12': { title: 'Strukturierte Übergabe nach ISBAR', category: 'Patientensicherheit' },
  'nugget_13': { title: 'Typische postoperative Komplikationen', category: 'Komplikationsmanagement' },
  'nugget_14': { title: 'Standardisierte Beobachtungskategorien (I Care)', category: 'Pflegestandards' },
  'nugget_15': { title: 'DMS-Kontrolle (Durchblutung, Motorik, Sensibilität)', category: 'Neurologische Prüfung' },
  'nugget_16': { title: 'Frühmobilisation & Sturzprophylaxe', category: 'Mobilisation' },
  'nugget_17': { title: 'Patientenkontrollierte Analgesie (PCA)', category: 'Schmerztherapie' },
  'nugget_18': { title: 'Zeitpunkt für orale Flüssigkeits- und Nahrungsaufnahme', category: 'Ernährungsmanagement' },
  'nugget_19': { title: 'Stufenweiser Kostaufbau nach Bauchoperationen', category: 'Ernährungsmanagement' }
};

export function notifyNuggetUnlocked(params: {
  id: string;
  title?: string;
  moduleNumber: 1 | 2 | 3 | 4;
  moduleName?: string;
  category?: string;
}): void {
  const known = KNOWN_NUGGET_TITLES[params.id];
  // Sanitize title if it looks technical, has underscores, or is empty
  let title = params.title;
  if (!title || title.includes('_') || title.startsWith('ds') || title.startsWith('nugget_') || title.startsWith('station-') || title.startsWith('video_')) {
    title = known?.title || (title ? title.replace(/^[a-z0-9]+_/i, '').replace(/_/g, ' ') : `Fachkarte ${params.id}`);
  }
  const category = params.category || known?.category || 'Fachwissen';
  const moduleName = params.moduleName || MODULE_NAMES[params.moduleNumber] || `Modul ${params.moduleNumber}`;

  const notification: NuggetUnlockNotification = {
    id: params.id,
    title,
    moduleNumber: params.moduleNumber,
    moduleName,
    category,
    unlockedAt: new Date().toISOString()
  };

  setTimeout(() => {
    nuggetListeners.forEach(fn => {
      try {
        fn(notification);
      } catch (e) {
        console.error('Error in nugget listener:', e);
      }
    });

    try {
      window.dispatchEvent(new CustomEvent('gpfa_nugget_unlocked', { detail: notification }));
    } catch {
      // ignore
    }
  }, 0);
}

