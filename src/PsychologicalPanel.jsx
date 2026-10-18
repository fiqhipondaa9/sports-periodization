import React, { useState } from 'react';
import { Brain, Sparkles, TrendingUp, ShieldCheck, AlertCircle } from 'lucide-react';

const RECOMMENDATIONS = {
  Keberanian: 'Terapkan visualisasi positif dan simulasi tekanan pertandingan (pressure training).',
  Fokus: 'Latihan mindfulness 10 menit sebelum sesi latihan dan kurangi distraksi eksternal.',
  Motivasi: 'Perjelas kembali target tahunan (goal setting) dan beri penguatan apresiasi berkala.',
  Emosi: 'Latihan teknik pernapasan box breathing (4-4-4-4) untuk kendali emosi saat tertinggal poin.',
  Resiliensi: 'Berikan skenario tantangan tanding terbalik (skor tertinggal) untuk melatih daya juang.',
  Disiplin: 'Jaga kepatuhan jam istirahat, log harian, dan ketepatan waktu hadir di lapangan.'
};

const PsychologicalPanel = ({ mentalData, setMentalData, t }) => {
  const [activePhaseTab, setActivePhaseTab] = useState('Current');

  const items = Array.isArray(mentalData) ? mentalData : [];

  // Hitung Skor Kesiapan Mental Rata-rata (0 - 100%)
  const totalScore = items.reduce((acc, curr) => acc + (Number(curr.score) || 0), 0);
  const maxScore = items.length * 10;
  const readinessIndex = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

  // Temukan aspek mental terendah untuk rekomendasi
  const lowestTrait = items.length > 0 
    ? [...items].sort((a, b) => (Number(a.score) || 0) - (Number(b.score) || 0))[0]
    : null;

  const getStatusBadge = (idx) => {
    if (idx >= 85) return { label: 'MENTAL PRIMA / JUARA', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' };
    if (idx >= 70) return { label: 'SIAP TANDING (STABIL)', color: 'bg-blue-500/20 text-blue-400 border-blue-500/40' };
    return { label: 'BUTUH PENDAMPINGAN PSIKOLOG', color: 'bg-rose-500/20 text-rose-400 border-rose-500/40' };
  };

  const status = getStatusBadge(readinessIndex);

  return (
    <div className="border p-6 rounded-3xl bg-slate-900 text-white shadow-inner flex flex-col justify-between">
      <div>
        {/* HEADER */}
        <div className="flex flex-wrap justify-between items-center mb-4 border-b border-slate-800 pb-3 gap-2">
          <div>
            <h2 className="font-black uppercase flex items-center gap-2 tracking-tight text-sm">
              <Brain className={`w-5 h-5 ${t.text}`}/> Asesmen Profil Psikologi Atlet
            </h2>
            <p className="text-[9px] font-bold text-slate-400">
              Monitoring 6 Pilar Mental Bertarung & Ketahanan Psikologis
            </p>
          </div>

          <div className={`px-3 py-1 rounded-xl border text-[8px] font-black uppercase tracking-wider flex items-center gap-1.5 ${status.color}`}>
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Indeks Mental: {readinessIndex}% — {status.label}</span>
          </div>
        </div>

        {/* 6 PILAR PARAMETER MENTAL */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {items.map((item, idx) => {
            const scoreVal = Number(item.score) || 0;
            const isHigh = scoreVal >= 8;
            const isMedium = scoreVal >= 6 && scoreVal < 8;

            return (
              <div key={item.id} className="bg-slate-800/80 p-2.5 rounded-2xl border border-slate-700/80 flex flex-col justify-between">
                <input 
                  value={item.label} 
                  onChange={e => { 
                    const newData = items.map((m, i) => i === idx ? { ...m, label: e.target.value } : m); 
                    setMentalData(newData); 
                  }} 
                  className="bg-transparent text-[8.5px] font-black text-slate-300 uppercase outline-none focus:text-white border-b border-transparent focus:border-slate-500 w-full mb-1" 
                />
                
                <div className="flex items-center justify-between gap-2 mt-1">
                  <div className="flex-1 bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-300 ${
                        isHigh ? 'bg-emerald-500' : isMedium ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${scoreVal * 10}%` }}
                    />
                  </div>
                  <input 
                    type="number" 
                    min="1" 
                    max="10" 
                    value={item.score} 
                    onChange={e => { 
                      const val = Math.max(1, Math.min(10, Number(e.target.value)));
                      const newData = items.map((m, i) => i === idx ? { ...m, score: val } : m); 
                      setMentalData(newData); 
                    }} 
                    className="w-7 text-right font-black text-sm outline-none bg-transparent" 
                    style={{ color: isHigh ? '#34d399' : isMedium ? '#fbbf24' : '#f87171' }} 
                  />
                  <span className="text-[7.5px] text-slate-500 font-bold">/10</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* REKOMENDASI INTERVENSI PSIKOLOGI */}
      {lowestTrait && (
        <div className="p-3 bg-slate-800/50 rounded-2xl border border-slate-700 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="text-[8.5px] text-slate-300 leading-relaxed">
            <span className="font-black text-amber-300 uppercase mr-1">
              Catatan Pelatih ({lowestTrait.label} {lowestTrait.score}/10):
            </span>
            {RECOMMENDATIONS[lowestTrait.label] || 'Lakukan evaluasi berkala dan sesi konseling untuk meningkatkan aspek ini.'}
          </div>
        </div>
      )}
    </div>
  );
};

export default PsychologicalPanel;