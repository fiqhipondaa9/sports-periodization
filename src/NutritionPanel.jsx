import React from 'react';
import { ClipboardList } from 'lucide-react';

const NutritionPanel = ({ nutritionNote, setNutritionNote }) => {
  return (
    <div className="border p-6 rounded-3xl bg-white shadow-sm border-slate-200 flex flex-col flex-1">
      <h2 className="font-black uppercase flex items-center gap-2 mb-3 text-orange-600 tracking-tighter">
        <ClipboardList className="w-4 h-4"/> Catatan Gizi & Medis
      </h2>
      <textarea 
        value={nutritionNote} 
        onChange={e => setNutritionNote(e.target.value)} 
        className="w-full bg-orange-50/30 border border-orange-100 p-4 rounded-2xl flex-1 outline-none font-bold text-slate-600 leading-relaxed text-[10px]" 
        placeholder="Input catatan gizi, suplemen, berat badan, atau catatan diet atlet di sini..." 
      />
    </div>
  );
};

export default NutritionPanel;