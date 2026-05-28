import React from 'react';
import { Trophy } from 'lucide-react';

const EvaluationPanel = ({ evaluation, setEvaluation, t }) => {
  
  // LOGIKA HITUNG SKOR SPORTS SCIENCE KITA PINDAHKAN KE SINI
  const calculateScore = () => {
    if (!evaluation.score || !evaluation.target || evaluation.score <= 0) {
      return { percentage: 0, label: "-", color: "text-slate-400", barColor: "bg-slate-200" };
    }
    
    let p = evaluation.isTime 
      ? (evaluation.target / evaluation.score) * 100 
      : (evaluation.score / evaluation.target) * 100;
    
    if (!isFinite(p) || isNaN(p)) p = 0;
    
    const r = Math.min(Math.round(p), 100);
    if (r >= 90) return { percentage: r, label: "EXCELLENT", color: "text-green-600", barColor: "bg-green-500" };
    if (r >= 75) return { percentage: r, label: "GOOD", color: t.text, barColor: t.bg };
    return { percentage: r, label: "POOR", color: "text-red-600", barColor: "bg-red-500" };
  };

  const scoreResult = calculateScore();

  return (
    <div className="border p-6 rounded-3xl bg-white shadow-sm flex flex-col border-slate-200">
       <h2 className={`font-black uppercase flex items-center gap-2 mb-4 ${t.text}`}>
         <Trophy className="w-4 h-4"/> Evaluasi Kemampuan Fisik
       </h2>
       
       <input 
         value={evaluation.name} 
         onChange={e => setEvaluation({ ...evaluation, name: e.target.value })} 
         className={`w-full mb-3 p-2 border-b font-black outline-none uppercase bg-slate-50 ${t.textDark}`} 
         placeholder="Nama Tes Utama..." 
       />
       
       <div className="flex gap-3 mb-3">
         <div className="w-1/2">
           <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Skor Atlet</label>
           <input 
             type="number" 
             value={evaluation.score} 
             onChange={e => setEvaluation({ ...evaluation, score: Number(e.target.value) })} 
             className={`w-full p-2 border rounded-xl text-center font-black ${t.text}`} 
           />
         </div>
         <div className="w-1/2">
           <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Target Ideal</label>
           <input 
             type="number" 
             value={evaluation.target} 
             onChange={e => setEvaluation({ ...evaluation, target: Number(e.target.value) })} 
             className="w-full p-2 border rounded-xl text-center font-black text-slate-400" 
           />
         </div>
       </div>
       
       <label className="flex items-center gap-2 cursor-pointer mb-3 justify-center bg-slate-50 p-2 rounded-xl border">
         <input 
           type="checkbox" 
           checked={evaluation.isTime} 
           onChange={e => setEvaluation({ ...evaluation, isTime: e.target.checked })} 
           className="w-3 h-3 cursor-pointer" 
           style={{ accentColor: t.hex }} 
         />
         <span className="text-[9px] font-black text-slate-500 uppercase">Mode Waktu/Kecepatan (Makin Kecil Makin Baik)</span>
       </label>

       <div className={`p-3 rounded-xl text-center font-black text-white shadow-inner ${scoreResult.barColor}`}>
         {scoreResult.percentage}% - {scoreResult.label}
       </div>
    </div>
  );
};

export default EvaluationPanel;