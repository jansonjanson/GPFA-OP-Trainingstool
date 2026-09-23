const fs = require('fs');

let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

// Add import
appTsx = appTsx.replace(
  "import SimulatorSection from './components/SimulatorSection';",
  "import SimulatorSection from './components/SimulatorSection';\nimport CheckInSection from './components/CheckInSection';"
);

// Add to switch
appTsx = appTsx.replace(
  "{activeSection === 'simulator' && <SimulatorSection onNavigate={navigateTo} onAchievement={handleAchievement} />}",
  `{activeSection === 'simulator' && <SimulatorSection onNavigate={navigateTo} onAchievement={handleAchievement} />}
            {activeSection === 'checkin' && <CheckInSection onNavigate={navigateTo} />}`
);

fs.writeFileSync('src/App.tsx', appTsx);
