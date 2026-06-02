import React from 'react';
import { Target, CheckCircle2, ArrowRight, Plus, X } from 'lucide-react';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const ControlPanel = ({
  activeStep,
  setActiveStep,
  athleteInfo,
  setAthleteInfo,
  startYear,
  setStartYear,
  startMonth,
  setStartMonth,
  endMonth,
  setEndMonth,
  phaseProps,
  setPhaseProps,
  activeMonths,
  competitionWeeks,
  setCompetitionWeeks,
  tryOutWeeks,
  setTryOutWeeks,
  tryInWeeks,
  setTryInWeeks,
  materials,
  setMaterials,
  materialInput,
  setMaterialInput,
  macroValues,
  setMacroValues,
  trainingFactors,
  setTrainingFactors,
  setMatrixData,
  t
}) => {

  const LOCKED_COMPONENTS = ['Endurance', 'Strength', 'Speed', 'Fleksibilitas', 'Teknik Dasar', 'Teknik Lanjutan', 'Mental / Psikologis'];
  const allMaterials = Array.from(new Set([...LOCKED_COMPONENTS, ...materials]));

  const handleAddMaterial = () => {
    const cleanInput = materialInput.trim();
    if (cleanInput === '') return;
    if (allMaterials.includes(cleanInput)) return alert(`Materi "${cleanInput}" sudah ada!`);
    setMaterials([...materials, cleanInput]);
    setMaterialInput('');
  };

  const removeMaterial = (mToRemove) => {
    setMaterials(materials.filter(x => x !== mToRemove));
    setMatrixData(prev => {
      const newData = { ...prev };
      Object.keys(newData).forEach(key => { if (key.endsWith(`-${mToRemove}`)) delete newData[key]; });
      return newData;
    });
  };

  return (
    <div className="bg-slate-50 border-b border-slate-200 p-6 print:hidden">
       <h2 className="font-black text-sm uppercase text-slate-800 mb-4 flex items-center gap-2">
         <Target className={`w-5 h-5 ${t.text}`}/> Control Panel: SOP Pembuatan Periodisasi
       </h2>
       
       <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
         {[1,2,3,4,5,6,7].map(step => {
           let stepName = '';
            if (step === 1) stepName = "1. Identitas & Waktu";
            if (step === 2) stepName = "2. Pembagian Fase";
            if (step === 3) stepName = "3. Peaking & Uji Coba";
            if (step === 4) stepName = "4. Komponen Latihan";
            if (step === 5) stepName = "5. Beban & Peaking";
            if (step === 6) stepName = "6. Proporsi Faktor";
            if (step === 7) stepName = "7. Evaluasi Akhir";

           return (
             <button 
               key={step} 
               onClick={() => setActiveStep(step)} 
               className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl border text-[9px] font-black uppercase transition-all flex items-center justify-center gap-2 ${activeStep === step ? `${t.bg} text-white shadow-md border-transparent` : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'}`}
             >
               {activeStep > step ? <CheckCircle2 className="w-3 h-3"/> : stepName}
             </button>
           );
         })}
       </div>

       <div className="bg-white p-5 rounded-2xl border shadow-sm min-h-[160px] flex flex-col justify-between">
         {activeStep === 1 && (
           <div className="animate-in fade-in slide-in-from-bottom-2">
             <h3 className="font-black text-[11px] text-slate-700 uppercase mb-3 border-b pb-2">1. Pengaturan Identitas & Total Waktu</h3>
             <div className="grid grid-cols-3 gap-4 mb-4">
               <div><label className="block text-[9px] font-bold text-slate-500 mb-1">CABANG OLAHRAGA</label><input value={athleteInfo.cabor} onChange={e => setAthleteInfo({...athleteInfo, cabor: e.target.value})} className="w-full border p-2 rounded-lg text-[10px] font-black uppercase" placeholder="Contoh: ATLETIK"/></div>
               <div><label className="block text-[9px] font-bold text-slate-500 mb-1">NAMA ATLET / TIM</label><input value={athleteInfo.name} onChange={e => setAthleteInfo({...athleteInfo, name: e.target.value})} className="w-full border p-2 rounded-lg text-[10px] font-black uppercase" placeholder="Nama Atlet/Tim"/></div>
               <div><label className="block text-[9px] font-bold text-slate-500 mb-1">USIA / KATEGORI</label><input value={athleteInfo.age} onChange={e => setAthleteInfo({...athleteInfo, age: e.target.value})} className="w-full border p-2 rounded-lg text-[10px] font-black uppercase" placeholder="Contoh: U-19 / Senior"/></div>
               <div><label className="block text-[9px] font-bold text-slate-500 mb-1">PROVINSI / DAERAH</label><input value={athleteInfo.prov} onChange={e => setAthleteInfo({...athleteInfo, prov: e.target.value})} className="w-full border p-2 rounded-lg text-[10px] font-black uppercase" placeholder="Contoh: DKI JAKARTA"/></div>
               <div><label className="block text-[9px] font-bold text-slate-500 mb-1">NAMA PELATIH</label><input value={athleteInfo.coach} onChange={e => setAthleteInfo({...athleteInfo, coach: e.target.value})} className="w-full border p-2 rounded-lg text-[10px] font-black uppercase" placeholder="Nama Pelatih Utama"/></div>
               <div><label className="block text-[9px] font-bold text-slate-500 mb-1">TARGET TAHUNAN</label><input value={athleteInfo.target} onChange={e => setAthleteInfo({...athleteInfo, target: e.target.value})} className="w-full border p-2 rounded-lg text-[10px] font-black uppercase" placeholder="Contoh: JUARA PON"/></div>
             </div>

             <div className="grid grid-cols-3 gap-4 border-t pt-4 mb-4 bg-slate-50 p-4 rounded-xl border">
                <div>
                  <label className="block text-[9px] font-black text-blue-700 mb-1">DURASI MAKSIMAL MINGGUAN (MENIT)</label>
                  <input type="number" value={athleteInfo.maxDuration || 300} onChange={e => setAthleteInfo({...athleteInfo, maxDuration: Number(e.target.value)})} className="w-full border p-2 rounded-lg text-[10px] font-black text-blue-600"/>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-amber-700 mb-1">1RM BENCH PRESS / UPPER BODY (KG)</label>
                  <input type="number" value={athleteInfo.benchPress1RM || 100} onChange={e => setAthleteInfo({...athleteInfo, benchPress1RM: Number(e.target.value)})} className="w-full border p-2 rounded-lg text-[10px] font-black text-amber-600"/>
                </div>
                <div>
                  <label className="block text-[9px] font-black text-amber-700 mb-1">1RM SQUAT / LOWER BODY (KG)</label>
                  <input type="number" value={athleteInfo.squat1RM || 100} onChange={e => setAthleteInfo({...athleteInfo, squat1RM: Number(e.target.value)})} className="w-full border p-2 rounded-lg text-[10px] font-black text-amber-600"/>
                </div>
              </div>

             <div className="grid grid-cols-3 gap-4 border-t pt-4">
               <div><label className="block text-[9px] font-bold text-slate-500 mb-1">TAHUN MULAI</label><input type="number" value={startYear} onChange={e => setStartYear(Number(e.target.value))} className="w-full border p-2 rounded-lg text-[10px] font-black uppercase"/></div>
               <div><label className="block text-[9px] font-bold text-slate-500 mb-1">BULAN MULAI</label><select value={startMonth} onChange={e => setStartMonth(Number(e.target.value))} className="w-full border p-2 rounded-lg text-[10px] font-black uppercase cursor-pointer">{months.map((m,i)=><option key={m} value={i}>{m}</option>)}</select></div>
               <div><label className="block text-[9px] font-bold text-slate-500 mb-1">BULAN SELESAI</label><select value={endMonth} onChange={e => setEndMonth(Number(e.target.value))} className="w-full border p-2 rounded-lg text-[10px] font-black uppercase cursor-pointer">{months.map((m,i)=><option key={m} value={i}>{m} {startMonth > i ? '(Tahun Depan)' : ''}</option>)}</select></div>
             </div>
             <div className="mt-4 flex justify-end"><button onClick={() => setActiveStep(2)} className={`px-4 py-2 text-white font-black text-[10px] rounded-lg flex items-center gap-1 ${t.bg} ${t.hoverBg}`}>Lanjut <ArrowRight className="w-3 h-3"/></button></div>
           </div>
         )}

         {activeStep === 2 && (
           <div className="animate-in fade-in slide-in-from-bottom-2">
             <h3 className="font-black text-[11px] text-slate-700 uppercase mb-3 border-b pb-2">2. Pembagian Periode & Fase (%)</h3>
             <div className="grid grid-cols-2 gap-6">
               <div><label className="block text-[9px] font-bold text-slate-500 mb-1">PROPORSI FASE PERSIAPAN UMUM VS KHUSUS (%)</label><input type="number" value={phaseProps.prep} onChange={e => setPhaseProps({...phaseProps, prep: Number(e.target.value)})} className="w-full border p-2 rounded-lg text-[11px] font-black text-blue-600"/></div>
             </div>
             <p className="text-[9px] font-bold text-slate-400 mt-2 italic">*Aplikasi menggunakan metode Backward Planning. Fase dihitung mundur secara otomatis dari Target Minggu Kompetisi Utama.</p>
             <div className="mt-4 flex justify-end"><button onClick={() => setActiveStep(3)} className={`px-4 py-2 text-white font-black text-[10px] rounded-lg flex items-center gap-1 ${t.bg} ${t.hoverBg}`}>Lanjut <ArrowRight className="w-3 h-3"/></button></div>
           </div>
         )}

         {activeStep === 3 && (
           <div className="animate-in fade-in slide-in-from-bottom-2">
             <h3 className="font-black text-[11px] text-slate-700 uppercase mb-3 border-b pb-2">3. Penentuan Peaking & Uji Coba (Spesifik Minggu)</h3>
             <div className="grid grid-cols-3 gap-6 h-[340px]">
               <div className="bg-red-50 p-3 rounded-xl border border-red-100 flex flex-col h-full">
                 <label className="block text-[9px] font-black text-red-700 mb-2 uppercase tracking-wider">🎯 KOMPETISI UTAMA (BISA {'>'}1 MINGGU)</label>
                 <div className="grid grid-cols-2 gap-2 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                   {activeMonths.map(m => (
                     <div key={`peak-container-${m}`} className="bg-white p-1.5 rounded-lg border text-center h-fit">
                       <span className="text-[9px] font-black text-slate-700 block mb-1">{m}</span>
                       <div className="flex justify-center gap-0.5 flex-wrap">
                         {[1, 2, 3, 4].map(w => {
                           const key = `${m}-W${w}`;
                           const isChecked = competitionWeeks.includes(key);
                           return (
                             <button key={`peak-btn-${key}`} onClick={() => setCompetitionWeeks(prev => prev.includes(key) ? prev.filter(x => x !== key) : [...prev, key])} className={`w-5 h-5 text-[8px] font-black rounded transition-all ${isChecked ? 'bg-red-600 text-white shadow-sm' : 'bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-100'}`}>
                               W{w}
                             </button>
                           );
                         })}
                       </div>
                     </div>
                   ))}
                 </div>
               </div>

               <div className="col-span-2 flex flex-col gap-3 h-full">
                 <div className="bg-purple-50 p-3 rounded-xl border border-purple-100 flex-1 flex flex-col">
                   <label className="block text-[9px] font-black text-purple-700 mb-2 uppercase tracking-wider">✈️ Try Out / Laga Tandang (Pilih Minggu Spesifik)</label>
                   <div className="grid grid-cols-4 gap-2 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                     {activeMonths.map(m => (
                       <div key={`to-container-${m}`} className="bg-white p-1.5 rounded-lg border text-center h-fit">
                         <span className="text-[9px] font-black text-slate-700 block mb-1">{m}</span>
                         <div className="flex justify-center gap-0.5">
                           {[1, 2, 3, 4].map(w => {
                             const key = `${m}-W${w}`;
                             const isChecked = !!tryOutWeeks[key];
                             return (
                               <button key={`to-btn-${key}`} onClick={() => setTryOutWeeks(p => ({ ...p, [key]: !p[key] }))} className={`w-5 h-5 text-[8px] font-black rounded transition-all ${isChecked ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-100'}`}>
                                 W{w}
                               </button>
                             );
                           })}
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>

                 <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 flex-1 flex flex-col">
                   <label className="block text-[9px] font-black text-orange-700 mb-2 uppercase tracking-wider">🏠 Try In / Laga Internal (Pilih Minggu Spesifik)</label>
                   <div className="grid grid-cols-4 gap-2 flex-1 overflow-y-auto pr-1 custom-scrollbar">
                     {activeMonths.map(m => (
                       <div key={`ti-container-${m}`} className="bg-white p-1.5 rounded-lg border text-center h-fit">
                         <span className="text-[9px] font-black text-slate-700 block mb-1">{m}</span>
                         <div className="flex justify-center gap-0.5">
                           {[1, 2, 3, 4].map(w => {
                             const key = `${m}-W${w}`;
                             const isChecked = !!tryInWeeks[key];
                             return (
                               <button key={`ti-btn-${key}`} onClick={() => setTryInWeeks(p => ({ ...p, [key]: !p[key] }))} className={`w-5 h-5 text-[8px] font-black rounded transition-all ${isChecked ? 'bg-orange-500 text-white shadow-sm' : 'bg-slate-50 text-slate-400 border border-slate-200 hover:bg-slate-100'}`}>
                                 W{w}
                               </button>
                             );
                           })}
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               </div>
             </div>
             <div className="mt-4 flex justify-end"><button onClick={() => setActiveStep(4)} className={`px-4 py-2 text-white font-black text-[10px] rounded-lg flex items-center gap-1 ${t.bg} ${t.hoverBg}`}>Lanjut <ArrowRight className="w-3 h-3"/></button></div>
           </div>
         )}

         {activeStep === 4 && (
           <div className="animate-in fade-in slide-in-from-bottom-2">
             <h3 className="font-black text-[11px] text-slate-700 uppercase mb-3 border-b pb-2">4. Masukan Komponen Latihan Tambahan</h3>
             <div className="flex gap-2 flex-wrap items-center">
               {LOCKED_COMPONENTS.map(c => <span key={c} className="px-3 py-1.5 bg-slate-100 border text-[9px] font-black rounded-lg text-slate-600 uppercase">{c}</span>)}
               {materials.filter(m => !LOCKED_COMPONENTS.includes(m)).map(c => (
                 <span key={c} className={`px-3 py-1.5 border text-[9px] font-black rounded-lg uppercase flex items-center gap-2 ${t.bgLight} ${t.text} ${t.borderLight}`}>
                   {c} <button onClick={() => removeMaterial(c)} className="text-red-500 hover:text-red-700 focus:outline-none"><X className="w-3 h-3"/></button>
                 </span>
               ))}
             </div>
             <div className="mt-3 flex gap-2 w-72">
               <input type="text" value={materialInput} onChange={e => setMaterialInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddMaterial()} className="border p-2 rounded-lg outline-none text-[10px] w-full focus:ring-1" style={{ '--tw-ring-color': t.hex }} placeholder="Ketik materi tambahan..."/>
               <button onClick={handleAddMaterial} className={`px-3 rounded-lg text-white font-black ${t.bg} ${t.hoverBg}`}><Plus className="w-4 h-4"/></button>
             </div>
             <div className="mt-4 flex justify-between items-center">
                <p className="text-[9px] font-bold text-slate-400 italic">*Komponen wajib telah dikunci. Anda bisa menambah materi khusus di sini.</p>
                <button onClick={() => setActiveStep(5)} className={`px-4 py-2 text-white font-black text-[10px] rounded-lg flex items-center gap-1 ${t.bg} ${t.hoverBg}`}>Lanjut <ArrowRight className="w-3 h-3"/></button>
             </div>
           </div>
         )}

         {activeStep === 5 && (
           <div className="animate-in fade-in slide-in-from-bottom-2">
             <h3 className="font-black text-[11px] text-slate-700 uppercase mb-3 border-b pb-2">5. Pengaturan Volume, Intensitas & Grafik Peaking</h3>
             <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
               {activeMonths.map(m => {
                 const computedMinutes = Math.round(((macroValues[m]?.vol || 50) / 100) * (athleteInfo.maxDuration || 300));
                 const computedBP = Math.round(((macroValues[m]?.int || 50) / 100) * (athleteInfo.benchPress1RM || 100));
                 const computedSquat = Math.round(((macroValues[m]?.int || 50) / 100) * (athleteInfo.squat1RM || 100));

                 return (
                   <div key={m} className="min-w-[105px] bg-slate-50 border p-2 rounded-xl text-center space-y-1">
                     <span className="text-[9px] font-black uppercase block mb-1 border-b pb-0.5">{m}</span>
                     <div className="flex items-center justify-between gap-1">
                       <span className="text-[8px] font-bold text-slate-400">Vol</span>
                       <input type="number" value={macroValues[m]?.vol} onChange={e=>setMacroValues({...macroValues, [m]:{...macroValues[m], vol:Number(e.target.value)}})} className="w-12 border rounded text-center text-[10px] font-black text-blue-600 p-0.5"/>
                     </div>
                     <div className="flex items-center justify-between gap-1">
                       <span className="text-[8px] font-bold text-slate-400">Int</span>
                       <input type="number" value={macroValues[m]?.int} onChange={e=>setMacroValues({...macroValues, [m]:{...macroValues[m], int:Number(e.target.value)}})} className="w-12 border rounded text-center text-[10px] font-black text-red-600 p-0.5"/>
                     </div>
                     <div className="flex items-center justify-between gap-1 pb-1">
                       <span className="text-[8px] font-bold text-slate-400">Peak</span>
                       <input type="number" min="1" max="5" value={macroValues[m]?.peak} onChange={e=>setMacroValues({...macroValues, [m]:{...macroValues[m], peak:Number(e.target.value)}})} className="w-12 border rounded text-center text-[10px] font-black text-orange-500 p-0.5"/>
                     </div>
                     <div className="border-t pt-1 space-y-0.5 text-left bg-white p-1 rounded border border-slate-100 text-[8px] font-black">
                       <div className="text-blue-700 truncate">⏱️ {computedMinutes} m/w</div>
                       <div className="text-amber-700 truncate">🏋️‍♂️ BP: {computedBP}kg</div>
                       <div className="text-amber-900 truncate">🦵 SQ: {computedSquat}kg</div>
                     </div>
                   </div>
                 );
               })}
             </div>
             <div className="mt-4 flex justify-end"><button onClick={() => setActiveStep(6)} className={`px-4 py-2 text-white font-black text-[10px] rounded-lg flex items-center gap-1 ${t.bg} ${t.hoverBg}`}>Lanjut <ArrowRight className="w-3 h-3"/></button></div>
           </div>
         )}

         {activeStep === 6 && (
           <div className="animate-in fade-in slide-in-from-bottom-2">
             <h3 className="font-black text-[11px] text-slate-700 uppercase mb-3 border-b pb-2">6. Proporsi Faktor Latihan (%)</h3>
             <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
               {activeMonths.map(m => (
                 <div key={`fac-${m}`} className="min-w-[100px] bg-slate-50 border p-2 rounded-xl text-center space-y-1">
                   <span className="text-[9px] font-black uppercase block mb-1">{m}</span>
                   <div className="flex items-center gap-1"><span className="text-[8px] text-slate-400 font-bold w-6 text-left">Fis</span><input type="number" value={trainingFactors[m]?.fisik} onChange={e=>setTrainingFactors({...trainingFactors, [m]:{...trainingFactors[m], fisik:Number(e.target.value)}})} className="w-full border rounded text-center text-[10px] font-black p-1"/></div>
                   <div className="flex items-center gap-1"><span className="text-[8px] text-slate-400 font-bold w-6 text-left">Tek</span><input type="number" value={trainingFactors[m]?.teknik} onChange={e=>setTrainingFactors({...trainingFactors, [m]:{...trainingFactors[m], teknik:Number(e.target.value)}})} className="w-full border rounded text-center text-[10px] font-black p-1"/></div>
                   <div className="flex items-center gap-1"><span className="text-[8px] text-slate-400 font-bold w-6 text-left">Tak</span><input type="number" value={trainingFactors[m]?.taktik} onChange={e=>setTrainingFactors({...trainingFactors, [m]:{...trainingFactors[m], taktik:Number(e.target.value)}})} className="w-full border rounded text-center text-[10px] font-black p-1"/></div>
                   <div className="flex items-center gap-1"><span className="text-[8px] text-slate-400 font-bold w-6 text-left">Psi</span><input type="number" value={trainingFactors[m]?.psikis} onChange={e=>setTrainingFactors({...trainingFactors, [m]:{...trainingFactors[m], psikis:Number(e.target.value)}})} className="w-full border rounded text-center text-[10px] font-black p-1"/></div>
                 </div>
               ))}
             </div>
             <div className="mt-4 flex justify-end"><button onClick={() => setActiveStep(7)} className={`px-4 py-2 text-white font-black text-[10px] rounded-lg flex items-center gap-1 ${t.bg} ${t.hoverBg}`}>Lanjut <ArrowRight className="w-3 h-3"/></button></div>
           </div>
         )}

         {activeStep === 7 && (
           <div className="animate-in fade-in slide-in-from-bottom-2 flex flex-col justify-center items-center h-full gap-4 text-center py-4">
             <div>
               <h3 className="font-black text-sm text-slate-800 uppercase mb-2">7. Matriks Kalender Siap Dievaluasi</h3>
               <p className="text-[10px] font-bold text-slate-500 max-w-md mx-auto">Semua variabel telah diatur. Langkah terakhir adalah menceklis jadwal tes pada matriks kalender, dan mengisi catatan gizi serta menu harian di panel bawah.</p>
             </div>
             <button onClick={() => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})} className={`px-8 py-3 text-white font-black text-[11px] rounded-xl uppercase flex items-center gap-2 shadow-lg transition-transform hover:scale-105 ${t.bg} ${t.hoverBg}`}>Gulir ke Bawah Untuk Lihat Matriks <ArrowRight className="w-4 h-4"/></button>
           </div>
         )}
       </div>
    </div>
  );
};

export default ControlPanel;