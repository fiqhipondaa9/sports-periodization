import React, { useState, useMemo, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, ReferenceLine, BarChart, Bar, Cell } from 'recharts';
import { Layout, Calendar, Trophy, Zap, Brain, Apple, Dumbbell, Activity, Target, Download, BarChart2, Timer, Wind, Globe, Save, Upload, Plus, X, Flag, PieChart as PieChartIcon, Table } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

// --- DATA MASTER (Diletakkan di luar agar aman dari ReferenceError) ---
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const biomotorData = {
  Strength: [
    { id: 'Adaptasi Anatomi', param: '40-65% 1RM | 8-12 Reps', desc: 'Penguatan ligamen & tendon' },
    { id: 'Maximum Strength (MXS)', param: '75-85% 1RM | 2-3 Set | 4-6 Reps', desc: 'Meningkatkan rekrutmen saraf' },
    { id: 'Konversi (Power)', param: 'Beban Dinamis Eksplosif', desc: 'Kekuatan diubah jadi daya ledak' },
    { id: 'Pemeliharaan', param: '30-100% 1RM | 1-3 Set | 1-3 Reps', desc: 'Pertahankan massa otot' },
    { id: 'Cessation', param: 'Hentikan Beban 5-7 Hari', desc: 'Tapering menuju kompetisi' },
    { id: 'Kompensasi', param: 'Istirahat Aktif | Fisioterapi', desc: 'Rehabilitasi & pemulihan' }
  ],
  Endurance: [
    { id: 'Aerobic Endurance', param: '120-150 bpm', desc: 'Meningkatkan VO2Max' },
    { id: 'Aerobic & Anaerobic', param: 'Kec. Tinggi | Durasi Pendek', desc: 'Meningkatkan ambang laktat' },
    { id: 'Specific Endurance', param: 'Simulasi Pertandingan', desc: 'Sesuai karakteristik cabor' },
    { id: 'Daya Tahan Khusus', param: 'Maintenance Peak', desc: 'Persiapan performa puncak' }
  ],
  Speed: [
    { id: 'Aerobic & Anaerobic', param: 'Fartlek / Bukit', desc: 'Fondasi daya tahan kecepatan' },
    { id: 'Kecepatan Alaktik', param: 'Intensitas Maksimal', desc: 'Sistem energi ATP-PC' },
    { id: 'Kecepatan Spesifik', param: 'Sprint & Drill', desc: 'Kecepatan gerak cabor' },
    { id: 'Kelincahan & Reaksi', param: 'Agility Drills', desc: 'Kecepatan reaksi' }
  ]
};

const App = () => {
  const BRANDING = "PERIODISASI OLAHRAGA BY FIQHIPONDAA9";
  const reportRef = useRef(null);
  const fileInputRef = useRef(null);

  // --- STATE MANAGEMENT ---
  const [startMonth, setStartMonth] = useState(0);
  const [endMonth, setEndMonth] = useState(11);
  const [peakingIndex, setPeakingIndex] = useState(5);
  const [competitionMonth, setCompetitionMonth] = useState('Okt');
  const [terminology, setTerminology] = useState('Eropa');
  const [tryOutMonths, setTryOutMonths] = useState([]);
  const [focusMonthState, setFocusMonthState] = useState('Jan');
  
  const [mentalScores, setMentalScores] = useState({ Positif: 8, Motivasi: 8, Goals: 7, Social: 8, 'Self-Talk': 7, Imagery: 8, Anxiety: 7, Emosi: 8, Fokus: 9 });
  const [testName, setTestName] = useState('VO2 Max');
  const [athleteScore, setAthleteScore] = useState(55);
  const [targetScore, setTargetScore] = useState(60);
  const [isTimeBased, setIsTimeBased] = useState(false);
  
  const [microType, setMicroType] = useState('developmental');
  const [activeBiomotor, setActiveBiomotor] = useState('Strength');
  const [selectedPhase, setSelectedPhase] = useState({ Strength: 'Adaptasi Anatomi', Endurance: 'Aerobic Endurance', Speed: 'Aerobic & Anaerobic' });
  
  const [materials, setMaterials] = useState([]);
  const [materialInput, setMaterialInput] = useState('');
  const [activeMaterial, setActiveMaterial] = useState('');
  const [showMatrixModal, setShowMatrixModal] = useState(false);
  const [matrixData, setMatrixData] = useState({});

  const activeMonths = useMemo(() => months.slice(startMonth, endMonth + 1), [startMonth, endMonth]);
  const focusMonth = activeMonths.includes(focusMonthState) ? focusMonthState : activeMonths[0];

  // --- LOGIC ---
  const getPhaseLabel = (m) => {
    const currIdx = months.indexOf(m);
    const compIdx = months.indexOf(competitionMonth);
    if (currIdx < compIdx) return { label: terminology === 'Eropa' ? 'Fase Persiapan' : terminology === 'Amerika Tradisional' ? 'Pre-Season' : 'Hypertrophy / Strength', color: 'bg-blue-100 text-blue-700 border-blue-200' };
    if (currIdx === compIdx) return { label: terminology === 'Eropa' ? 'Fase Kompetisi' : terminology === 'Amerika Tradisional' ? 'In-Season' : 'Peaking', color: 'bg-red-100 text-red-700 border-red-200' };
    return { label: terminology === 'Eropa' ? 'Fase Transisi' : terminology === 'Amerika Tradisional' ? 'Off-Season' : 'Active Rest', color: 'bg-slate-100 text-slate-600 border-slate-200' };
  };

  const chartData = useMemo(() => {
    return activeMonths.map((m, i) => {
      let vol = peakingIndex * 18 - (i * 2);
      let int = (6 - peakingIndex) * 18 + (i * 2);
      if (m === competitionMonth) { vol *= 0.5; int = Math.min(int * 1.2, 100); }
      return { name: m, Intensitas: int, Volume: vol, phase: getPhaseLabel(m).label };
    });
  }, [activeMonths, peakingIndex, competitionMonth, terminology]);

  const focusData = useMemo(() => {
    const label = getPhaseLabel(focusMonth).label.toLowerCase();
    if (label.includes('persiapan') || label.includes('pre-') || label.includes('hypertrophy')) return [{ name: 'Fisik', val: 65, fill: '#ef4444' }, { name: 'Teknik', val: 20, fill: '#eab308' }, { name: 'Psiko', val: 15, fill: '#22c55e' }];
    if (label.includes('kompetisi') || label.includes('in-season') || label.includes('peaking')) return [{ name: 'Fisik', val: 20, fill: '#ef4444' }, { name: 'Teknik', val: 45, fill: '#eab308' }, { name: 'Psiko', val: 35, fill: '#22c55e' }];
    return [{ name: 'Fisik', val: 30, fill: '#ef4444' }, { name: 'Teknik', val: 10, fill: '#eab308' }, { name: 'Psiko', val: 60, fill: '#22c55e' }];
  }, [focusMonth, terminology, competitionMonth]);

  const microcycleData = {
    developmental: [{ day: 'Sen', val: 65, color: '#22c55e' }, { day: 'Sel', val: 85, color: '#eab308' }, { day: 'Rab', val: 100, color: '#ef4444' }, { day: 'Kam', val: 10, color: '#94a3b8' }, { day: 'Jum', val: 85, color: '#eab308' }, { day: 'Sab', val: 100, color: '#ef4444' }, { day: 'Min', val: 10, color: '#94a3b8' }],
    shock: [{ day: 'Sen', val: 85, color: '#eab308' }, { day: 'Sel', val: 100, color: '#ef4444' }, { day: 'Rab', val: 100, color: '#ef4444' }, { day: 'Kam', val: 85, color: '#eab308' }, { day: 'Jum', val: 100, color: '#ef4444' }, { day: 'Sab', val: 85, color: '#eab308' }, { day: 'Min', val: 10, color: '#94a3b8' }],
    regeneration: [{ day: 'Sen', val: 65, color: '#22c55e' }, { day: 'Sel', val: 85, color: '#eab308' }, { day: 'Rab', val: 65, color: '#22c55e' }, { day: 'Kam', val: 85, color: '#eab308' }, { day: 'Jum', val: 65, color: '#22c55e' }, { day: 'Sab', val: 85, color: '#eab308' }, { day: 'Min', val: 10, color: '#94a3b8' }],
    peaking: [{ day: 'Sen', val: 65, color: '#22c55e' }, { day: 'Sel', val: 85, color: '#eab308' }, { day: 'Rab', val: 100, color: '#ef4444' }, { day: 'Kam', val: 85, color: '#eab308' }, { day: 'Jum', val: 65, color: '#22c55e' }, { day: 'Sab', val: 65, color: '#22c55e' }, { day: 'Min', val: 100, color: '#ef4444' }]
  };

  const handleSaveJSON = () => {
    const data = { startMonth, endMonth, peakingIndex, competitionMonth, terminology, tryOutMonths, mentalScores, testName, athleteScore, targetScore, isTimeBased, microType, activeBiomotor, selectedPhase, materials, activeMaterial, matrixData };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `Program_${new Date().getTime()}.json`; a.click();
  };

  const handleLoadJSON = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target.result);
        setStartMonth(d.startMonth); setEndMonth(d.endMonth); setPeakingIndex(d.peakingIndex); setCompetitionMonth(d.competitionMonth);
        setTerminology(d.terminology); setTryOutMonths(d.tryOutMonths || []); setMentalScores(d.mentalScores); setTestName(d.testName);
        setAthleteScore(d.athleteScore); setTargetScore(d.targetScore); setIsTimeBased(d.isTimeBased); setMicroType(d.microType);
        setActiveBiomotor(d.activeBiomotor); setSelectedPhase(d.selectedPhase); setMaterials(d.materials); setActiveMaterial(d.activeMaterial);
        setMatrixData(d.matrixData || {}); alert("Program Berhasil Dimuat!");
      } catch (err) { alert("Format File Salah!"); }
    };
    reader.readAsText(file);
  };

  const uniquePhases = [];
  let currentPhase = null;
  activeMonths.forEach(m => {
    const p = getPhaseLabel(m);
    if (!currentPhase || currentPhase.label !== p.label) { currentPhase = { ...p, span: 1 }; uniquePhases.push(currentPhase); }
    else { currentPhase.span += 1; }
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans relative text-slate-900">
      {/* MATRIX MODAL */}
      {showMatrixModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden border">
            <div className="p-5 border-b bg-slate-50 flex justify-between items-center">
              <h2 className="text-xl font-black text-blue-900 uppercase">Matriks Mesosiklus Mingguan</h2>
              <button onClick={() => setShowMatrixModal(false)} className="p-2 hover:bg-red-50 rounded-xl"><X /></button>
            </div>
            <div className="p-6 overflow-auto custom-scrollbar flex-1">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="p-3 border bg-slate-100 text-xs font-black sticky left-0 z-10">Materi</th>
                    {activeMonths.map(m => <th key={m} colSpan={4} className="p-2 border bg-blue-50 text-[10px] font-black">{m}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {materials.map(mat => (
                    <tr key={mat}>
                      <td className="p-2 border bg-white sticky left-0 z-10 text-[11px] font-bold">{mat}</td>
                      {activeMonths.map(m => [1,2,3,4].map(w => (
                        <td key={`${m}-W${w}`} className="p-1 border text-center">
                          <input type="checkbox" checked={!!matrixData[`${m}-W${w}-${mat}`]} onChange={() => setMatrixData(prev => ({...prev, [`${m}-W${w}-${mat}`]: !prev[`${m}-W${w}-${mat}`]}))} className="accent-blue-600" />
                        </td>
                      )))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TOOLBAR */}
      <div className="max-w-[1200px] mx-auto flex justify-end gap-3 mb-4">
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleLoadJSON} />
        <button onClick={() => fileInputRef.current.click()} className="bg-white border px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-xs"><Upload className="w-4 h-4 text-blue-600"/> Buka JSON</button>
        <button onClick={handleSaveJSON} className="bg-white border px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-xs"><Save className="w-4 h-4 text-green-600"/> Simpan JSON</button>
        <button onClick={() => window.print()} className="bg-slate-900 text-white px-5 py-2 rounded-xl flex items-center gap-2 font-bold text-xs"><Download className="w-4 h-4"/> Cetak</button>
      </div>

      <div ref={reportRef} className="max-w-[1200px] mx-auto p-4 bg-white rounded-3xl shadow-sm border overflow-hidden">
        <header className="mb-6 flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
          <div>
            <h1 className="text-xl font-black text-blue-900 uppercase">{BRANDING}</h1>
            <p className="text-[10px] font-bold text-slate-400">SISTEM PERIODISASI TUDOR BOMPA TERINTEGRASI</p>
          </div>
          <div className="flex gap-2">
            <div className="bg-indigo-50 px-3 py-2 rounded-xl border flex items-center gap-2">
               <Globe className="w-4 h-4 text-indigo-600"/>
               <select value={terminology} onChange={e => setTerminology(e.target.value)} className="bg-transparent text-[10px] font-black outline-none cursor-pointer">
                  <option value="Eropa">EROPA</option>
                  <option value="Amerika Tradisional">AMERIKA</option>
               </select>
            </div>
            <div className="bg-blue-50 px-3 py-2 rounded-xl border flex items-center gap-2">
               <Calendar className="w-4 h-4 text-blue-600"/>
               <select value={startMonth} onChange={e => setStartMonth(Number(e.target.value))} className="bg-transparent text-[11px] font-black">
                 {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
               </select>
               <span className="font-bold">-</span>
               <select value={endMonth} onChange={e => setEndMonth(Number(e.target.value))} className="bg-transparent text-[11px] font-black">
                 {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
               </select>
            </div>
            <div className="bg-red-50 px-3 py-2 rounded-xl border flex items-center gap-2">
               <Target className="w-4 h-4 text-red-600"/>
               <select value={competitionMonth} onChange={e => setCompetitionMonth(e.target.value)} className="bg-transparent text-[11px] font-black">
                 {activeMonths.map(m => <option key={m} value={m}>{m}</option>)}
               </select>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* CHART AREA */}
          <div className="md:col-span-2 border p-6 rounded-3xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold flex items-center gap-2 uppercase text-sm"><Zap className="text-orange-500"/> Makrosiklus & Tapering</h2>
              <input type="range" min="1" max="5" value={peakingIndex} onChange={e => setPeakingIndex(e.target.value)} className="accent-orange-500 w-24" />
            </div>
            <div className="flex w-full mb-4 gap-1 h-6">
              {uniquePhases.map((p, idx) => (
                <div key={idx} className={`flex items-center justify-center rounded border text-[9px] font-black uppercase overflow-hidden whitespace-nowrap px-1 ${p.color}`} style={{ flex: p.span }}>{p.label}</div>
              ))}
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}}/>
                  <YAxis hide/>
                  <RechartsTooltip/>
                  <Legend iconType="circle"/>
                  {activeMonths.includes(competitionMonth) && <ReferenceLine x={competitionMonth} stroke="#ef4444" strokeDasharray="5 5" label={{ position: 'top', value: 'Tanding', fill: '#ef4444', fontSize: 9, fontWeight: 'bold' }} />}
                  <Line type="monotone" name="Intensitas" dataKey="Intensitas" stroke="#ef4444" strokeWidth={4} dot={{r: 4}} />
                  <Line type="monotone" name="Volume" dataKey="Volume" stroke="#3b82f6" strokeWidth={4} dot={{r: 4}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* BIOMOTORIK */}
          <div className="border p-6 rounded-3xl flex flex-col h-full bg-slate-50/30">
            <h2 className="font-bold text-sm mb-4 uppercase">Manajemen Biomotorik</h2>
            <div className="flex bg-slate-200 p-1 rounded-xl mb-4">
              {['Strength', 'Endurance', 'Speed'].map(t => (
                <button key={t} onClick={() => setActiveBiomotor(t)} className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${activeBiomotor === t ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>{t.toUpperCase()}</button>
              ))}
            </div>
            <div className="space-y-2 flex-1 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar">
              {biomotorData[activeBiomotor].map(p => (
                <div key={p.id} onClick={() => setSelectedPhase(prev => ({...prev, [activeBiomotor]: p.id}))} className={`p-3 rounded-2xl border-2 cursor-pointer transition-all ${selectedPhase[activeBiomotor] === p.id ? 'border-blue-500 bg-blue-50 shadow-sm' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
                   <p className="text-[10px] font-black text-blue-900 mb-1">{p.id.toUpperCase()}</p>
                   <p className="text-[9px] font-bold text-blue-600 mb-1">{p.param}</p>
                   <p className="text-[8px] text-slate-400 italic">{p.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* LOWER GRID */}
          <div className="md:col-span-2 border p-6 rounded-3xl flex flex-col">
            <div className="flex justify-between items-center mb-6">
               <h2 className="font-bold text-sm uppercase flex items-center gap-2"><BarChart2 className="w-4 h-4 text-blue-600"/> Siklus Mikro</h2>
               <div className="flex gap-1">
                 {['developmental', 'shock', 'regeneration', 'peaking'].map(t => (
                   <button key={t} onClick={() => setMicroType(t)} className={`px-3 py-1 text-[9px] font-black rounded-lg border uppercase ${microType === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-400'}`}>{t.slice(0,4)}</button>
                 ))}
               </div>
            </div>
            <div className="h-40 w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={microcycleData[microType]}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 'bold'}}/>
                  <YAxis hide domain={[0, 100]}/>
                  <Bar dataKey="val" radius={[4, 4, 0, 0]} barSize={40}>
                    {microcycleData[microType].map((entry, index) => <Cell key={index} fill={entry.color} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="border-t pt-4">
               <div className="flex justify-between items-center mb-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase">Materi Latihan Spesifik</span>
                  <button onClick={() => setShowMatrixModal(true)} className="text-[10px] font-black text-blue-600 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100 hover:bg-blue-100 transition-all"><Table className="w-3 h-3"/> Buka Matriks</button>
               </div>
               <div className="flex gap-2">
                  <input type="text" value={materialInput} onChange={e => setMaterialInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddMaterial()} className="flex-1 border p-2 rounded-xl text-xs" placeholder="Ketik Materi..."/>
                  <button onClick={handleAddMaterial} className="bg-blue-600 text-white p-2 rounded-xl"><Plus/></button>
               </div>
            </div>
          </div>

          <div className="border p-6 rounded-3xl flex flex-col justify-center items-center bg-indigo-50/30">
            <h2 className="text-[11px] font-black text-indigo-900 mb-4 uppercase tracking-widest flex items-center gap-2"><PieChartIcon className="w-4 h-4"/> Fokus Latihan ({focusMonth})</h2>
            <div className="h-40 w-full mb-4">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={focusData}>
                   <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}}/>
                   <YAxis hide domain={[0, 100]}/>
                   <Bar dataKey="val" radius={[4, 4, 0, 0]}>
                     {focusData.map((e, i) => <Cell key={i} fill={e.fill} />)}
                   </Bar>
                 </BarChart>
               </ResponsiveContainer>
            </div>
            <select value={focusMonthState} onChange={e => setFocusMonthState(e.target.value)} className="w-full bg-white border p-2 rounded-xl text-[10px] font-black outline-none shadow-sm">
               {activeMonths.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;