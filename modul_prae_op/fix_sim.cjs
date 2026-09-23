const fs = require('fs');
let content = fs.readFileSync('src/components/SimulatorSection.tsx', 'utf8');

content = content.replace(
  "if (isGameOver && score >= 90) {",
  `if (isGameOver && score >= 90) {
      if (onAchievement) onAchievement({title: "Master of Disaster", desc: "Simulation fehlerfrei bestanden!"});`
);

fs.writeFileSync('src/components/SimulatorSection.tsx', content);
