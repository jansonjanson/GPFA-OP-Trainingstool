import { Achievement } from '../types';

export const ACHIEVEMENTS: Record<string, Achievement> = {
  'macgyver': {
    id: 'macgyver',
    title: 'MacGyver der Pflege',
    description: 'Ohne Ausrüstung losgezogen und trotzdem improvisiert.',
    icon: 'Wrench',
    type: 'neutral'
  },
  'prepared': {
    id: 'prepared',
    title: 'Vorbereitet ist das halbe Leben',
    description: 'Den Bettplatz und Transportausrüstung perfekt vorbereitet.',
    icon: 'BriefcaseMedical',
    type: 'positive'
  },
  'pain_manager': {
    id: 'pain_manager',
    title: 'Schmerz-Vordenker',
    description: 'Das Schmerzkonzept im AWR aktiv abgefragt.',
    icon: 'ShieldCheck',
    type: 'positive'
  },
  'marathon': {
    id: 'marathon',
    title: 'Marathonläufer',
    description: 'Wichtiges Equipment vergessen und unnötig viel gelaufen (Energieverlust).',
    icon: 'Footprints',
    type: 'negative'
  },
  'adlerauge': {
    id: 'adlerauge',
    title: 'Adlerauge',
    description: 'Nachblutung erkannt, korrekt abgewartet, markiert und Arzt gerufen.',
    icon: 'Eye',
    type: 'positive'
  },
  'isbar_pro': {
    id: 'isbar_pro',
    title: 'ISBAR-Profi',
    description: 'Übergabe oder Arzt-Telefonat perfekt strukturiert durchgeführt.',
    icon: 'PhoneCall',
    type: 'positive'
  },
  'keimschleuder': {
    id: 'keimschleuder',
    title: 'Keimschleuder',
    description: 'Tätigkeiten am Patienten mit unsterilen, kontaminierten Händen/Handschuhen durchgeführt.',
    icon: 'Bug',
    type: 'negative'
  },
  'textbook': {
    id: 'textbook',
    title: 'Lehrbuch-Fachkraft',
    description: 'Die Simulation mit 100% Patientensicherheit beendet.',
    icon: 'GraduationCap',
    type: 'positive'
  },
  'code_blue': {
    id: 'code_blue',
    title: 'Code Blue',
    description: 'Einen lebensbedrohlichen Notfall provoziert.',
    icon: 'HeartCrack',
    type: 'negative'
  },
  'fast_track': {
    id: 'fast_track',
    title: 'Fast-Track Master',
    description: 'Ernährung und Frühmobilisation optimal umgesetzt.',
    icon: 'Activity',
    type: 'positive'
  },
  'multiverse': {
    id: 'multiverse',
    title: 'Reise durch das post OP Multiversum',
    description: 'Alle anderen 10 Achievements freigeschaltet. Sie haben jede Zeitlinie gesehen.',
    icon: 'Globe',
    type: 'positive'
  }
};
