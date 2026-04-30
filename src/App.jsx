import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine, ReferenceDot } from 'recharts';
import { Layout, Calendar, Trophy, Zap, Brain, Apple, Dumbbell, Activity, Target } from 'lucide-react';

const App = () => {
  const BRANDING = "PERIODISASI OLAHRAGA by fiqhipondaa9";

  // State Management
  const [startMonth, setStartMonth] = useState(0);
  const [endMonth, setEndMonth] = useState(11);
  const [peakingIndex, setPeakingIndex] = useState(5);
  const [currentStrengthPhase, setCurrentStrengthPhase] = useState('Adaptasi Anatomi');
  
  // STATE BARU: Auto-Tapering & Kompetisi Utama
  const [competitionMonth, setCompetitionMonth] = useState('Okt');

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const activeMonths = useMemo(() => months.slice(startMonth, endMonth + 1), [startMonth, endMonth]);

  // ALGORITMA AUTO-TAPERING
  const chartData = useMemo(() => {
    return activeMonths.map((m, i) => {
      // 1. Kalkulasi Beban Dasar (Normal)
      let baseVolume = peakingIndex * 18 - (i * 2);
      let baseIntensity = (6 - peakingIndex) * 18 + (i * 2);

      // 2. Trigger Auto-Tapering jika bulan ini adalah Bulan Kompetisi
      if (m === competitionMonth) {
        // Pemotongan Volume 50% (berada di rentang 40-60% sesuai panduan)
        baseVolume = baseVolume * 0.5; 
        // Intensitas memuncak
        baseIntensity = Math.min(baseIntensity * 1.2, 100); 
      }

      return { 
        name: m, 
        Intensitas: baseIntensity, 
        Volume: baseVolume,
        isComp: m === competitionMonth
      };
    });
  }, [activeMonths, peakingIndex, competitionMonth]);

  // (Fungsi getScoreLabel, getNutrition, calculateScore tetap sama seperti sebelumnya...)

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-900">
      
      {/* Header & Timeline Picker */}
      <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100 gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-blue-900 uppercase">{BRANDING}</h1>
          <p className="text-slate-500 font-medium">Digital Periodization & Auto-Tapering Algorithm</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <div className="bg-blue-50 px-4 py-2 rounded-xl flex items-center gap-3 border border-blue-100">
            <Calendar className="text-blue-600 w-5 h-5" />
            <span className="font-bold text-blue-900">{activeMonths[0]} - {activeMonths[activeMonths.length - 1]}</span>
          </div>
          {/* KONTROL BARU: Pemilihan Bulan Kompetisi */}
          <div className="bg-red-50 px-4 py-2 rounded-xl flex items-center gap-3 border border-red-100">
            <Target className="text-red-600 w-5 h-5" />
            <select 
              value={competitionMonth} 
              onChange={(e) => setCompetitionMonth(e.target.value)}
              className="bg-transparent font-bold text-red-900 outline-none cursor-pointer"
            >
              {activeMonths.map(m => <option key={`comp-${m}`} value={m}>Target Tanding: {m}</option>)}
            </select>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Modul: Peaking Index & AUTO-TAPERING CHART */}
        <div className="md:col-span-3 bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="flex items-center gap-2 font-bold text-lg"><Zap className="w-5 h-5 text-orange-500" /> Beban Latihan & Auto-Tapering</h2>
              <p className="text-xs text-slate-500 mt-1">Garis putus-putus merah menandakan bulan kompetisi di mana volume otomatis dipangkas 50%.</p>
            </div>
            <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 uppercase">Peaking Index</span>
              <input type="range" min="1" max="5" value={peakingIndex} onChange={(e) => setPeakingIndex(e.target.value)} className="accent-orange-500" />
              <span className="font-black text-orange-600">{peakingIndex}</span>
            </div>
          </div>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}} 
                  labelStyle={{fontWeight: 'bold', color: '#1e293b', marginBottom: '4px'}}
                />
                <Legend iconType="circle" wrapperStyle={{paddingTop: '20px'}} />
                
                {/* Penanda Garis Kompetisi Utama */}
                {activeMonths.includes(competitionMonth) && (
                  <ReferenceLine 
                    x={competitionMonth} 
                    stroke="#ef4444" 
                    strokeDasharray="5 5" 
                    label={{ position: 'top', value: 'KOMPETISI UTAMA', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} 
                  />
                )}

                <Line type="monotone" dataKey="Intensitas" stroke="#ef4444" strokeWidth={4} activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="Volume" stroke="#3b82f6" strokeWidth={4} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* (Sisa modul lainnya seperti Fase Kekuatan, Evaluasi Fisik, dan 9 Rule S Mental letakkan di bawah ini...) */}

      </div>
    </div>
  );
};

export default App;