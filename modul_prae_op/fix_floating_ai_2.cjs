const fs = require('fs');
let aiTsx = fs.readFileSync('src/components/FloatingAI.tsx', 'utf8');

// Add props to FloatingAI
aiTsx = aiTsx.replace(
  'export default function FloatingAI() {',
  'import { useEffect } from "react";\ninterface Props { onOpenAI?: () => void; }\nexport default function FloatingAI({ onOpenAI }: Props) {'
);

// Add state and useEffect for the tutorial tooltip
aiTsx = aiTsx.replace(
  'const [isOpen, setIsOpen] = useState(false);',
  `const [isOpen, setIsOpen] = useState(false);
  const [hasClicked, setHasClicked] = useState(false);
  
  useEffect(() => {
    // Show tutorial ping after a short delay
    const timer = setTimeout(() => {
      if (!hasClicked) {
        // play sound or show visually
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [hasClicked]);`
);

// Replace button onClick and className
aiTsx = aiTsx.replace(
  'onClick={() => setIsOpen(!isOpen)}',
  'onClick={() => { setIsOpen(!isOpen); if (!hasClicked) { setHasClicked(true); if (onOpenAI) onOpenAI(); } }}'
);
aiTsx = aiTsx.replace(
  'className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:shadow-xl hover:scale-105 active:scale-95"',
  'className={`bg-gradient-to-r from-violet-600 to-indigo-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:shadow-xl hover:scale-105 active:scale-95 ${!hasClicked ? "animate-pulse ring-4 ring-indigo-300 ring-opacity-50" : ""}`}'
);

// Add the tooltip itself right before the button icon
aiTsx = aiTsx.replace(
  '{isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}',
  `{isOpen ? <X className="w-6 h-6" /> : <Sparkles className="w-6 h-6" />}
        {!hasClicked && (
          <div className="absolute -top-16 left-0 bg-white text-indigo-900 text-sm font-bold px-4 py-2 rounded-xl shadow-lg whitespace-nowrap border border-indigo-100 animate-bounce">
            Hallo! Ich bin dein KI-Helfer. 👋<br/>Klick mich für Tipps an!
            <div className="absolute -bottom-2 left-6 w-4 h-4 bg-white transform rotate-45 border-b border-r border-indigo-100"></div>
          </div>
        )}`
);

fs.writeFileSync('src/components/FloatingAI.tsx', aiTsx);
