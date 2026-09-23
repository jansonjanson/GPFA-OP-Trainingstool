const fs = require('fs');
let appTsx = fs.readFileSync('src/App.tsx', 'utf8');

appTsx = appTsx.replace(
  'const handleNuggetComplete = (index: number) => {',
  `const handleAchievement = useCallback((title: string, desc: string) => {
    setShowAchievement(prev => {
      if (prev && prev.title === title) return prev;
      return {title, desc};
    });
  }, []);

  const handleNuggetComplete = (index: number) => {`
);

appTsx = appTsx.replace(
  "import React, { useState, useEffect } from 'react';",
  "import React, { useState, useEffect, useCallback } from 'react';"
);

appTsx = appTsx.replace(
  /onAchievement=\{\(title, desc\) => setShowAchievement\(\{title, desc\}\)\}/g,
  'onAchievement={handleAchievement}'
);

fs.writeFileSync('src/App.tsx', appTsx);
