const fs = require('fs');

let simTsx = fs.readFileSync('src/components/SimulatorSection.tsx', 'utf8');

simTsx = simTsx.replace(
  /<li>Die verlinkte <strong>Hauscheckliste ansehen<\/strong> \(siehe Arbeitsauftrag\)<\/li>/m,
  '<li>Die verlinkte <strong>Hauscheckliste ansehen</strong> (siehe <button onClick={() => onNavigate(\'auftrag\')} className="text-blue-600 hover:underline">Arbeitsauftrag</button>)</li>'
);

// We should also implement the welcome screen icon in App.tsx
// Let's modify App.tsx one more time to include WelcomeModal explicitly.

fs.writeFileSync('src/components/SimulatorSection.tsx', simTsx);
console.log("Simulator updated.");
