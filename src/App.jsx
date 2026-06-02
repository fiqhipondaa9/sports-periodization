import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, Legend } from 'recharts';
import { Coffee, X, CheckCircle, AlertTriangle, Monitor, Globe } from 'lucide-react';
import DailyModal from './DailyModal';
import BiomotorPanel from "./BiomotorPanel";
import PsychologicalPanel from "./PsychologicalPanel";
import NutritionPanel from "./NutritionPanel";
import EvaluationPanel from "./EvaluationPanel";
import MicrocyclePanel from "./MicrocyclePanel";
import ControlPanel from "./ControlPanel";
import PeriodizationTable from "./PeriodizationTable";
import { toPng } from 'html-to-image';
import * as XLSX from 'xlsx';
import qrisImage from './assets/shareqr.png';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const LOCKED_COMPONENTS = ['Endurance', 'Strength', 'Speed', 'Fleksibilitas', 'Teknik Dasar', 'Teknik Lanjutan', 'Mental / Psikologis'];

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

const App = () => {
  const reportRef = useRef(null);
  const fileInputRef = useRef(null);

  const [activeTheme, setActiveTheme] = useState('blue');
  const t = THEMES[activeTheme];
  const [activeStep, setActiveStep] = useState(1);
  const [startYear, setStartYear] = useState(new Date().getFullYear());
  
  const [athleteInfo, setAthleteInfo] = useState({ 
    cabor: 'edit', 
    name: 'edit', 
    age: 'edit', 
    prov: 'edit', 
    coach: 'edit',
    target: 'edit',
    maxDuration: 300, 
    benchPress1RM: 100,
    squat1RM: 100
  });
  
  const [startMonth, setStartMonth] = useState(0); 
  const [endMonth, setEndMonth] = useState(11); 
  const [phaseProps, setPhaseProps] = useState({ prep: 50, comp: 50, transWeeks: 4 });
  
  const [competitionWeeks, setCompetitionWeeks] = useState(['Okt-W4']); 
  const [tryOutWeeks, setTryOutWeeks] = useState({});
  const [tryInWeeks, setTryInWeeks] = useState({});

  // tryOutMonths & tryInMonths dihapus — tidak digunakan

  const [locations, setLocations] = useState({});
  const [monthlyObjectives, setMonthlyObjectives] = useState(months.reduce((acc, m) => ({ ...acc, [m]: '' }), {}));
  const [macroValues, setMacroValues] = useState(months.reduce((acc, m) => ({ ...acc, [m]: { vol: 50, int: 50, peak: 3 } }), {}));
  const [trainingFactors, setTrainingFactors] = useState(months.reduce((acc, m) => ({ ...acc, [m]: { fisik: 40, teknik: 30, taktik: 20, psikis: 10 } }), {}));
  
  const [materials, setMaterials] = useState(['Simulasi Game', 'Drilling Defence']);
  const [materialInput, setMaterialInput] = useState('');
  const [matrixData, setMatrixData] = useState({});
  const [testSchedule, setTestSchedule] = useState({});
  
  const [microType, setMicroType] = useState('Developmental');
  const [toast, setToast] = useState(null); // { message, type: 'success'|'error' }

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [showCoffeeModal, setShowCoffeeModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Sen');
  const [dailySessions, setDailySessions] = useState(['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].reduce((acc, d) => ({ ...acc, [d]: { morning: { menu: '', int: 5 }, afternoon: { menu: '', int: 5 } } }), {}));
  
  const [mentalData, setMentalData] = useState([
    { id: 'm1', label: 'Keberanian', score: 8 }, { id: 'm2', label: 'Fokus', score: 8 }, { id: 'm3', label: 'Motivasi', score: 8 },
    { id: 'm4', label: 'Emosi', score: 8 }, { id: 'm5', label: 'Resiliensi', score: 8 }, { id: 'm6', label: 'Disiplin', score: 8 }
  ]);
  
  const [evaluation, setEvaluation] = useState({ name: 'Tes Fisik Bleep', score: 50, target: 100, isTime: false });
  const [terminology, setTerminology] = useState('Eropa');
  const [nutritionNote, setNutritionNote] = useState('Input catatan gizi, suplemen, atau berat badan di sini.');
  const [isProjectorMode, setIsProjectorMode] = useState(false);

  const calculatedEndYear = startMonth <= endMonth ? startYear : startYear + 1;

  const activeMonths = useMemo(() => {
    if (startMonth <= endMonth) return months.slice(startMonth, endMonth + 1);
    return [...months.slice(startMonth), ...months.slice(0, endMonth + 1)];
  }, [startMonth, endMonth]);

  const allMaterials = useMemo(() => Array.from(new Set([...LOCKED_COMPONENTS, ...materials])), [materials]);
  const allWeeks = useMemo(() => activeMonths.flatMap(m => [1,2,3,4].map(w => `${m}-W${w}`)), [activeMonths]);

  useEffect(() => {
    const apresiasiTimer = setInterval(() => {
      if (!isProjectorMode) {
        setShowCoffeeModal(true);
      }
    }, 33 * 60 * 1000); 

    return () => clearInterval(apresiasiTimer);
  }, [isProjectorMode]);

  useEffect(() => {
    const validWeeks = competitionWeeks.filter(w => allWeeks.includes(w));
    if (validWeeks.length !== competitionWeeks.length && allWeeks.length > 0) {
       setCompetitionWeeks(validWeeks.length > 0 ? validWeeks : [allWeeks[allWeeks.length - 1]]);
    }
  }, [allWeeks, competitionWeeks]);

  const getPhaseDataWeek = (weekKey) => {
    const currIdx = allWeeks.indexOf(weekKey);
    const peakIndices = competitionWeeks.map(w => allWeeks.indexOf(w)).filter(i => i !== -1).sort((a,b) => a-b);
    const firstPeakIdx = peakIndices.length > 0 ? peakIndices[0] : -1;
    const lastPeakIdx = peakIndices.length > 0 ? peakIndices[peakIndices.length - 1] : -1;

    if (currIdx === -1 || firstPeakIdx === -1) return { phase: 'PERSIAPAN', subPhase: 'PERSIAPAN UMUM', color: `${t.bg} text-white`, subColor: `${t.bgLight} ${t.textDark}` };
    if (competitionWeeks.includes(weekKey)) return { phase: 'KOMPETISI', subPhase: 'KOMPETISI UTAMA', color: 'bg-red-600 text-white', subColor: 'bg-pink-600 text-white' };
    if (currIdx > lastPeakIdx) return { phase: 'TRANSISI', subPhase: 'PEMULIHAN AKTIF', color: 'bg-slate-500 text-white', subColor: 'bg-slate-400 text-white' };
    if (currIdx > firstPeakIdx && currIdx < lastPeakIdx) return { phase: 'KOMPETISI', subPhase: 'MAINTENANCE', color: 'bg-red-500 text-white', subColor: 'bg-pink-500 text-white' };
    if (currIdx >= firstPeakIdx - 4 && currIdx < firstPeakIdx) return { phase: 'KOMPETISI', subPhase: 'PRA KOMPETISI', color: 'bg-purple-600 text-white', subColor: 'bg-purple-400 text-white' };

    const prepLength = (firstPeakIdx - 4); 
    if (prepLength <= 0) return { phase: 'PERSIAPAN', subPhase: 'PERSIAPAN KHUSUS', color: `${t.bg} text-white`, subColor: 'bg-yellow-500 text-yellow-900' };

    const generalPrepLength = Math.ceil(prepLength * (phaseProps.prep / 100));
    if (currIdx < generalPrepLength) return { phase: 'PERSIAPAN', subPhase: 'PERSIAPAN UMUM', color: `${t.bg} text-white`, subColor: `${t.bgLight} ${t.textDark}` };
    return { phase: 'PERSIAPAN', subPhase: 'PERSIAPAN KHUSUS', color: `${t.bg} text-white`, subColor: 'bg-yellow-500 text-yellow-900' };
  };

  const unifiedPhases = useMemo(() => {
    const phases = []; let current = null;
    allWeeks.forEach(w => {
      const p = getPhaseDataWeek(w);
      if (!current || current.phase !== p.phase) { current = { phase: p.phase, color: p.color, span: 1 }; phases.push(current); } else { current.span += 1; }
    }); return phases;
  }, [allWeeks, competitionWeeks, phaseProps, activeTheme]);

  const unifiedSubPhases = useMemo(() => {
    const subPhases = []; let current = null;
    allWeeks.forEach(w => {
      const p = getPhaseDataWeek(w);
      if (!current || current.subPhase !== p.subPhase) { current = { subPhase: p.subPhase, color: p.subColor, span: 1 }; subPhases.push(current); } else { current.span += 1; }
    }); return subPhases;
  }, [allWeeks, competitionWeeks, phaseProps, activeTheme]);

  const chartData = useMemo(() => activeMonths.map(m => ({ name: m, Intensitas: macroValues[m]?.int || 0, Volume: macroValues[m]?.vol || 0, Peak: macroValues[m]?.peak || 0 })), [activeMonths, macroValues]);
  const peakMonthsForChart = useMemo(() => [...new Set(competitionWeeks.map(w => w.split('-')[0]))], [competitionWeeks]);

  const handleLoadData = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target.result);
        if(d.activeTheme && THEMES[d.activeTheme]) setActiveTheme(d.activeTheme);
        if(d.startYear) setStartYear(d.startYear);
        if(d.athleteInfo) setAthleteInfo({...athleteInfo, ...d.athleteInfo});
        if(d.startMonth !== undefined) setStartMonth(d.startMonth);
        if(d.endMonth !== undefined) setEndMonth(d.endMonth);
        if(d.phaseProps) setPhaseProps(d.phaseProps);
        if(d.competitionWeeks) setCompetitionWeeks(d.competitionWeeks);
        if(d.tryOutWeeks) setTryOutWeeks(d.tryOutWeeks);
        if(d.tryInWeeks) setTryInWeeks(d.tryInWeeks);
        if(d.locations) setLocations(d.locations);
        if(d.monthlyObjectives) setMonthlyObjectives(d.monthlyObjectives);
        if(d.macroValues) setMacroValues(d.macroValues);
        if(d.trainingFactors) setTrainingFactors(d.trainingFactors);
        if(d.matrixData) setMatrixData(d.matrixData);
        if(d.testSchedule) setTestSchedule(d.testSchedule);
        if(d.materials) setMaterials(d.materials);
        if(d.dailySessions) setDailySessions(d.dailySessions);
        if(d.nutritionNote) setNutritionNote(d.nutritionNote);
        if(d.evaluation) setEvaluation(d.evaluation);
        if(d.mentalData) setMentalData(d.mentalData);
        if(d.microType) setMicroType(d.microType);
        if(d.terminology) setTerminology(d.terminology);
        showToast(`✅ Data "${file.name}" berhasil dimuat!`, 'success');
      } catch (err) { showToast('❌ Format file salah atau rusak!', 'error'); }
    };
    reader.readAsText(file); e.target.value = null;
  };

  const handleSaveData = () => {
    const data = { activeTheme, startYear, athleteInfo, startMonth, endMonth, phaseProps, competitionWeeks, tryOutWeeks, tryInWeeks, locations, monthlyObjectives, macroValues, trainingFactors, matrixData, testSchedule, materials, dailySessions, nutritionNote, evaluation, mentalData, microType, terminology };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const filename = `Periodisasi_${athleteInfo.name || 'Program'}.json`;
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click();
    showToast(`💾 File "${filename}" berhasil disimpan!`, 'success');
  };

  const handleExportPNG = async () => {
    try {
      const el = reportRef.current; if (!el) return;
      const scrollContainer = el.querySelector('#periodization-matrix-root');
      const originalScrollClass = scrollContainer ? scrollContainer.className : '';
      const originalElWidth = el.style.width;
      el.style.width = '1450px'; 
      if (scrollContainer) {
         scrollContainer.style.overflow = 'visible';
         scrollContainer.classList.remove('overflow-x-auto');
      }
      await new Promise(resolve => setTimeout(resolve, 800));
      const dataUrl = await toPng(el, { backgroundColor: "#ffffff", pixelRatio: 2 });
      el.style.width = originalElWidth;
      if (scrollContainer) {
         scrollContainer.className = originalScrollClass;
         scrollContainer.style.overflow = '';
      }
      const link = document.createElement('a'); link.href = dataUrl; link.download = `Periodisasi_${athleteInfo.name || 'Plan'}.png`; link.click();
    } catch (error) { showToast('❌ Proses PNG gagal: ' + error.message, 'error'); }
  };

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new(); const aoa = []; const weeksCols = allWeeks.length;
    aoa.push(['Tahun', ...Array(weeksCols).fill(`${startYear} ${startMonth > endMonth ? '- ' + calculatedEndYear : ''}`)]);
    let bulanRow = ['Bulan']; activeMonths.forEach(m => { bulanRow.push(m, '', '', ''); }); aoa.push(bulanRow);
    let mingguRow = ['Minggu']; activeMonths.forEach((m, mIdx) => [1,2,3,4].forEach(w => mingguRow.push((mIdx*4)+w))); aoa.push(mingguRow);
    let toRow = ['Try Out']; allWeeks.forEach(w => toRow.push(tryOutWeeks[w] ? 'TO' : '')); aoa.push(toRow);
    let tiRow = ['Try In']; allWeeks.forEach(w => tiRow.push(tryInWeeks[w] ? 'TI' : '')); aoa.push(tiRow);
    let locRow = ['Waktu/Lokasi']; activeMonths.forEach(m => { locRow.push(locations[m] || '', '', '', ''); }); aoa.push(locRow);
    let faseRow = ['Fase']; unifiedPhases.forEach(p => { faseRow.push(p.phase); for(let i=1; i<p.span; i++) faseRow.push(''); }); aoa.push(faseRow);
    let subFaseRow = ['Sub Fase']; unifiedSubPhases.forEach(p => { subFaseRow.push(p.subPhase); for(let i=1; i<p.span; i++) subFaseRow.push(''); }); aoa.push(subFaseRow);
    let sasaranRow = ['Sasaran Prestasi']; activeMonths.forEach(m => { sasaranRow.push(monthlyObjectives[m] || '', '', '', ''); }); aoa.push(sasaranRow);
    aoa.push(['--- BENTUK LATIHAN ---', ...Array(weeksCols).fill('')]);
    allMaterials.forEach(mat => { let r = [mat]; allWeeks.forEach(w => r.push(matrixData[`${w}-${mat}`] ? 'V' : '')); aoa.push(r); });
    aoa.push(['--- TES & EVALUASI ---', ...Array(weeksCols).fill('')]);
    ['Tes Kesehatan', 'Tes Fisik', 'Tes Teknik', 'Tes Psikis'].forEach(test => { let r = [test]; allWeeks.forEach(w => r.push(testSchedule[`${w}-${test}`] ? 'V' : '')); aoa.push(r); });
    aoa.push(['--- BEBAN LATIHAN ---', ...Array(weeksCols).fill('')]);
    let volRow = ['Volume']; activeMonths.forEach(m => { volRow.push(macroValues[m]?.vol, '', '', ''); }); aoa.push(volRow);
    let intRow = ['Intensitas']; activeMonths.forEach(m => { intRow.push(macroValues[m]?.int, '', '', ''); }); aoa.push(intRow);
    let peakRow = ['Peak Performance']; activeMonths.forEach(m => { peakRow.push(macroValues[m]?.peak, '', '', ''); }); aoa.push(peakRow);
    aoa.push(['--- PROPORSI FAKTOR (%) ---', ...Array(weeksCols).fill('')]);
    let fisRow = ['Fisik (%)']; activeMonths.forEach(m => { fisRow.push(trainingFactors[m]?.fisik, '', '', ''); }); aoa.push(fisRow);
    let tekRow = ['Teknik (%)']; activeMonths.forEach(m => { tekRow.push(trainingFactors[m]?.teknik, '', '', ''); }); aoa.push(tekRow);
    let takRow = ['Taktik (%)']; activeMonths.forEach(m => { takRow.push(trainingFactors[m]?.taktik, '', '', ''); }); aoa.push(takRow);
    let psiRow = ['Psikologis (%)']; activeMonths.forEach(m => { psiRow.push(trainingFactors[m]?.psikis, '', '', ''); }); aoa.push(psiRow);

    const ws = XLSX.utils.aoa_to_sheet(aoa); const merges = [];
    merges.push({ s: {r:0, c:1}, e: {r:0, c:weeksCols} });
    activeMonths.forEach((m, i) => {
      const cS = 1 + i * 4; const cE = cS + 3;
      merges.push({ s: {r:1, c:cS}, e: {r:1, c:cE} }, { s: {r:5, c:cS}, e: {r:5, c:cE} }, { s: {r:8, c:cS}, e: {r:8, c:cE} });
      const rB = 9 + allMaterials.length + 1 + 4 + 1 + 1; merges.push({ s: {r:rB, c:cS}, e: {r:rB, c:cE} }, { s: {r:rB+1, c:cS}, e: {r:rB+1, c:cE} }, { s: {r:rB+2, c:cS}, e: {r:rB+2, c:cE} });
      const rF = rB+3 + 1; merges.push({ s: {r:rF, c:cS}, e: {r:rF, c:cE} }, { s: {r:rF+1, c:cS}, e: {r:rF+1, c:cE} }, { s: {r:rF+2, c:cS}, e: {r:rF+2, c:cE} }, { s: {r:rF+3, c:cS}, e: {r:rF+3, c:cE} });
    });
    let cC = 1; unifiedPhases.forEach(p => { const cE = cC + p.span - 1; if(p.span > 1) merges.push({ s: {r:6, c:cC}, e: {r:6, c:cE} }); cC = cE + 1; });
    cC = 1; unifiedSubPhases.forEach(p => { const cE = cC + p.span - 1; if(p.span > 1) merges.push({ s: {r:7, c:cC}, e: {r:7, c:cE} }); cC = cE + 1; });
    ws['!merges'] = merges; XLSX.utils.book_append_sheet(wb, ws, "Matrix_Periodisasi"); XLSX.writeFile(wb, `Program_${athleteInfo.name}.xlsx`);
  };

  const printStyles = { WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' };

  return (
    <div className="min-h-screen bg-slate-100 p-6 font-sans text-slate-900 text-[11px] print:p-0 print:bg-white" style={printStyles}>
      <style type="text/css">
        {`@media print { @page { size: landscape; margin: 10mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`}
      </style>

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className={`print:hidden fixed top-6 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-white text-[11px] font-black uppercase tracking-wide transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`}>
          {toast.type === 'success'
            ? <CheckCircle className="w-4 h-4 flex-shrink-0" />
            : <AlertTriangle className="w-4 h-4 flex-shrink-0" />}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="ml-2 opacity-70 hover:opacity-100"><X className="w-3.5 h-3.5" /></button>
        </div>
      )}

      {/* FAB KONSULTASI */}
      {!isProjectorMode && (
        <button onClick={() => setShowCoffeeModal(true)} className="print:hidden fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white h-14 rounded-full shadow-2xl z-50 flex items-center justify-center px-4 gap-0 hover:gap-3 transition-all duration-300 border-4 border-blue-100 group overflow-hidden">
          <div className="relative flex items-center justify-center"><Coffee className="w-6 h-6" /><span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span></div>
          <span className="max-w-0 opacity-0 group-hover:max-w-xs group-hover:opacity-100 transition-all duration-500 whitespace-nowrap font-black text-xs uppercase tracking-widest">Konsultasi WA</span>
        </button>
      )}

      {/* COFFEE MODAL */}
      {showCoffeeModal && (
        <div className="fixed inset-0 z-[200] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl flex flex-col p-8 text-center relative">
            <button onClick={() => setShowCoffeeModal(false)} className="absolute top-4 right-4 bg-slate-100 p-2 rounded-xl text-slate-400"><X className="w-5 h-5" /></button>
            <h3 className="text-xl font-black mb-2">Traktir Kopi Developer</h3>
            <div className="bg-slate-50 rounded-2xl p-4 mb-6 flex justify-center"><img src={qrisImage} alt="QRIS" className="max-w-[200px] rounded-xl" /></div>
            <a href="https://wa.me/6285340804702?text=Halo%20Developer..." target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white font-black py-4 rounded-xl w-full uppercase text-sm">Konsultasi WhatsApp</a>
          </div>
        </div>
      )}

      {/* DAILY MODAL */}
      <DailyModal showDailyModal={showDailyModal} setShowDailyModal={setShowDailyModal} selectedDay={selectedDay} dailySessions={dailySessions} setDailySessions={setDailySessions} athleteInfo={athleteInfo} t={t} />

      {/* TOOLBAR */}
      <div className="max-w-[1300px] mx-auto flex flex-wrap justify-between items-center gap-2 mb-6 print:hidden">
        <div className="flex items-center gap-3 flex-wrap">
          {/* PILIHAN TEMA WARNA */}
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border shadow-sm">
            {Object.entries(THEMES).map(([key, theme]) => (
              <button key={key} onClick={() => setActiveTheme(key)} className={`w-4 h-4 rounded-full border-2 ${activeTheme === key ? 'border-slate-900 scale-125' : 'border-transparent'}`} style={{ backgroundColor: theme.hex }} />
            ))}
          </div>
          {/* TOGGLE MAZHAB TERMINOLOGI */}
          <button
            onClick={() => setTerminology(t => t === 'Eropa' ? 'Amerika' : 'Eropa')}
            title="Ganti terminologi fase (Eropa/Amerika)"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border shadow-sm text-[9px] font-black uppercase transition-all ${terminology === 'Eropa' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-amber-50 border-amber-200 text-amber-700'}`}
          >
            <Globe className="w-3.5 h-3.5" />
            {terminology === 'Eropa' ? 'Eropa (Prep/Komp)' : 'Amerika (Macro/Meso)'}
          </button>
          {/* TOGGLE MODE PROYEKTOR */}
          <button
            onClick={() => setIsProjectorMode(prev => !prev)}
            title="Mode Proyektor: sembunyikan panel kontrol untuk presentasi"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border shadow-sm text-[9px] font-black uppercase transition-all ${isProjectorMode ? 'bg-slate-900 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-600'}`}
          >
            <Monitor className="w-3.5 h-3.5" />
            {isProjectorMode ? 'Mode Proyektor ON' : 'Mode Proyektor'}
          </button>
        </div>
        <div className="flex flex-wrap justify-end gap-2">
          <input type="file" ref={fileInputRef} className="hidden" onChange={handleLoadData} />
          <button onClick={() => fileInputRef.current.click()} className="bg-white border px-4 py-2 rounded-xl font-black text-blue-600 uppercase">Buka</button>
          <button onClick={handleSaveData} className="bg-white border px-4 py-2 rounded-xl font-black text-green-600 uppercase">Simpan</button>
          <button onClick={handleExportPNG} className={`text-white px-4 py-2 rounded-xl font-black uppercase ${t.bg}`}>PNG</button>
          <button onClick={handleExportExcel} className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-black uppercase">Excel</button>
          <button onClick={() => window.print()} className="bg-slate-900 text-white px-5 py-2 rounded-xl font-black uppercase">PDF</button>
        </div>

      </div>

      {/* MASTER CONTAINER AREA CETAK */}
      <div ref={reportRef} className="max-w-[1300px] mx-auto bg-white rounded-3xl border shadow-lg p-8 print:p-0 print:shadow-none print:border-none space-y-6">
        
        {/* HEADER BRAND */}
        <div className="flex justify-between items-end border-b-2 pb-4">
          <div>
            <h1 className={`text-2xl font-black uppercase ${t.textDark}`}>ANNUAL TRAINING PLAN SYSTEM</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Designed by fiqhipondaa9</p>
          </div>
          <table className="text-[10px] font-black uppercase text-slate-700">
            <tbody>
              <tr><td>Cabor</td><td>: {athleteInfo.cabor}</td></tr>
              <tr><td>Tim/Atlet</td><td className="text-blue-900">: {athleteInfo.name}</td></tr>
              <tr><td>Pelatih</td><td>: {athleteInfo.coach}</td></tr>
            </tbody>
          </table>
        </div>

        {/* SUB-KOMPONEN: PUSAT KENDALI PROGRAM WIZARD */}
        <ControlPanel 
          activeStep={activeStep} setActiveStep={setActiveStep} athleteInfo={athleteInfo} setAthleteInfo={setAthleteInfo}
          startYear={startYear} setStartYear={setStartYear} startMonth={startMonth} setStartMonth={setStartMonth}
          endMonth={endMonth} setEndMonth={setEndMonth} phaseProps={phaseProps} setPhaseProps={setPhaseProps}
          activeMonths={activeMonths} competitionWeeks={competitionWeeks} setCompetitionWeeks={setCompetitionWeeks}
          tryOutWeeks={tryOutWeeks} setTryOutWeeks={setTryOutWeeks} tryInWeeks={tryInWeeks} setTryInWeeks={setTryInWeeks}
          materials={materials} setMaterials={setMaterials} materialInput={materialInput} setMaterialInput={setMaterialInput}
          macroValues={macroValues} setMacroValues={setMacroValues} trainingFactors={trainingFactors} setTrainingFactors={setTrainingFactors}
          setMatrixData={setMatrixData} t={t}
        />

        {/* SUB-KOMPONEN FINAL: MATRIKS KALENDER PERIODISASI TAHUNAN */}
        <PeriodizationTable 
          activeMonths={activeMonths} competitionWeeks={competitionWeeks} tryOutWeeks={tryOutWeeks} tryInWeeks={tryInWeeks}
          materials={materials} macroValues={macroValues} trainingFactors={trainingFactors} matrixData={matrixData}
          setMatrixData={setMatrixData} athleteInfo={athleteInfo} terminology={terminology} testSchedule={testSchedule} setTestSchedule={setTestSchedule} t={t}
        />

        {/* GRAFIK DINAMIKA MAKRO MINGGUAN */}
        <div className="bg-slate-50 p-4 rounded-2xl border">
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Grafik Dinamika Beban Makro</p>
            <div className="flex items-center gap-4 text-[8px] font-black uppercase">
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-blue-500 inline-block"></span> Volume (%)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-red-500 inline-block"></span> Intensitas (%)</span>
              <span className="flex items-center gap-1"><span className="w-3 h-2 bg-yellow-300 border border-yellow-400 inline-block rounded-sm"></span> Peak Index (1–5) →</span>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 4, right: 40, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fontWeight: 'bold', fontSize: 9 }} />
                {/* Sumbu kiri: Volume & Intensitas (0–100%) */}
                <YAxis
                  yAxisId="left"
                  domain={[0, 100]}
                  tick={{ fontSize: 8, fontWeight: 'bold', fill: '#64748b' }}
                  tickFormatter={(v) => `${v}%`}
                  width={32}
                />
                {/* Sumbu kanan: Indeks Peak (0–5) */}
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                  tick={{ fontSize: 8, fontWeight: 'bold', fill: '#ca8a04' }}
                  tickFormatter={(v) => v === 0 ? '' : `P${v}`}
                  width={28}
                />
                <RechartsTooltip
                  contentStyle={{ fontSize: '10px', fontWeight: 'bold', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                  formatter={(value, name) => {
                    if (name === 'Peak Index') return [`${value} / 5`, 'Peak Index'];
                    return [`${value}%`, name];
                  }}
                />
                {peakMonthsForChart.map((pm, i) => (
                  <ReferenceLine
                    key={`ref-${i}`}
                    yAxisId="left"
                    x={pm}
                    stroke="#ef4444"
                    strokeDasharray="5 5"
                    label={{ value: '🏆 PEAK', fill: '#ef4444', fontSize: 9, fontWeight: 'bold', position: 'insideTopLeft' }}
                  />
                ))}
                {/* Area Peak — sumbu KANAN, skala 1–5 */}
                <Area
                  yAxisId="right"
                  type="monotone"
                  name="Peak Index"
                  dataKey="Peak"
                  fill="#fef08a"
                  stroke="#eab308"
                  strokeWidth={2}
                  fillOpacity={0.5}
                  dot={{ r: 3, fill: '#ca8a04', strokeWidth: 0 }}
                />
                {/* Line Intensitas — sumbu KIRI, skala 0–100% */}
                <Line
                  yAxisId="left"
                  type="monotone"
                  name="Intensitas"
                  dataKey="Intensitas"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 3, fill: '#ef4444', strokeWidth: 0 }}
                />
                {/* Line Volume — sumbu KIRI, skala 0–100% */}
                <Line
                  yAxisId="left"
                  type="monotone"
                  name="Volume"
                  dataKey="Volume"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 3, fill: '#3b82f6', strokeWidth: 0 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* PANEL BAWAH GRID LAYOUT */}
        <div className="grid grid-cols-2 gap-6 print:hidden">
          <MicrocyclePanel microType={microType} setMicroType={setMicroType} dailySessions={dailySessions} setSelectedDay={setSelectedDay} setShowDailyModal={setShowDailyModal} t={t} />
          <div className="space-y-4 flex flex-col">
            <EvaluationPanel evaluation={evaluation} setEvaluation={setEvaluation} t={t} />
            <NutritionPanel nutritionNote={nutritionNote} setNutritionNote={setNutritionNote} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6 print:hidden">
          <BiomotorPanel athleteInfo={athleteInfo} t={t} />
          <PsychologicalPanel mentalData={mentalData} setMentalData={setMentalData} t={t} />
        </div>
      </div>
    </div>
  );
};

export default App;