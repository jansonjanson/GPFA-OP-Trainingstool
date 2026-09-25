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
    // Also remove any custom keys
    localStorage.removeItem('gpfa_m4_completed_quizzes');
    localStorage.removeItem('gpfa_m3_completed_quizzes');
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

  listeners.forEach(fn => fn(unlockedAch));
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
