import { jsPDF } from 'jspdf';
import { CategoryScores } from '../types';

interface CertificateData {
  studentName: string;
  score: number;
  categories: CategoryScores;
  dateStr?: string;
}

export function generateCertificatePdf({
  studentName,
  score,
  categories,
  dateStr
}: CertificateData) {
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 297;
  const pageHeight = 210;

  // Background tint
  doc.setFillColor(252, 253, 255);
  doc.rect(0, 0, pageWidth, pageHeight, 'F');

  // Decorative Outer Border (Navy / Indigo)
  doc.setDrawColor(26, 44, 76); // Deep Navy
  doc.setLineWidth(3);
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

  // Decorative Inner Border (Gold)
  doc.setDrawColor(217, 155, 38); // Warm Gold
  doc.setLineWidth(0.8);
  doc.rect(14, 14, pageWidth - 28, pageHeight - 28);

  // Corner Accents (Gold)
  const drawCorner = (x: number, y: number, size: number) => {
    doc.setFillColor(217, 155, 38);
    doc.circle(x, y, 1.8, 'F');
  };
  drawCorner(14, 14, 3);
  drawCorner(pageWidth - 14, 14, 3);
  drawCorner(14, pageHeight - 14, 3);
  drawCorner(pageWidth - 14, pageHeight - 14, 3);

  // Header - Organization / Curriculum
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text('GENERALISTISCHE PFLEGEAUSBILDUNG • LERNEINHEIT 3.4', pageWidth / 2, 26, { align: 'center' });

  // Main Certificate Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24);
  doc.setTextColor(26, 44, 76);
  doc.text('TEILNAHMEBESCHEINIGUNG & ZERTIFIKAT', pageWidth / 2, 36, { align: 'center' });

  // Subtitle
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(194, 120, 20);
  doc.text('Curriculum Perioperative Pflege: Von der Diagnose bis zur Entlassung (DS 1–8)', pageWidth / 2, 43, { align: 'center' });

  // Divider
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.5);
  doc.line(40, 48, pageWidth - 40, 48);

  // Certification text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  doc.setTextColor(71, 85, 105);
  doc.text('Hiermit wird bescheinigt, dass', pageWidth / 2, 57, { align: 'center' });

  // Student Name
  const displayName = studentName.trim() || 'Auszubildende / Auszubildender der Pflege';
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42);
  doc.text(displayName, pageWidth / 2, 69, { align: 'center' });

  // Underline for name
  doc.setDrawColor(217, 155, 38);
  doc.setLineWidth(1);
  const textWidth = doc.getTextWidth(displayName);
  const startX = (pageWidth - textWidth) / 2 - 6;
  doc.line(startX, 72, startX + textWidth + 12, 72);

  // Success summary text
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(51, 65, 85);
  doc.text(
    'das Gesamttraining zur perioperativen Patientenversorgung erfolgreich absolviert und in den interaktiven Modulen\nsowie der abschließenden klinischen Pflegesimulation umfassende Fach- und Handlungskompetenz nachgewiesen hat.',
    pageWidth / 2,
    79,
    { align: 'center', lineHeightFactor: 1.4 }
  );

  // Modules Grid Box
  const boxTop = 92;
  const boxHeight = 44;
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.4);
  doc.roundedRect(22, boxTop, pageWidth - 44, boxHeight, 3, 3, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(26, 44, 76);
  doc.text('NACHGEWIESENE KOMPETENZFELDER & MODULE:', 28, boxTop + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(71, 85, 105);

  // Column 1
  doc.text('• Modul 1 (DS 1 & 2): Klinische Diagnose & Appendizitis (Symptome, McBurney/Lanz, Labor/US)', 28, boxTop + 16);
  doc.text('• Modul 2 (DS 3 & 4): Angstbewältigung & Deeskalation (Vegetative Kaskade, 4-A, 5-4-3-2-1, Atemtechnik)', 28, boxTop + 24);

  // Column 2
  doc.text('• Modul 3 (DS 5 & 6): Prä-OP Vorbereitung (Nüchternheitsregeln, Arztvorbehalt, Clipper, Schleuse)', 28, boxTop + 32);
  doc.text('• Modul 4 (DS 7 & 8): Post-OP & Notfallmanagement (AWR, Metamizol-Sicherheit, Frühmobilisation, ISBAR)', 28, boxTop + 40);

  // Performance Box
  const scoreTop = 142;
  doc.setFillColor(239, 246, 255); // Soft blue
  doc.setDrawColor(191, 219, 254);
  doc.roundedRect(22, scoreTop, pageWidth - 44, 22, 2.5, 2.5, 'FD');

  const grade = score >= 80 ? 'Mit hervorragender Auszeichnung bestanden' : score >= 50 ? 'Erfolgreich bestanden' : 'Teilgenommen & bestanden';
  const gradeColor = score >= 80 ? [16, 120, 75] : [26, 44, 76];

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(gradeColor[0], gradeColor[1], gradeColor[2]);
  doc.text(`Prüfungsergebnis: ${score} / 100 Punkte (${grade})`, 28, scoreTop + 7.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `Fachwissen: ${categories.fachwissen || 0} Pkt.  |  Vorausschauendes Handeln: ${categories.voraussicht || 0} Pkt.  |  Patientenzentrierung: ${categories.patientenzentrierung || 0} Pkt.  |  Zeitmanagement: ${categories.zeitmanagement || 0} Pkt.`,
    28,
    scoreTop + 15
  );

  // Footer / Signatures
  const footerY = 182;
  const today = dateStr || new Date().toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' });

  // Date
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text(`Datum: ${today}`, 30, footerY);
  doc.line(30, footerY + 2, 75, footerY + 2);

  // Instructor
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(26, 44, 76);
  doc.text('J. Rosenow M. A.', pageWidth - 85, footerY);
  doc.line(pageWidth - 85, footerY + 2, pageWidth - 30, footerY + 2);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('Lehrgangsleitung / Pflegepädagogik', pageWidth - 85, footerY + 6);

  // Bottom Security / Authenticity note
  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('Zertifikat digital generiert über das GPFA OP-Trainingstool • Verifizierbares E-Learning-Curriculum', pageWidth / 2, pageHeight - 16, { align: 'center' });

  // Save the document
  const safeFilename = `Teilnahmebescheinigung_${(displayName || 'Auszubildende').replace(/[^a-zA-Z0-9äöüÄÖÜß_-]/g, '_')}.pdf`;
  doc.save(safeFilename);
}
