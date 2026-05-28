import React from 'react';
import { Brain } from 'lucide-react';

const PsychologicalPanel = ({ mentalData, setMentalData, t }) => {
  return (
    <div className="border p-8 rounded-3xl bg-slate-900 text-white shadow-inner h-80 flex flex-col">
      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
        <h2 className="font-black uppercase flex items-center gap-2 tracking-tighter text-sm">
          <Brain className={`w-5 h-5 ${t.text}`}/> Asesmen Psikologi Bertarung
        </h2>
        <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest italic">by fiqhipondaa9 system</span>
      </div>
      
      <div className="grid grid-cols-3 gap-4 flex-1 content-start">
        {mentalData.map((item, idx) => (
          <div key={item.id} className="space-y-2 text-center group flex flex-col items-center">
            <input 
              value={item.label} 
              onChange={e => { 
                const newData = mentalData.map((m, i) => i === idx ? { ...m, label: e.target.value } : m); 
                setMentalData(newData); 
              }} 
              className="bg-transparent text-[9px] font-black text-slate-400 uppercase outline-none text-center focus:text-white transition-colors w-full" 
            />
            <div 
              className="bg-slate-800 p-3 rounded-2xl border border-slate-700 shadow-md transition-all w-24" 
              style={{ '--tw-border-opacity': 1, borderColor: item.score >= 8 ? t.hex : '#334155' }}
            >
              <input 
                type="number" 
                min="1" 
                max="9" 
                value={item.score} 
                onChange={e => { 
                  const newData = mentalData.map((m, i) => i === idx ? { ...m, score: Number(e.target.value) } : m); 
                  setMentalData(newData); 
                }} 
                className="bg-transparent w-full text-center font-black text-2xl outline-none" 
                style={{ color: t.hex }} 
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PsychologicalPanel;