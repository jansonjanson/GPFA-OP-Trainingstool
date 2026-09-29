import React, { useState, useMemo, useEffect } from 'react';
import { 
  BookOpen, 
  Search, 
  X, 
  Sparkles, 
  CheckCircle2, 
  Lock, 
  Filter, 
  ChevronDown, 
  Layers, 
  FileText, 
  Lightbulb, 
  ExternalLink,
  ShieldCheck,
  Stethoscope,
  HeartHandshake,
  Activity,
  Bookmark,
  Printer,
  Download
} from 'lucide-react';
import { FACHHANDBUCH_NUGGETS, FachhandbuchNugget } from '../data/fachhandbuchData';
import { StorageKeys, getLocal, isAdminUnlocked } from '../utils/gamification';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialModuleFilter?: 1 | 2 | 3 | 4 | 'all';
}

export const FachhandbuchModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialModuleFilter = 'all'
}) => {
  const [selectedModule, setSelectedModule] = useState<1 | 2 | 3 | 4 | 'all'>(initialModuleFilter);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedNuggetIds, setExpandedNuggetIds] = useState<Set<string>>(new Set());
  const [showOnlyUnlocked, setShowOnlyUnlocked] = useState<boolean>(false);
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0);

  const isAdmin = isAdminUnlocked();

  // Listen to storage and custom events to update unlocked status live
  useEffect(() => {
    const handleUpdate = () => setRefreshTrigger(prev => prev + 1);
    window.addEventListener('storage', handleUpdate);
    window.addEventListener('gpfa_nugget_unlocked', handleUpdate);
    return () => {
      window.removeEventListener('storage', handleUpdate);
      window.removeEventListener('gpfa_nugget_unlocked', handleUpdate);
    };
  }, []);

  // Read unlocked states across all 4 modules from localStorage
  const unlockedSets = useMemo(() => {
    const m1 = new Set<string>(getLocal<string[]>(StorageKeys.MODUL1_NUGGETS, []));
    const m2 = new Set<string>(getLocal<string[]>(StorageKeys.MODUL2_NUGGETS, []));
    const m3Record = getLocal<Record<string, boolean>>(StorageKeys.MODUL3_NUGGETS, {});
    const m4 = new Set<string>(getLocal<string[]>(StorageKeys.MODUL4_NUGGETS, []));

    // Also read any completed quizzes keys
    const m1q = getLocal<string[]>(StorageKeys.MODUL1_QUIZZES, []);
    m1q.forEach(k => m1.add(k));
    const m2q = getLocal<string[]>(StorageKeys.MODUL2_QUIZZES, []);
    m2q.forEach(k => m2.add(k));
    const m4q = getLocal<Record<string, any>>(StorageKeys.MODUL4_QUIZZES, {});
    Object.keys(m4q).forEach(k => {
      if (m4q[k]?.answered && m4q[k]?.isCorrect) {
        m4.add(k);
        m4.add(k.replace('quiz_', 'nugget_'));
        m4.add(k.replace('quiz_', 'station-'));
      }
    });

    // Convert m3 record (keyed by index or id)
    const m3 = new Set<string>();
    Object.keys(m3Record).forEach(k => {
      if (m3Record[k]) {
        m3.add(k);
        m3.add(`station-${k}`);
        m3.add(`station_${k}`);
      }
    });

    return { m1, m2, m3, m4 };
  }, [isOpen, refreshTrigger]);

  const toggleNuggetExpanded = (id: string) => {
    setExpandedNuggetIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const isNuggetUnlocked = (nugget: FachhandbuchNugget): boolean => {
    if (isAdmin) return true;
    if (nugget.moduleIndex === 1) {
      if (nugget.nuggetMatchId && unlockedSets.m1.has(nugget.nuggetMatchId)) return true;
      if (unlockedSets.m1.has(nugget.id)) return true;
      if (nugget.id === 'm1_nugget_station1' && (unlockedSets.m1.has('nugget_station1_patho') || unlockedSets.m1.has('q1'))) return true;
      if (nugget.id === 'm1_nugget_station2' && (unlockedSets.m1.has('nugget_station2_article') || unlockedSets.m1.has('q2'))) return true;
      if (nugget.id === 'm1_nugget_station3' && (unlockedSets.m1.has('nugget_station3_surgery') || unlockedSets.m1.has('q3'))) return true;
      return false;
    }
    if (nugget.moduleIndex === 2) {
      if (unlockedSets.m2.has(nugget.id)) return true;
      if (nugget.nuggetMatchId && unlockedSets.m2.has(nugget.nuggetMatchId)) return true;
      // Direct quiz and slide mappings for Modul 2
      const m2Map: Record<string, string[]> = {
        nugget_furcht_angst: ['ds1_quiz1', 'nugget_furcht_angst', 'm2_nugget_furcht_angst', 'ds1_step2_def', 'ds1_step1_video'],
        nugget_entstehung: ['ds1_quiz2', 'nugget_entstehung', 'm2_nugget_entstehung'],
        nugget_physiologie: ['ds1_quiz3', 'nugget_physiologie', 'm2_nugget_physiologie'],
        nugget_kaskade: ['ds1_quiz4', 'ds1_quiz5', 'nugget_kaskade', 'm2_nugget_kaskade'],
        nugget_kommunikation: ['ds2_quiz1', 'nugget_kommunikation', 'm2_nugget_kommunikation', 'ds2_step1_text'],
        nugget_notfallkoffer: ['ds2_quiz2', 'ds2_quiz3', 'ds2_quiz4', 'ds2_quiz5', 'nugget_notfallkoffer', 'm2_nugget_notfallkoffer', 'ds2_step2_koffer']
      };
      const allowed = (nugget.nuggetMatchId && m2Map[nugget.nuggetMatchId]) || m2Map[nugget.id.replace('m2_', '')];
      if (allowed && allowed.some(k => unlockedSets.m2.has(k))) return true;
      return false;
    }
    if (nugget.moduleIndex === 3) {
      if (nugget.nuggetMatchId && unlockedSets.m3.has(nugget.nuggetMatchId)) return true;
      if (unlockedSets.m3.has(nugget.id)) return true;
      // Dringlichkeitsstufen, Prähabilitation, Nüchternheit, etc.
      const m3Map: Record<string, string[]> = {
        '0': ['0', '1', '2', 'station-1', 'm3_nugget_einteilung', 'station_1'],
        m3_nugget_einteilung: ['0', '1', '2', 'station-1', 'm3_nugget_einteilung', 'station_1'],
        '1': ['3', '5', 'station-2', 'm3_nugget_praehab', 'station_2'],
        m3_nugget_praehab: ['3', '5', 'station-2', 'm3_nugget_praehab', 'station_2'],
        '2': ['4', '6', 'station-3', 'm3_nugget_nuechtern', 'station_3'],
        m3_nugget_nuechtern: ['4', '6', 'station-3', 'm3_nugget_nuechtern', 'station_3'],
        '3': ['7', 'station-4', 'm3_nugget_abfuehren', 'station_4'],
        m3_nugget_abfuehren: ['7', 'station-4', 'm3_nugget_abfuehren', 'station_4'],
        '4': ['8', 'station-5', 'm3_nugget_hautpflege', 'station_5'],
        m3_nugget_hautpflege: ['8', 'station-5', 'm3_nugget_hautpflege', 'station_5'],
        '5': ['9', '10', 'station-6', 'm3_nugget_praemed', 'station_6'],
        m3_nugget_praemed: ['9', '10', 'station-6', 'm3_nugget_praemed', 'station_6'],
        '6': ['10', '11', '12', 'station-7', 'm3_nugget_checklist', 'station_7'],
        m3_nugget_checklist: ['10', '11', '12', 'station-7', 'm3_nugget_checklist', 'station_7']
      };
      const allowed = (nugget.nuggetMatchId && m3Map[nugget.nuggetMatchId]) || m3Map[nugget.id];
      if (allowed && allowed.some(k => unlockedSets.m3.has(k))) return true;
      return false;
    }
    if (nugget.moduleIndex === 4) {
      if (nugget.nuggetMatchId && unlockedSets.m4.has(nugget.nuggetMatchId)) return true;
      if (unlockedSets.m4.has(nugget.id)) return true;
      const num = nugget.id.replace('m4_nugget_', '').replace('nugget_', '');
      if (unlockedSets.m4.has(`station-${num}`) || unlockedSets.m4.has(`nugget_${num}`) || unlockedSets.m4.has(num)) return true;
      return false;
    }
    return false;
  };

  const handleExportPDF = () => {
    const itemsToExport = FACHHANDBUCH_NUGGETS.filter(n => {
      if (showOnlyUnlocked) return isNuggetUnlocked(n);
      if (selectedModule !== 'all') return n.moduleIndex === selectedModule;
      return true;
    });

    const sourcesList = [
      { title: 'I Care Pflege – Kapitel Prä- und Postoperative Pflege (Thieme Verlag)', desc: 'Lehr- und Praxisgrundlagen der generalistischen Pflegeassistenzausbildung', url: 'https://archive.org/download/icare-pflege-pra-op-kapitel-reduced/ICare%20Pflege%20pr%C3%A4%20OP%20Kapitel%20-%20Reduced.pdf' },
      { title: 'gesund.bund.de – Gallensteine & Cholezystitis (Bundesministerium für Gesundheit)', desc: 'Evidenzbasierte Patienten- & Leitlinieninformationen zu Symptomen, Risikofaktoren und Cholezystektomie', url: 'https://gesund.bund.de/gallensteine' },
      { title: 'Dr. med. Tobias Weigl – Gallensteine: Ursachen, Steinarten & Charcot-Trias', desc: 'Fachärztliche Video-Lehrinhalte zur Pathophysiologie des Gallenstaus und Schmerzkoliken', url: 'https://youtu.be/DD8ZivE-VAc' },
      { title: 'Laparoskopische Cholezystektomie – Chirurgischer OP-Ablauf', desc: 'OP-Schritte, Trokarplatzierung, Klippen des Ductus cysticus und Bergung des Konkrements', url: 'https://youtu.be/rN1r5Q-E5QY' },
      { title: 'Händehygiene & OP-Schleusentransfer (Klinikum Dortmund)', desc: 'Lehrvideo zur standardisierten Patienteneinschleusung und chirurgischen Händedesinfektion', url: 'https://youtu.be/66rpkChOeew' },
      { title: 'Ablauf im Operationssaal – Perioperative Arbeitsabläufe', desc: 'Schnitt-Naht-Zeit, Team Time Out, Narkoseüberwachung und Vorbereitung', url: 'https://youtu.be/faeI5ywNf3M' },
      { title: 'Einführung in die perioperative Phase', desc: 'Didaktische Einführung in die prä-, intra- und postoperative Pflegeverantwortung', url: 'https://youtu.be/DADwjbcMfXg' },
      { title: 'I Care Lehrabbildung – Postoperative Beobachtungskategorien & Vitalzeichen', desc: 'Strukturierte Überwachung im Aufwachraum: Bewusstsein, Atmung, Herz-Kreislauf, Wunde und Schmerz', url: 'https://github.com/jansonjanson/GPFA-OP-Trainingstool/blob/main/ICare%20Abb%20Beobachtungskategorien.JPG?raw=true' },
      { title: 'KRINKO-Empfehlungen zur Prävention postoperativer Wundinfektionen (RKI)', desc: 'Präoperative Hautantiseptik, Verzicht auf Nassrasur zugunsten elektrischer Clipper', url: 'https://www.rki.de' },
      { title: 'DGAI-Leitlinie – Präoperative Nüchternheit bei elektiven Eingriffen', desc: '6h feste Nahrung, 2h klare Flüssigkeiten (Aspirations- und Dehydratationsprophylaxe)', url: 'https://www.dgai.de' },
      { title: 'APAIS – Amsterdam Preoperative Anxiety and Information Scale', desc: 'Standardisiertes klinisches Pflege-Assessment zur Erfassung präoperativer Ängste', url: 'https://www.thieme-connect.de' },
      { title: 'ISBAR-Übergabestandard (WHO / Patientensicherheit)', desc: 'Strukturierte Übergabe im Aufwachraum: Identification, Situation, Background, Assessment, Recommendation', url: 'https://www.who.int' }
    ];

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Bitte erlauben Sie Pop-ups in Ihrem Browser, um den PDF-Export zu starten.');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="de">
      <head>
        <meta charset="UTF-8">
        <title>GPFA Fachhandbuch & Quellenverzeichnis – Export</title>
        <style>
          @page {
            size: A4 portrait;
            margin: 14mm 16mm 16mm 16mm;
          }
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            color: #1e293b;
            background: #ffffff;
            margin: 0;
            padding: 0;
            font-size: 11pt;
            line-height: 1.5;
          }
          .header-banner {
            border-bottom: 3px solid #2563eb;
            padding-bottom: 12px;
            margin-bottom: 20px;
          }
          .app-title {
            font-size: 18pt;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 4px 0;
          }
          .subtitle {
            font-size: 11pt;
            color: #475569;
            margin: 0;
          }
          .meta-box {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 10px 14px;
            margin-bottom: 20px;
            font-size: 9.5pt;
            display: flex;
            justify-content: space-between;
          }
          .nugget-card {
            border: 1px solid #cbd5e1;
            border-radius: 8px;
            padding: 14px 16px;
            margin-bottom: 16px;
            page-break-inside: avoid;
            background: #ffffff;
          }
          .nugget-meta {
            font-size: 8.5pt;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #2563eb;
            margin-bottom: 4px;
          }
          .nugget-title {
            font-size: 13pt;
            font-weight: 800;
            color: #0f172a;
            margin: 0 0 8px 0;
          }
          .summary-box {
            background: #eff6ff;
            border-left: 3px solid #3b82f6;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 10pt;
            color: #1e3a8a;
            margin-bottom: 10px;
          }
          .core-list {
            margin: 8px 0;
            padding-left: 20px;
            font-size: 9.5pt;
          }
          .core-list li {
            margin-bottom: 4px;
          }
          .tip-box {
            background: #ecfdf5;
            border-left: 3px solid #10b981;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 9.5pt;
            color: #065f46;
            margin-top: 10px;
          }
          .ref-line {
            margin-top: 8px;
            font-size: 8.5pt;
            color: #64748b;
            font-style: italic;
          }
          .sources-section {
            margin-top: 30px;
            page-break-before: always;
            border-top: 2px solid #0f172a;
            padding-top: 16px;
          }
          .sources-title {
            font-size: 16pt;
            font-weight: 800;
            color: #0f172a;
            margin-bottom: 12px;
          }
          .source-item {
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px dashed #e2e8f0;
            font-size: 9.5pt;
          }
          .source-link {
            color: #2563eb;
            font-family: monospace;
            font-size: 8.5pt;
            word-break: break-all;
          }
          .print-btn-bar {
            background: #0f172a;
            color: white;
            padding: 12px 18px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 100;
            border-radius: 6px;
            margin-bottom: 20px;
          }
          .print-btn {
            background: #2563eb;
            color: white;
            border: none;
            padding: 8px 16px;
            font-weight: bold;
            border-radius: 6px;
            cursor: pointer;
            font-size: 11pt;
          }
          @media print {
            .print-btn-bar {
              display: none !important;
            }
          }
        </style>
      </head>
      <body>
        <div class="print-btn-bar">
          <span>GPFA Fachhandbuch – Druck- und PDF-Export</span>
          <button class="print-btn" onclick="window.print()">Jetzt als PDF speichern / Drucken</button>
        </div>

        <div class="header-banner">
          <h1 class="app-title">Generalistische Pflegefachassistenz (GPFA)</h1>
          <p class="subtitle">Klinisches Fachhandbuch, Wissensspeicher & Primärquellen (DS 1–8)</p>
        </div>

        <div class="meta-box">
          <div>
            <strong>Curriculum:</strong> Perioperative Pflege bei Cholezystektomie<br />
            <strong>Fallbeispiel:</strong> Frau Carola Meinhardt (42 J.)
          </div>
          <div style="text-align: right;">
            <strong>Exportierte Einträge:</strong> ${itemsToExport.length} Learning Nuggets<br />
            <strong>Datum:</strong> ${new Date().toLocaleDateString('de-DE')}
          </div>
        </div>

        <div>
          ${itemsToExport.map(nugget => `
            <div class="nugget-card">
              <div class="nugget-meta">
                Modul ${nugget.moduleIndex} • ${nugget.stationOrDs} • ${nugget.category}
              </div>
              <h2 class="nugget-title">${nugget.title}</h2>
              <div class="summary-box">
                <strong>Kernzusammenfassung:</strong> ${nugget.summary}
              </div>
              <div>
                <strong>Fachwissen & Kernpunkte:</strong>
                <ul class="core-list">
                  ${nugget.corePoints.map(pt => `<li>${pt}</li>`).join('')}
                </ul>
              </div>
              <div class="tip-box">
                <strong>Klinischer Praxistipp für die Pflege:</strong> ${nugget.clinicalTip}
              </div>
              <div class="ref-line">
                Quellennachweis: ${nugget.reference}
              </div>
            </div>
          `).join('')}
        </div>

        <div class="sources-section">
          <h2 class="sources-title">Vollständiges Quellenverzeichnis & Digitale Primärquellen</h2>
          <p style="font-size: 9.5pt; color: #475569; margin-bottom: 16px;">
            Alle im Ausbildungscurriculum verwendeten Fachinformationen basieren ausschließlich auf verifizierten pflegewissenschaftlichen Standardwerken, offiziellen Leitlinien und fachärztlichen Lehrinhalten.
          </p>
          <div>
            ${sourcesList.map(src => `
              <div class="source-item">
                <div style="font-weight: bold; color: #0f172a;">${src.title}</div>
                <div style="color: #475569;">${src.desc}</div>
                <a href="${src.url}" target="_blank" class="source-link">${src.url}</a>
              </div>
            `).join('')}
          </div>
        </div>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Auto-trigger print dialog after layout render
    printWindow.onload = () => {
      try {
        printWindow.focus();
        printWindow.print();
      } catch {
        // ignore
      }
    };
  };

  const filteredNuggets = useMemo(() => {
    return FACHHANDBUCH_NUGGETS.filter(nugget => {
      // Module Filter
      if (selectedModule !== 'all' && nugget.moduleIndex !== selectedModule) {
        return false;
      }
      // Unlocked Filter
      if (showOnlyUnlocked && !isNuggetUnlocked(nugget)) {
        return false;
      }
      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = nugget.title.toLowerCase().includes(q);
        const matchesCategory = nugget.category.toLowerCase().includes(q);
        const matchesSummary = nugget.summary.toLowerCase().includes(q);
        const matchesCore = nugget.corePoints.some(p => p.toLowerCase().includes(q));
        const matchesTip = nugget.clinicalTip.toLowerCase().includes(q);
        if (!matchesTitle && !matchesCategory && !matchesSummary && !matchesCore && !matchesTip) {
          return false;
        }
      }
      return true;
    });
  }, [selectedModule, searchQuery, showOnlyUnlocked, unlockedSets, isAdmin]);

  const totalUnlockedCount = useMemo(() => {
    return FACHHANDBUCH_NUGGETS.filter(n => isNuggetUnlocked(n)).length;
  }, [unlockedSets, isAdmin]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-indigo-900/50 flex-shrink-0">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/90 text-white flex items-center justify-center shadow-lg border border-indigo-400/30 flex-shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-300 bg-indigo-500/20 px-2 py-0.5 rounded-md border border-indigo-400/20">
                  Zentrales Fachhandbuch
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">•</span>
                <span className="text-xs text-slate-300 hidden sm:inline">
                  Wissensarchiv aller Module (DS 1–8)
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-0.5">
                Klinischer Wissensspeicher & Learning Nuggets
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md border border-indigo-400/40 transition-all cursor-pointer hover:scale-102"
              title="Fachhandbuch und alle Quellenlinks drucken oder als PDF speichern"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Als PDF drucken / exportieren</span>
              <span className="sm:hidden">PDF Export</span>
            </button>

            <div className="hidden md:flex flex-col items-end text-xs">
              <span className="text-slate-400 text-[10px] uppercase font-bold">Wissenssicherung</span>
              <span className="font-bold text-emerald-400">
                {totalUnlockedCount} von {FACHHANDBUCH_NUGGETS.length} freigeschaltet
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-2xl transition-colors cursor-pointer"
              title="Fachhandbuch schließen"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Toolbar: Search & Module Filter Tabs */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200/80 space-y-3 flex-shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Thema, Stichwort oder Symptom suchen (z. B. 6-F, Nüchternheit, ISBAR, Schmerz)..."
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Toggle only unlocked */}
            <label className="flex items-center space-x-2 text-xs font-semibold text-slate-700 cursor-pointer self-start sm:self-auto select-none">
              <input
                type="checkbox"
                checked={showOnlyUnlocked}
                onChange={(e) => setShowOnlyUnlocked(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-slate-300"
              />
              <span>Nur freigeschaltete Karten anzeigen</span>
            </label>
          </div>

          {/* Module Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <button
              onClick={() => setSelectedModule('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedModule === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              Alle Module ({FACHHANDBUCH_NUGGETS.length})
            </button>

            <button
              onClick={() => setSelectedModule(1)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                selectedModule === 1
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-900 border border-indigo-200'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Modul 1: Diagnose (9)</span>
            </button>

            <button
              onClick={() => setSelectedModule(2)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                selectedModule === 2
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Modul 2: Angst vor OP (6)</span>
            </button>

            <button
              onClick={() => setSelectedModule(3)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                selectedModule === 3
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-teal-50 hover:bg-teal-100 text-teal-900 border border-teal-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Modul 3: Prä-OP (7)</span>
            </button>

            <button
              onClick={() => setSelectedModule(4)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                selectedModule === 4
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Modul 4: Post-OP & AWR (19)</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {filteredNuggets.length === 0 ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-700 text-base">Keine Fachkarten gefunden</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Für diesen Filter oder Suchbegriff liegen keine Learning Nuggets vor. Versuchen Sie einen anderen Suchbegriff oder heben Sie die Filter auf.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredNuggets.map(nugget => {
                const isUnlocked = isNuggetUnlocked(nugget);
                const isExpanded = expandedNuggetIds.has(nugget.id);

                let badgeColor = "bg-indigo-50 text-indigo-700 border-indigo-200";
                if (nugget.moduleIndex === 2) badgeColor = "bg-blue-50 text-blue-700 border-blue-200";
                if (nugget.moduleIndex === 3) badgeColor = "bg-teal-50 text-teal-700 border-teal-200";
                if (nugget.moduleIndex === 4) badgeColor = "bg-emerald-50 text-emerald-700 border-emerald-200";

                return (
                  <div
                    key={nugget.id}
                    className={`rounded-2xl border-2 transition-all p-5 flex flex-col justify-between ${
                      isUnlocked
                        ? 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-md'
                        : 'bg-slate-50/80 border-slate-200 opacity-70'
                    }`}
                  >
                    <div>
                      {/* Top Badges */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${badgeColor}`}>
                            {nugget.moduleShort}
                          </span>
                          <span className="text-[10px] text-slate-500 font-medium">
                            {nugget.stationOrDs}
                          </span>
                        </div>

                        {isUnlocked ? (
                          <span className="text-[11px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Gesichert</span>
                          </span>
                        ) : (
                          <span className="text-[11px] text-slate-500 bg-slate-200 font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
                            <Lock className="w-3 h-3" />
                            <span>Im Modul freischalten</span>
                          </span>
                        )}
                      </div>

                      {/* Title & Category */}
                      <div className="mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                          {nugget.category}
                        </span>
                        <h4 className="font-extrabold text-sm sm:text-base text-slate-900 leading-snug">
                          {nugget.title}
                        </h4>
                      </div>

                      {/* Summary */}
                      <p className="text-xs text-slate-600 leading-relaxed mb-3">
                        {nugget.summary}
                      </p>

                      {/* Expanded Core Points & Tips */}
                      {isExpanded && (
                        <div className="space-y-3 pt-3 border-t border-slate-100 animate-in fade-in duration-200">
                          <div>
                            <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider block mb-1.5">
                              Kernaspekte & Fachstandards:
                            </span>
                            <ul className="space-y-1.5 text-xs text-slate-700">
                              {nugget.corePoints.map((point, pIdx) => (
                                <li key={pIdx} className="flex items-start space-x-2">
                                  <span className="text-indigo-600 font-bold">•</span>
                                  <span className="leading-relaxed">{point}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {nugget.clinicalTip && (
                            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 flex items-start space-x-2">
                              <Lightbulb className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                              <div className="leading-relaxed">
                                <strong className="block font-bold">Klinischer PFA-Praxistipp:</strong>
                                <span>{nugget.clinicalTip}</span>
                              </div>
                            </div>
                          )}

                          <div className="text-[11px] text-slate-400 pt-1 flex items-center justify-between">
                            <span>Quelle: <strong>{nugget.reference}</strong></span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Bottom Action: Expand / Collapse */}
                    <div className="pt-3 mt-2 border-t border-slate-100 flex items-center justify-between">
                      <button
                        onClick={() => toggleNuggetExpanded(nugget.id)}
                        className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center space-x-1 cursor-pointer"
                      >
                        <span>{isExpanded ? 'Details einklappen' : 'Kernaspekte & Praxistipp anzeigen'}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      {!isUnlocked && (
                        <span className="text-[10px] text-slate-400 italic">
                          Schalten Sie die Station im Modul frei
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 flex-shrink-0">
          <div className="flex items-center space-x-2">
            <Bookmark className="w-4 h-4 text-indigo-600" />
            <span>
              Alle 41 Fachkarten dienen als nachhaltige Wissenssicherung für das gesamte PFA-Curriculum.
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all shadow-xs cursor-pointer"
          >
            Schließen
          </button>
        </div>
      </div>
    </div>
  );
};
