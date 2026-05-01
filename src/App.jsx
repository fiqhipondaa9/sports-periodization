import React, { useState, useMemo, useRef, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar, Cell } from 'recharts';
import { Trophy, Zap, Brain, Apple, Dumbbell, Activity, Target, Download, BarChart2, Globe, Save, Upload, Plus, X, Flag, PieChart as PieChartIcon, Table, FileSpreadsheet, Image as ImageIcon, ClipboardList, AlertTriangle, Palette, Calendar } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

// 9 COLOR MODES (THEMES)
const THEMES = {
  blue: { id: 'blue', name: 'Blue', hex: '#3b82f6', bg: 'bg-blue-600', text: 'text-blue-600', textDark: 'text-blue-900', bgLight: 'bg-blue-50', borderLight: 'border-blue-100', hoverBg: 'hover:bg-blue-700', hoverLight: 'hover:bg-blue-50' },
  emerald: { id: 'emerald', name: 'Emerald', hex: '#10b981', bg: 'bg-emerald-600', text: 'text-emerald-600', textDark: 'text-emerald-900', bgLight: 'bg-emerald-50', borderLight: 'border-emerald-100', hoverBg: 'hover:bg-emerald-700', hoverLight: 'hover:bg-emerald-50' },
  purple: { id: 'purple', name: 'Purple', hex: '#a855f7', bg: 'bg-purple-600', text: 'text-purple-600', textDark: 'text-purple-900', bgLight: 'bg-purple-50', borderLight: 'border-purple-100', hoverBg: 'hover:bg-purple-700', hoverLight: 'hover:bg-purple-50' },
  rose: { id: 'rose', name: 'Rose', hex: '#f43f5e', bg: 'bg-rose-600', text: 'text-rose-600', textDark: 'text-rose-900', bgLight: 'bg-rose-50', borderLight: 'border-rose-100', hoverBg: 'hover:bg-rose-700', hoverLight: 'hover:bg-rose-50' },
  orange: { id: 'orange', name: 'Orange', hex: '#f97316', bg: 'bg-orange-600', text: 'text-orange-600', textDark: 'text-orange-900', bgLight: 'bg-orange-50', borderLight: 'border-orange-100', hoverBg: 'hover:bg-orange-700', hoverLight: 'hover:bg-orange-50' },
  teal: { id: 'teal', name: 'Teal', hex: '#14b8a6', bg: 'bg-teal-600', text: 'text-teal-600', textDark: 'text-teal-900', bgLight: 'bg-teal-50', borderLight: 'border-teal-100', hoverBg: 'hover:bg-teal-700', hoverLight: 'hover:bg-teal-50' },
  indigo: { id: 'indigo', name: 'Indigo', hex: '#6366f1', bg: 'bg-indigo-600', text: 'text-indigo-600', textDark: 'text-indigo-900', bgLight: 'bg-indigo-50', borderLight: 'border-indigo-100', hoverBg: 'hover:bg-indigo-700', hoverLight: 'hover:bg-indigo-50' },
  cyan: { id: 'cyan', name: 'Cyan', hex: '#06b6d4', bg: 'bg-cyan-600', text: 'text-cyan-600', textDark: 'text-cyan-900', bgLight: 'bg-cyan-50', borderLight: 'border-cyan-100', hoverBg: 'hover:bg-cyan-700', hoverLight: 'hover:bg-cyan-50' },
  zinc: { id: 'zinc', name: 'Zinc', hex: '#52525b', bg: 'bg-zinc-600', text: 'text-zinc-600', textDark: 'text-zinc-900', bgLight: 'bg-zinc-50', borderLight: 'border-zinc-100', hoverBg: 'hover:bg-zinc-700', hoverLight: 'hover:bg-zinc-50' }
};

const biomotorData = {
  Strength: [
    { id: 'Adaptasi Anatomi', param: '40-60% 1RM | 12-20 Reps | 2-4 Set', rest: 'Rest: 30-120 Detik', desc: 'Modifikasi ketebalan jaringan ikat & fungsi ligamen.' },
    { id: 'Hipertrofi', param: '60-80% 1RM | 6-12 Reps | 3-6 Set', rest: 'Rest: 1-2 Menit', desc: 'Pembesaran diameter otot kontraktil (sarkoplasma).' },
    { id: 'Kekuatan Maksimum (MxS)', param: '70-100% 1RM | 1-6 Reps | 2-8 Set', rest: 'Rest: 3-5+ Menit', desc: 'Eksitasi impuls neuromuskuler & firing rate neuron.' },
    { id: 'Konversi (Power)', param: '30-80% 1RM | 8-15 Reps Balistik | 2-5 Set', rest: 'Rest: 3-4 Menit', desc: 'Optimalisasi laju percepatan gaya (RFD).' },
    { id: 'Konversi (Endurance)', param: '30-60% 1RM | 15-30+ Reps | 2-5 Set', rest: 'Rest: 0.5-2 Menit', desc: 'Ketahanan toleransi cairan asam laktat darah.' },
    { id: 'Pemeliharaan', param: '1-4x Sesi/Minggu | Beban Spesifik', rest: 'Rest: Relatif', desc: 'Mencegah detraining selama musim kompetisi.' },
    { id: 'Cessation', param: 'Hentikan Beban 5-7 Hari', rest: 'Rest: Total', desc: 'Fasilitasi superkompensasi puncak sebelum perlombaan.' }
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

const microTypesDesc = {
  'Developmental': 'Fokus: Peningkatan adaptasi fungsional, keterampilan, & kualitas biomotor.',
  'Shock': 'Fokus: Kelebihan beban terencana (planned overreaching) untuk efek tertunda.',
  'Regeneration': 'Fokus: Pemulihan aktif, meredakan ketegangan saraf & membuang laktat.',
  'Peaking / Unloading': 'Fokus: Pembongkaran beban (Tapering) menuju superkompensasi puncak.'
};

const App = () => {
  const BRANDING = "ANNUAL TRAINING PLAN SYSTEM by fiqhipondaa9";
  const reportRef = useRef(null);
  const fileInputRef = useRef(null);

  const [activeTheme, setActiveTheme] = useState('blue');
  const t = THEMES[activeTheme];

  const [athleteInfo, setAthleteInfo] = useState({ name: 'KOTA PALU', target: 'JUARA UMUM', class: 'SEMUA CABOR', age: 'Senior (>18 Tahun)', coach: 'fiqhipondaa9' });
  const [startMonth, setStartMonth] = useState(0); 
  const [endMonth, setEndMonth] = useState(11); 
  const [terminology, setTerminology] = useState('Eropa');
  
  const [competitionMonth, setCompetitionMonth] = useState('Nov');
  const [secondaryPeaks, setSecondaryPeaks] = useState([]);
  
  const [macroValues, setMacroValues] = useState(months.reduce((acc, m) => ({ ...acc, [m]: { vol: 70, int: 30, peak: 3 } }), {}));
  const [nutritionNote, setNutritionNote] = useState('Input catatan gizi, suplemen, atau berat badan di sini.');
  const [tryOutMonths, setTryOutMonths] = useState([]);
  const [locations, setLocations] = useState({});
  const [materials, setMaterials] = useState(['Latihan Fisik Umum', 'Teknik Dasar', 'Simulasi Pertandingan']);
  const [materialInput, setMaterialInput] = useState('');
  const [matrixData, setMatrixData] = useState({});
  
  const [microType, setMicroType] = useState('Developmental');
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Sen');
  const [dailySessions, setDailySessions] = useState(['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].reduce((acc, d) => ({ ...acc, [d]: { morning: { menu: '', int: 5 }, afternoon: { menu: '', int: 5 } } }), {}));
  
  const [mentalData, setMentalData] = useState([
    { id: 'm1', label: 'Keberanian', score: 8 }, { id: 'm2', label: 'Fokus', score: 8 }, { id: 'm3', label: 'Motivasi', score: 8 },
    { id: 'm4', label: 'Emosi', score: 8 }, { id: 'm5', label: 'Resiliensi', score: 8 }, { id: 'm6', label: 'Disiplin', score: 8 },
    { id: 'm7', label: 'Self-Talk', score: 8 }, { id: 'm8', label: 'Anxiety', score: 8 }, { id: 'm9', label: 'Social', score: 8 }
  ]);
  const [evaluation, setEvaluation] = useState({ name: 'Uji 1RM / VO2 Max', score: 50, target: 100, isTime: false });
  const [activeBiomotor, setActiveBiomotor] = useState('Strength');

  const activeMonths = useMemo(() => months.slice(startMonth, endMonth + 1), [startMonth, endMonth]);

  const handleCompMonthChange = (e) => {
    const newMonth = e.target.value;
    setCompetitionMonth(newMonth);
    if (secondaryPeaks.includes(newMonth)) setSecondaryPeaks(prev => prev.filter(x => x !== newMonth));
  };

  useEffect(() => {
    if (!activeMonths.includes(competitionMonth)) setCompetitionMonth(activeMonths[activeMonths.length - 1]);
  }, [activeMonths, competitionMonth]);

  const getPhase = (m) => {
    if (m === competitionMonth || secondaryPeaks.includes(m)) {
      return { label: terminology === 'Eropa' ? 'KOMPETISI UTAMA' : 'IN-SEASON', color: 'bg-red-600 text-white' };
    }
    const currIdx = months.indexOf(m);
    const compIdx1 = months.indexOf(competitionMonth);
    const maxSec = secondaryPeaks.length > 0 ? Math.max(...secondaryPeaks.map(x => months.indexOf(x))) : -1;
    const lastCompIdx = Math.max(compIdx1, maxSec);

    // Memisahkan Persiapan Umum & Khusus/Pra-Kompetisi secara dinamis
    if (currIdx < lastCompIdx) {
       const midPoint = Math.floor(lastCompIdx / 2);
       if (currIdx < midPoint) return { label: terminology === 'Eropa' ? 'PERSIAPAN UMUM' : 'OFF-SEASON', color: `${t.bg} text-white` };
       return { label: terminology === 'Eropa' ? 'PERSIAPAN KHUSUS' : 'PRE-SEASON', color: `${t.bgLight} ${t.textDark} border border-${t.text}` };
    }
    return { label: 'TRANSISI', color: 'bg-slate-400 text-white' };
  };

  const unifiedPhases = useMemo(() => {
    const phases = [];
    let current = null;
    activeMonths.forEach(m => {
      const p = getPhase(m);
      if (!current || current.label !== p.label) { current = { ...p, span: 1 }; phases.push(current); } 
      else { current.span += 1; }
    });
    return phases;
  }, [activeMonths, terminology, competitionMonth, secondaryPeaks, activeTheme]);

  const chartData = useMemo(() => activeMonths.map(m => ({ name: m, Intensitas: macroValues[m]?.int || 0, Volume: macroValues[m]?.vol || 0 })), [activeMonths, macroValues]);

  const calculateScore = () => {
    if (!evaluation.score || !evaluation.target) return { percentage: 0, label: "-", color: "text-slate-400", barColor: "bg-slate-200" };
    let p = evaluation.isTime ? (evaluation.target / evaluation.score) * 100 : (evaluation.score / evaluation.target) * 100;
    const r = Math.min(Math.round(p), 100);
    if (r >= 90) return { percentage: r, label: "EXCELLENT", color: "text-green-600", barColor: "bg-green-500" };
    if (r >= 75) return { percentage: r, label: "GOOD", color: t.text, barColor: t.bg };
    return { percentage: r, label: "POOR", color: "text-red-600", barColor: "bg-red-500" };
  };

  const handleAddMaterial = () => {
    const cleanInput = materialInput.trim();
    if (cleanInput === '') return;
    if (materials.includes(cleanInput)) return alert(`Materi "${cleanInput}" sudah ada!`);
    setMaterials([...materials, cleanInput]);
    setMaterialInput('');
  };

  const handleLoadData = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target.result);
        if(d.activeTheme && THEMES[d.activeTheme]) setActiveTheme(d.activeTheme);
        if(d.athleteInfo) setAthleteInfo(d.athleteInfo);
        if(d.startMonth !== undefined) setStartMonth(d.startMonth);
        if(d.endMonth !== undefined) setEndMonth(d.endMonth);
        if(d.competitionMonth) setCompetitionMonth(d.competitionMonth);
        if(d.secondaryPeaks) setSecondaryPeaks(d.secondaryPeaks);
        else if (d.secondaryCompetition) setSecondaryPeaks([d.secondaryCompetition]);
        if(d.terminology) setTerminology(d.terminology);
        if(d.macroValues) setMacroValues(d.macroValues);
        if(d.dailySessions) setDailySessions(d.dailySessions);
        if(d.matrixData) setMatrixData(d.matrixData);
        if(d.materials) setMaterials(d.materials);
        if(d.locations) setLocations(d.locations);
        if(d.tryOutMonths) setTryOutMonths(d.tryOutMonths);
        if(d.nutritionNote) setNutritionNote(d.nutritionNote);
        if(d.microType) setMicroType(d.microType);
        if(d.evaluation) setEvaluation(d.evaluation);
        if(d.mentalData) { setMentalData(d.mentalData); } 
        else if (d.mentalScores && d.mentalLabels) {
          const migratedData = d.mentalLabels.map((lbl, i) => ({ id: `m${i}`, label: lbl, score: d.mentalScores[lbl] || 0 }));
          setMentalData(migratedData);
        }
        alert("Semua data berhasil dimuat dengan aman!");
      } catch (err) { alert("Format file salah!"); }
    };
    reader.readAsText(file); e.target.value = null;
  };

  const handleSaveData = () => {
    const data = { activeTheme, athleteInfo, startMonth, endMonth, competitionMonth, secondaryPeaks, terminology, macroValues, locations, tryOutMonths, dailySessions, matrixData, materials, mentalData, nutritionNote, evaluation, microType };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `Plan_${athleteInfo.name}.json`; a.click();
  };

  const handleExportPNG = async () => {
    const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
    const link = document.createElement('a'); link.href = canvas.toDataURL('image/png');
    link.download = `Plan_${athleteInfo.name}.png`; link.click();
  };

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();
    const macroSheet = chartData.map(d => ({ Bulan: d.name, Volume: `${d.Volume}%`, Intensitas: `${d.Intensitas}%`, Fase: getPhase(d.name).label }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(macroSheet), "Makrosiklus");
    XLSX.writeFile(wb, `Plan_${athleteInfo.name}.xlsx`);
  };

  const printStyles = { WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' };

  return (
    <div className="min-h-screen bg-slate-100 p-6 font-sans text-slate-900 text-[11px]" style={printStyles}>
      
      {/* MODAL DAILY */}
      {showDailyModal && (
        <div className="fixed inset-0 z-[120] bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border">
            <div className="p-4 bg-slate-900 text-white font-black uppercase flex justify-between"><span>SESI HARIAN: {selectedDay}</span><X className="cursor-pointer" onClick={() => setShowDailyModal(false)}/></div>
            <div className="p-6 space-y-4">
              {['morning', 'afternoon'].map(session => (
                <div key={session}>
                  <label className="font-black text-[9px] text-slate-400 uppercase mb-1 block">{session === 'morning' ? 'Sesi Pagi' : 'Sesi Sore'}</label>
                  <textarea value={dailySessions[selectedDay][session].menu} onChange={e => setDailySessions({...dailySessions, [selectedDay]: {...dailySessions[selectedDay], [session]: {...dailySessions[selectedDay][session], menu: e.target.value}}})} className="w-full border p-2 rounded-xl h-16 outline-none text-[10px] focus:ring-1 focus:ring-opacity-50" style={{ '--tw-ring-color': t.hex }} placeholder="Ketik menu..." />
                </div>
              ))}
            </div>
            <div className="p-4 flex justify-center"><button onClick={() => setShowDailyModal(false)} className={`text-white px-8 py-2 rounded-xl font-black ${t.bg} ${t.hoverBg}`}>SIMPAN</button></div>
          </div>
        </div>
      )}

      {/* TOOLBAR */}
      <div className="max-w-[1200px] mx-auto flex flex-wrap justify-between items-center gap-2 mb-4 no-print">
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border shadow-sm">
          <Palette className="w-4 h-4 text-slate-400" />
          <div className="h-4 w-px bg-slate-200 mx-1"></div>
          {Object.entries(THEMES).map(([key, theme]) => (
            <button key={key} onClick={() => setActiveTheme(key)} className={`w-4 h-4 rounded-full border-2 transition-all ${activeTheme === key ? 'border-slate-900 scale-125' : 'border-transparent hover:scale-110'}`} style={{ backgroundColor: theme.hex }} title={theme.name} />
          ))}
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleLoadData} />
          <button onClick={() => fileInputRef.current.click()} className={`bg-white border px-4 py-2 rounded-xl flex items-center gap-2 font-black shadow-sm transition-all uppercase ${t.text} ${t.hoverLight}`}><Upload className="w-3 h-3"/> Buka</button>
          <button onClick={handleSaveData} className="bg-white border px-4 py-2 rounded-xl flex items-center gap-2 font-black shadow-sm hover:bg-green-50 transition-all uppercase text-green-600"><Save className="w-3 h-3"/> Simpan</button>
          <button onClick={handleExportPNG} className={`text-white px-4 py-2 rounded-xl flex items-center gap-2 font-black shadow-md transition-all uppercase ${t.bg} ${t.hoverBg}`}><ImageIcon className="w-3 h-3"/> PNG</button>
          <button onClick={handleExportExcel} className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-black shadow-md hover:bg-emerald-700 transition-all uppercase"><FileSpreadsheet className="w-3 h-3"/> Excel</button>
          <button onClick={() => window.print()} className="bg-slate-900 text-white px-5 py-2 rounded-xl flex items-center gap-2 font-black shadow-md hover:bg-slate-800 transition-all uppercase"><Download className="w-3 h-3"/> PDF</button>
        </div>
      </div>

      <div ref={reportRef} className="max-w-[1200px] mx-auto p-10 bg-white rounded-3xl border shadow-lg relative overflow-hidden" style={printStyles}>
        
        {/* HEADER PROFIL */}
        <div className="grid grid-cols-3 gap-8 mb-10 border-b pb-8 items-center">
          <div className="space-y-4">
            <div>
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">NAMA TIM / ATLET</label>
              <input value={athleteInfo.name} onChange={e => setAthleteInfo({...athleteInfo, name: e.target.value})} className={`w-full text-2xl font-black outline-none uppercase bg-transparent ${t.textDark}`} />
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Kategori Usia</label>
                <select value={athleteInfo.age} onChange={e => setAthleteInfo({...athleteInfo, age: e.target.value})} className="w-full text-xs font-bold text-slate-600 outline-none uppercase bg-transparent border-b pb-1 border-slate-200 cursor-pointer">
                  <option value="U13 (<14 Tahun)">U13 (&lt;14 Tahun)</option>
                  <option value="U15-U16 (14-16 Tahun)">U15-U16 (14-16 Tahun)</option>
                  <option value="Senior (>18 Tahun)">Senior (&gt;18 Tahun)</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Target Utama</label>
                <input value={athleteInfo.target} onChange={e => setAthleteInfo({...athleteInfo, target: e.target.value})} className="w-full text-xs font-bold text-slate-600 outline-none uppercase bg-transparent border-b pb-1 border-slate-200" />
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-xl font-black text-slate-900 italic text-center leading-tight uppercase tracking-tighter">ANNUAL TRAINING PLAN<br/><span className={`text-sm ${t.text}`}>by fiqhipondaa9</span></h1>
          </div>
          <div className="text-right space-y-4">
            <div>
              <label className="text-[8px] font-black text-slate-400 uppercase">COACH / ADMINISTRATOR</label>
              <input value={athleteInfo.coach} onChange={e => setAthleteInfo({...athleteInfo, coach: e.target.value})} className={`block text-xs font-black text-right outline-none uppercase w-full bg-transparent ${t.text}`} />
            </div>
            <div className={`flex justify-end gap-3 font-black ${t.textDark}`}>
              <select value={startMonth} onChange={e => setStartMonth(Number(e.target.value))} className="bg-transparent outline-none uppercase cursor-pointer">{months.map((m, i) => <option key={i} value={i}>{m}</option>)}</select>
              <span>-</span>
              <select value={endMonth} onChange={e => setEndMonth(Number(e.target.value))} className="bg-transparent outline-none uppercase cursor-pointer">{months.map((m, i) => <option key={i} value={i} disabled={i < startMonth}>{m}</option>)}</select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-8">
          {/* MAKROSIKLUS (COLS 1-3) */}
          <div className="col-span-3 space-y-8">
            <div className="border p-8 rounded-3xl bg-white shadow-sm relative border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-black uppercase flex items-center gap-2 tracking-tighter text-sm"><Zap className="text-orange-500 w-5 h-5"/> Grafik Beban Makrosiklus</h2>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1"><div className="w-3 h-1 bg-red-500 rounded-full"/><span className="text-[8px] font-black text-slate-400 uppercase">Intensitas</span></div>
                  <div className="flex items-center gap-1"><div className="w-3 h-1 rounded-full" style={{backgroundColor: t.hex}}/><span className="text-[8px] font-black text-slate-400 uppercase">Volume</span></div>
                </div>
              </div>
              
              <div className="flex w-full mb-4 gap-1 h-7">
                {unifiedPhases.map((p, idx) => (
                  <div key={idx} className={`flex items-center justify-center rounded-lg font-black text-[9px] uppercase shadow-sm border border-white/20 ${p.color}`} style={{ flex: p.span }}>{p.label}</div>
                ))}
              </div>

              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ left: 20, right: 20, top: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                    <XAxis dataKey="name" interval={0} tick={{fontSize: 10, fontWeight: 'bold', fill: '#94a3b8'}} axisLine={false} tickLine={false}/>
                    <YAxis hide domain={[0, 100]}/>
                    <RechartsTooltip/>
                    {tryOutMonths.map(m => activeMonths.includes(m) && <ReferenceLine key={m} x={m} stroke="#9333ea" strokeDasharray="4 4" label={{ position: 'insideTopLeft', value: locations[m] || 'TO', fill: '#9333ea', fontSize: 8, fontWeight: 'bold' }} />)}
                    
                    <ReferenceLine x={competitionMonth} stroke="#ef4444" strokeDasharray="5 5" label={{ position: 'insideTopRight', value: 'TARGET UTAMA', fill: '#ef4444', fontSize: 9, fontWeight: 'bold' }} />
                    
                    {secondaryPeaks.map(sp => (
                      activeMonths.includes(sp) && sp !== competitionMonth && (
                        <ReferenceLine key={`sp-${sp}`} x={sp} stroke="#eab308" strokeDasharray="5 5" label={{ position: 'insideTopLeft', value: 'TARGET ANTARA', fill: '#eab308', fontSize: 9, fontWeight: 'bold' }} />
                      )
                    ))}

                    <Line type="monotone" name="Intensitas" dataKey="Intensitas" stroke="#ef4444" strokeWidth={5} dot={{r: 5, fill: '#ef4444'}} activeDot={{r: 8}}/>
                    <Line type="monotone" name="Volume" dataKey="Volume" stroke={t.hex} strokeWidth={5} dot={{r: 5, fill: t.hex}} activeDot={{r: 8}}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-10 grid grid-cols-12 gap-2">
                {activeMonths.map(m => (
                  <div key={m} className="bg-slate-50 p-2 rounded-2xl border border-slate-100 text-center space-y-1 shadow-sm">
                    <span className="font-black text-slate-400 text-[9px] uppercase block mb-1">{m}</span>
                    <input type="number" value={macroValues[m]?.int} onChange={e => setMacroValues({...macroValues, [m]: {...macroValues[m], int: Number(e.target.value)}})} className="w-full text-center font-black text-red-600 bg-white border border-red-50 rounded-lg p-1 outline-none text-[10px]" title="Intensitas %"/>
                    <input type="number" value={macroValues[m]?.vol} onChange={e => setMacroValues({...macroValues, [m]: {...macroValues[m], vol: Number(e.target.value)}})} className={`w-full text-center font-black bg-white border rounded-lg p-1 outline-none text-[10px] ${t.text} ${t.borderLight}`} title="Volume %"/>
                    <input type="number" min="1" max="5" value={macroValues[m]?.peak || 3} onChange={e => setMacroValues({...macroValues, [m]: {...macroValues[m], peak: Number(e.target.value)}})} className="w-full text-center font-black text-orange-500 bg-orange-50 border border-orange-100 rounded-lg p-1 outline-none text-[10px] mt-1" title="Peaking Index (1-5)"/>
                  </div>
                ))}
              </div>
            </div>
            
            {/* ROW 2 KIRI: BIOMOTORIK & MICROCYCLE */}
            <div className="grid grid-cols-2 gap-8">
              <div className="border p-6 rounded-3xl bg-slate-50/50 flex flex-col h-full shadow-sm">
                <h2 className="font-black uppercase tracking-tighter flex items-center gap-2 mb-4"><Dumbbell className="text-slate-600 w-4 h-4"/> Fase Biomotorik Spesifik</h2>
                
                {athleteInfo.age.includes('U13') && activeBiomotor === 'Strength' && (
                  <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-xl flex gap-2 items-start shadow-sm">
                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5"/>
                    <p className="text-[9px] font-bold text-red-700 leading-tight">PERINGATAN LTAD BOMPA: Atlet U13 dilarang keras melakukan beban mekanik (MxS/Hipertrofi). Wajib fokus pada Bodyweight dan Adaptasi Anatomi.</p>
                  </div>
                )}

                <div className="flex bg-white p-1 rounded-xl mb-4 border">
                  {['Strength', 'Endurance', 'Speed'].map(type => (
                    <button key={type} onClick={() => setActiveBiomotor(type)} className={`flex-1 py-1.5 text-[10px] font-black rounded-lg transition-all ${activeBiomotor === type ? t.bg + ' text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>{type.toUpperCase()}</button>
                  ))}
                </div>
                <div className="space-y-2 flex-1 overflow-y-auto max-h-[300px] pr-1 custom-scrollbar">
                  {biomotorData[activeBiomotor].map(p => (
                    <div key={p.id} className="p-3 rounded-2xl border-2 transition-all bg-white border-slate-100 hover:border-slate-200 cursor-pointer">
                       <p className={`text-[10px] font-black uppercase mb-1 ${t.textDark}`}>{p.id}</p>
                       <p className={`text-[9px] font-bold mb-0.5 ${t.text}`}>{p.param}</p>
                       <p className="text-[8px] font-black text-orange-500 mb-1">{p.rest}</p>
                       <p className="text-[8px] text-slate-500 italic">{p.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border p-6 rounded-3xl bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className={`font-black uppercase flex items-center gap-2 tracking-tighter ${t.textDark}`}><BarChart2 className="w-4 h-4"/> Siklus Mikro (Daily)</h2>
                  </div>
                  
                  <div className="mb-4 bg-slate-50 p-2 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] font-black uppercase text-slate-400">Tipe Minggu Latihan:</span>
                      <select value={microType} onChange={(e) => setMicroType(e.target.value)} className={`flex-1 bg-transparent text-[10px] font-black outline-none cursor-pointer uppercase ${t.text}`}>
                        {Object.keys(microTypesDesc).map(k => <option key={k} value={k}>{k}</option>)}
                      </select>
                    </div>
                    <p className="text-[8px] font-bold text-slate-500 italic">{microTypesDesc[microType]}</p>
                  </div>

                  <div className="h-32 mb-4">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={Object.entries(dailySessions).map(([day, s]) => ({day, val: (s.morning.menu ? 50 : 0) + (s.afternoon.menu ? 50 : 0)}))} onClick={d => { if(d.activeLabel) { setSelectedDay(d.activeLabel); setShowDailyModal(true); } }}>
                        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}}/>
                        <YAxis hide domain={[0, 100]}/>
                        <Bar dataKey="val" radius={[8, 8, 0, 0]} barSize={35} cursor="pointer">
                          {Object.entries(dailySessions).map(([day, s], idx) => <Cell key={idx} fill={s.morning.menu && s.afternoon.menu ? t.hex : s.morning.menu || s.afternoon.menu ? '#eab308' : '#f1f5f9'} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR (COL 4) */}
          <div className="space-y-8">
            <div className={`border p-6 rounded-3xl bg-white shadow-sm ${t.borderLight}`}>
               <h2 className={`font-black uppercase flex items-center gap-2 mb-4 ${t.text}`}><Trophy className="w-4 h-4"/> Evaluasi Fisik 1RM</h2>
               <input value={evaluation.name} onChange={e => setEvaluation({...evaluation, name: e.target.value})} className={`w-full mb-3 p-1 border-b font-black outline-none uppercase ${t.textDark}`} placeholder="Nama Tes..." />
               <div className="flex gap-2 mb-3">
                 <input type="number" value={evaluation.score} onChange={e => setEvaluation({...evaluation, score: Number(e.target.value)})} className={`w-1/2 p-2 border rounded-xl text-center font-black ${t.text}`} title="Skor Atlet" />
                 <input type="number" value={evaluation.target} onChange={e => setEvaluation({...evaluation, target: Number(e.target.value)})} className="w-1/2 p-2 border rounded-xl text-center font-black text-slate-400" title="Target Skor" />
               </div>
               <div className={`p-3 rounded-xl text-center font-black text-white shadow-inner mb-3 ${calculateScore().barColor}`}>{calculateScore().percentage}% - {calculateScore().label}</div>
               <div className="p-2 bg-slate-50 rounded-lg border border-slate-100 text-[8px] font-bold text-slate-500 italic">
                 "Kalibrasi ulang tes biometrik hanya dilakukan pada akhir minggu Unloading (W4)."
               </div>
            </div>

            <div className="border p-6 rounded-3xl bg-white shadow-sm border-orange-100 flex flex-col">
               <h2 className="font-black uppercase flex items-center gap-2 mb-4 text-orange-600 tracking-tighter"><ClipboardList className="w-4 h-4"/> Gizi & Medis</h2>
               <textarea value={nutritionNote} onChange={e => setNutritionNote(e.target.value)} className="w-full bg-orange-50/30 border-none p-4 rounded-2xl h-24 outline-none font-bold text-slate-600 leading-relaxed text-[10px]" placeholder="Ketik catatan gizi..." />
            </div>

            <div className="border p-6 rounded-3xl bg-white shadow-sm border-indigo-100 flex-1">
               <h2 className="font-black uppercase flex items-center gap-2 mb-4 text-indigo-600 tracking-tighter"><Target className="w-4 h-4"/> Event & Lokasi</h2>
               
               <div className="mb-4 space-y-2 p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                 <div className="flex items-center justify-between">
                   <span className="text-[9px] font-black text-red-600 uppercase">Target Utama</span>
                   <select value={competitionMonth} onChange={handleCompMonthChange} className="text-[10px] font-black text-red-700 bg-white px-1 py-0.5 rounded border outline-none cursor-pointer">
                     {activeMonths.map(m => <option key={m} value={m}>{m}</option>)}
                   </select>
                 </div>
                 
                 <div className="flex flex-col gap-1 border-t border-indigo-200 pt-2">
                   <span className="text-[9px] font-black text-yellow-600 uppercase">Target Antara (Multi)</span>
                   <div className="flex flex-wrap gap-1 mt-1">
                     {activeMonths.map(m => {
                       if (m === competitionMonth) return null;
                       const isActive = secondaryPeaks.includes(m);
                       return (
                         <button key={`peak-${m}`} onClick={() => setSecondaryPeaks(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])}
                           className={`px-2 py-0.5 rounded text-[9px] font-black border transition-all ${isActive ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white text-slate-400 border-slate-200 hover:border-yellow-400'}`}>
                           {m}
                         </button>
                       )
                     })}
                   </div>
                 </div>
               </div>

               <div className="space-y-2 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
                  {activeMonths.map(m => (
                    <div key={m} className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${m === competitionMonth ? 'bg-red-50 border-red-200' : secondaryPeaks.includes(m) ? 'bg-yellow-50 border-yellow-200' : 'bg-slate-50 border-slate-100'}`}>
                      <span className={`font-black w-8 text-[9px] ${m === competitionMonth ? 'text-red-600' : secondaryPeaks.includes(m) ? 'text-yellow-600' : 'text-slate-400'}`}>{m.toUpperCase()}</span>
                      <input placeholder="Nama Event..." value={locations[m] || ''} onChange={e => setLocations({...locations, [m]: e.target.value})} className="bg-transparent outline-none w-full font-bold text-slate-600" />
                      <button onClick={() => {if(m !== competitionMonth && !secondaryPeaks.includes(m)) setTryOutMonths(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])}}><Flag className={`w-3 h-3 cursor-pointer ${tryOutMonths.includes(m) ? 'text-purple-600 fill-purple-600' : 'text-slate-200'}`} /></button>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* KALENDER PERIODISASI (TIMELINE MATERI FULL WIDTH) */}
          <div className="col-span-4 border p-8 rounded-3xl bg-white shadow-sm relative border-slate-100 overflow-hidden flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className={`font-black uppercase flex items-center gap-2 tracking-tighter text-sm ${t.textDark}`}>
                <Calendar className={`w-5 h-5 ${t.text}`}/> Kalender Periodisasi (Timeline Materi Pelatihan)
              </h2>
            </div>
            
            <div className="overflow-x-auto pb-4 custom-scrollbar">
              <table className="w-full border-collapse border min-w-[1000px]">
                <thead>
                  <tr>
                    <th className="p-2 border bg-slate-50 min-w-[200px] sticky left-0 z-20 text-left text-[10px] text-slate-400 uppercase tracking-widest">Fase Pelatihan</th>
                    {unifiedPhases.map((p, idx) => (
                      <th key={`phase-${idx}`} colSpan={p.span * 4} className={`p-2 border text-[9px] font-black uppercase ${p.color} tracking-widest`}>
                        {p.label}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    <th className="p-2 border bg-slate-50 sticky left-0 z-20 text-left text-[10px] text-slate-400 uppercase tracking-widest">Bulan</th>
                    {activeMonths.map(m => (
                      <th key={`m-${m}`} colSpan={4} className={`p-2 border font-black uppercase ${t.bgLight} ${t.textDark}`}>
                        {m}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    <th className="p-2 border bg-slate-50 sticky left-0 z-20 flex justify-between items-center h-[34px]">
                       <span className="text-[10px] text-slate-400 uppercase tracking-widest">Instrumen Latihan</span>
                       <div className="flex gap-1">
                         <input type="text" value={materialInput} onChange={e => setMaterialInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddMaterial()} className="border p-1 rounded outline-none text-[9px] w-24 focus:ring-1" style={{ '--tw-ring-color': t.hex }} placeholder="+ Tambah..."/>
                       </div>
                    </th>
                    {activeMonths.map(m => (
                      <React.Fragment key={`w-${m}`}>
                        <th className="p-1 border bg-slate-50 text-[9px] text-slate-500 w-8">W1</th>
                        <th className="p-1 border bg-slate-50 text-[9px] text-slate-500 w-8">W2</th>
                        <th className="p-1 border bg-slate-50 text-[9px] text-slate-500 w-8">W3</th>
                        <th className="p-1 border bg-green-50 text-[9px] text-green-700 w-8" title="Unloading">W4(U)</th>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {materials.map(mat => (
                    <tr key={mat} className="hover:bg-slate-50 transition-colors">
                      <td className="p-2 border bg-white sticky left-0 z-10 font-bold text-[10px] text-slate-700 truncate max-w-[200px]" title={mat}>{mat}</td>
                      {activeMonths.map(m => [1,2,3,4].map(w => (
                        <td key={`${m}-W${w}`} className={`p-1 border text-center ${w===4 ? 'bg-green-50/20' : ''}`}>
                          <input type="checkbox" checked={!!matrixData[`${m}-W${w}-${mat}`]} onChange={() => setMatrixData(prev => ({...prev, [`${m}-W${w}-${mat}`]: !prev[`${m}-W${w}-${mat}`]}))} className="cursor-pointer w-3 h-3" style={{ accentColor: t.hex }} />
                        </td>
                      )))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PSIKOLOGI */}
          <div className="col-span-4 border p-8 rounded-3xl bg-slate-900 text-white shadow-inner">
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
              <h2 className="font-black uppercase flex items-center gap-2 tracking-tighter text-sm"><Brain className={`w-5 h-5 ${t.text}`}/> Asesmen Psikologi Bertarung</h2>
              <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest italic">by fiqhipondaa9 system</span>
            </div>
            <div className="grid grid-cols-9 gap-4">
               {mentalData.map((item, idx) => (
                 <div key={item.id} className="space-y-2 text-center group">
                   <input value={item.label} onChange={e => { 
                      const newData = mentalData.map((m, i) => i === idx ? { ...m, label: e.target.value } : m);
                      setMentalData(newData); 
                   }} className="bg-transparent text-[8px] font-black text-slate-500 uppercase outline-none text-center focus:text-white transition-colors w-full" style={{ focusColor: t.hex }} />
                   <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 shadow-md transition-all" style={{ '--tw-border-opacity': 1, borderColor: item.score >= 8 ? t.hex : '#334155' }}>
                     <input type="number" min="1" max="9" value={item.score} onChange={e => { 
                        const newData = mentalData.map((m, i) => i === idx ? { ...m, score: Number(e.target.value) } : m);
                        setMentalData(newData); 
                     }} className="bg-transparent w-full text-center font-black text-xl outline-none" style={{ color: t.hex }} />
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-10 pt-6 border-t border-slate-100 flex justify-between items-center opacity-40">
           <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">Professional Annual Plan System | Designed by fiqhipondaa9</p>
           <div className="flex gap-4 items-center">
              <Globe className="w-3 h-3"/><select value={terminology} onChange={e => setTerminology(e.target.value)} className="bg-transparent font-black outline-none uppercase text-[8px] cursor-pointer"><option value="Eropa">Mazhab Eropa</option><option value="Amerika">Mazhab Amerika</option></select>
           </div>
        </div>
      </div>
    </div>
  );
};

export default App;