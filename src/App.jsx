import React, { useState, useMemo, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, ReferenceLine, BarChart, Bar, Cell } from 'recharts';
import { Layout, Calendar, Trophy, Zap, Brain, Apple, Dumbbell, Activity, Target, Download, BarChart2, Timer, Wind, Globe } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const App = () => {
  const BRANDING = "PERIODISASI OLAHRAGA by fiqhipondaa9";
  const reportRef = useRef(null);

  // State Management Makrosiklus
  const [startMonth, setStartMonth] = useState(0);
  const [endMonth, setEndMonth] = useState(11);
  const [peakingIndex, setPeakingIndex] = useState(5);
  const [competitionMonth, setCompetitionMonth] = useState('Okt');

  // TAHAP 3 & 4: STATE TERMINOLOGI PERIODISASI
  const [terminology, setTerminology] = useState('Eropa');

  // State Modul Evaluasi & Mental
  const [mentalScores, setMentalScores] = useState({ Positif: 8, Motivasi: 8, Goals: 7, Social: 8, 'Self-Talk': 7, Imagery: 8, Anxiety: 7, Emosi: 8, Fokus: 9 });
  const [testName, setTestName] = useState('VO2 Max');
  const [athleteScore, setAthleteScore] = useState(55);
  const [targetScore, setTargetScore] = useState(60);
  const [isTimeBased, setIsTimeBased] = useState(false);

  // State Siklus Mikro & Biomotorik
  const [microType, setMicroType] = useState('developmental');
  const [activeBiomotor, setActiveBiomotor] = useState('Strength');
  const [selectedPhase, setSelectedPhase] = useState({ Strength: 'Adaptasi Anatomi', Endurance: 'Aerobic Endurance', Speed: 'Aerobic & Anaerobic' });

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const activeMonths = useMemo(() => months.slice(startMonth, endMonth + 1), [startMonth, endMonth]);

  // Logika Pemetaan Terminologi Fase Latihan
  const getPhaseLabel = (month) => {
    const currIdx = months.indexOf(month);
    const compIdx = months.indexOf(competitionMonth);

    if (currIdx < compIdx) {
      if (terminology === 'Eropa') return { label: 'Fase Persiapan', color: 'bg-blue-100 text-blue-700 border-blue-200' };
      if (terminology === 'Amerika Tradisional') return { label: 'Pre-Season', color: 'bg-blue-100 text-blue-700 border-blue-200' };
      return { label: 'Hypertrophy / Strength', color: 'bg-blue-100 text-blue-700 border-blue-200' };
    } else if (currIdx === compIdx) {
      if (terminology === 'Eropa') return { label: 'Fase Kompetisi', color: 'bg-red-100 text-red-700 border-red-200' };
      if (terminology === 'Amerika Tradisional') return { label: 'In-Season', color: 'bg-red-100 text-red-700 border-red-200' };
      return { label: 'Peaking', color: 'bg-red-100 text-red-700 border-red-200' };
    } else {
      if (terminology === 'Eropa') return { label: 'Fase Transisi', color: 'bg-slate-100 text-slate-600 border-slate-200' };
      if (terminology === 'Amerika Tradisional') return { label: 'Off-Season', color: 'bg-slate-100 text-slate-600 border-slate-200' };
      return { label: 'Active Rest', color: 'bg-slate-100 text-slate-600 border-slate-200' };
    }
  };

  const chartData = useMemo(() => {
    return activeMonths.map((m, i) => {
      let baseVolume = peakingIndex * 18 - (i * 2);
      let baseIntensity = (6 - peakingIndex) * 18 + (i * 2);
      if (m === competitionMonth) {
        baseVolume = baseVolume * 0.5; 
        baseIntensity = Math.min(baseIntensity * 1.2, 100); 
      }
      return { name: m, Intensitas: baseIntensity, Volume: baseVolume, phase: getPhaseLabel(m).label };
    });
  }, [activeMonths, peakingIndex, competitionMonth, terminology]);

  // Data Siklus Mikro
  const microcycleData = {
    developmental: [{ day: 'Sen', val: 65, color: '#22c55e' }, { day: 'Sel', val: 85, color: '#eab308' }, { day: 'Rab', val: 100, color: '#ef4444' }, { day: 'Kam', val: 10, color: '#94a3b8' }, { day: 'Jum', val: 85, color: '#eab308' }, { day: 'Sab', val: 100, color: '#ef4444' }, { day: 'Min', val: 10, color: '#94a3b8' }],
    shock: [{ day: 'Sen', val: 85, color: '#eab308' }, { day: 'Sel', val: 100, color: '#ef4444' }, { day: 'Rab', val: 100, color: '#ef4444' }, { day: 'Kam', val: 85, color: '#eab308' }, { day: 'Jum', val: 100, color: '#ef4444' }, { day: 'Sab', val: 85, color: '#eab308' }, { day: 'Min', val: 10, color: '#94a3b8' }],
    regeneration: [{ day: 'Sen', val: 65, color: '#22c55e' }, { day: 'Sel', val: 85, color: '#eab308' }, { day: 'Rab', val: 65, color: '#22c55e' }, { day: 'Kam', val: 85, color: '#eab308' }, { day: 'Jum', val: 65, color: '#22c55e' }, { day: 'Sab', val: 85, color: '#eab308' }, { day: 'Min', val: 10, color: '#94a3b8' }],
    peaking: [{ day: 'Sen', val: 65, color: '#22c55e' }, { day: 'Sel', val: 85, color: '#eab308' }, { day: 'Rab', val: 100, color: '#ef4444' }, { day: 'Kam', val: 85, color: '#eab308' }, { day: 'Jum', val: 65, color: '#22c55e' }, { day: 'Sab', val: 65, color: '#22c55e' }, { day: 'Min', val: 100, color: '#ef4444' }]
  };

  // Data Biomotorik
  const biomotorData = {
    Strength: [
      { id: 'Adaptasi Anatomi', param: '40-65% 1RM | 8-12 Reps', desc: 'Penguatan ligamen & tendon' },
      { id: 'Maximum Strength (MXS)', param: '75-85% 1RM | 2-3 Set | 4-6 Reps', desc: 'Meningkatkan rekrutmen saraf' },
      { id: 'Konversi (Power)', param: 'Beban Dinamis Eksplosif', desc: 'Kekuatan diubah jadi daya ledak' },
      { id: 'Pemeliharaan', param: '30-100% 1RM | 1-3 Set | 1-3 Reps', desc: 'Pertahankan massa otot in-season' },
      { id: 'Cessation', param: 'Hentikan Beban 5-7 Hari', desc: 'Tapering menuju kompetisi' },
      { id: 'Kompensasi', param: 'Istirahat Aktif | Fisioterapi', desc: 'Rehabilitasi & hilangkan kelelahan' }
    ],
    Endurance: [
      { id: 'Aerobic Endurance', param: 'Intensitas Sedang (120-150 bpm)', desc: 'Meningkatkan VO2Max (Persiapan Umum)' },
      { id: 'Aerobic & Anaerobic', param: 'Aktivitas Pendek | Kecepatan Tinggi', desc: 'Meningkatkan anaerobik (Persiapan Khusus)' },
      { id: 'Specific Endurance', param: 'Intensitas Tinggi | Waktu Pendek', desc: 'Sesuai karakteristik cabor (Kompetisi)' },
      { id: 'Daya Tahan Khusus', param: 'Simulasi Strategi & Taktik', desc: 'Mempersiapkan peak performance' }
    ],
    Speed: [
      { id: 'Aerobic & Anaerobic', param: 'Fartlek | Cross Country | Lari Bukit', desc: 'Fondasi daya tahan (Persiapan)' },
      { id: 'Kecepatan Alaktik', param: 'Intensitas Maksimal | Durasi Pendek', desc: 'Kecepatan tanpa penumpukan laktat' },
      { id: 'Kecepatan Spesifik', param: 'Alaktik + Laktik + Daya Tahan', desc: 'Gabungan untuk fase kompetisi' },
      { id: 'Kelincahan & Reaksi', param: 'Agility Drills | Reaction Time', desc: 'Kecepatan khusus cabor' }
    ]
  };

  const handlePhaseChange = (component, phaseId) => setSelectedPhase(prev => ({ ...prev, [component]: phaseId }));

  const calculateScore = () => {
    if (!athleteScore || !targetScore) return { percentage: 0, label: "-", color: "text-slate-400", barColor: "bg-slate-200" };
    let percentage = isTimeBased ? (targetScore / athleteScore) * 100 : (athleteScore / targetScore) * 100;
    const roundedPercent = Math.round(percentage);
    if (roundedPercent >= 100) return { percentage: roundedPercent, label: "Sangat Baik", color: "text-green-600", barColor: "bg-green-500" };
    if (roundedPercent >= 80) return { percentage: roundedPercent, label: "Baik", color: "text-blue-600", barColor: "bg-blue-500" };
    if (roundedPercent >= 60) return { percentage: roundedPercent, label: "Cukup", color: "text-yellow-600", barColor: "bg-yellow-500" };
    return { percentage: roundedPercent, label: "Kurang", color: "text-red-600", barColor: "bg-red-500" };
  };

  const getNutrition = (phase) => {
    if (terminology === 'Eropa' && phase === 'Fase Persiapan') return "High Protein (Anatomy Adaptation)";
    if (terminology === 'Eropa' && phase === 'Fase Kompetisi') return "High Carbohydrate (Glycogen Loading)";
    return "Mix (Balance / Maintenance)";
  };

  const currentResult = calculateScore();

  const handleExportPDF = async () => {
    const element = reportRef.current;
    if (!element) return;
    const originalBg = element.style.backgroundColor;
    element.style.backgroundColor = '#f8fafc';
    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Laporan_Periodisasi_${new Date().getTime()}.pdf`);
    } catch (error) {
      alert("Terjadi kesalahan saat mencetak PDF.");
    } finally {
      element.style.backgroundColor = originalBg;
    }
  };

  // Ekstraksi pita fase unik untuk Ribbon (Menghindari duplikasi label)
  const uniquePhases = [];
  let currentPhase = null;
  activeMonths.forEach(m => {
    const phaseLabel = getPhaseLabel(m);
    if (!currentPhase || currentPhase.label !== phaseLabel.label) {
      currentPhase = { label: phaseLabel.label, color: phaseLabel.color, span: 1 };
      uniquePhases.push(currentPhase);
    } else {
      currentPhase.span += 1;
    }
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-900">
      
      <div className="max-w-[1200px] mx-auto flex justify-end mb-4">
        <button onClick={handleExportPDF} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg hover:bg-slate-800 transition-all">
          <Download className="w-5 h-5" /> Cetak Laporan PDF
        </button>
      </div>

      <div ref={reportRef} className="max-w-[1200px] mx-auto p-4 bg-slate-50">
        
        <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-blue-900 uppercase">{BRANDING}</h1>
            <p className="text-slate-500 font-medium">Sistem Periodisasi Tudor Bompa Terintegrasi</p>
          </div>
          <div className="flex flex-wrap gap-3">
            {/* TAHAP 3 & 4: DROPDOWN TERMINOLOGI */}
            <div className="bg-indigo-50 px-3 py-2 rounded-xl flex items-center gap-2 border border-indigo-100">
              <Globe className="text-indigo-600 w-4 h-4" />
              <select value={terminology} onChange={(e) => setTerminology(e.target.value)} className="bg-transparent text-xs font-bold text-indigo-900 outline-none cursor-pointer uppercase">
                <option value="Eropa">Eropa (Persiapan/Kompetisi)</option>
                <option value="Amerika Tradisional">Amerika (Pre/In/Off-Season)</option>
                <option value="Amerika Strength & Power">Amerika (Hypertrophy/Peaking)</option>
              </select>
            </div>
            <div className="bg-blue-50 px-4 py-2 rounded-xl flex items-center gap-3 border border-blue-100">
              <Calendar className="text-blue-600 w-4 h-4" />
              <span className="font-bold text-sm text-blue-900">{activeMonths[0]} - {activeMonths[activeMonths.length - 1]}</span>
            </div>
            <div className="bg-red-50 px-4 py-2 rounded-xl flex items-center gap-3 border border-red-100">
              <Target className="text-red-600 w-4 h-4" />
              <select value={competitionMonth} onChange={(e) => setCompetitionMonth(e.target.value)} className="bg-transparent font-bold text-sm text-red-900 outline-none cursor-pointer">
                {activeMonths.map(m => <option key={`comp-${m}`} value={m}>Tanding: {m}</option>)}
              </select>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="flex items-center gap-2 font-bold text-lg"><Zap className="w-5 h-5 text-orange-500" /> Makrosiklus & Tapering</h2>
              <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Peaking Index</span>
                <input type="range" min="1" max="5" value={peakingIndex} onChange={(e) => setPeakingIndex(e.target.value)} className="accent-orange-500 w-20" />
                <span className="font-black text-orange-600">{peakingIndex}</span>
              </div>
            </div>

            {/* PITA FASE LATIHAN (TIMELINE RIBBON)[cite: 2] */}
            <div className="flex w-full mb-4 gap-1 h-6">
              {uniquePhases.map((phase, idx) => (
                <div key={idx} className={`flex items-center justify-center rounded border text-[9px] font-black uppercase tracking-widest ${phase.color}`} style={{ flex: phase.span }}>
                  {phase.label}
                </div>
              ))}
            </div>

            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} />
                  <YAxis hide />
                  <RechartsTooltip contentStyle={{borderRadius: '12px'}} labelStyle={{fontWeight:'bold'}} />
                  <Legend iconType="circle" />
                  {activeMonths.includes(competitionMonth) && (
                    <ReferenceLine x={competitionMonth} stroke="#ef4444" strokeDasharray="5 5" label={{ position: 'top', value: 'TAPERING', fill: '#ef4444', fontSize: 9, fontWeight: 'bold' }} />
                  )}
                  <Line type="monotone" name="Intensitas" dataKey="Intensitas" stroke="#ef4444" strokeWidth={4} activeDot={{ r: 8 }} />
                  <Line type="monotone" name="Volume" dataKey="Volume" stroke="#3b82f6" strokeWidth={4} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Modul Biomotorik */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col h-full">
            <h2 className="font-bold text-lg text-slate-800 mb-4">Manajemen Biomotorik[cite: 2]</h2>
            <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
              {[{ id: 'Strength', icon: <Dumbbell className="w-4 h-4" /> }, { id: 'Endurance', icon: <Timer className="w-4 h-4" /> }, { id: 'Speed', icon: <Wind className="w-4 h-4" /> }].map(tab => (
                <button key={tab.id} onClick={() => setActiveBiomotor(tab.id)} className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-all ${activeBiomotor === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>
                  {tab.icon}
                </button>
              ))}
            </div>
            <div className="space-y-2 flex-1 overflow-y-auto pr-1 custom-scrollbar max-h-[260px]">
              {biomotorData[activeBiomotor].map((phase) => (
                <button key={phase.id} onClick={() => handlePhaseChange(activeBiomotor, phase.id)} className={`w-full p-3 rounded-2xl border-2 transition-all text-left flex flex-col gap-1 ${selectedPhase[activeBiomotor] === phase.id ? 'border-blue-500 bg-blue-50' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}>
                  <div className="flex justify-between items-center w-full">
                    <span className={`text-[11px] font-black uppercase ${selectedPhase[activeBiomotor] === phase.id ? 'text-blue-700' : 'text-slate-600'}`}>{phase.id}</span>
                    {selectedPhase[activeBiomotor] === phase.id && <div className="w-2 h-2 rounded-full bg-blue-600"></div>}
                  </div>
                  <span className={`text-[9px] font-bold inline-block px-2 py-0.5 rounded ${selectedPhase[activeBiomotor] === phase.id ? 'bg-blue-200 text-blue-800' : 'bg-slate-200 text-slate-500'}`}>{phase.param}</span>
                  <p className="text-[10px] text-slate-500 leading-tight mt-1">{phase.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
              <h2 className="flex items-center gap-2 font-bold text-lg text-blue-900"><BarChart2 className="w-5 h-5" /> Dinamika Siklus Mikro[cite: 2]</h2>
              <div className="flex gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200 overflow-x-auto custom-scrollbar">
                {[{ id: 'developmental', label: 'Developmental' }, { id: 'shock', label: 'Shock (Goncangan)' }, { id: 'regeneration', label: 'Regenerasi' }, { id: 'peaking', label: 'Peaking/Unload' }].map((type) => (
                  <button key={type.id} onClick={() => setMicroType(type.id)} className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg whitespace-nowrap transition-all ${microType === type.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}>
                    {type.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-40 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={microcycleData[microType]} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 'bold'}} />
                  <YAxis hide domain={[0, 100]} />
                  <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="val" radius={[6, 6, 6, 6]} barSize={40}>
                    {microcycleData[microType].map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex-1">
              <h2 className="flex items-center gap-2 font-bold text-lg mb-4"><Trophy className="w-5 h-5 text-yellow-500" /> Evaluasi Fisik</h2>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <input type="number" value={athleteScore} onChange={(e) => setAthleteScore(Number(e.target.value))} className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-center text-blue-600" placeholder="Skor" />
                <input type="number" value={targetScore} onChange={(e) => setTargetScore(Number(e.target.value))} className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-center text-slate-500" placeholder="Target" />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <input type="checkbox" checked={isTimeBased} onChange={(e) => setIsTimeBased(e.target.checked)} className="accent-indigo-600" />
                <label className="text-[10px] font-bold text-slate-500">Tes Waktu</label>
              </div>
              <div className={`p-3 rounded-2xl border flex flex-col items-center justify-center ${currentResult.barColor.replace('bg-', 'bg-').replace('500', '50')} ${currentResult.barColor.replace('bg-', 'border-').replace('500', '200')}`}>
                <span className={`text-xl font-black ${currentResult.color}`}>{currentResult.percentage}%</span>
                <span className={`text-[9px] font-bold uppercase ${currentResult.color}`}>{currentResult.label}</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-3 bg-white p-6 rounded-3xl shadow-sm border border-slate-200 mt-2">
            <h2 className="flex items-center gap-2 font-bold text-lg mb-4 text-purple-900"><Brain className="w-5 h-5" /> Asesmen Mental (Skala 1-9)</h2>
            <div className="grid grid-cols-3 md:grid-cols-9 gap-3">
              {Object.entries(mentalScores).map(([rule, score]) => (
                <div key={rule} className="p-3 bg-purple-50 rounded-2xl border border-purple-100 flex flex-col items-center justify-center relative group">
                  <p className="text-[9px] font-black text-purple-400 uppercase tracking-wider mb-2">{rule}</p>
                  <input type="number" min="1" max="9" value={score} onChange={(e) => { let val = Number(e.target.value); if (val > 9) val = 9; if (val < 1) val = 1; setMentalScores({...mentalScores, [rule]: val}); }} className="w-full bg-transparent text-center text-xl font-black text-purple-900 outline-none appearance-none cursor-pointer" />
                  {score <= 5 && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white"></div>}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;