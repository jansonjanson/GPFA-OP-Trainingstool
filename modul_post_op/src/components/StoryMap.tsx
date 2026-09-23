import React from 'react';
import { HistoryItem } from '../types';
import { scenes } from '../data/scenes';
import { motion } from 'framer-motion';

interface StoryMapProps {
  history: HistoryItem[];
}

export const StoryMap: React.FC<StoryMapProps> = ({ history }) => {
  const visitedSceneIds = history.map(h => h.sceneId).filter(Boolean);

  const flow = [
    { level: 0, nodes: ['prep'] },
    { level: 1, nodes: ['prep_call', 'prep_transport'] },
    { level: 2, nodes: ['awr_arrival'] },
    { level: 3, nodes: ['awr_vigilanz'] },
    { level: 4, nodes: ['awr_evaluate'] },
    { level: 5, nodes: ['elevator_crisis_severe', 'elevator_nausea'] },
    { level: 6, nodes: ['ward_arrival', 'end_aspiration', 'end_reanimation'] },
    { level: 7, nodes: ['ward_acute_care'] },
    { level: 8, nodes: ['ward_wound_check'] },
    { level: 9, nodes: ['ward_isbar_doctor'] },
    { level: 10, nodes: ['ward_diet', 'ward_mobi'] },
    { level: 11, nodes: ['shift_end'] }
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl overflow-x-auto">
      <div className="mb-8">
        <h3 className="font-bold text-2xl text-white mb-2 tracking-wide uppercase font-mono">Flowchart</h3>
        <p className="text-sm text-slate-400 font-mono">
          <span className="inline-block w-3 h-3 bg-cyan-400 mr-2 rounded-sm shadow-[0_0_8px_rgba(34,211,238,0.8)]"></span>
          Erlebter Pfad
          <span className="inline-block w-3 h-3 border border-slate-600 mr-2 ml-6 rounded-sm"></span>
          Verpasste Alternative
        </p>
      </div>
      
      <div className="flex flex-col items-center gap-12 py-8 min-w-[800px] relative">
        {flow.map((layer, layerIndex) => (
          <div key={layerIndex} className="flex gap-16 justify-center w-full relative">
            {layerIndex > 0 && (
               <div className="absolute top-[-3rem] left-0 right-0 h-12 flex justify-center -z-10">
                 <div className="w-0.5 bg-gradient-to-b from-cyan-900/40 to-cyan-500/20 h-full"></div>
               </div>
            )}
            {layer.nodes.map((id, i) => {
              const scene = scenes[id];
              if (!scene) return null;
              const isVisited = visitedSceneIds.includes(id);
              
              return (
                <div key={id} className="relative group flex flex-col items-center w-48">
                  {/* Connection lines to next layer could be drawn SVG here, 
                      for now using a simpler CSS vertical approach to simulate the DBH tree */}
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: layerIndex * 0.1 }}
                    className={`w-full p-4 rounded-sm border-2 backdrop-blur-sm transition-all duration-300
                      ${isVisited 
                        ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]' 
                        : 'bg-slate-900 border-slate-700 opacity-50'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`w-2 h-2 rounded-full ${isVisited ? 'bg-cyan-400 shadow-[0_0_5px_#22d3ee]' : 'bg-slate-600'}`}></div>
                      <div className={`text-[10px] font-mono tracking-widest uppercase ${isVisited ? 'text-cyan-400' : 'text-slate-500'}`}>
                        {scene.time}
                      </div>
                    </div>
                    <div className={`font-mono text-sm font-semibold leading-tight ${isVisited ? 'text-white' : 'text-slate-400'}`}>
                      {scene.title}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
