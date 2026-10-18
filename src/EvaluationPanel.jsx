import React, { useState } from 'react';
import { Trophy, Plus, Trash2, Clock, CheckCircle2, ChevronRight, Sparkles } from 'lucide-react';

const PRESET_TESTS = [
  { name: 'Bleep Test (VO2Max)', category: 'Endurance', score: 12.5, target: 14.0, unit: 'Level', isTime: false },
  { name: 'Cooper Test 2.4km', category: 'Endurance', score: 9.30, target: 8.50, unit: 'menit', isTime: true },
  { name: 'Sprint 20m Acceleration', category: 'Speed', score: 3.12, target: 2.95, unit: 'detik', isTime: true },
  { name: 'Sprint 30m Speed', category: 'Speed', score: 4.25, target: 4.05, unit: 'detik', isTime: true },
  { name: 'Vertical Jump Test', category: 'Power', score: 62, target: 68, unit: 'cm', isTime: false },
  { name: 'Standing Broad Jump', category: 'Power', score: 245, target: 260, unit: 'cm', isTime: false },
  { name: 'Agility T-Test', category: 'Agility', score: 10.35, target: 9.80, unit: 'detik', isTime: true },
  { name: 'Illinois Agility Run', category: 'Agility', score: 16.4, target: 15.2, unit: 'detik', isTime: true },
  { name: 'Push-Up 1 Menit', category: 'Strength', score: 48, target: 55, unit: 'reps', isTime: false },
  { name: 'Plank Core Endurance', category: 'Strength', score: 120, target: 180, unit: 'detik', isTime: false }
];

const EvaluationPanel = ({ evaluations, setEvaluations, t }) => {
  const [selectedPreset, setSelectedPreset] = useState('');

  // Fallback jika evaluations belum berupa array
  const testList = Array.isArray(evaluations) ? evaluations : [];

  const calculateItemScore = (item) => {
    if (!item.score || !item.target || item.score <= 0) {
      return { percentage: 0, label: "-", color: "text-slate-400", barColor: "bg-slate-200" };
    }
    let p = item.isTime 
      ? (item.target / item.score) * 100 
      : (item.score / item.target) * 100;
    
    if (!isFinite(p) || isNaN(p)) p = 0;
    const r = Math.min(Math.round(p), 100);
    if (r >= 90) return { percentage: r, label: "EXCELLENT", color: "text-emerald-600", barColor: "bg-emerald-500", bgLight: "bg-emerald-50 text-emerald-700" };
    if (r >= 75) return { percentage: r, label: "GOOD", color: t.text, barColor: t.bg, bgLight: `${t.bgLight} ${t.textDark}` };
    return { percentage: r, label: "POOR", color: "text-rose-600", barColor: "bg-rose-500", bgLight: "bg-rose-50 text-rose-700" };
  };

  const handleAddPreset = (e) => {
    const val = e.target.value;
    if (!val) return;
    const preset = PRESET_TESTS.find(p => p.name === val);
    if (preset) {
      const newTest = {
        ...preset,
        id: `test-${Date.now()}`
      };
      setEvaluations([...testList, newTest]);
    }
    setSelectedPreset('');
  };

  const handleAddNewCustom = () => {
    const newTest = {
      id: `test-${Date.now()}`,
      name: 'Tes Fisik Baru',
      category: 'General',
      score: 50,
      target: 100,
      unit: 'pts',
      isTime: false
    };
    setEvaluations([...testList, newTest]);
  };

  const handleUpdateTest = (id, field, value) => {
    setEvaluations(testList.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const handleDeleteTest = (id) => {
    if (testList.length <= 1) {
      alert("Minimal sisakan 1 parameter tes fisik!");
      return;
    }
    setEvaluations(testList.filter(t => t.id !== id));
  };

  // Rata-rata Skor Baterai Tes
  const overallIndex = testList.length > 0 
    ? Math.round(testList.reduce((acc, curr) => acc + calculateItemScore(curr).percentage, 0) / testList.length)
    : 0;

  const getOverallStatus = (idx) => {
    if (idx >= 90) return { label: 'SIAP TANDING (EXCELLENT)', color: 'text-emerald-700 bg-emerald-100 border-emerald-300' };
    if (idx >= 75) return { label: 'PROGRES BAIK (GOOD)', color: 'text-blue-700 bg-blue-100 border-blue-300' };
    return { label: 'PERLU PENINGKATAN (POOR)', color: 'text-rose-700 bg-rose-100 border-rose-300' };
  };

  const overallStatus = getOverallStatus(overallIndex);

  return (
    <div className="border p-6 rounded-3xl bg-white shadow-sm flex flex-col border-slate-200">
      <div className="flex flex-wrap items-center justify-between mb-4 border-b pb-3 gap-2">
        <div>
          <h2 className={`font-black uppercase flex items-center gap-2 tracking-tight ${t.text}`}>
            <Trophy className="w-5 h-5"/> Baterai Tes Fisik Atlet
          </h2>
          <p className="text-[9px] font-bold text-slate-400">
            Multitest Battery: Daya Tahan, Kecepatan, Daya Ledak & Kelincahan
          </p>
        </div>
        
        {/* OVERALL READINESS SCORE BADGE */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[9px] font-black uppercase shadow-sm ${overallStatus.color}`}>
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Indeks Fisik: {overallIndex}% — {overallStatus.label}</span>
        </div>
      </div>

      {/* TOOLBAR TAMBAH TES & PRESET */}
      <div className="flex flex-wrap items-center gap-2 mb-4 bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
        <select 
          value={selectedPreset}
          onChange={handleAddPreset}
          className="border border-slate-300 rounded-xl p-2 text-[9px] font-black uppercase text-slate-700 bg-white cursor-pointer outline-none flex-1 min-w-[200px]"
        >
          <option value="">⚡ + Pilih Template Tes Cabor (Sports Science)...</option>
          {PRESET_TESTS.map(p => (
            <option key={p.name} value={p.name}>
              {p.category} — {p.name} ({p.unit})
            </option>
          ))}
        </select>
        
        <button 
          type="button"
          onClick={handleAddNewCustom}
          className={`px-3 py-2 text-white font-black text-[9px] rounded-xl flex items-center gap-1 uppercase transition-all shadow-sm ${t.bg} ${t.hoverBg}`}
        >
          <Plus className="w-3.5 h-3.5" /> Tes Custom
        </button>
      </div>

      {/* DAFTAR TES FISIK */}
      <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
        {testList.map((test, index) => {
          const itemScore = calculateItemScore(test);
          return (
            <div 
              key={test.id || index}
              className="p-3 bg-slate-50/70 border border-slate-200 rounded-2xl hover:border-slate-300 transition-all flex flex-col gap-2"
            >
              <div className="flex items-center justify-between gap-2">
                <input 
                  value={test.name}
                  onChange={e => handleUpdateTest(test.id, 'name', e.target.value)}
                  className="font-black text-[10px] uppercase text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-500 outline-none flex-1"
                  placeholder="Nama Tes..."
                />
                <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase ${itemScore.bgLight}`}>
                  {itemScore.percentage}% {itemScore.label}
                </span>
                <button 
                  type="button"
                  onClick={() => handleDeleteTest(test.id)}
                  title="Hapus parameter tes ini"
                  className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2 items-center">
                <div>
                  <label className="text-[7.5px] font-black text-slate-400 uppercase block mb-0.5">Skor Atlet</label>
                  <input 
                    type="number"
                    step="0.01"
                    value={test.score}
                    onChange={e => handleUpdateTest(test.id, 'score', Number(e.target.value))}
                    className={`w-full p-1.5 border rounded-lg text-center font-black text-[10px] ${t.text} bg-white`}
                  />
                </div>
                <div>
                  <label className="text-[7.5px] font-black text-slate-400 uppercase block mb-0.5">Target Ideal</label>
                  <input 
                    type="number"
                    step="0.01"
                    value={test.target}
                    onChange={e => handleUpdateTest(test.id, 'target', Number(e.target.value))}
                    className="w-full p-1.5 border rounded-lg text-center font-black text-[10px] text-slate-500 bg-white"
                  />
                </div>
                <div>
                  <label className="text-[7.5px] font-black text-slate-400 uppercase block mb-0.5">Satuan</label>
                  <input 
                    value={test.unit || 'pts'}
                    onChange={e => handleUpdateTest(test.id, 'unit', e.target.value)}
                    className="w-full p-1.5 border rounded-lg text-center font-bold text-[9px] text-slate-600 bg-white uppercase"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <label className="text-[7px] font-black text-slate-400 uppercase block mb-0.5">Mode Waktu</label>
                  <label className="flex items-center gap-1 cursor-pointer bg-white px-2 py-1.5 rounded-lg border border-slate-200">
                    <input 
                      type="checkbox"
                      checked={!!test.isTime}
                      onChange={e => handleUpdateTest(test.id, 'isTime', e.target.checked)}
                      className="w-3 h-3 cursor-pointer"
                      style={{ accentColor: t.hex }}
                    />
                    <span className="text-[7.5px] font-bold text-slate-600 uppercase">Cepat (Detik)</span>
                  </label>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EvaluationPanel;