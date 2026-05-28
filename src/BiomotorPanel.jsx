import React, { useState } from 'react';
import { Dumbbell, AlertTriangle } from 'lucide-react';

// DATABASE TEKS KITA PINDAHKAN KESINI AGAR FILE INDUK TIDAK PENUH
const biomotorData = {
  Strength: [
    { id: 'Adaptasi Anatomi', param: '40-60% 1RM | 12-20 Reps', rest: 'Rest: 30-120 Detik', desc: 'Modifikasi ketebalan jaringan ikat & fungsi ligamen.' },
    { id: 'Hipertrofi', param: '60-80% 1RM | 6-12 Reps', rest: 'Rest: 1-2 Menit', desc: 'Pembesaran diameter otot kontraktil (sarkoplasma).' },
    { id: 'Kekuatan Maksimum', param: '70-100% 1RM | 1-6 Reps', rest: 'Rest: 3-5+ Menit', desc: 'Eksitasi impuls neuromuskuler & firing rate neuron.' },
    { id: 'Konversi (Power)', param: '30-80% 1RM | 8-15 Reps Balistik', rest: 'Rest: 3-4 Menit', desc: 'Optimalisasi laju percepatan gaya (RFD).' },
    { id: 'Konversi (Endurance)', param: '30-60% 1RM | 15-30+ Reps', rest: 'Rest: 0.5-2 Menit', desc: 'Ketahanan toleransi cairan asam laktat darah.' },
    { id: 'Pemeliharaan', param: '1-4x Sesi/Minggu', rest: 'Rest: Relatif', desc: 'Mencegah detraining selama musim kompetisi.' },
    { id: 'Cessation', param: 'Hentikan Beban 5-7 Hari', rest: 'Rest: Total', desc: 'Fasilitasi superkompensasi puncak.' }
  ],
  Endurance: [
    { id: 'Aerobic Endurance', param: '120-150 bpm', rest: 'Volume Tinggi', desc: 'Meningkatkan VO2Max & kapilarisasi.' },
    { id: 'Specific Endurance', param: 'Simulasi Pertandingan', rest: 'Sesuai Cabor', desc: 'Menyesuaikan ergogenesis cabang olahraga.' }
  ],
  Speed: [
    { id: 'Aerobic & Anaerobic', param: 'Fartlek / Interval', rest: 'Rest Moderat', desc: 'Fondasi daya tahan kecepatan.' },
    { id: 'Kecepatan Spesifik', param: 'Sprint Maksimal', rest: 'Rest: 5+ Menit (Wajib)', desc: 'Kecepatan gerak cabor tanpa residu laktat.' }
  ]
};

const BiomotorPanel = ({ athleteInfo, t }) => {
  // STATE JUGA KITA PINDAH KESINI KARENA HANYA DIGUNAKAN DI MODUL INI
  const [activeBiomotor, setActiveBiomotor] = useState('Strength');

  return (
    <div className="border p-6 rounded-3xl bg-slate-50/50 flex flex-col shadow-sm border-slate-200 h-80">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-black uppercase tracking-tighter flex items-center gap-2">
          <Dumbbell className="text-slate-600 w-4 h-4"/> Pemandu Biomotorik Spesifik
        </h2>
      </div>
      
      {athleteInfo.age.includes('U13') && activeBiomotor === 'Strength' && (
        <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-xl flex gap-2 items-start shadow-sm">
          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5"/>
          <p className="text-[9px] font-bold text-red-700 leading-tight">PERINGATAN LTAD BOMPA: Atlet U13 dilarang keras melakukan beban mekanik.</p>
        </div>
      )}

      <div className="flex bg-white p-1 rounded-xl mb-4 border">
        {['Strength', 'Endurance', 'Speed'].map(type => (
          <button 
            key={type} 
            onClick={() => setActiveBiomotor(type)} 
            className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${activeBiomotor === type ? t.bg + ' text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}
          >
            {type.toUpperCase()}
          </button>
        ))}
      </div>
      
      <div className="space-y-2 flex-1 overflow-y-auto pr-1 custom-scrollbar">
        {biomotorData[activeBiomotor].map(p => (
          <div key={p.id} className="p-3 rounded-2xl border-2 transition-all bg-white border-slate-100 hover:border-slate-200">
             <p className={`text-[10px] font-black uppercase mb-1 ${t.textDark}`}>{p.id}</p>
             <p className={`text-[9px] font-bold mb-0.5 ${t.text}`}>{p.param}</p>
             <p className="text-[8px] font-black text-orange-500 mb-1">{p.rest}</p>
             <p className="text-[8px] text-slate-500 italic">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BiomotorPanel;