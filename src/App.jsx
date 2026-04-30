import React, { useState, useMemo, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, ReferenceLine, BarChart, Bar, Cell } from 'recharts';
import { Trophy, Zap, Brain, Apple, Dumbbell, Activity, Target, Download, BarChart2, Timer, Wind, Globe, Save, Upload, Plus, X, Flag, PieChart as PieChartIcon, Table, FileSpreadsheet, Image as ImageIcon, Sun, Moon, User, ClipboardList } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

// --- DATA MASTER ---
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const App = () => {
  const BRANDING = "ANNUAL TRAINING PLAN SYSTEM";
  const reportRef = useRef(null);
  const fileInputRef = useRef(null);

  // --- 1. STATE IDENTITAS ---
  const [athleteInfo, setAthleteInfo] = useState({ name: 'KOTA PALU', target: 'JUARA UMUM', class: 'SEMUA CABOR', coach: 'FIQHIPONDAA9' });
  const [startMonth, setStartMonth] = useState(0); 
  const [endMonth, setEndMonth] = useState(11); 
  const [competitionMonth, setCompetitionMonth] = useState('Nov');
  const [terminology, setTerminology] = useState('Eropa');
  const [nutritionNote, setNutritionNote] = useState('Input catatan gizi, suplemen, atau berat badan di sini.');

  // --- 2. DATA MAKRO (MANUAL INPUT) ---
  const [macroValues, setMacroValues] = useState(
    months.reduce((acc, m) => ({ ...acc, [m]: { vol: 70, int: 30 } }), {})
  );

  // --- 3. LOKASI & TRY OUT ---
  const [tryOutMonths, setTryOutMonths] = useState([]);
  const [locations, setLocations] = useState({});

  // --- 4. MATRIKS & MATERI ---
  const [materials, setMaterials] = useState(['Latihan Fisik Umum', 'Teknik Dasar', 'Simulasi']);
  const [materialInput, setMaterialInput] = useState('');
  const [matrixData, setMatrixData] = useState({});
  const [showMatrixModal, setShowMatrixModal] = useState(false);

  // --- 5. DETAIL SESI HARIAN ---
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Sen');
  const [dailySessions, setDailySessions] = useState(
    ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].reduce((acc, d) => ({ 
      ...acc, [d]: { morning: { menu: '', int: 5 }, afternoon: { menu: '', int: 5 } } 
    }), {})
  );

  // --- 6. EVALUASI FISIK & MENTAL ---
  const [mentalLabels, setMentalLabels] = useState(['Keberanian', 'Fokus', 'Motivasi', 'Emosi', 'Resiliensi', 'Disiplin', 'Self-Talk', 'Anxiety', 'Social']);
  const [mentalScores, setMentalScores] = useState(mentalLabels.reduce((acc, l) => ({ ...acc, [l]: 8 }), {}));
  const [evaluation, setEvaluation] = useState({ name: 'VO2 Max / Speed Test', score: 50, target: 100, isTime: false });

  const activeMonths = useMemo(() => months.slice(startMonth, endMonth + 1), [startMonth, endMonth]);

  // --- LOGIC HELPERS ---
  const getPhase = (m) => {
    const currIdx = months.indexOf(m);
    const compIdx = months.indexOf(competitionMonth);
    if (currIdx < compIdx) return { label: terminology === 'Eropa' ? 'FASE PERSIAPAN' : 'PRE-SEASON', color: 'bg-blue-100 text-blue-700' };
    if (currIdx === compIdx) return { label: terminology === 'Eropa' ? 'FASE KOMPETISI' : 'IN-SEASON', color: 'bg-red-100 text-red-700' };
    return { label: 'TRANSISI', color: 'bg-slate-100 text-slate-600' };
  };

  const calculateScore = () => {
    if (!evaluation.score || !evaluation.target) return { percentage: 0, label: "-", color: "text-slate-400", barColor: "bg-slate-200" };
    let p = evaluation.isTime ? (evaluation.target / evaluation.score) * 100 : (evaluation.score / evaluation.target) * 100;
    const r = Math.min(Math.round(p), 100);
    if (r >= 90) return { percentage: r, label: "EXCELLENT", color: "text-green-600", barColor: "bg-green-500" };
    if (r >= 75) return { percentage: r, label: "GOOD", color: "text-blue-600", barColor: "bg-blue-500" };
    return { percentage: r, label: "POOR", color: "text-red-600", barColor: "bg-red-500" };
  };

  const chartData = useMemo(() => activeMonths.map(m => ({
    name: m,
    Intensitas: macroValues[m].int,
    Volume: macroValues[m].vol
  })), [activeMonths, macroValues]);

  // --- EXPORT ACTIONS ---
  const handleExportPNG = async () => {
    const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
    const link = document.createElement('a'); link.href = canvas.toDataURL('image/png');
    link.download = `Plan_${athleteInfo.name}_${new Date().getTime()}.png`; link.click();
  };

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();
    const macroSheet = chartData.map(d => ({ Bulan: d.name, Volume: `${d.Volume}%`, Intensitas: `${d.Intensitas}%`, Fase: getPhase(d.name).label }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(macroSheet), "Makrosiklus");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([athleteInfo]), "Profil Tim");
    XLSX.writeFile(wb, `Program_Latihan_${athleteInfo.name}.xlsx`);
  };

  const handleSaveJSON = () => {
    const data = { athleteInfo, startMonth, endMonth, competitionMonth, terminology, macroValues, locations, tryOutMonths, dailySessions, matrixData, materials, mentalScores, evaluation, nutritionNote };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `Backup_${athleteInfo.name}.json`; a.click();
  };

  const handleLoadJSON = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target.result);
        if(d.athleteInfo) setAthleteInfo(d.athleteInfo);
        if(d.macroValues) setMacroValues(d.macroValues);
        if(d.dailySessions) setDailySessions(d.dailySessions);
        if(d.matrixData) setMatrixData(d.matrixData);
        if(d.materials) setMaterials(d.materials);
        if(d.locations) setLocations(d.locations);
        if(d.tryOutMonths) setTryOutMonths(d.tryOutMonths);
        alert("Seluruh data berhasil dimuat sempurna!");
      } catch (err) { alert("Format file tidak didukung!"); }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-900 text-[11px]">
      
      {/* MODAL MATRIKS */}
      {showMatrixModal && (
        <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border">
            <div className="p-4 bg-blue-900 text-white flex justify-between font-black uppercase">
              <span>Distribusi Materi Mingguan</span>
              <X className="cursor-pointer" onClick={() => setShowMatrixModal(false)}/>
            </div>
            <div className="p-4 overflow-auto flex-1">
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="p-2 border sticky left-0 z-10 bg-slate-100">Materi</th>
                    {activeMonths.map(m => <th key={m} colSpan={4} className="p-2 border bg-blue-50 font-black text-blue-900">{m}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {materials.map(mat => (
                    <tr key={mat}>
                      <td className="p-2 border bg-white sticky left-0 z-10 font-bold text-left">{mat}</td>
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

      {/* MODAL DETAIL SESI */}
      {showDailyModal && (
        <div className="fixed inset-0 z-[120] bg-slate-900/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border">
            <div className="p-4 bg-slate-900 text-white font-black uppercase flex justify-between">
              <span>HARI {selectedDay}</span>
              <X className="cursor-pointer" onClick={() => setShowDailyModal(false)}/>
            </div>
            <div className="p-6 space-y-4">
              {['morning', 'afternoon'].map(session => (
                <div key={session}>
                  <label className="font-black text-[9px] text-slate-400 uppercase mb-1 block">{session === 'morning' ? 'Sesi Pagi' : 'Sesi Sore'}</label>
                  <textarea value={dailySessions[selectedDay][session].menu} onChange={e => setDailySessions({...dailySessions, [selectedDay]: {...dailySessions[selectedDay], [session]: {...dailySessions[selectedDay][session], menu: e.target.value}}})} className="w-full border p-2 rounded-xl h-16 outline-none text-[10px] focus:border-blue-500" placeholder="Ketik menu latihan..." />
                </div>
              ))}
            </div>
            <div className="p-4 flex justify-center"><button onClick={() => setShowDailyModal(false)} className="bg-blue-600 text-white px-8 py-2 rounded-xl font-black">SIMPAN DATA</button></div>
          </div>
        </div>
      )}

      {/* TOOLBAR */}
      <div className="max-w-[1200px] mx-auto flex justify-end gap-2 mb-4 no-print">
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleLoadJSON} />
        <button onClick={() => fileInputRef.current.click()} className="bg-white border px-3 py-2 rounded-xl flex items-center gap-2 font-black shadow-sm hover:bg-blue-50 transition-all"><Upload className="w-3 h-3 text-blue-600"/> BUKA JSON</button>
        <button onClick={handleSaveJSON} className="bg-white border px-3 py-2 rounded-xl flex items-center gap-2 font-black shadow-sm hover:bg-green-50 transition-all"><Save className="w-3 h-3 text-green-600"/> SIMPAN JSON</button>
        <button onClick={handleExportPNG} className="bg-blue-600 text-white px-3 py-2 rounded-xl flex items-center gap-2 font-black shadow-md hover:bg-blue-700 transition-all"><ImageIcon className="w-3 h-3"/> PNG</button>
        <button onClick={handleExportExcel} className="bg-emerald-600 text-white px-3 py-2 rounded-xl flex items-center gap-2 font-black shadow-md hover:bg-emerald-700 transition-all"><FileSpreadsheet className="w-3 h-3"/> EXCEL</button>
        <button onClick={() => window.print()} className="bg-slate-900 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-black shadow-md hover:bg-slate-800 transition-all"><Download className="w-3 h-3"/> PDF</button>
      </div>

      <div ref={reportRef} className="max-w-[1200px] mx-auto p-8 bg-white rounded-3xl border shadow-sm">
        
        {/* HEADER PROFIL */}
        <div className="grid grid-cols-3 gap-8 mb-8 border-b pb-8 items-center">
          <div className="space-y-4">
            <div>
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">NAMA TIM / ATLET</label>
              <input value={athleteInfo.name} onChange={e => setAthleteInfo({...athleteInfo, name: e.target.value})} className="w-full text-xl font-black text-blue-900 outline-none uppercase bg-transparent" />
            </div>
            <div>
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">TARGET UTAMA</label>
              <input value={athleteInfo.target} onChange={e => setAthleteInfo({...athleteInfo, target: e.target.value})} className="w-full text-xs font-bold text-slate-600 outline-none uppercase bg-transparent" />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <h1 className="text-xl font-black text-slate-900 italic">ANNUAL TRAINING PLAN</h1>
            <div className="bg-slate-900 px-4 py-1 rounded-full mt-2 text-[8px] font-black text-white tracking-widest uppercase">UNIVERSAL SYSTEM</div>
          </div>
          <div className="text-right space-y-4">
            <div>
              <label className="text-[8px] font-black text-slate-400 uppercase">COACH / ADMINISTRATOR</label>
              <input value={athleteInfo.coach} onChange={e => setAthleteInfo({...athleteInfo, coach: e.target.value})} className="block text-xs font-black text-blue-600 text-right outline-none uppercase w-full bg-transparent" />
            </div>
            <div className="flex justify-end gap-3 text-blue-900 font-black">
              <select value={startMonth} onChange={e => setStartMonth(Number(e.target.value))} className="bg-transparent outline-none uppercase cursor-pointer">{months.map((m, i) => <option key={i} value={i}>{m}</option>)}</select>
              <span>-</span>
              <select value={endMonth} onChange={e => setEndMonth(Number(e.target.value))} className="bg-transparent outline-none uppercase cursor-pointer">{months.map((m, i) => <option key={i} value={i} disabled={i < startMonth}>{m}</option>)}</select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-8">
          {/* KOLOM GRAFIK & INPUT */}
          <div className="col-span-3 space-y-8">
            <div className="border p-6 rounded-3xl bg-white shadow-sm relative">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-black uppercase flex items-center gap-2"><Zap className="text-orange-500 w-4 h-4"/> Grafik Makrosiklus (Manual Input)</h2>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1"><div className="w-3 h-1 bg-red-500 rounded-full"/><span className="text-[8px] font-black text-slate-400 uppercase">Intensitas</span></div>
                  <div className="flex items-center gap-1"><div className="w-3 h-1 bg-blue-500 rounded-full"/><span className="text-[8px] font-black text-slate-400 uppercase">Volume</span></div>
                </div>
              </div>
              <div className="flex w-full mb-4 gap-1 h-6">{activeMonths.map((m, idx) => { const p = getPhase(m); return <div key={idx} className={`flex items-center justify-center rounded border text-[7px] font-black uppercase overflow-hidden px-1 ${p.color}`} style={{ flex: 1 }}>{p.label}</div> })}</div>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ left: 0, right: 10, top: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9"/>
                    <XAxis dataKey="name" interval={0} tick={{fontSize: 9, fontWeight: 'bold', fill: '#94a3b8'}} axisLine={false} tickLine={false}/>
                    <YAxis hide domain={[0, 100]}/>
                    <RechartsTooltip/>
                    {tryOutMonths.map(m => activeMonths.includes(m) && <ReferenceLine key={m} x={m} stroke="#9333ea" strokeDasharray="4 4" label={{ position: 'insideTopLeft', value: locations[m] || 'TO', fill: '#9333ea', fontSize: 8, fontWeight: 'bold' }} />)}
                    <ReferenceLine x={competitionMonth} stroke="#ef4444" strokeDasharray="5 5" label={{ position: 'top', value: locations[competitionMonth] || 'TARGET', fill: '#ef4444', fontSize: 9, fontWeight: 'bold' }} />
                    <Line type="monotone" name="Intensitas" dataKey="Intensitas" stroke="#ef4444" strokeWidth={5} dot={{r: 4, fill: '#ef4444'}} />
                    <Line type="monotone" name="Volume" dataKey="Volume" stroke="#3b82f6" strokeWidth={5} dot={{r: 4, fill: '#3b82f6'}} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-8 flex justify-between gap-1 overflow-x-auto pb-2 custom-scrollbar">
                {activeMonths.map(m => (
                  <div key={m} className="flex-1 min-w-[55px] bg-slate-50 p-2 rounded-2xl border text-center space-y-2">
                    <span className="font-black text-slate-400 text-[9px]">{m.toUpperCase()}</span>
                    <div className="space-y-1">
                      <input type="number" value={macroValues[m].int} onChange={e => setMacroValues({...macroValues, [m]: {...macroValues[m], int: Number(e.target.value)}})} className="w-full text-center font-black text-red-600 bg-white border rounded p-1 outline-none text-[10px]" />
                      <input type="number" value={macroValues[m].vol} onChange={e => setMacroValues({...macroValues, [m]: {...macroValues[m], vol: Number(e.target.value)}})} className="w-full text-center font-black text-blue-600 bg-white border rounded p-1 outline-none text-[10px]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="border p-6 rounded-3xl bg-white shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-black uppercase flex items-center gap-2"><BarChart2 className="text-blue-600 w-4 h-4"/> Siklus Mikro (Detail)</h2>
                  <button onClick={() => setShowMatrixModal(true)} className="bg-blue-900 text-white px-3 py-1 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-md">Matriks</button>
                </div>
                <div className="h-44 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={Object.entries(dailySessions).map(([day, s]) => ({day, val: (s.morning.menu ? 50 : 0) + (s.afternoon.menu ? 50 : 0)}))} onClick={d => { if(d.activeLabel) { setSelectedDay(d.activeLabel); setShowDailyModal(true); } }}>
                      <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}}/>
                      <YAxis hide domain={[0, 100]}/>
                      <Bar dataKey="val" radius={[8, 8, 0, 0]} barSize={35} cursor="pointer">
                        {Object.entries(dailySessions).map(([day, s], idx) => <Cell key={idx} fill={s.morning.menu && s.afternoon.menu ? '#3b82f6' : s.morning.menu || s.afternoon.menu ? '#eab308' : '#f1f5f9'} />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex gap-2 pt-4 border-t"><input type="text" value={materialInput} onChange={e => setMaterialInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (setMaterials([...materials, materialInput]), setMaterialInput(''))} className="flex-1 border p-2 rounded-xl outline-none" placeholder="Tambah Materi..."/><button onClick={() => {if(materialInput){setMaterials([...materials, materialInput]); setMaterialInput('');}}} className="bg-blue-600 text-white p-2 rounded-xl"><Plus/></button></div>
              </div>
              <div className="border p-6 rounded-3xl bg-indigo-50/20 flex flex-col items-center justify-center">
                 <h2 className="font-black uppercase mb-4 flex items-center gap-2 text-indigo-900"><PieChartIcon className="w-4 h-4"/> Fokus Distribusi Latihan</h2>
                 <div className="h-48 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={[{name:'Fisik', val:65, fill:'#ef4444'},{name:'Teknik', val:20, fill:'#eab308'},{name:'Psiko', val:15, fill:'#22c55e'}]}><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 'bold'}}/><YAxis hide domain={[0, 100]}/><Bar dataKey="val" radius={[6, 6, 0, 0]}>{[0,1,2].map(i => <Cell key={i} fill={['#ef4444','#eab308','#22c55e'][i]} />)}</Bar></BarChart></ResponsiveContainer></div>
              </div>
            </div>
          </div>

          {/* KOLOM SAMPING */}
          <div className="space-y-8">
            <div className="border p-6 rounded-3xl bg-white shadow-sm border-orange-100">
               <h2 className="font-black uppercase flex items-center gap-2 mb-4 text-orange-600"><ClipboardList className="w-4 h-4"/> Catatan Gizi & Khusus</h2>
               <textarea value={nutritionNote} onChange={e => setNutritionNote(e.target.value)} className="w-full bg-orange-50/30 border-none p-4 rounded-2xl h-40 outline-none font-bold text-slate-500 leading-relaxed text-[10px]" placeholder="Ketik catatan..." />
            </div>

            <div className="border p-6 rounded-3xl bg-white shadow-sm border-indigo-100">
               <h2 className="font-black uppercase flex items-center gap-2 mb-4 text-indigo-600"><Target className="w-4 h-4"/> Event & Try Out</h2>
               <div className="space-y-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                  {activeMonths.map(m => (
                    <div key={m} className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${m === competitionMonth ? 'bg-red-50 border-red-200' : 'bg-slate-50'}`}>
                      <span className={`font-black w-8 text-[9px] ${m === competitionMonth ? 'text-red-600' : 'text-slate-400'}`}>{m.toUpperCase()}</span>
                      <input placeholder="..." value={locations[m] || ''} onChange={e => setLocations({...locations, [m]: e.target.value})} className="bg-transparent outline-none w-full font-bold text-slate-600" />
                      <button onClick={() => {if(m !== competitionMonth) setTryOutMonths(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])}}><Flag className={`w-3 h-3 ${tryOutMonths.includes(m) ? 'text-purple-600 fill-purple-600' : 'text-slate-200'}`} /></button>
                    </div>
                  ))}
               </div>
            </div>

            <div className="border p-6 rounded-3xl bg-white shadow-sm border-blue-100">
               <h2 className="font-black uppercase flex items-center gap-2 mb-4 text-blue-600"><Trophy className="w-4 h-4"/> Evaluasi Fisik</h2>
               <input value={evaluation.name} onChange={e => setEvaluation({...evaluation, name: e.target.value})} className="w-full mb-3 p-1 border-b font-black text-blue-900 outline-none uppercase" />
               <div className="flex gap-2 mb-4"><input type="number" value={evaluation.score} onChange={e => setEvaluation({...evaluation, score: Number(e.target.value)})} className="w-1/2 p-2 border rounded-xl text-center font-black text-blue-600" /><input type="number" value={evaluation.target} onChange={e => setEvaluation({...evaluation, target: Number(e.target.value)})} className="w-1/2 p-2 border rounded-xl text-center font-black text-slate-400" /></div>
               <div className={`p-3 rounded-xl text-center font-black text-white ${calculateScore().barColor}`}>{calculateScore().percentage}% - {calculateScore().label}</div>
            </div>
          </div>

          <div className="col-span-4 border p-6 rounded-3xl bg-slate-900 text-white">
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
              <h2 className="font-black uppercase flex items-center gap-2"><Brain className="w-4 h-4 text-purple-400"/> Asesmen Psikologi Bertarung (Dynamic Labels)</h2>
              <Globe className="w-4 h-4 opacity-20 cursor-pointer" onClick={() => setTerminology(terminology === 'Eropa' ? 'Amerika' : 'Eropa')}/>
            </div>
            <div className="grid grid-cols-9 gap-4">
               {mentalLabels.map((label, idx) => (
                 <div key={idx} className="space-y-2 text-center">
                   <input value={label} onChange={e => { const nl = [...mentalLabels]; nl[idx] = e.target.value; setMentalLabels(nl); }} className="bg-transparent text-[8px] font-black text-slate-500 uppercase outline-none text-center focus:text-purple-400" />
                   <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700">
                     <input type="number" min="1" max="9" value={mentalScores[label] || 0} onChange={e => setMentalScores({...mentalScores, [label]: Number(e.target.value)})} className="bg-transparent w-full text-center font-black text-xl text-purple-400 outline-none" />
                   </div>
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