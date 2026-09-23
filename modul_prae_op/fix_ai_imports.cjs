const fs = require('fs');

let aiTsx = fs.readFileSync('src/components/FloatingAI.tsx', 'utf8');

// Remove the inline import
aiTsx = aiTsx.replace('import { useEffect } from "react";\ninterface Props', 'interface Props');

// Add it to the top
aiTsx = aiTsx.replace("import { useState } from 'react';", "import { useState, useEffect } from 'react';");

fs.writeFileSync('src/components/FloatingAI.tsx', aiTsx);
