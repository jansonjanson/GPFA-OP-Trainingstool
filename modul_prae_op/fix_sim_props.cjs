const fs = require('fs');
let simTsx = fs.readFileSync('src/components/SimulatorSection.tsx', 'utf8');

simTsx = simTsx.replace(
  'interface Props {\n  onNavigate: (section: Section) => void;\n}',
  'interface Props {\n  onNavigate: (section: Section) => void;\n  onAchievement?: (title: string, desc: string) => void;\n}'
);

fs.writeFileSync('src/components/SimulatorSection.tsx', simTsx);
