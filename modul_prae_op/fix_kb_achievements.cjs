const fs = require('fs');

let kbTsx = fs.readFileSync('src/components/KnowledgeBaseSection.tsx', 'utf8');

// The nuggets are wrapped in <LearningNugget ... onComplete={() => onNuggetComplete(0)} />
// I can change that to trigger an achievement as well.

const achievementTitles = [
  "Definition gemeistert!",
  "Risikofaktor-Spezialist",
  "Post-OP Profi",
  "Nüchternheits-Ninja",
  "Körperpflege-Experte",
  "Transport-Meister",
  "Medikamenten-Kenner",
  "Abführ-Ass",
  "Prämedikations-Profi"
];

let i = 0;
kbTsx = kbTsx.replace(/onComplete=\{\(\) => onNuggetComplete\((\d+)\)\}/g, (match, p1) => {
  const title = achievementTitles[i] || ("Nugget " + (parseInt(p1)+1) + " gemeistert!");
  i++;
  return `onComplete={() => { onNuggetComplete(${p1}); if(onAchievement) onAchievement("${title}", "Wissens-Nugget erfolgreich abgeschlossen!"); }}`;
});

fs.writeFileSync('src/components/KnowledgeBaseSection.tsx', kbTsx);
