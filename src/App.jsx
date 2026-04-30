import React, { useState, useMemo, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, ReferenceLine, BarChart, Bar, Cell } from 'recharts';
import { Layout, Calendar, Trophy, Zap, Brain, Apple, Dumbbell, Activity, Target, Download, BarChart2, Timer, Wind, Globe, Save, Upload, Plus, X, Flag, PieChart as PieChartIcon, Table } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const App = () => {
  const BRANDING = "PERIODISASI OLAHRAGA by fiqhipondaa9";
  const reportRef = useRef(null);
  const fileInputRef = useRef(null);

  // State Management Makrosiklus & Terminologi
  const [startMonth, setStartMonth] = useState(0);
  const [endMonth, setEndMonth] = useState(11);
  const [peakingIndex, setPeakingIndex] = useState(5);
  const [competitionMonth, setCompetitionMonth] = useState('Okt');
  const [terminology, setTerminology] = useState('Eropa');
  const [tryOutMonths, setTryOutMonths] = useState([]);
  const [focusMonthState, setFocusMonthState] = useState('Jan');

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

  // Input Materi Latihan Dinamis
  const [materials, setMaterials] = useState([]);
  const [materialInput, setMaterialInput] = useState('');
  const [activeMaterial, setActiveMaterial] = useState('');

  // FITUR TAHAP 3: MATRIKS MESOSIKLUS MINGGUAN
  const [showMatrixModal, setShowMatrixModal] = useState(false);
  const [matrixData, setMatrixData] = useState({});

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const activeMonths = useMemo(() => months.slice(startMonth, endMonth + 1), [startMonth, endMonth]);
  const focusMonth = activeMonths.includes(focusMonthState) ? focusMonthState : activeMonths[0];

  const toggleTryOut = (month) => {
    if (month === competitionMonth) return;
    if (tryOutMonths.includes(month)) setTryOutMonths(tryOutMonths.filter(m => m !== month));
    else setTryOutMonths([...tryOutMonths, month]);
  };

  const toggleMatrixCell = (month, week, material) => {
    const key = `${month}-${week}-${material}`;
    setMatrixData(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveJSON = () => {
    const programData = {
      startMonth, endMonth, peakingIndex, competitionMonth, terminology, tryOutMonths, focusMonthState,
      mentalScores, testName, athleteScore, targetScore, isTimeBased,
      microType, activeBiomotor, selectedPhase, materials, activeMaterial, matrixData
    };
    const blob = new Blob([JSON.stringify(programData, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Program_${BRANDING.replace(/ /g, '_')}_${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLoadJSON = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if(data.startMonth !== undefined) setStartMonth(data.startMonth);
        if(data.endMonth !== undefined) setEndMonth(data.endMonth);
        if(data.peakingIndex !== undefined) setPeakingIndex(data.peakingIndex);
        if(data.competitionMonth !== undefined) setCompetitionMonth(data.competitionMonth);
        if(data.terminology !== undefined) setTerminology(data.terminology);
        if(data.tryOutMonths !== undefined) setTryOutMonths(data.tryOutMonths);
        if(data.focusMonthState !== undefined) setFocusMonthState(data.focusMonthState);
        if(data.mentalScores !== undefined) setMentalScores(data.mentalScores);
        if(data.testName !== undefined) setTestName(data.testName);
        if(data.athleteScore !== undefined) setAthleteScore(data.athleteScore);
        if(data.targetScore !== undefined) setTargetScore(data.targetScore);
        if(data.isTimeBased !== undefined) setIsTimeBased(data.isTimeBased);
        if(data.microType !== undefined) setMicroType(data.microType);
        if(data.activeBiomotor !== undefined) setActiveBiomotor(data.activeBiomotor);
        if(data.selectedPhase !== undefined) setSelectedPhase(data.selectedPhase);
        if(data.materials !== undefined) setMaterials(data.materials);
        if(data.activeMaterial !== undefined) setActiveMaterial(data.activeMaterial);
        if(data.matrixData !== undefined) setMatrixData(data.matrixData);
        alert("File Program Latihan berhasil dimuat!");
      } catch (err) {
        alert("Format file JSON tidak valid atau rusak!");
      }
    };
    reader.readAsText(file);
    event.target.value = null; 
  };

  const handleAddMaterial = () => {
    if (materialInput.trim() !== '') {
      setMaterials([...materials, materialInput]);
      setActiveMaterial(materialInput);
      setMaterialInput('');
    }
  };

  const getPhaseLabel = (month) => {
    const currIdx = months.indexOf(month);
    const compIdx = months.indexOf(competitionMonth);
    if (currIdx < compIdx) return { label: terminology === 'Eropa' ? 'Fase Persiapan' : terminology === 'Amerika Tradisional' ? 'Pre-Season' : 'Hypertrophy / Strength', color: 'bg-blue-100 text-blue-700 border-blue-200' };
    else if (currIdx === compIdx) return { label: terminology === 'Eropa' ? 'Fase Kompetisi' : terminology === 'Amerika Tradisional' ? 'In-Season' : 'Peaking', color: 'bg-red-100 text-red-700 border-red-200' };
    else return { label: terminology === 'Eropa' ? 'Fase Transisi' : terminology === 'Amerika Tradisional' ? 'Off-Season' : 'Active Rest', color: 'bg-slate-100 text-slate-600 border-slate-200' };
  };

  const chartData = useMemo(() => {
    return activeMonths.map((m, i) => {
      let baseVolume = peakingIndex * 18 - (i * 2);
      let baseIntensity = (6 - peakingIndex) * 18 + (i * 2);
      if (m === competitionMonth) { baseVolume *= 0.5; baseIntensity = Math.min(baseIntensity * 1.2, 100); }
      return { name: m, Intensitas: baseIntensity, Volume: baseVolume, phase: getPhaseLabel(m).label };
    });
  }, [activeMonths, peakingIndex, competitionMonth, terminology]);

  const getDistributionData = (month) => {
    const phaseLabel = getPhaseLabel(month).label.toLowerCase();
    if (phaseLabel.includes('persiapan') || phaseLabel.includes('pre-') || phaseLabel.includes('hypertrophy')) return [{ name: 'Fisik', val: 65, fill: '#ef4444' }, { name: 'Teknik', val: 20, fill: '#eab308' }, { name: 'Psiko', val: 15, fill: '#22c55e' }];
    else if (phaseLabel.includes('kompetisi') || phaseLabel.includes('in-season') || phaseLabel.includes('peaking')) return [{ name: 'Fisik', val: 20, fill: '#ef4444' }, { name: 'Teknik', val: 45, fill: '#eab308' }, { name: 'Psiko', val: 35, fill: '#22c55e' }];
    else return [{ name: 'Fisik', val: 30, fill: '#ef4444' }, { name: 'Teknik', val: 10, fill: '#eab308' }, { name: 'Psiko', val: 60, fill: '#22c55e' }];
  };
  const focusData = getDistributionData(focusMonth);

  const microcycleData = {
    developmental: [{ day: 'Sen', val: 65, color: '#22c55e' }, { day: 'Sel', val: 85, color: '#eab308' }, { day: 'Rab', val: 100, color: '#ef4444' }, { day: 'Kam', val: 10, color: '#94a3b8' }, { day: 'Jum', val: 85, color: '#eab308' }, { day: 'Sab', val: 100, color: '#ef4444' }, { day: 'Min', val: 10, color: '#94a3b8' }],
    shock: [{ day: 'Sen', val: 85, color: '#eab308' }, { day: 'Sel', val: 100, color: '#ef4444' }, { day: 'Rab', val: 100, color: '#ef4444' }, { day: 'Kam', val: 85, color: '#eab308' }, { day: 'Jum', val: 100, color: '#ef4444' }, { day: 'Sab', val: 85, color: '#eab308' }, { day: 'Min', val: 10, color: '#94a3b8' }],
    regeneration: [{ day: 'Sen', val: 65, color: '#22c55e' }, { day: 'Sel', val: 85, color: '#eab308' }, { day: 'Rab', val: 65, color: '#22c55e' }, { day: 'Kam', val: 85, color: '#eab308' }, { day: 'Jum', val: 65, color: '#22c55e' }, { day: 'Sab', val: 85, color: '#eab308' }, { day: 'Min', val: 10, color: '#94a3b8' }],
    peaking: [{ day: 'Sen', val: 65, color: '#22c55e' }, { day: 'Sel', val: 85, color: '#eab308' }, { day: 'Rab', val: 100, color: '#ef4444' }, { day: 'Kam', val: 85, color: '#eab308' }, { day: 'Jum', val: 65, color: '#22c55e' }, { day: 'Sab', val: 65, color: '#22c55e' }, { day: 'Min', val: 100, color: '#ef4444' }]
  };

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
    } catch (error) { alert("Terjadi kesalahan saat mencetak PDF."); } 
    finally { element.style.backgroundColor = originalBg; }
  };

  const uniquePhases = [];
  let currentPhase = null;
  activeMonths.forEach(m => {
    const phaseLabel = getPhaseLabel(m);
    if (!currentPhase || currentPhase.label !== phaseLabel.label) {
      currentPhase = { label: phaseLabel.label, color: phaseLabel.color, span: 1 };
      uniquePhases.push(currentPhase);
    } else { currentPhase.span += 1; }
  });

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-900 relative">
      
      {/* TAHAP 3: MODAL/POP-UP MATRIKS MINGGUAN */}
      {showMatrixModal && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-xl font-black text-blue-900 flex items-center gap-2"><Table className="w-6 h-6 text-blue-600"/> Matriks Distribusi Materi (Mesosiklus)</h2>
                <p className="text-xs font-bold text-slate-500 mt-1">Ceklis materi latihan untuk setiap minggu (W1-W4) per bulan.</p>
              </div>
              <button onClick={() => setShowMatrixModal(false)} className="p-2 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors"><X className="w-6 h-6"/></button>
            </div>
            <div className="p-6 overflow-auto custom-scrollbar flex-1 bg-white">
              {materials.length === 0 ? (
                <div className="text-center py-20 flex flex-col items-center">
                  <Table className="w-16 h-16 text-slate-200 mb-4" />
                  <p className="text-slate-400 font-bold text-lg">Matriks Kosong</p>
                  <p className="text-slate-400 text-sm">Silahkan tambahkan Materi Pelatihan Spesifik terlebih dahulu di menu utama.</p>
                  <button onClick={() => setShowMatrixModal(false)} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-700">Tutup & Tambah Materi</button>
                </div>
              ) : (
                <div className="rounded-xl overflow-hidden border border-slate-200">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="p-3 border border-slate-200 bg-slate-100 min-w-[200px] sticky left-0 z-10 text-xs font-black text-slate-700 uppercase">Materi Latihan</th>
                        {activeMonths.map(m => (
                          <th key={m} colSpan={4} className="p-2 border border-slate-200 bg-blue-50 text-center text-[10px] font-black text-blue-900 uppercase tracking-widest">{m}</th>
                        ))}
                      </tr>
                      <tr>
                        <th className="p-2 border border-slate-200 bg-slate-50 sticky left-0 z-10"></th>
                        {activeMonths.map(m => (
                          <React.Fragment key={`week-${m}`}>
                            {[1,2,3,4].map(w => <th key={`${m}-w${w}`} className="p-1.5 border border-slate-200 bg-slate-50 text-center text-[9px] font-bold text-slate-500">W{w}</th>)}
                          </React.Fragment>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {materials.map(mat => (
                        <tr key={mat} className="hover:bg-blue-50/50 transition-colors">
                          <td className="p-2 border border-slate-200 bg-white sticky left-0 z-10 text-[11px] font-bold text-slate-700">{mat}</td>
                          {activeMonths.map(m => (
                            <React.Fragment key={`cell-${m}-${mat}`}>
                              {[1,2,3,4].map(w => {
                                const key = `${m}-W${w}-${mat}`;
                                return (
                                  <td key={key} className="p-1 border border-slate-200 text-center">
                                    <input type="checkbox" checked={!!matrixData[key]} onChange={() => toggleMatrixCell(m, `W${w}`, mat)} className="w-3.5 h-3.5 accent-blue-600 cursor-pointer" />
                                  </td>
                                )
                              })}
                            </React.Fragment>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
               <button onClick={() => setShowMatrixModal(false)} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold shadow-md hover:bg-blue-700">Selesai</button>
            </div>
          </div>
        </div>
      )}

      {/* HEADER KONTROL JSON & PDF */}
      <div className="max-w-[1200px] mx-auto flex flex-wrap justify-end gap-3 mb-4">
        <input type="file" accept=".json" ref={fileInputRef} className="hidden" onChange={handleLoadJSON} />
        <button onClick={() => fileInputRef.current.click()} className="bg-white text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-sm hover:bg-slate-50 transition-all"><Upload className="w-4 h-4 text-blue-600" /> Buka Data (.json)</button>
        <button onClick={handleSaveJSON} className="bg-white text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-sm hover:bg-slate-50 transition-all"><Save className="w-4 h-4 text-green-600" /> Simpan Data</button>
        <button onClick={handleExportPDF} className="bg-slate-900 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg hover:bg-slate-800 transition-all"><Download className="w-5 h-5" /> Cetak Laporan</button>
      </div>

      <div ref={reportRef} className="max-w-[1200px] mx-auto p-4 bg-slate-50">
        
        <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-blue-900 uppercase">{BRANDING}</h1>
            <p className="text-slate-500 font-medium">Sistem Periodisasi Tudor Bompa Terintegrasi</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="bg-indigo-50 px-2 py-2 rounded-xl flex items-center gap-1 border border-indigo-100">
              <Globe className="text-indigo-600 w-4 h-4" />
              <select value={terminology} onChange={(e) => setTerminology(e.target.value)} className="bg-transparent text-[10px] font-bold text-indigo-900 outline-none cursor-pointer uppercase">
                <option value="Eropa">Eropa</option><option value="Amerika Tradisional">AS (Pre/In/Off)</option><option value="Amerika Strength & Power">AS (Power)</option>
              </select>
            </div>
            <div className="bg-blue-50 px-2 py-2 rounded-xl flex items-center gap-1 border border-blue-100">
              <Calendar className="text-blue-600 w-4 h-4" />
              <select value={startMonth} onChange={(e) => setStartMonth(Number(e.target.value))} className="bg-transparent font-bold text-[11px] text-blue-900 outline-none cursor-pointer">
                {months.map((m, i) => <option key={`start-${i}`} value={i}>{m}</option>)}
              </select>
              <span className="text-blue-900 font-bold">-</span>
              <select value={endMonth} onChange={(e) => setEndMonth(Number(e.target.value))} className="bg-transparent font-bold text-[11px] text-blue-900 outline-none cursor-pointer">
                {months.map((m, i) => <option key={`end-${i}`} value={i} disabled={i < startMonth}>{m}</option>)}
              </select>
            </div>
            <div className="bg-purple-50 px-3 py-2 rounded-xl flex items-center gap-2 border border-purple-100 relative group cursor-pointer z-40">
              <Flag className="text-purple-600 w-4 h-4" />
              <span className="text-[11px] font-bold text-purple-900">Try Out {tryOutMonths.length > 0 ? `(${tryOutMonths.length})` : ''}</span>
              <div className="absolute top-full left-0 mt-2 bg-white shadow-xl rounded-xl border border-slate-100 p-3 hidden group-hover:flex flex-wrap gap-1.5 w-56">
                <p className="w-full text-[9px] text-slate-400 font-bold mb-1 uppercase tracking-wider">Pilih Bulan Try Out</p>
                {activeMonths.map(m => (
                  <button key={`to-${m}`} onClick={() => toggleTryOut(m)} disabled={m === competitionMonth} className={`px-2 py-1.5 text-[10px] rounded-lg font-bold transition-all ${m === competitionMonth ? 'opacity-30 cursor-not-allowed bg-slate-100 text-slate-400' : tryOutMonths.includes(m) ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-50 text-slate-500 hover:bg-slate-200 border border-slate-100'}`}>{m}</button>
                ))}
              </div>
            </div>
            <div className="bg-red-50 px-3 py-2 rounded-xl flex items-center gap-2 border border-red-100">
              <Target className="text-red-600 w-4 h-4" />
              <select value={competitionMonth} onChange={(e) => { setCompetitionMonth(e.target.value); if (tryOutMonths.includes(e.target.value)) setTryOutMonths(tryOutMonths.filter(m => m !== e.target.value)); }} className="bg-transparent font-bold text-[11px] text-red-900 outline-none cursor-pointer">
                {activeMonths.map(m => <option key={`comp-${m}`} value={m}>Tanding: {m}</option>)}
              </select>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-200 relative z-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="flex items-center gap-2 font-bold text-lg"><Zap className="w-5 h-5 text-orange-500" /> Makrosiklus & Tapering</h2>
              <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-500 uppercase">Peaking Index</span>
                <input type="range" min="1" max="5" value={peakingIndex} onChange={(e) => setPeakingIndex(e.target.value)} className="accent-orange-500 w-20" />
                <span className="font-black text-orange-600">{peakingIndex}</span>
              </div>
            </div>
            <div className="flex w-full mb-4 gap-1 h-6">
              {uniquePhases.map((phase, idx) => (
                <div key={idx} className={`flex items-center justify-center rounded border text-[9px] font-black uppercase tracking-widest overflow-hidden whitespace-nowrap px-1 ${phase.color}`} style={{ flex: phase.span }}>{phase.label}</div>
              ))}
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 15, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} />
                  <YAxis hide />
                  <RechartsTooltip contentStyle={{borderRadius: '12px'}} labelStyle={{fontWeight:'bold'}} />
                  <Legend iconType="circle" />
                  {tryOutMonths.map(m => activeMonths.includes(m) && <ReferenceLine key={`ref-${m}`} x={m} stroke="#9333ea" strokeDasharray="4 4" label={{ position: 'insideTopLeft', value: 'TRY OUT', fill: '#9333ea', fontSize: 9, fontWeight: 'bold' }} />)}
                  {activeMonths.includes(competitionMonth) && <ReferenceLine x={competitionMonth} stroke="#ef4444" strokeDasharray="5 5" label={{ position: 'top', value: 'TAPERING', fill: '#ef4444', fontSize: 9, fontWeight: 'bold' }} />}
                  <Line type="monotone" name="Intensitas" dataKey="Intensitas" stroke="#ef4444" strokeWidth={4} activeDot={{ r: 8 }} />
                  <Line type="monotone" name="Volume" dataKey="Volume" stroke="#3b82f6" strokeWidth={4} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col h-full relative z-0">
            <h2 className="font-bold text-lg text-slate-800 mb-4">Manajemen Biomotorik</h2>
            <div className="flex bg-slate-100 p-1 rounded-xl mb-4">
              {[{ id: 'Strength', icon: <Dumbbell className="w-4 h-4" /> }, { id: 'Endurance', icon: <Timer className="w-4 h-4" /> }, { id: 'Speed', icon: <Wind className="w-4 h-4" /> }].map(tab => (
                <button key={tab.id} onClick={() => setActiveBiomotor(tab.id)} className={`flex-1 flex items-center justify-center py-2 rounded-lg transition-all ${activeBiomotor === tab.id ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>{tab.icon}</button>
              ))}
            </div>
            <div className="space-y-2 flex-1 overflow-y-auto pr-1 custom-scrollbar max-h-[260px]">
              {biomotorData[activeBiomotor].map((phase) => (
                <button key={phase.id} onClick={() => setSelectedPhase(prev => ({ ...prev, [activeBiomotor]: phase.id }))} className={`w-full p-3 rounded-2xl border-2 transition-all text-left flex flex-col gap-1 ${selectedPhase[activeBiomotor] === phase.id ? 'border-blue-500 bg-blue-50' : 'border-slate-50 bg-slate-50 hover:border-slate-200'}`}>
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

          <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
              <h2 className="flex items-center gap-2 font-bold text-lg text-blue-900"><BarChart2 className="w-5 h-5" /> Dinamika Siklus Mikro</h2>
              <div className="flex gap-2 bg-slate-50 p-1 rounded-xl border border-slate-200 overflow-x-auto custom-scrollbar">
                {[{ id: 'developmental', label: 'Developmental' }, { id: 'shock', label: 'Shock (Goncangan)' }, { id: 'regeneration', label: 'Regenerasi' }, { id: 'peaking', label: 'Peaking/Unload' }].map((type) => (
                  <button key={type.id} onClick={() => setMicroType(type.id)} className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-lg whitespace-nowrap transition-all ${microType === type.id ? 'bg-blue-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}>{type.label}</button>
                ))}
              </div>
            </div>
            <div className="flex-1 h-36 w-full mb-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={microcycleData[microType]} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
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
            <div className="border-t border-slate-100 pt-4 mt-auto">
              {/* TOMBOL TAHAP 3: BUKA MATRIKS ADA DI SINI */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700">Materi Pelatihan Spesifik</span>
                <div className="flex gap-3 items-center">
                  <button onClick={() => setShowMatrixModal(true)} className="text-[11px] font-black text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg border border-blue-100"><Table className="w-3 h-3"/> Buka Matriks Mingguan</button>
                  {materials.length > 0 && <button onClick={() => {if(window.confirm('Hapus semua materi?')) clearMaterials()}} className="text-[10px] font-bold text-red-500 hover:text-red-700 transition-colors">Hapus Semua</button>}
                </div>
              </div>
              <div className="flex gap-2">
                <input type="text" value={materialInput} onChange={(e) => setMaterialInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleAddMaterial()} placeholder="Ketik materi (misal: Sprint 20m, Fartlek)..." className="flex-1 p-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-all" />
                <button onClick={handleAddMaterial} className="bg-blue-600 hover:bg-blue-700 text-white px-4 rounded-xl flex items-center justify-center transition-all"><Plus className="w-5 h-5" /></button>
              </div>
              {materials.length > 0 && (
                <div className="mt-3">
                  <select value={activeMaterial} onChange={(e) => setActiveMaterial(e.target.value)} className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold text-blue-900 outline-none shadow-sm cursor-pointer">
                    <option value="" disabled>-- Pilih Materi Aktif Hari Ini --</option>
                    {materials.map((m, idx) => <option key={idx} value={m}>{m}</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col h-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="flex items-center gap-2 font-bold text-[15px] text-slate-800"><PieChartIcon className="w-4 h-4 text-indigo-500" /> Distribusi Fokus</h2>
              <select value={focusMonthState} onChange={(e) => setFocusMonthState(e.target.value)} className="bg-slate-50 border border-slate-200 text-[10px] text-slate-700 font-bold rounded-lg px-2 py-1 outline-none cursor-pointer">
                {activeMonths.map(m => <option key={`focus-${m}`} value={m}>{m}</option>)}
              </select>
            </div>
            <div className="flex-1 h-36 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={focusData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 11, fontWeight: 'bold'}} />
                  <YAxis hide domain={[0, 100]} />
                  <RechartsTooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                  <Bar dataKey="val" radius={[4, 4, 0, 0]} barSize={35}>
                    {focusData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 text-center bg-indigo-50 py-2 rounded-xl text-[9px] font-black text-indigo-800 uppercase tracking-widest border border-indigo-100">
              Proporsi: {getPhaseLabel(focusMonth).label}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col justify-between">
            <div>
              <h2 className="flex items-center gap-2 font-bold text-lg mb-4"><Trophy className="w-5 h-5 text-yellow-500" /> Evaluasi Fisik</h2>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <input type="text" value={testName} onChange={(e) => setTestName(e.target.value)} className="col-span-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-center" placeholder="Nama Tes..." />
                <input type="number" value={athleteScore} onChange={(e) => setAthleteScore(Number(e.target.value))} className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-center text-blue-600" placeholder="Skor" />
                <input type="number" value={targetScore} onChange={(e) => setTargetScore(Number(e.target.value))} className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-center text-slate-500" placeholder="Target" />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <input type="checkbox" checked={isTimeBased} onChange={(e) => setIsTimeBased(e.target.checked)} className="accent-indigo-600" />
                <label className="text-[10px] font-bold text-slate-500">Tes Waktu (makin kecil baik)</label>
              </div>
            </div>
            <div className={`p-3 rounded-2xl border flex flex-col items-center justify-center ${currentResult.barColor.replace('bg-', 'bg-').replace('500', '50')} ${currentResult.barColor.replace('bg-', 'border-').replace('500', '200')}`}>
              <span className={`text-xl font-black ${currentResult.color}`}>{currentResult.percentage}%</span>
              <span className={`text-[9px] font-bold uppercase ${currentResult.color}`}>{currentResult.label}</span>
            </div>
          </div>

          <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="flex items-center gap-2 font-bold text-lg mb-4 text-purple-900"><Brain className="w-5 h-5" /> Asesmen Mental (Skala 1-9)</h2>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
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