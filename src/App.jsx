import React, { useState, useMemo, useRef, useEffect } from 'react';
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

  // --- STATE IDENTITAS ---
  const [athleteInfo, setAthleteInfo] = useState({ name: 'KOTA PALU', target: 'JUARA UMUM', class: 'SEMUA CABOR', age: 'Senior (>18 Tahun)', coach: 'fiqhipondaa9' });
  const [startMonth, setStartMonth] = useState(0); 
  const [endMonth, setEndMonth] = useState(11); 
  const [competitionMonth, setCompetitionMonth] = useState('Nov');
  const [terminology, setTerminology] = useState('Eropa');
  const [nutritionNote, setNutritionNote] = useState('Input catatan gizi, suplemen, atau berat badan di sini.');
  
  // --- STATE DATA MAKRO & MATRIKS ---
  const [macroValues, setMacroValues] = useState(months.reduce((acc, m) => ({ ...acc, [m]: { vol: 70, int: 30 } }), {}));
  const [tryOutMonths, setTryOutMonths] = useState([]);
  const [locations, setLocations] = useState({});
  const [materials, setMaterials] = useState(['Latihan Fisik Umum', 'Teknik Dasar', 'Simulasi Pertandingan']);
  const [materialInput, setMaterialInput] = useState('');
  const [matrixData, setMatrixData] = useState({});
  
  // --- STATE MODAL & SESI ---
  const [showMatrixModal, setShowMatrixModal] = useState(false);
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Sen');
  const [dailySessions, setDailySessions] = useState(['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].reduce((acc, d) => ({ ...acc, [d]: { morning: { menu: '', int: 5 }, afternoon: { menu: '', int: 5 } } }), {}));
  
  // FIX 1: STATE MENTAL DATA (Anti-Reset saat edit label)
  const [mentalData, setMentalData] = useState([
    { id: 'm1', label: 'Keberanian', score: 8 }, { id: 'm2', label: 'Fokus', score: 8 }, { id: 'm3', label: 'Motivasi', score: 8 },
    { id: 'm4', label: 'Emosi', score: 8 }, { id: 'm5', label: 'Resiliensi', score: 8 }, { id: 'm6', label: 'Disiplin', score: 8 },
    { id: 'm7', label: 'Self-Talk', score: 8 }, { id: 'm8', label: 'Anxiety', score: 8 }, { id: 'm9', label: 'Social', score: 8 }
  ]);

  const activeMonths = useMemo(() => months.slice(startMonth, endMonth + 1), [startMonth, endMonth]);

  // FIX 3: Cegah Target Lomba Keluar Jalur
  useEffect(() => {
    if (!activeMonths.includes(competitionMonth)) {
      setCompetitionMonth(activeMonths[activeMonths.length - 1]);
    }
  }, [activeMonths, competitionMonth]);

  const getPhase = (m) => {
    const currIdx = months.indexOf(m);
    const compIdx = months.indexOf(competitionMonth);
    if (currIdx < compIdx) return { label: terminology === 'Eropa' ? 'FASE PERSIAPAN' : 'PRE-SEASON', color: 'bg-blue-600 text-white' };
    if (currIdx === compIdx) return { label: terminology === 'Eropa' ? 'FASE KOMPETISI' : 'IN-SEASON', color: 'bg-red-600 text-white' };
    return { label: 'TRANSISI', color: 'bg-slate-400 text-white' };
  };

  const chartData = useMemo(() => activeMonths.map(m => ({ name: m, Intensitas: macroValues[m]?.int || 0, Volume: macroValues[m]?.vol || 0 })), [activeMonths, macroValues]);

  const unifiedPhases = useMemo(() => {
    const phases = [];
    let current = null;
    activeMonths.forEach(m => {
      const p = getPhase(m);
      if (!current || current.label !== p.label) { current = { ...p, span: 1 }; phases.push(current); } 
      else { current.span += 1; }
    });
    return phases;
  }, [activeMonths, terminology, competitionMonth]);

  // FIX 2: Cegah Materi Duplikat & Input Kosong
  const handleAddMaterial = () => {
    const cleanInput = materialInput.trim();
    if (cleanInput === '') return;
    if (materials.includes(cleanInput)) {
      alert(`Materi "${cleanInput}" sudah ada di dalam daftar!`);
      return;
    }
    setMaterials([...materials, cleanInput]);
    setMaterialInput('');
  };

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
        if(d.macroValues) setMacroValues(d.macroValues);
        if(d.dailySessions) setDailySessions(d.dailySessions);
        if(d.matrixData) setMatrixData(d.matrixData);
        if(d.materials) setMaterials(d.materials);
        if(d.locations) setLocations(d.locations);
        if(d.tryOutMonths) setTryOutMonths(d.tryOutMonths);
        if(d.nutritionNote) setNutritionNote(d.nutritionNote);
        
        // Backward compatibility untuk JSON lama
        if(d.mentalData) {
          setMentalData(d.mentalData);
        } else if (d.mentalScores && d.mentalLabels) {
          const migratedData = d.mentalLabels.map((lbl, i) => ({ id: `m${i}`, label: lbl, score: d.mentalScores[lbl] || 0 }));
          setMentalData(migratedData);
        }
        alert("Data atlet berhasil dimuat sempurna!");
      } catch (err) { alert("Format file salah!"); }
    };
    reader.readAsText(file);
    e.target.value = null; // Reset input
  };

  const handleSaveData = () => {
    const data = { athleteInfo, startMonth, endMonth, competitionMonth, terminology, macroValues, locations, tryOutMonths, dailySessions, matrixData, materials, mentalData, nutritionNote };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `Plan_${athleteInfo.name}.json`; a.click();
  };

  const handleExportPNG = async () => {
    const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
    const link = document.createElement('a'); link.href = canvas.toDataURL('image/png');
    link.download = `Plan_${athleteInfo.name}_by_fiqhipondaa9.png`; link.click();
  };

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();
    const macroSheet = chartData.map(d => ({ Bulan: d.name, Volume: `${d.Volume}%`, Intensitas: `${d.Intensitas}%`, Fase: getPhase(d.name).label }));
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(macroSheet), "Makrosiklus");
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet([athleteInfo]), "Profil Tim");
    XLSX.writeFile(wb, `Program_Latihan_${athleteInfo.name}_by_fiqhipondaa9.xlsx`);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6 font-sans text-slate-900 text-[11px]">
      
      {/* MODAL MATRIKS */}
      {showMatrixModal && (
        <div className="fixed inset-0 z-[110] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border">
            <div className="p-4 bg-blue-900 text-white flex justify-between font-black uppercase">
              <span>Materi Latihan Mingguan (Hukum Bompa 3:1)</span>
              <X className="cursor-pointer" onClick={() => setShowMatrixModal(false)}/>
            </div>
            <div className="p-4 overflow-auto flex-1">
              <table className="w-full border-collapse border">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="p-2 border sticky left-0 z-10 bg-slate-100 min-w-[150px]">Materi</th>
                    {activeMonths.map(m => (
                      <React.Fragment key={`th-${m}`}>
                        <th className="p-2 border bg-blue-50 font-black text-blue-900">W1</th>
                        <th className="p-2 border bg-blue-50 font-black text-blue-900">W2</th>
                        <th className="p-2 border bg-blue-50 font-black text-blue-900">W3</th>
                        <th className="p-2 border bg-green-100 font-black text-green-800 text-[9px]">W4<br/>Unload</th>
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {materials.map(mat => (
                    <tr key={mat}>
                      <td className="p-2 border bg-white sticky left-0 z-10 font-bold text-left">{mat}</td>
                      {activeMonths.map(m => [1,2,3,4].map(w => (
                        <td key={`${m}-W${w}`} className={`p-1 border text-center ${w===4 ? 'bg-green-50/30' : ''}`}>
                          <input type="checkbox" checked={!!matrixData[`${m}-W${w}-${mat}`]} onChange={() => setMatrixData(prev => ({...prev, [`${m}-W${w}-${mat}`]: !prev[`${m}-W${w}-${mat}`]}))} className="accent-blue-600 cursor-pointer" />
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
        <button onClick={handleExportExcel} className="bg-emerald-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 font-black shadow-md hover:bg-emerald-700 transition-all uppercase"><FileSpreadsheet className="w-3 h-3"/> Excel</button>
        <button onClick={() => window.print()} className="bg-slate-900 text-white px-5 py-2 rounded-xl flex items-center gap-2 font-black shadow-md hover:bg-slate-800 transition-all uppercase"><Download className="w-3 h-3"/> PDF</button>
      </div>

      <div ref={reportRef} className="max-w-[1200px] mx-auto p-10 bg-white rounded-3xl border shadow-lg relative overflow-hidden">
        
        {/* HEADER PROFIL */}
        <div className="grid grid-cols-3 gap-8 mb-10 border-b pb-8 items-center">
          <div className="space-y-4">
            <div>
              <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">NAMA TIM / ATLET</label>
              <input value={athleteInfo.name} onChange={e => setAthleteInfo({...athleteInfo, name: e.target.value})} className="w-full text-2xl font-black text-blue-900 outline-none uppercase bg-transparent" />
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
          {/* MAKROSIKLUS */}
          <div className="col-span-3 space-y-8">
            <div className="border p-8 rounded-3xl bg-white shadow-sm relative border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-black uppercase flex items-center gap-2 tracking-tighter text-sm"><Zap className="text-orange-500 w-5 h-5"/> Grafik Beban Makrosiklus</h2>
                <div className="flex gap-4">
                  <div className="flex items-center gap-1"><div className="w-3 h-1 bg-red-500 rounded-full"/><span className="text-[8px] font-black text-slate-400 uppercase">Intensitas</span></div>
                  <div className="flex items-center gap-1"><div className="w-3 h-1 bg-blue-500 rounded-full"/><span className="text-[8px] font-black text-slate-400 uppercase">Volume</span></div>
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
                    <ReferenceLine x={competitionMonth} stroke="#ef4444" strokeDasharray="5 5" label={{ position: 'top', value: 'TARGET', fill: '#ef4444', fontSize: 9, fontWeight: 'bold' }} />
                    <Line type="monotone" name="Intensitas" dataKey="Intensitas" stroke="#ef4444" strokeWidth={5} dot={{r: 5, fill: '#ef4444'}} activeDot={{r: 8}}/>
                    <Line type="monotone" name="Volume" dataKey="Volume" stroke="#3b82f6" strokeWidth={5} dot={{r: 5, fill: '#3b82f6'}} activeDot={{r: 8}}/>
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-10 grid grid-cols-12 gap-2">
                {activeMonths.map(m => (
                  <div key={m} className="bg-slate-50 p-2 rounded-2xl border border-slate-100 text-center space-y-2 shadow-sm">
                    <span className="font-black text-slate-400 text-[9px] uppercase">{m}</span>
                    <div className="space-y-1">
                      <input type="number" value={macroValues[m]?.int} onChange={e => setMacroValues({...macroValues, [m]: {...macroValues[m], int: Number(e.target.value)}})} className="w-full text-center font-black text-red-600 bg-white border border-red-50 rounded-lg p-1 outline-none text-[10px] focus:ring-1 focus:ring-red-400" title="Intensitas %"/>
                      <input type="number" value={macroValues[m]?.vol} onChange={e => setMacroValues({...macroValues, [m]: {...macroValues[m], vol: Number(e.target.value)}})} className="w-full text-center font-black text-blue-600 bg-white border border-blue-50 rounded-lg p-1 outline-none text-[10px] focus:ring-1 focus:ring-blue-400" title="Volume %"/>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              {/* SIKLUS MIKRO */}
              <div className="border p-6 rounded-3xl bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="font-black uppercase flex items-center gap-2 text-blue-900 tracking-tighter"><BarChart2 className="w-4 h-4"/> Siklus Mikro</h2>
                    <button onClick={() => setShowMatrixModal(true)} className="bg-slate-900 text-white px-3 py-1 rounded-xl font-black text-[8px] uppercase tracking-widest shadow-md hover:bg-slate-800 transition-colors">Matriks Mingguan</button>
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
                  <div className="flex gap-2 pt-4 border-t">
                    <input type="text" value={materialInput} onChange={e => setMaterialInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddMaterial()} className="flex-1 border p-2 rounded-xl outline-none focus:border-blue-500" placeholder="Tambah materi (Tekan Enter)..."/>
                    <button onClick={handleAddMaterial} className="bg-blue-600 text-white p-2 rounded-xl hover:bg-blue-700 transition-colors"><Plus/></button>
                  </div>
                </div>
              </div>

              {/* FOKUS PROPORSI */}
              <div className="border p-6 rounded-3xl bg-indigo-50/20 flex flex-col items-center justify-center">
                 <h2 className="font-black uppercase mb-4 flex items-center gap-2 text-indigo-900 tracking-tighter"><PieChartIcon className="w-4 h-4"/> Proporsi Latihan</h2>
                 <div className="h-48 w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={[{name:'Fisik', val:65, fill:'#ef4444'},{name:'Teknik', val:20, fill:'#eab308'},{name:'Psiko', val:15, fill:'#22c55e'}]}><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 9, fontWeight: 'bold'}}/><YAxis hide domain={[0, 100]}/><Bar dataKey="val" radius={[6, 6, 0, 0]}>{[0,1,2].map(i => <Cell key={i} fill={['#ef4444','#eab308','#22c55e'][i]} />)}</Bar></BarChart></ResponsiveContainer></div>
              </div>
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-8">
            <div className="border p-6 rounded-3xl bg-white shadow-sm border-orange-100 h-64 overflow-hidden flex flex-col">
               <h2 className="font-black uppercase flex items-center gap-2 mb-4 text-orange-600 tracking-tighter"><ClipboardList className="w-4 h-4"/> Gizi & Medis</h2>
               <textarea value={nutritionNote} onChange={e => setNutritionNote(e.target.value)} className="w-full bg-orange-50/30 border-none p-4 rounded-2xl flex-1 outline-none font-bold text-slate-600 leading-relaxed text-[10px]" placeholder="Ketik catatan gizi..." />
            </div>

            <div className="border p-6 rounded-3xl bg-white shadow-sm border-indigo-100 flex-1">
               <h2 className="font-black uppercase flex items-center gap-2 mb-4 text-indigo-600 tracking-tighter"><Target className="w-4 h-4"/> Event & Lokasi</h2>
               <div className="space-y-2 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
                  {activeMonths.map(m => (
                    <div key={m} className={`flex items-center gap-2 p-2 rounded-xl border transition-all ${m === competitionMonth ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-100'}`}>
                      <span className={`font-black w-8 text-[9px] ${m === competitionMonth ? 'text-red-600' : 'text-slate-400'}`}>{m.toUpperCase()}</span>
                      <input placeholder="Nama Event..." value={locations[m] || ''} onChange={e => setLocations({...locations, [m]: e.target.value})} className="bg-transparent outline-none w-full font-bold text-slate-600" />
                      <button onClick={() => {if(m !== competitionMonth) setTryOutMonths(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])}}><Flag className={`w-3 h-3 cursor-pointer ${tryOutMonths.includes(m) ? 'text-purple-600 fill-purple-600' : 'text-slate-200'}`} /></button>
                    </div>
                  ))}
               </div>
            </div>
          </div>

          {/* PSIKOLOGI (FIX POIN 1) */}
          <div className="col-span-4 border p-8 rounded-3xl bg-slate-900 text-white shadow-inner">
            <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
              <h2 className="font-black uppercase flex items-center gap-2 tracking-tighter text-sm"><Brain className="w-5 h-5 text-purple-400"/> Asesmen Psikologi Bertarung</h2>
              <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest italic">by fiqhipondaa9 system</span>
            </div>
            <div className="grid grid-cols-9 gap-4">
               {mentalData.map((item, idx) => (
                 <div key={item.id} className="space-y-2 text-center group">
                   <input value={item.label} onChange={e => { const newData = [...mentalData]; newData[idx].label = e.target.value; setMentalData(newData); }} className="bg-transparent text-[8px] font-black text-slate-500 uppercase outline-none text-center focus:text-purple-400 transition-colors w-full" />
                   <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 shadow-md group-hover:border-purple-500/50 transition-all">
                     <input type="number" min="1" max="9" value={item.score} onChange={e => { const newData = [...mentalData]; newData[idx].score = Number(e.target.value); setMentalData(newData); }} className="bg-transparent w-full text-center font-black text-xl text-purple-400 outline-none" />
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