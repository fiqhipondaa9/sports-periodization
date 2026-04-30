import React, { useState, useMemo, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend, ReferenceLine, BarChart, Bar, Cell } from 'recharts';
import { Trophy, Zap, Brain, Apple, Dumbbell, Activity, Target, Download, BarChart2, Timer, Wind, Globe, Save, Upload, Plus, X, Flag, PieChart as PieChartIcon, Table, FileSpreadsheet, Image as ImageIcon, Sun, Moon, User, ClipboardList } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const App = () => {
  const BRANDING = "ANNUAL TRAINING PLAN SYSTEM by fiqhipondaa9";
  const reportRef = useRef(null);
  const fileInputRef = useRef(null);

  const [athleteInfo, setAthleteInfo] = useState({ name: 'KOTA PALU', target: 'JUARA UMUM', class: 'SEMUA CABOR', coach: 'fiqhipondaa9' });
  const [startMonth, setStartMonth] = useState(0); 
  const [endMonth, setEndMonth] = useState(11); 
  const [competitionMonth, setCompetitionMonth] = useState('Nov');
  const [terminology, setTerminology] = useState('Eropa');
  const [nutritionNote, setNutritionNote] = useState('Input catatan gizi, suplemen, atau berat badan di sini.');
  const [macroValues, setMacroValues] = useState(months.reduce((acc, m) => ({ ...acc, [m]: { vol: 70, int: 30 } }), {}));
  const [tryOutMonths, setTryOutMonths] = useState([]);
  const [locations, setLocations] = useState({});
  const [materials, setMaterials] = useState(['Latihan Fisik Umum', 'Teknik Dasar', 'Simulasi Pertandingan']);
  const [materialInput, setMaterialInput] = useState('');
  const [matrixData, setMatrixData] = useState({});
  const [showMatrixModal, setShowMatrixModal] = useState(false);
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Sen');
  const [dailySessions, setDailySessions] = useState(['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].reduce((acc, d) => ({ ...acc, [d]: { morning: { menu: '', int: 5 }, afternoon: { menu: '', int: 5 } } }), {}));
  const [mentalLabels, setMentalLabels] = useState(['Keberanian', 'Fokus', 'Motivasi', 'Emosi', 'Resiliensi', 'Disiplin', 'Self-Talk', 'Anxiety', 'Social']);
  const [mentalScores, setMentalScores] = useState(mentalLabels.reduce((acc, l) => ({ ...acc, [l]: 8 }), {}));

  const activeMonths = useMemo(() => months.slice(startMonth, endMonth + 1), [startMonth, endMonth]);

  const getPhase = (m) => {
    const currIdx = months.indexOf(m);
    const compIdx = months.indexOf(competitionMonth);
    if (currIdx < compIdx) return { label: terminology === 'Eropa' ? 'FASE PERSIAPAN' : 'PRE-SEASON', color: 'bg-blue-100 text-blue-700' };
    if (currIdx === compIdx) return { label: terminology === 'Eropa' ? 'FASE KOMPETISI' : 'IN-SEASON', color: 'bg-red-100 text-red-700' };
    return { label: 'TRANSISI', color: 'bg-slate-100 text-slate-600' };
  };

  const chartData = useMemo(() => activeMonths.map(m => ({ name: m, Intensitas: macroValues[m]?.int || 0, Volume: macroValues[m]?.vol || 0 })), [activeMonths, macroValues]);

  // FIX: Load Data Lengkap
  const handleLoadData = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target.result);
        if(d.athleteInfo) setAthleteInfo(d.athleteInfo);
        if(d.startMonth !== undefined) setStartMonth(d.startMonth);
        if(d.endMonth !== undefined) setEndMonth(d.endMonth);
        if(d.competitionMonth) setCompetitionMonth(d.competitionMonth);
        if(d.terminology) setTerminology(d.terminology);
        if(d.nutritionNote) setNutritionNote(d.nutritionNote);
        if(d.macroValues) setMacroValues(d.macroValues);
        if(d.dailySessions) setDailySessions(d.dailySessions);
        if(d.matrixData) setMatrixData(d.matrixData);
        if(d.materials) setMaterials(d.materials);
        if(d.locations) setLocations(d.locations);
        if(d.tryOutMonths) setTryOutMonths(d.tryOutMonths);
        if(d.mentalLabels) setMentalLabels(d.mentalLabels);
        if(d.mentalScores) setMentalScores(d.mentalScores);
        alert("Seluruh data atlet berhasil dimuat sempurna!");
      } catch (err) { alert("Format file tidak didukung!"); }
    };
    reader.readAsText(file);
  };

  const handleSaveData = () => {
    const data = { athleteInfo, startMonth, endMonth, competitionMonth, terminology, macroValues, locations, tryOutMonths, dailySessions, matrixData, materials, mentalScores, mentalLabels, nutritionNote };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `Plan_${athleteInfo.name}.json`; a.click();
  };

  const handleExportPNG = async () => {
    const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
    const link = document.createElement('a'); link.href = canvas.toDataURL('image/png');
    link.download = `Plan_${athleteInfo.name}_by_fiqhipondaa9.png`; link.click();
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-900 text-[11px]">
      {/* MODAL MATRIKS */}
      {showMatrixModal && (
        <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border">
            <div className="p-4 bg-blue-900 text-white flex justify-between font-black uppercase">
              <span>Materi Latihan Mingguan</span>
              <X className="cursor-pointer" onClick={() => setShowMatrixModal(false)}/>
            </div>
            <div className="p-4 overflow-auto flex-1">
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="p-2 border sticky left-0 z-10 bg-slate-100">Materi</th>
                    {activeMonths.map(m => <th key={m} colSpan={4} className="p-2 border bg-blue-50 font-black text-blue-900 uppercase">{m}</th>)}
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
              <span>SESI HARIAN: {selectedDay}</span>
              <X className="cursor-pointer" onClick={() => setShowDailyModal(false)}/>
            </div>
            <div className="p-6 space-y-4">
              {['morning', 'afternoon'].map(session => (
                <div key={session}>
                  <label className="font-black text-[9px] text-slate-400 uppercase mb-1 block">{session === 'morning' ? 'Sesi Pagi' : 'Sesi Sore'}</label>
                  <textarea value={dailySessions[selectedDay][session].menu} onChange={e => setDailySessions({...dailySessions, [selectedDay]: {...dailySessions[selectedDay], [session]: {...dailySessions[selectedDay][session], menu: e.target.value}}})} className="w-full border p-2 rounded-xl h-16 outline-none text-[10px] focus:border-blue-500" placeholder="Ketik menu..." />
                </div>
              ))}
            </div>
            <div className="p-4 flex justify-center"><button onClick={() => setShowDailyModal(false)} className="bg-blue-600 text-white px-8 py-2 rounded-xl font-black">SIMPAN</button></div>
          </div>
        </div>
      )}

      {/* TOOLBAR */}
      <div className="max-w-[1200px] mx-auto flex justify-end gap-2 mb-4 no-print">
        <input type="file" ref={fileInputRef} className="hidden" onChange={handleLoadData} />
        <button onClick={() => fileInputRef.current.click()} className="bg-white border px-4 py-2 rounded-xl flex items-center gap-2 font-black shadow-sm hover:bg-blue-50 transition-all uppercase"><Upload className="w-3 h-3 text-blue-600"/> Buka</button>
        <button onClick={handleSaveData} className="bg-white border px-4 py-2 rounded-xl flex items-center gap-2 font-black shadow-sm hover:bg-green-50 transition-all uppercase"><Save className="w-3 h-3 text-green-600"/> Simpan</button>
        <button onClick={handleExportPNG} className="bg-blue-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-black shadow-md hover:bg-blue-700 transition-all uppercase"><ImageIcon className="w-3 h-3"/> PNG</button>
        <button onClick={() => window.print()} className="bg-slate-900 text-white px-5 py-2 rounded-xl flex items-center gap-2 font-black shadow-md hover:bg-slate-800 transition-all uppercase"><Download className="w-3 h-3"/> PDF</button>
      </div>

      <div ref={reportRef} className="max-w-[1200px] mx-auto p-8 bg-white rounded-3xl border shadow-sm relative overflow-hidden">
        {/* HEADER */}
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
            <h1 className="text-xl font-black text-slate-900 italic text-center leading-tight uppercase tracking-tighter">ANNUAL TRAINING PLAN<br/><span className="text-blue-600 text-sm">by fiqhipondaa9</span></h1>
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
          {/* MAKRO */}
          <div className="col-span-3 space-y-8">
            <div className="border p-6 rounded-3xl bg-white shadow-sm relative">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-black uppercase flex items-center gap-2 tracking-tighter"><Zap className="text-orange-500 w-4 h-4"/> Grafik Beban Makrosiklus</h2>
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
                    <span className="font-black text-slate-400 text-[9px] uppercase">{m}</span>
                    <div className="space-y-1">
                      <input type="number" value={macroValues[m]?.int} onChange={e => setMacroValues({...macroValues, [m]: {...macroValues[m], int: Number(e.target.value)}})} className="w-full text-center font-black text-red-600 bg-white border rounded p-1 outline-none text-[10px]" />
                      <input type="number" value={macroValues[m]?.vol} onChange={e => setMacroValues({...macroValues, [m]: {...macroValues[m], vol: Number(e.target.value)}})} className="w-full text-center font-black text-blue-600 bg-white border rounded p-1 outline-none text-[10px]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-8">
            <div className="border p-6 rounded-3xl bg-white shadow-sm border-orange-100 h-64 overflow-hidden flex flex-col">
               <h2 className="font-black uppercase flex items-center gap-2 mb-4 text-orange-600 tracking-tighter"><ClipboardList className="w-4 h-4"/> Gizi & Medis</h2>
               <textarea value={nutritionNote} onChange={e => setNutritionNote(e.target.value)} className="w-full bg-orange-50/30 border-none p-4 rounded-2xl flex-1 outline-none font-bold text-slate-500 leading-relaxed text-[10px]" placeholder="Ketik catatan..." />
            </div>

            <div className="border p-6 rounded-3xl bg-white shadow-sm border-indigo-100 flex-1">
               <h2 className="font-black uppercase flex items-center gap-2 mb-4 text-indigo-600 tracking-tighter"><Target className="w-4 h-4"/> Event & Lokasi</h2>
               <div className="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                  {activeMonths.map(m => (
                    <div key={m} className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${m === competitionMonth ? 'bg-red-50 border-red-200' : 'bg-slate-50'}`}>
                      <span className={`font-black w-8 text-[9px] ${m === competitionMonth ? 'text-red-600' : 'text-slate-400'}`}>{m.toUpperCase()}</span>
                      <input placeholder="..." value={locations[m] || ''} onChange={e => setLocations({...locations, [m]: e.target.value})} className="bg-transparent outline-none w-full font-bold text-slate-600" />
                      <button onClick={() => {if(m !== competitionMonth) setTryOutMonths(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])}}><Flag className={`w-3 h-3 ${tryOutMonths.includes(m) ? 'text-purple-600 fill-purple-600' : 'text-slate-200'}`} /></button>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* PSIKOLOGI */}
          <div className="col-span-4 border p-6 rounded-3xl bg-slate-900 text-white">
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
              <h2 className="font-black uppercase flex items-center gap-2 tracking-tighter"><Brain className="w-4 h-4 text-purple-400"/> Asesmen Psikologi Bertarung</h2>
              <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest italic text-right">by fiqhipondaa9 system</span>
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

        <div className="mt-8 pt-6 border-t flex justify-between items-center opacity-40">
           <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic tracking-tighter">Designed & Developed by fiqhipondaa9 for Elite Coaches</p>
           <div className="flex gap-4 items-center">
              <Globe className="w-3 h-3"/><select value={terminology} onChange={e => setTerminology(e.target.value)} className="bg-transparent font-black outline-none uppercase text-[8px]"><option value="Eropa">EROPA</option><option value="Amerika">AMERIKA</option></select>
           </div>
        </div>
      </div>
    </div>
  );
};

export default App;