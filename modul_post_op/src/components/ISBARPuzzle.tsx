import React, { useState, useEffect } from 'react';
import { CheckCircle2, GripVertical } from 'lucide-react';
import { motion, Reorder } from 'motion/react';

interface ISBARItem {
  id: string;
  text: string;
  correctIndex: number;
}

export const ISBARPuzzle: React.FC<{ items: ISBARItem[], onComplete: () => void }> = ({ items: initialItems, onComplete }) => {
  const [items, setItems] = useState<ISBARItem[]>(() => {
    return [...initialItems].sort(() => Math.random() - 0.5);
  });

  // Re-shuffle if initialItems completely changes, and ensure it's NEVER in the correct order initially
  useEffect(() => {
    let shuffled = [...initialItems].sort(() => Math.random() - 0.5);
    while (shuffled.every((item, idx) => item.correctIndex === idx) && shuffled.length > 1) {
       shuffled = [...initialItems].sort(() => Math.random() - 0.5);
    }
    setItems(shuffled);
  }, [initialItems]);

  const isCorrect = items.every((item, idx) => item.correctIndex === idx);

  return (
    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
      <div className="mb-4 text-sm text-slate-600 bg-white p-3 rounded-lg border border-slate-200">
        Ziehen Sie die Bausteine an die richtige Position, um die ISBAR-Übergabe zu strukturieren.
      </div>
      
      <Reorder.Group axis="y" values={items} onReorder={setItems} className="space-y-3">
        {items.map((item, idx) => {
          const isCorrectPos = item.correctIndex === idx;
          return (
            <Reorder.Item 
              key={item.id} 
              value={item}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-grab active:cursor-grabbing transition-colors ${isCorrectPos && isCorrect ? 'border-teal-500 bg-teal-50/50' : 'border-slate-200 bg-white shadow-sm'}`}
            >
              <div className="shrink-0 text-slate-400">
                <GripVertical className="w-5 h-5" />
              </div>
              
              <div className="flex-grow select-none">
                <div className="text-sm font-medium text-slate-700">{item.text}</div>
              </div>

              {isCorrect && isCorrectPos && (
                <div className="shrink-0 text-teal-500 pr-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              )}
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      <div className="mt-6">
        <button
          onClick={onComplete}
          disabled={!isCorrect}
          className="w-full bg-teal-600 text-white font-bold py-4 rounded-xl hover:bg-teal-700 transition shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50 disabled:bg-slate-300 disabled:cursor-not-allowed"
        >
          {isCorrect ? "Perfekte Übergabe! Schicht beenden" : "Ordnen Sie die Bausteine korrekt..."}
        </button>
      </div>
    </div>
  );
};
