const fs = require('fs');

let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

appTsx = appTsx.replace(
  '<FloatingAI />',
  '<FloatingAI onOpenAI={() => handleAchievement("Praxisanleitung eilt zur Hilfe", "KI-Helfer aktiviert!")} />'
);

fs.writeFileSync('src/App.tsx', appTsx);
