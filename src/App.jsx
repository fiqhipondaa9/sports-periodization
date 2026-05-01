import React, { useState, useMemo, useRef, useEffect } from 'react';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, ReferenceLine, BarChart, Bar, Cell } from 'recharts';
import { Trophy, Zap, Brain, Activity, Target, Download, BarChart2, Globe, Save, Upload, Plus, X, Flag, FileSpreadsheet, Image as ImageIcon, ClipboardList, AlertTriangle, Palette, Calendar, Coffee, MessageCircle, CheckCircle2, ArrowRight, Dumbbell } from 'lucide-react';
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

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

const biomotorData = {
  Strength: [
    { id: 'Adaptasi Anatomi', param: '40-60% 1RM | 12-20 Reps', rest: 'Rest: 30-120 Detik', desc: 'Modifikasi ketebalan jaringan ikat & fungsi ligamen.' },
    { id: 'Hipertrofi', param: '60-80% 1RM | 6-12 Reps', rest: 'Rest: 1-2 Menit', desc: 'Pembesaran diameter otot kontraktil (sarkoplasma).' },
    { id: 'Kekuatan Maksimum', param: '70-100% 1RM | 1-6 Reps', rest: 'Rest: 3-5+ Menit', desc: 'Eksitasi impuls neuromuskuler & firing rate neuron.' },
    { id: 'Konversi (Power)', param: '30-80% 1RM | 8-15 Reps Balistik', rest: 'Rest: 3-4 Menit', desc: 'Optimalisasi laju percepatan gaya (RFD).' },
    { id: 'Konversi (Endurance)', param: '30-60% 1RM | 15-30+ Reps', rest: 'Rest: 0.5-2 Menit', desc: 'Ketahanan toleransi cairan asam laktat darah.' },
    { id: 'Pemeliharaan', param: '1-4x Sesi/Minggu', rest: 'Rest: Relatif', desc: 'Mencegah detraining selama musim kompetisi.' },
    { id: 'Cessation', param: 'Hentikan Beban 5-7 Hari', rest: 'Rest: Total', desc: 'Fasilitasi superkompensasi puncak.' }
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
  'Developmental': 'Peningkatan adaptasi fungsional, keterampilan, & kualitas biomotor.',
  'Shock': 'Kelebihan beban terencana (planned overreaching) untuk efek tertunda.',
  'Regeneration': 'Pemulihan aktif, meredakan ketegangan saraf & membuang laktat.',
  'Peaking / Unloading': 'Pembongkaran beban (Tapering) menuju superkompensasi puncak.'
};

const PrintSafeCheckbox = ({ checked, onChange, colorHex }) => (
  <div onClick={onChange} className="cursor-pointer flex items-center justify-center w-3 h-3 mx-auto rounded-[2px] border transition-colors shadow-sm" style={{ backgroundColor: checked ? colorHex : '#ffffff', borderColor: checked ? colorHex : '#cbd5e1', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' }}>
    {checked && <svg viewBox="0 0 14 14" fill="none" className="w-2.5 h-2.5 text-white stroke-current stroke-[3] stroke-linecap-round stroke-linejoin-round"><polyline points="2.5 7 5.5 10 11.5 3"/></svg>}
  </div>
);

const App = () => {
  const WA_NUMBER = "6285340804702";
  const QRIS_LINK = "/qris-dana.png"; // Link File Lokal
  
  const reportRef = useRef(null);
  const fileInputRef = useRef(null);

  const [activeTheme, setActiveTheme] = useState('blue');
  const t = THEMES[activeTheme];
  const [activeStep, setActiveStep] = useState(1);

  const [startYear, setStartYear] = useState(new Date().getFullYear());
  
  // FIX: Semua Identitas dikumpulkan di sini
  const [athleteInfo, setAthleteInfo] = useState({ 
    cabor: 'edit', 
    name: 'edit', 
    age: 'edit', 
    prov: 'edit', 
    coach: 'edit',
    target: 'edit'
  });
  
  const [startMonth, setStartMonth] = useState(0); 
  const [endMonth, setEndMonth] = useState(11); 
  const [phaseProps, setPhaseProps] = useState({ prep: 50, comp: 50, transWeeks: 4 });
  const [competitionMonth, setCompetitionMonth] = useState('Okt');
  const [tryOutMonths, setTryOutMonths] = useState([]);
  const [tryInMonths, setTryInMonths] = useState([]);
  const [locations, setLocations] = useState({});
  const [monthlyObjectives, setMonthlyObjectives] = useState(months.reduce((acc, m) => ({ ...acc, [m]: '' }), {}));

  const [macroValues, setMacroValues] = useState(months.reduce((acc, m) => ({ ...acc, [m]: { vol: 50, int: 50, peak: 3 } }), {}));
  const [trainingFactors, setTrainingFactors] = useState(months.reduce((acc, m) => ({ ...acc, [m]: { fisik: 40, teknik: 30, taktik: 20, psikis: 10 } }), {}));
  
  const [materials, setMaterials] = useState(['Simulasi Game', 'Drilling Defence']);
  const [materialInput, setMaterialInput] = useState('');
  const [matrixData, setMatrixData] = useState({});
  const [testSchedule, setTestSchedule] = useState({});
  
  const [microType, setMicroType] = useState('Developmental');
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [showQrisModal, setShowQrisModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Sen');
  const [dailySessions, setDailySessions] = useState(['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'].reduce((acc, d) => ({ ...acc, [d]: { morning: { menu: '', int: 5 }, afternoon: { menu: '', int: 5 } } }), {}));
  
  const [mentalData, setMentalData] = useState([
    { id: 'm1', label: 'Keberanian', score: 8 }, { id: 'm2', label: 'Fokus', score: 8 }, { id: 'm3', label: 'Motivasi', score: 8 },
    { id: 'm4', label: 'Emosi', score: 8 }, { id: 'm5', label: 'Resiliensi', score: 8 }, { id: 'm6', label: 'Disiplin', score: 8 }
  ]);
  
  const [evaluation, setEvaluation] = useState({ name: 'Tes Fisik Bleep', score: 50, target: 100, isTime: false });
  const [activeBiomotor, setActiveBiomotor] = useState('Strength');
  const [terminology, setTerminology] = useState('Eropa');
  const [nutritionNote, setNutritionNote] = useState('Input catatan gizi, suplemen, atau berat badan di sini.');

  const calculatedEndYear = startMonth <= endMonth ? startYear : startYear + 1;

  const activeMonths = useMemo(() => {
    if (startMonth <= endMonth) return months.slice(startMonth, endMonth + 1);
    return [...months.slice(startMonth), ...months.slice(0, endMonth + 1)];
  }, [startMonth, endMonth]);

  const allMaterials = useMemo(() => Array.from(new Set([...LOCKED_COMPONENTS, ...materials])), [materials]);

  useEffect(() => {
    if (!activeMonths.includes(competitionMonth)) setCompetitionMonth(activeMonths[activeMonths.length - 1]);
  }, [activeMonths, competitionMonth]);

  const getPhaseData = (m) => {
    const currIdx = activeMonths.indexOf(m);
    const compIdx = activeMonths.indexOf(competitionMonth);

    if (m === competitionMonth) return { phase: 'KOMPETISI', subPhase: 'KOMPETISI UTAMA', color: 'bg-red-600 text-white', subColor: 'bg-pink-600 text-white' };
    if (currIdx > compIdx) return { phase: 'TRANSISI', subPhase: 'PEMULIHAN AKTIF', color: 'bg-slate-500 text-white', subColor: 'bg-slate-400 text-white' };
    if (currIdx === compIdx - 1) return { phase: 'KOMPETISI', subPhase: 'PRA KOMPETISI', color: 'bg-purple-600 text-white', subColor: 'bg-purple-400 text-white' };

    const prepLength = (compIdx - 1); 
    if (prepLength <= 0) return { phase: 'PERSIAPAN', subPhase: 'PERSIAPAN KHUSUS', color: `${t.bg} text-white`, subColor: 'bg-yellow-500 text-yellow-900' };

    const generalPrepLength = Math.ceil(prepLength * (phaseProps.prep / 100));

    if (currIdx < generalPrepLength) return { phase: 'PERSIAPAN', subPhase: 'PERSIAPAN UMUM', color: `${t.bg} text-white`, subColor: `${t.bgLight} ${t.textDark}` };
    return { phase: 'PERSIAPAN', subPhase: 'PERSIAPAN KHUSUS', color: `${t.bg} text-white`, subColor: 'bg-yellow-500 text-yellow-900' };
  };

  const unifiedPhases = useMemo(() => {
    const phases = []; let current = null;
    activeMonths.forEach(m => {
      const p = getPhaseData(m);
      if (!current || current.phase !== p.phase) { current = { phase: p.phase, color: p.color, span: 1 }; phases.push(current); } else { current.span += 1; }
    }); return phases;
  }, [activeMonths, competitionMonth, phaseProps, activeTheme]);

  const unifiedSubPhases = useMemo(() => {
    const subPhases = []; let current = null;
    activeMonths.forEach(m => {
      const p = getPhaseData(m);
      if (!current || current.subPhase !== p.subPhase) { current = { subPhase: p.subPhase, color: p.subColor, span: 1 }; subPhases.push(current); } else { current.span += 1; }
    }); return subPhases;
  }, [activeMonths, competitionMonth, phaseProps, activeTheme]);

  const chartData = useMemo(() => activeMonths.map(m => ({ name: m, Intensitas: macroValues[m]?.int || 0, Volume: macroValues[m]?.vol || 0, Peak: macroValues[m]?.peak || 0 })), [activeMonths, macroValues]);

  const calculateScore = () => {
    if (!evaluation.score || !evaluation.target || evaluation.score <= 0) return { percentage: 0, label: "-", color: "text-slate-400", barColor: "bg-slate-200" };
    let p = evaluation.isTime ? (evaluation.target / evaluation.score) * 100 : (evaluation.score / evaluation.target) * 100;
    
    if (!isFinite(p) || isNaN(p)) p = 0;
    
    const r = Math.min(Math.round(p), 100);
    if (r >= 90) return { percentage: r, label: "EXCELLENT", color: "text-green-600", barColor: "bg-green-500" };
    if (r >= 75) return { percentage: r, label: "GOOD", color: t.text, barColor: t.bg };
    return { percentage: r, label: "POOR", color: "text-red-600", barColor: "bg-red-500" };
  };

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

  const handleLoadData = (e) => {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const d = JSON.parse(ev.target.result);
        if(d.activeTheme && THEMES[d.activeTheme]) setActiveTheme(d.activeTheme);
        if(d.startYear) setStartYear(d.startYear);
        if(d.athleteInfo) setAthleteInfo({...athleteInfo, ...d.athleteInfo}); // Merge identity
        if(d.startMonth !== undefined) setStartMonth(d.startMonth);
        if(d.endMonth !== undefined) setEndMonth(d.endMonth);
        if(d.phaseProps) setPhaseProps(d.phaseProps);
        if(d.competitionMonth) setCompetitionMonth(d.competitionMonth);
        if(d.tryOutMonths) setTryOutMonths(d.tryOutMonths);
        if(d.tryInMonths) setTryInMonths(d.tryInMonths);
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
        alert("Data Periodisasi Bompa Berhasil Dimuat!");
      } catch (err) { alert("Format file salah atau rusak!"); }
    };
    reader.readAsText(file); e.target.value = null;
  };

  const handleSaveData = () => {
    const data = { activeTheme, startYear, athleteInfo, startMonth, endMonth, phaseProps, competitionMonth, tryOutMonths, tryInMonths, locations, monthlyObjectives, macroValues, trainingFactors, matrixData, testSchedule, materials, dailySessions, nutritionNote, evaluation, mentalData };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `Periodisasi_${athleteInfo.name}.json`; a.click();
  };

  const handleExportPNG = async () => {
    const el = reportRef.current;
    if (!el) return alert("Elemen tidak ditemukan!");

    try {
      // 1. Simpan posisi scroll asli agar tidak mengagetkan user
      const originalScrollY = window.scrollY;
      window.scrollTo(0, 0);

      // 2. Beri jeda agar UI stabil
      await new Promise(resolve => setTimeout(resolve, 800));

      // 3. Konfigurasi pemotretan "Anti-Crop" & "Anti-Gagal"
      const canvas = await html2canvas(el, {
        scale: 1.5,               // Gunakan 1.5 agar memori tidak meledak di laptop RAM kecil
        useCORS: true,            // Wajib untuk gambar QRIS
        logging: false,
        backgroundColor: "#ffffff",
        // PAKSA: Mesin foto harus melihat lebar asli konten (bukan lebar layar laptop Coach)
        width: el.scrollWidth,
        height: el.scrollHeight,
        windowWidth: el.scrollWidth,
        onclone: (clonedDoc) => {
           // Buka semua scrollbar di dalam hasil kloning foto
           const scrolls = clonedDoc.querySelectorAll('.overflow-x-auto');
           scrolls.forEach(s => {
             s.style.overflow = 'visible';
             s.style.display = 'block';
           });
        }
      });

      // 4. Eksekusi Unduh
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement('a');
      link.href = image;
      link.download = `Periodisasi_Plan_${athleteInfo.name || 'Athlete'}.png`;
      link.click();
      
      // 5. Kembalikan posisi layar
      window.scrollTo(0, originalScrollY);

    } catch (error) {
      console.error("Detail Error:", error);
      alert("PNG Gagal. Solusi: 1. Gunakan Google Chrome. 2. Jangan zoom-in/out browser saat menekan tombol. 3. Pastikan koneksi internet stabil.");
    }
  };

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();
    const aoa = [];
    const weeksCols = activeMonths.length * 4;

    aoa.push(['Tahun', ...Array(weeksCols).fill(`${startYear} ${startMonth > endMonth ? '- ' + calculatedEndYear : ''}`)]);
    
    let bulanRow = ['Bulan']; activeMonths.forEach(m => { bulanRow.push(m, '', '', ''); }); aoa.push(bulanRow);
    let mingguRow = ['Minggu']; activeMonths.forEach((m, mIdx) => [1,2,3,4].forEach(w => mingguRow.push((mIdx*4)+w))); aoa.push(mingguRow);
    
    let toRow = ['Try Out']; activeMonths.forEach(m => [1,2,3,4].forEach(w => toRow.push(tryOutMonths.includes(m) ? 'TO' : ''))); aoa.push(toRow);
    let tiRow = ['Try In']; activeMonths.forEach(m => [1,2,3,4].forEach(w => tiRow.push(tryInMonths.includes(m) ? 'TI' : ''))); aoa.push(tiRow);
    
    let locRow = ['Waktu/Lokasi']; activeMonths.forEach(m => { locRow.push(locations[m] || '', '', '', ''); }); aoa.push(locRow);
    let faseRow = ['Fase']; activeMonths.forEach(m => { faseRow.push(getPhaseData(m).phase, '', '', ''); }); aoa.push(faseRow);
    let subFaseRow = ['Sub Fase']; activeMonths.forEach(m => { subFaseRow.push(getPhaseData(m).subPhase, '', '', ''); }); aoa.push(subFaseRow);
    let sasaranRow = ['Sasaran Prestasi']; activeMonths.forEach(m => { sasaranRow.push(monthlyObjectives[m] || '', '', '', ''); }); aoa.push(sasaranRow);

    aoa.push(['--- BENTUK LATIHAN ---', ...Array(weeksCols).fill('')]);
    allMaterials.forEach(mat => {
       let r = [mat];
       activeMonths.forEach(m => [1,2,3,4].forEach(w => r.push(matrixData[`${m}-W${w}-${mat}`] ? 'V' : '')));
       aoa.push(r);
    });

    aoa.push(['--- TES & EVALUASI ---', ...Array(weeksCols).fill('')]);
    ['Tes Kesehatan', 'Tes Fisik', 'Tes Teknik', 'Tes Psikis'].forEach(test => {
       let r = [test];
       activeMonths.forEach(m => [1,2,3,4].forEach(w => r.push(testSchedule[`${m}-W${w}-${test}`] ? 'V' : '')));
       aoa.push(r);
    });

    aoa.push(['--- BEBAN LATIHAN ---', ...Array(weeksCols).fill('')]);
    let volRow = ['Volume']; activeMonths.forEach(m => { volRow.push(macroValues[m]?.vol, '', '', ''); }); aoa.push(volRow);
    let intRow = ['Intensitas']; activeMonths.forEach(m => { intRow.push(macroValues[m]?.int, '', '', ''); }); aoa.push(intRow);
    let peakRow = ['Peak Performance']; activeMonths.forEach(m => { peakRow.push(macroValues[m]?.peak, '', '', ''); }); aoa.push(peakRow);

    aoa.push(['--- PROPORSI FAKTOR (%) ---', ...Array(weeksCols).fill('')]);
    let fisRow = ['Fisik (%)']; activeMonths.forEach(m => { fisRow.push(trainingFactors[m]?.fisik, '', '', ''); }); aoa.push(fisRow);
    let tekRow = ['Teknik (%)']; activeMonths.forEach(m => { tekRow.push(trainingFactors[m]?.teknik, '', '', ''); }); aoa.push(tekRow);
    let takRow = ['Taktik (%)']; activeMonths.forEach(m => { takRow.push(trainingFactors[m]?.taktik, '', '', ''); }); aoa.push(takRow);
    let psiRow = ['Psikologis (%)']; activeMonths.forEach(m => { psiRow.push(trainingFactors[m]?.psikis, '', '', ''); }); aoa.push(psiRow);

    const ws = XLSX.utils.aoa_to_sheet(aoa);
    const merges = [];
    merges.push({ s: {r:0, c:1}, e: {r:0, c:weeksCols} }); 
    merges.push({ s: {r:9, c:0}, e: {r:9, c:weeksCols} }); 
    merges.push({ s: {r:9 + allMaterials.length + 1, c:0}, e: {r:9 + allMaterials.length + 1, c:weeksCols} }); 
    merges.push({ s: {r:9 + allMaterials.length + 1 + 4 + 1, c:0}, e: {r:9 + allMaterials.length + 1 + 4 + 1, c:weeksCols} }); 
    merges.push({ s: {r:9 + allMaterials.length + 1 + 4 + 1 + 3 + 1, c:0}, e: {r:9 + allMaterials.length + 1 + 4 + 1 + 3 + 1, c:weeksCols} }); 

    activeMonths.forEach((m, i) => {
      const cStart = 1 + i * 4;
      const cEnd = cStart + 3;
      merges.push({ s: {r:1, c:cStart}, e: {r:1, c:cEnd} }); 
      merges.push({ s: {r:5, c:cStart}, e: {r:5, c:cEnd} }); 
      merges.push({ s: {r:8, c:cStart}, e: {r:8, c:cEnd} }); 
      
      const rStartBeban = 9 + allMaterials.length + 1 + 4 + 1 + 1; 
      merges.push({ s: {r:rStartBeban, c:cStart}, e: {r:rStartBeban, c:cEnd} });
      merges.push({ s: {r:rStartBeban+1, c:cStart}, e: {r:rStartBeban+1, c:cEnd} });
      merges.push({ s: {r:rStartBeban+2, c:cStart}, e: {r:rStartBeban+2, c:cEnd} });

      const rStartFaktor = rStartBeban+3 + 1; 
      merges.push({ s: {r:rStartFaktor, c:cStart}, e: {r:rStartFaktor, c:cEnd} });
      merges.push({ s: {r:rStartFaktor+1, c:cStart}, e: {r:rStartFaktor+1, c:cEnd} });
      merges.push({ s: {r:rStartFaktor+2, c:cStart}, e: {r:rStartFaktor+2, c:cEnd} });
      merges.push({ s: {r:rStartFaktor+3, c:cStart}, e: {r:rStartFaktor+3, c:cEnd} });
    });

    let currentC = 1;
    unifiedPhases.forEach(p => {
      const cEnd = currentC + (p.span * 4) - 1;
      merges.push({ s: {r:6, c:currentC}, e: {r:6, c:cEnd} });
      currentC = cEnd + 1;
    });

    currentC = 1;
    unifiedSubPhases.forEach(p => {
      const cEnd = currentC + (p.span * 4) - 1;
      merges.push({ s: {r:7, c:currentC}, e: {r:7, c:cEnd} });
      currentC = cEnd + 1;
    });

    ws['!merges'] = merges;
    XLSX.utils.book_append_sheet(wb, ws, "Matrix_Periodisasi");
    XLSX.writeFile(wb, `Program_${athleteInfo.name}.xlsx`);
  };

  const handleWA = () => {
    window.open(`https://wa.me/${WA_NUMBER}?text=Halo%20Coach%20Fiqhi,%20saya%20pengguna%20Aplikasi%20Periodisasi%20Bompa.%20Saya%20sangat%20terbantu!`, '_blank');
  };

  const printStyles = { WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' };

  return (
    <div className="min-h-screen bg-slate-100 p-6 font-sans text-slate-900 text-[11px] print:p-0 print:bg-white" style={printStyles}>
      
      <style type="text/css">
        {`@media print { @page { size: landscape; margin: 10mm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`}
      </style>

      {/* FLOATING ACTION BUTTONS */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50 print:hidden">
         <button onClick={() => setShowQrisModal(true)} className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 p-3 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110" title="Traktir Kopi Coach">
            <Coffee className="w-6 h-6" />
         </button>
         <button onClick={handleWA} className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110" title="Lapor Bug / Chat WA">
            <MessageCircle className="w-6 h-6" />
         </button>
      </div>

      {/* QRIS MODAL */}
      {showQrisModal && (
        <div className="fixed inset-0 z-[200] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 no-print">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden text-center relative">
            <button onClick={() => setShowQrisModal(false)} className="absolute top-4 right-4 bg-slate-100 p-2 rounded-full hover:bg-slate-200 text-slate-600"><X className="w-4 h-4"/></button>
            <div className="bg-blue-600 p-6 text-white">
               <Coffee className="w-10 h-10 mx-auto mb-2 opacity-80" />
               <h2 className="font-black text-lg">Dukung Pengembangan!</h2>
               <p className="text-[10px] opacity-80">Traktir kopi untuk update fitur selanjutnya.</p>
            </div>
            <div className="p-6 flex flex-col items-center">
               <img src={QRIS_LINK} alt="QRIS DANA" className="w-48 h-48 object-cover rounded-2xl shadow-md border mb-4" onError={(e) => e.target.src = "https://via.placeholder.com/200?text=QRIS+Image+Error"}/>
               <p className="text-[10px] font-bold text-slate-500">Scan via aplikasi DANA atau M-Banking Anda.</p>
               <p className="text-[12px] font-black text-blue-900 mt-2">by fiqhipondaa9</p>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DAILY */}
      {showDailyModal && (
        <div className="fixed inset-0 z-[120] bg-slate-900/60 flex items-center justify-center p-4 no-print">
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
      <div className="max-w-[1300px] mx-auto flex flex-wrap justify-between items-center gap-2 mb-6 print:hidden">
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

      <div className="max-w-[1300px] mx-auto bg-white rounded-3xl border shadow-lg relative overflow-hidden print:max-w-none print:border-none print:shadow-none print:rounded-none">
        
        {/* ==========================================
            PANEL KENDALI: 8 LANGKAH WIZARD
            ========================================== */}
        <div className="bg-slate-50 border-b border-slate-200 p-6 print:hidden">
           <h2 className="font-black text-sm uppercase text-slate-800 mb-4 flex items-center gap-2"><Target className={`w-5 h-5 ${t.text}`}/> Control Panel: SOP Pembuatan Periodisasi</h2>
           
           <div className="flex gap-2 mb-6 overflow-x-auto pb-2 custom-scrollbar">
             {[1,2,3,4,5,6,7,8].map(step => (
               <button key={step} onClick={() => setActiveStep(step)} className={`flex-1 min-w-[120px] py-2 px-3 rounded-xl border text-[9px] font-black uppercase transition-all flex items-center justify-center gap-2 ${activeStep === step ? `${t.bg} text-white shadow-md border-transparent` : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'}`}>
                 {activeStep > step ? <CheckCircle2 className="w-3 h-3"/> : `Langkah ${step}`}
               </button>
             ))}
           </div>

           <div className="bg-white p-5 rounded-2xl border shadow-sm min-h-[160px] flex flex-col justify-between">
             {/* FIX: Form Identitas yang Lengkap di Langkah 1 */}
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

                 <div className="grid grid-cols-3 gap-4 border-t pt-4">
                   <div><label className="block text-[9px] font-bold text-slate-500 mb-1">TAHUN MULAI</label><input type="number" value={startYear} onChange={e => setStartYear(Number(e.target.value))} className="w-full border p-2 rounded-lg text-[10px] font-black uppercase" title="Tahun Mulai"/></div>
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
                   <div><label className="block text-[9px] font-bold text-slate-500 mb-1">PROPORSI FASE PERSIAPAN UMUM VS KHUSUS (%)</label><input type="number" value={phaseProps.prep} onChange={e => setPhaseProps({...phaseProps, prep: Number(e.target.value)})} className="w-full border p-2 rounded-lg text-[11px] font-black text-blue-600" title="Contoh: 50 berarti setengah Persiapan Umum, setengah Persiapan Khusus"/></div>
                 </div>
                 <p className="text-[9px] font-bold text-slate-400 mt-2 italic">*Aplikasi menggunakan metode Backward Planning. Fase akan dihitung mundur dari Target Bulan Kompetisi Utama Anda.</p>
                 <div className="mt-4 flex justify-end"><button onClick={() => setActiveStep(3)} className={`px-4 py-2 text-white font-black text-[10px] rounded-lg flex items-center gap-1 ${t.bg} ${t.hoverBg}`}>Lanjut <ArrowRight className="w-3 h-3"/></button></div>
               </div>
             )}
             {activeStep === 3 && (
               <div className="animate-in fade-in slide-in-from-bottom-2">
                 <h3 className="font-black text-[11px] text-slate-700 uppercase mb-3 border-b pb-2">3. Penentuan Peaking & Uji Coba</h3>
                 <div className="grid grid-cols-3 gap-6">
                   <div>
                     <label className="block text-[9px] font-bold text-slate-500 mb-1">TARGET KOMPETISI UTAMA (PEAK)</label>
                     <select value={competitionMonth} onChange={e => setCompetitionMonth(e.target.value)} className="w-full border p-2 rounded-lg text-[10px] font-black uppercase text-red-600 cursor-pointer">{activeMonths.map(m=><option key={m} value={m}>{m}</option>)}</select>
                   </div>
                   <div className="col-span-2 flex gap-4">
                     <div className="flex-1 bg-purple-50 p-2 rounded-xl border border-purple-100">
                       <label className="block text-[9px] font-black text-purple-700 mb-1">TRY OUT (TANDANG)</label>
                       <div className="flex flex-wrap gap-1">{activeMonths.map(m => (<button key={`to-${m}`} onClick={()=>setTryOutMonths(prev=>prev.includes(m)?prev.filter(x=>x!==m):[...prev,m])} className={`px-2 py-1 text-[8px] font-black rounded transition-colors ${tryOutMonths.includes(m)?'bg-purple-600 text-white':'bg-white text-slate-400 border hover:border-purple-300'}`}>{m}</button>))}</div>
                     </div>
                     <div className="flex-1 bg-orange-50 p-2 rounded-xl border border-orange-100">
                       <label className="block text-[9px] font-black text-orange-700 mb-1">TRY IN (KANDANG)</label>
                       <div className="flex flex-wrap gap-1">{activeMonths.map(m => (<button key={`ti-${m}`} onClick={()=>setTryInMonths(prev=>prev.includes(m)?prev.filter(x=>x!==m):[...prev,m])} className={`px-2 py-1 text-[8px] font-black rounded transition-colors ${tryInMonths.includes(m)?'bg-orange-500 text-white':'bg-white text-slate-400 border hover:border-orange-300'}`}>{m}</button>))}</div>
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
                   <input type="text" value={materialInput} onChange={e => setMaterialInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddMaterial()} className="border p-2 rounded-lg outline-none text-[10px] w-full focus:ring-1" style={{ '--tw-ring-color': t.hex }} placeholder="Ketik materi tambahan (Cth: Servis)..."/>
                   <button onClick={handleAddMaterial} className={`px-3 rounded-lg text-white font-black ${t.bg} ${t.hoverBg}`}><Plus className="w-4 h-4"/></button>
                 </div>
                 <div className="mt-4 flex justify-between items-center">
                    <p className="text-[9px] font-bold text-slate-400 italic">*Komponen wajib telah dikunci. Anda bisa menambah materi khusus di sini.</p>
                    <button onClick={() => setActiveStep(5)} className={`px-4 py-2 text-white font-black text-[10px] rounded-lg flex items-center gap-1 ${t.bg} ${t.hoverBg}`}>Lanjut <ArrowRight className="w-3 h-3"/></button>
                 </div>
               </div>
             )}
             {(activeStep === 5 || activeStep === 6) && (
               <div className="animate-in fade-in slide-in-from-bottom-2">
                 <h3 className="font-black text-[11px] text-slate-700 uppercase mb-3 border-b pb-2">5 & 6. Pengaturan Volume, Intensitas & Grafik Peaking</h3>
                 <p className="text-[9px] font-bold text-slate-500 mb-3">Silakan atur angka parameter beban untuk setiap bulan secara manual. Grafik akan otomatis menyesuaikan.</p>
                 <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                   {activeMonths.map(m => (
                     <div key={m} className="min-w-[70px] bg-slate-50 border p-2 rounded-xl text-center space-y-1">
                       <span className="text-[9px] font-black uppercase block mb-1">{m}</span>
                       <input type="number" value={macroValues[m]?.vol} onChange={e=>setMacroValues({...macroValues, [m]:{...macroValues[m], vol:Number(e.target.value)}})} className="w-full border rounded text-center text-[10px] font-black text-blue-600 p-1" title="Volume"/>
                       <input type="number" value={macroValues[m]?.int} onChange={e=>setMacroValues({...macroValues, [m]:{...macroValues[m], int:Number(e.target.value)}})} className="w-full border rounded text-center text-[10px] font-black text-red-600 p-1" title="Intensitas"/>
                       <input type="number" min="1" max="5" value={macroValues[m]?.peak} onChange={e=>setMacroValues({...macroValues, [m]:{...macroValues[m], peak:Number(e.target.value)}})} className="w-full border rounded text-center text-[10px] font-black text-orange-500 p-1" title="Peaking (1-5)"/>
                     </div>
                   ))}
                 </div>
                 <div className="mt-4 flex justify-end"><button onClick={() => setActiveStep(7)} className={`px-4 py-2 text-white font-black text-[10px] rounded-lg flex items-center gap-1 ${t.bg} ${t.hoverBg}`}>Lanjut <ArrowRight className="w-3 h-3"/></button></div>
               </div>
             )}
             {activeStep === 7 && (
               <div className="animate-in fade-in slide-in-from-bottom-2">
                 <h3 className="font-black text-[11px] text-slate-700 uppercase mb-3 border-b pb-2">7. Proporsi Faktor Latihan (%)</h3>
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
                 <div className="mt-4 flex justify-end"><button onClick={() => setActiveStep(8)} className={`px-4 py-2 text-white font-black text-[10px] rounded-lg flex items-center gap-1 ${t.bg} ${t.hoverBg}`}>Lanjut <ArrowRight className="w-3 h-3"/></button></div>
               </div>
             )}
             {activeStep === 8 && (
               <div className="animate-in fade-in slide-in-from-bottom-2 flex flex-col justify-center items-center h-full gap-4 text-center py-4">
                 <div>
                   <h3 className="font-black text-sm text-slate-800 uppercase mb-2">8. Matriks Kalender Siap Dievaluasi</h3>
                   <p className="text-[10px] font-bold text-slate-500 max-w-md mx-auto">Semua variabel telah diatur. Langkah terakhir adalah menceklis jadwal tes pada matriks kalender, dan mengisi catatan gizi serta menu harian di panel bawah.</p>
                 </div>
                 <button onClick={() => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'})} className={`px-8 py-3 text-white font-black text-[11px] rounded-xl uppercase flex items-center gap-2 shadow-lg transition-transform hover:scale-105 ${t.bg} ${t.hoverBg}`}>Gulir ke Bawah Untuk Lihat Matriks <ArrowRight className="w-4 h-4"/></button>
               </div>
             )}
           </div>
        </div>

{/* =========================================
            AREA KHUSUS CETAK (PNG & PDF)
            ========================================= */}
        <div ref={reportRef} className="bg-white pb-4 print:pb-0">

        {/* HEADER IDENTITAS PRINT */}
        <div className="p-8 pb-4 print:pt-4">
           
           {/* --- TAMBAHAN HEADER JUDUL UTAMA --- */}
           <div className="mb-6 flex justify-between items-end border-b-2 border-slate-200 pb-4">
              <div>
                 <h1 className={`text-2xl font-black tracking-tighter uppercase ${t.textDark} print:text-3xl`}>ANNUAL TRAINING PLAN SYSTEM</h1>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Designed by fiqhipondaa9</p>
              </div>
           </div>
           {/* ----------------------------------- */}

           <table className="text-[10px] font-black text-slate-700 uppercase print:text-[12px]">
             <tbody>
               <tr><td className="w-32 pb-1">Cabang Olahraga</td><td className="w-4 pb-1">:</td><td className="pb-1">{athleteInfo.cabor}</td></tr>
               <tr><td className="pb-1">Usia / Kategori</td><td className="pb-1">:</td><td className="pb-1">{athleteInfo.age}</td></tr>
               <tr><td className="pb-1">Provinsi / Daerah</td><td className="pb-1">:</td><td className="pb-1">{athleteInfo.prov}</td></tr>
               <tr><td className="pb-1">Pelatih</td><td className="pb-1">:</td><td className="pb-1">{athleteInfo.coach}</td></tr>
               <tr><td className="pb-1 pt-2">Nama Atlet / Tim</td><td className="pb-1 pt-2">:</td><td className="pb-1 pt-2 text-sm text-blue-900 print:text-black">{athleteInfo.name}</td></tr>
             </tbody>
           </table>
        </div>

        {/* =========================================
            MASTER TIMELINE (KALENDER RAKSASA)
            ========================================= */}
        <div className="px-6 pb-6 print:px-0">
          <div className="flex justify-between items-center mb-3">
             <h2 className="text-xl font-black uppercase text-slate-900 tracking-tighter print:text-2xl">PERIODISASI LATIHAN</h2>
             <div className="flex gap-4">
               <div className="text-center"><p className="text-[8px] font-bold text-slate-400 uppercase print:text-[10px]">Target / Sasaran Latihan Tahunan</p><p className="font-black text-[11px] uppercase border-b-2 border-slate-900 pb-1 print:text-[14px]">{athleteInfo.target}</p></div>
             </div>
          </div>

          <div className="overflow-x-auto pb-4 custom-scrollbar border rounded-xl shadow-sm border-slate-300 print:overflow-visible print:border-none print:shadow-none print:pb-0">
            <table className="w-full border-collapse min-w-[1200px] print:min-w-full print:text-[10px]">
              <thead>
                {/* TAHUN */}
                <tr>
                  <th className="p-2 border-b border-r bg-slate-100 sticky left-0 z-20 text-center text-[9px] font-black text-slate-500 uppercase min-w-[180px] print:static">Tahun</th>
                  <th colSpan={activeMonths.length * 4} className="p-1 border-b bg-yellow-300 text-center text-[10px] font-black text-yellow-900 uppercase print:bg-transparent print:border print:text-black">{startYear} {startMonth > endMonth ? `- ${calculatedEndYear}` : ''}</th>
                </tr>
                {/* BULAN */}
                <tr>
                  <th className="p-2 border-b border-r bg-slate-100 sticky left-0 z-20 text-center text-[9px] font-black text-slate-500 uppercase print:static">Bulan</th>
                  {activeMonths.map(m => (
                    <th key={`tm-${m}`} colSpan={4} className="p-1 border-b border-r bg-yellow-200 text-center text-[9px] font-black text-yellow-900 uppercase print:bg-transparent print:border print:text-black">{m}</th>
                  ))}
                </tr>
                {/* MINGGU ABSOLUT (1-52) */}
                <tr>
                  <th className="p-2 border-b border-r bg-slate-100 sticky left-0 z-20 text-center text-[9px] font-black text-slate-500 uppercase print:static">Minggu</th>
                  {activeMonths.flatMap((m, mIdx) => [1,2,3,4].map(w => {
                    const absWeek = (mIdx * 4) + w;
                    return <th key={`aw-${m}-${w}`} className="p-1 border-b border-r bg-yellow-100 text-center text-[8px] font-black text-yellow-900 w-8 print:bg-transparent print:border print:text-black">{absWeek}</th>
                  }))}
                </tr>
                {/* TRY OUT & TRY IN */}
                <tr>
                  <th className="p-1 border-b border-r bg-slate-50 sticky left-0 z-20 text-right pr-4 text-[9px] font-black text-purple-700 uppercase print:static print:text-black">Try Out</th>
                  {activeMonths.flatMap((m, mIdx) => [1,2,3,4].map(w => (
                    <th key={`to-${m}-${w}`} className={`p-1 border-b border-r text-center ${tryOutMonths.includes(m) ? 'bg-purple-500 print:bg-gray-400' : 'bg-white'}`}></th>
                  )))}
                </tr>
                <tr>
                  <th className="p-1 border-b border-r bg-slate-50 sticky left-0 z-20 text-right pr-4 text-[9px] font-black text-orange-600 uppercase print:static print:text-black">Try In</th>
                  {activeMonths.flatMap((m, mIdx) => [1,2,3,4].map(w => (
                    <th key={`ti-${m}-${w}`} className={`p-1 border-b border-r text-center ${tryInMonths.includes(m) ? 'bg-orange-400 print:bg-gray-300' : 'bg-white'}`}></th>
                  )))}
                </tr>
                {/* LOKASI / WAKTU KALENDER */}
                <tr>
                  <th className="p-4 border-b border-r bg-slate-50 sticky left-0 z-20 text-center text-[10px] font-black text-slate-600 uppercase print:static">Waktu / Kalender<br/><span className="text-[8px] font-bold text-slate-400 print:text-black">(Lokasi Event)</span></th>
                  {activeMonths.map(m => (
                    <th key={`loc-${m}`} colSpan={4} className="p-1 border-b border-r bg-white text-center align-middle relative h-16 print:border">
                       <input type="text" value={locations[m]||''} onChange={e=>setLocations({...locations, [m]:e.target.value})} className="absolute inset-0 w-full h-full text-center text-[8px] font-black uppercase outline-none bg-transparent" placeholder="-"/>
                    </th>
                  ))}
                </tr>
                {/* FASE & SUB FASE */}
                <tr>
                  <th className="p-1 border-b border-r bg-slate-100 sticky left-0 z-20 text-left pl-4 text-[9px] font-black text-slate-500 uppercase print:static">Fase</th>
                  {unifiedPhases.map((p, idx) => (
                    <th key={`p-${idx}`} colSpan={p.span * 4} className={`p-1 border-b border-r text-[9px] font-black uppercase text-center ${p.color} print:bg-transparent print:border print:text-black`}>{p.phase}</th>
                  ))}
                </tr>
                <tr>
                  <th className="p-1 border-b border-r bg-slate-100 sticky left-0 z-20 text-left pl-4 text-[9px] font-black text-slate-500 uppercase print:static">Sub Fase</th>
                  {unifiedSubPhases.map((p, idx) => (
                    <th key={`sp-${idx}`} colSpan={p.span * 4} className={`p-1 border-b border-r text-[8px] font-black uppercase text-center ${p.color} print:bg-transparent print:border print:text-black`}>{p.subPhase}</th>
                  ))}
                </tr>
                {/* SASARAN PRESTASI */}
                <tr>
                  <th className="p-2 border-b border-r bg-slate-100 sticky left-0 z-20 text-left pl-4 text-[9px] font-black text-slate-500 uppercase print:static">Sasaran Prestasi</th>
                  {activeMonths.map(m => (
                    <th key={`obj-${m}`} colSpan={4} className="p-1 border-b border-r bg-white font-normal print:border">
                      <input type="text" value={monthlyObjectives[m]} onChange={e => setMonthlyObjectives({...monthlyObjectives, [m]: e.target.value})} className="w-full text-center text-[8px] font-bold outline-none text-slate-600 bg-transparent uppercase" placeholder="Ketik Sasaran..."/>
                    </th>
                  ))}
                </tr>
                {/* BENTUK LATIHAN HEADER */}
                <tr>
                  <th className="p-1 border-b border-r bg-slate-200 sticky left-0 z-20 text-center text-[10px] font-black text-slate-700 uppercase print:static print:border" rowSpan={allMaterials.length + 1}>Bentuk Latihan</th>
                </tr>
              </thead>
              <tbody>
                {/* BENTUK LATIHAN (LOCKED + CUSTOM) */}
                {allMaterials.map((mat, idx) => {
                  let rowColor = idx % 2 === 0 ? 'bg-white' : 'bg-slate-50';
                  if(mat.includes('Endurance') || mat.includes('Strength') || mat.includes('Speed')) rowColor = 'bg-blue-50/50 print:bg-white';
                  if(mat.includes('Teknik')) rowColor = 'bg-emerald-50/50 print:bg-white';
                  if(mat.includes('Mental')) rowColor = 'bg-yellow-50/50 print:bg-white';

                  return (
                  <tr key={mat} className={rowColor}>
                    <td className="p-1.5 px-3 border-b border-r sticky left-0 z-10 font-bold text-[9px] text-slate-700 uppercase shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] pl-4 print:static print:shadow-none print:border">{mat}</td>
                    {activeMonths.map(m => [1,2,3,4].map(w => (
                      <td key={`mat-${m}-W${w}`} className="p-1 border-b border-r text-center print:border">
                        <PrintSafeCheckbox checked={!!matrixData[`${m}-W${w}-${mat}`]} onChange={() => setMatrixData(prev => ({...prev, [`${m}-W${w}-${mat}`]: !prev[`${m}-W${w}-${mat}`]}))} colorHex={t.hex} />
                      </td>
                    )))}
                  </tr>
                )})}

                {/* SIKLUS MAKRO / MIKRO INFO */}
                <tr>
                  <td className="p-1.5 px-3 border-b border-r bg-slate-100 sticky left-0 z-10 font-black text-[9px] text-slate-500 uppercase print:static print:border print:bg-transparent">Siklus Makro</td>
                  {activeMonths.map((m, idx) => <td key={`makro-${m}`} colSpan={4} className="p-1 border-b border-r bg-yellow-100 text-center text-[9px] font-black text-yellow-900 print:bg-transparent print:border print:text-black">{idx + 1}</td>)}
                </tr>
                <tr>
                  <td className="p-1.5 px-3 border-b border-r bg-slate-100 sticky left-0 z-10 font-black text-[9px] text-slate-500 uppercase print:static print:border print:bg-transparent">Siklus Mikro</td>
                  {activeMonths.flatMap((m, mIdx) => [1,2,3,4].map(w => {
                    const absWeek = (mIdx * 4) + w;
                    return <td key={`mikro-${m}-${w}`} className="p-1 border-b border-r bg-cyan-100 text-center text-[8px] font-black text-cyan-900 w-8 print:bg-transparent print:border print:text-black">{absWeek}</td>
                  }))}
                </tr>

                {/* TES KESEHATAN, FISIK, TEKNIK, PSIKIS */}
                {['Tes Kesehatan', 'Tes Fisik', 'Tes Teknik', 'Tes Psikis'].map(test => (
                  <tr key={`test-${test}`} className="hover:bg-slate-50 transition-colors">
                    <td className="p-1 px-3 border-b border-r bg-white sticky left-0 z-10 font-bold text-[9px] text-slate-600 pl-4 print:static print:border">{test}</td>
                    {activeMonths.map(m => [1,2,3,4].map(w => (
                      <td key={`t-${m}-W${w}`} className="p-1 border-b border-r text-center print:border">
                        <PrintSafeCheckbox checked={!!testSchedule[`${m}-W${w}-${test}`]} onChange={() => setTestSchedule(prev => ({...prev, [`${m}-W${w}-${test}`]: !prev[`${m}-W${w}-${test}`]}))} colorHex="#ef4444" />
                      </td>
                    )))}
                  </tr>
                ))}

                {/* BEBAN LATIHAN */}
                <tr>
                  <td className="p-1 border-b border-r bg-slate-200 sticky left-0 z-10 text-center text-[10px] font-black text-slate-700 uppercase print:static print:border print:bg-transparent" rowSpan={4}>Latihan</td>
                </tr>
                <tr>
                  <td className="p-1 px-3 border-b border-r bg-white sticky left-0 z-10 font-black text-[9px] text-blue-600 pl-4 print:static print:border print:text-black">Volume</td>
                  {activeMonths.flatMap((m, mIdx) => [1,2,3,4].map(w => (
                    <td key={`v-${m}-${w}`} className="p-0 border-b border-r bg-white text-center print:border"><div className="h-full w-full bg-blue-100 text-[7px] font-bold text-blue-800 flex items-center justify-center print:bg-transparent print:text-black">{w===1 ? macroValues[m]?.vol : ''}</div></td>
                  )))}
                </tr>
                <tr>
                  <td className="p-1 px-3 border-b border-r bg-white sticky left-0 z-10 font-black text-[9px] text-red-600 pl-4 print:static print:border print:text-black">Intensitas</td>
                  {activeMonths.flatMap((m, mIdx) => [1,2,3,4].map(w => (
                    <td key={`i-${m}-${w}`} className="p-0 border-b border-r bg-white text-center print:border"><div className="h-full w-full bg-red-100 text-[7px] font-bold text-red-800 flex items-center justify-center print:bg-transparent print:text-black">{w===1 ? macroValues[m]?.int : ''}</div></td>
                  )))}
                </tr>
                <tr>
                  <td className="p-1 px-3 border-b border-r bg-white sticky left-0 z-10 font-black text-[9px] text-orange-600 pl-4 print:static print:border print:text-black">Peak Performance</td>
                  {activeMonths.flatMap((m, mIdx) => [1,2,3,4].map(w => (
                    <td key={`pk-${m}-${w}`} className="p-0 border-b border-r bg-white text-center print:border"><div className="h-full w-full bg-orange-100 text-[7px] font-bold text-orange-800 flex items-center justify-center print:bg-transparent print:text-black">{w===1 ? macroValues[m]?.peak : ''}</div></td>
                  )))}
                </tr>

                {/* FAKTOR PROPORSI */}
                <tr>
                  <td className="p-1 border-b border-r bg-slate-200 sticky left-0 z-10 text-center text-[10px] font-black text-slate-700 uppercase print:static print:border print:bg-transparent" rowSpan={5}>Faktor (%)</td>
                </tr>
                <tr>
                  <td className="p-1 px-3 border-b border-r bg-white sticky left-0 z-10 font-bold text-[9px] text-slate-600 pl-4 print:static print:border">Fisik</td>
                  {activeMonths.flatMap((m, mIdx) => [1,2,3,4].map(w => (
                    <td key={`f-${m}-${w}`} className="p-0 border-b border-r bg-slate-50 text-center text-[7px] font-bold text-slate-500 print:bg-transparent print:border">{w===1 ? trainingFactors[m]?.fisik : ''}</td>
                  )))}
                </tr>
                <tr>
                  <td className="p-1 px-3 border-b border-r bg-white sticky left-0 z-10 font-bold text-[9px] text-slate-600 pl-4 print:static print:border">Teknik</td>
                  {activeMonths.flatMap((m, mIdx) => [1,2,3,4].map(w => (
                    <td key={`t-${m}-${w}`} className="p-0 border-b border-r bg-slate-50 text-center text-[7px] font-bold text-slate-500 print:bg-transparent print:border">{w===1 ? trainingFactors[m]?.teknik : ''}</td>
                  )))}
                </tr>
                <tr>
                  <td className="p-1 px-3 border-b border-r bg-white sticky left-0 z-10 font-bold text-[9px] text-slate-600 pl-4 print:static print:border">Taktik</td>
                  {activeMonths.flatMap((m, mIdx) => [1,2,3,4].map(w => (
                    <td key={`tak-${m}-${w}`} className="p-0 border-b border-r bg-slate-50 text-center text-[7px] font-bold text-slate-500 print:bg-transparent print:border">{w===1 ? trainingFactors[m]?.taktik : ''}</td>
                  )))}
                </tr>
                <tr>
                  <td className="p-1 px-3 border-b border-r bg-white sticky left-0 z-10 font-bold text-[9px] text-slate-600 pl-4 print:static print:border">Psikologis</td>
                  {activeMonths.flatMap((m, mIdx) => [1,2,3,4].map(w => (
                    <td key={`p-${m}-${w}`} className="p-0 border-b border-r bg-slate-50 text-center text-[7px] font-bold text-slate-500 print:bg-transparent print:border">{w===1 ? trainingFactors[m]?.psikis : ''}</td>
                  )))}
                </tr>

                {/* GRAFIK RAKSASA TERINTEGRASI */}
                <tr>
                  <td className="p-4 border-b border-r bg-white sticky left-0 z-10 font-black text-[10px] text-slate-400 uppercase align-middle text-center shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] print:static print:border print:shadow-none">
                     Grafik Dinamika<br/>Beban
                     <div className="flex flex-col gap-1 mt-4 items-center print:hidden">
                        <span className="text-[8px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">Volume</span>
                        <span className="text-[8px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-100">Intensitas</span>
                        <span className="text-[8px] font-black text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded border border-yellow-200 mt-2">Peaking Area</span>
                     </div>
                  </td>
                  <td colSpan={activeMonths.length * 4} className="p-0 border-b border-r bg-white align-top print:border">
                    <div className="h-64 w-full mt-4 print:h-48">
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData} margin={{ left: 30, right: 30, top: 10, bottom: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={true} stroke="#f1f5f9"/>
                          <XAxis dataKey="name" hide />
                          <YAxis yAxisId="left" hide domain={[0, 100]}/>
                          <YAxis yAxisId="right" orientation="right" hide domain={[0, 5]}/>
                          <RechartsTooltip/>
                          <ReferenceLine yAxisId="left" x={competitionMonth} stroke="#ef4444" strokeDasharray="5 5" label={{ position: 'insideTopRight', value: 'PEAK', fill: '#ef4444', fontSize: 10, fontWeight: 'black' }} />
                          <Area isAnimationActive={false} yAxisId="right" type="monotone" dataKey="Peak" fill="#fef08a" stroke="#eab308" opacity={0.3} strokeWidth={2} />
                          <Line isAnimationActive={false} yAxisId="left" type="monotone" name="Intensitas" dataKey="Intensitas" stroke="#ef4444" strokeWidth={3} dot={{r: 4, fill: '#ef4444'}} activeDot={{r: 6}}/>
                          <Line isAnimationActive={false} yAxisId="left" type="monotone" name="Volume" dataKey="Volume" stroke="#3b82f6" strokeWidth={3} dot={{r: 4, fill: '#3b82f6'}} activeDot={{r: 6}}/>
                        </ComposedChart>
                      </ResponsiveContainer>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        </div> {/* <-- PENUTUP reportRef DI SINI */}

        {/* PANEL BAWAH: MIKROSIKLUS & BIOMOTORIK */}
        <div className="grid grid-cols-2 gap-8 mb-8 print:hidden px-6 mt-8">
          <div className="border p-6 rounded-3xl bg-white shadow-sm flex flex-col justify-between border-slate-200">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className={`font-black uppercase flex items-center gap-2 tracking-tighter ${t.textDark}`}><BarChart2 className="w-4 h-4"/> Template Siklus Mikro Aktif</h2>
              </div>
              <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[9px] font-black uppercase text-slate-400">Tipe Minggu Latihan:</span>
                  <select value={microType} onChange={(e) => setMicroType(e.target.value)} className={`flex-1 bg-transparent text-[11px] font-black outline-none cursor-pointer uppercase ${t.text}`}>
                    {Object.keys(microTypesDesc).map(k => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <p className="text-[9px] font-bold text-slate-500 italic">{microTypesDesc[microType]}</p>
              </div>
              <div className="h-40 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={Object.entries(dailySessions).map(([day, s]) => ({day, val: (s.morning.menu ? 50 : 0) + (s.afternoon.menu ? 50 : 0)}))} onClick={d => { if(d.activeLabel) { setSelectedDay(d.activeLabel); setShowDailyModal(true); } }}>
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fontWeight: 'bold'}}/>
                    <YAxis hide domain={[0, 100]}/>
                    <Bar isAnimationActive={false} dataKey="val" radius={[8, 8, 0, 0]} barSize={40} cursor="pointer">
                      {Object.entries(dailySessions).map(([day, s], idx) => <Cell key={idx} fill={s.morning.menu && s.afternoon.menu ? t.hex : s.morning.menu || s.afternoon.menu ? '#eab308' : '#f1f5f9'} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-2 p-3 bg-green-50 rounded-xl border border-green-100 flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-600 flex-shrink-0"/>
              <span className="text-[9px] font-bold text-green-700 leading-tight">Klik batang grafik untuk menyusun menu. Grafik ini bertindak sebagai kerangka/template harian bagi pelatih asisten.</span>
            </div>
          </div>

          <div className="space-y-6">
            <div className={`border p-6 rounded-3xl bg-white shadow-sm flex flex-col border-slate-200`}>
               <h2 className={`font-black uppercase flex items-center gap-2 mb-4 ${t.text}`}><Trophy className="w-4 h-4"/> Evaluasi Kemampuan Fisik</h2>
               <input value={evaluation.name} onChange={e => setEvaluation({...evaluation, name: e.target.value})} className={`w-full mb-3 p-2 border-b font-black outline-none uppercase bg-slate-50 ${t.textDark}`} placeholder="Nama Tes Utama..." />
               <div className="flex gap-3 mb-3">
                 <div className="w-1/2">
                   <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Skor Atlet</label>
                   <input type="number" value={evaluation.score} onChange={e => setEvaluation({...evaluation, score: Number(e.target.value)})} className={`w-full p-2 border rounded-xl text-center font-black ${t.text}`} />
                 </div>
                 <div className="w-1/2">
                   <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest block mb-1">Target Ideal</label>
                   <input type="number" value={evaluation.target} onChange={e => setEvaluation({...evaluation, target: Number(e.target.value)})} className="w-full p-2 border rounded-xl text-center font-black text-slate-400" />
                 </div>
               </div>
               
               <label className="flex items-center gap-2 cursor-pointer mb-3 justify-center bg-slate-50 p-2 rounded-xl border">
                 <input type="checkbox" checked={evaluation.isTime} onChange={e => setEvaluation({...evaluation, isTime: e.target.checked})} className="w-3 h-3 cursor-pointer" style={{ accentColor: t.hex }} />
                 <span className="text-[9px] font-black text-slate-500 uppercase">Mode Waktu/Kecepatan (Makin Kecil Makin Baik)</span>
               </label>

               <div className={`p-3 rounded-xl text-center font-black text-white shadow-inner ${calculateScore().barColor}`}>{calculateScore().percentage}% - {calculateScore().label}</div>
            </div>

            <div className="border p-6 rounded-3xl bg-white shadow-sm border-slate-200 flex flex-col flex-1">
               <h2 className="font-black uppercase flex items-center gap-2 mb-3 text-orange-600 tracking-tighter"><ClipboardList className="w-4 h-4"/> Catatan Gizi & Medis</h2>
               <textarea value={nutritionNote} onChange={e => setNutritionNote(e.target.value)} className="w-full bg-orange-50/30 border border-orange-100 p-4 rounded-2xl flex-1 outline-none font-bold text-slate-600 leading-relaxed text-[10px]" placeholder="Ketik catatan diet..." />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 px-6 print:hidden">
           {/* MODUL BIOMOTORIK BOMPA */}
           <div className="border p-6 rounded-3xl bg-slate-50/50 flex flex-col shadow-sm border-slate-200 h-80">
             <div className="flex justify-between items-center mb-4">
               <h2 className="font-black uppercase tracking-tighter flex items-center gap-2"><Dumbbell className="text-slate-600 w-4 h-4"/> Pemandu Biomotorik Spesifik</h2>
             </div>
             
             {athleteInfo.age.includes('U13') && activeBiomotor === 'Strength' && (
               <div className="mb-4 p-3 bg-red-100 border border-red-200 rounded-xl flex gap-2 items-start shadow-sm">
                 <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5"/>
                 <p className="text-[9px] font-bold text-red-700 leading-tight">PERINGATAN LTAD BOMPA: Atlet U13 dilarang keras melakukan beban mekanik.</p>
               </div>
             )}

             <div className="flex bg-white p-1 rounded-xl mb-4 border">
               {['Strength', 'Endurance', 'Speed'].map(type => (
                 <button key={type} onClick={() => setActiveBiomotor(type)} className={`flex-1 py-2 text-[10px] font-black rounded-lg transition-all ${activeBiomotor === type ? t.bg + ' text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>{type.toUpperCase()}</button>
               ))}
             </div>
             <div className="space-y-2 flex-1 overflow-y-auto pr-1 custom-scrollbar">
               {biomotorData[activeBiomotor].map(p => (
                 <div key={p.id} className="p-3 rounded-2xl border-2 transition-all bg-white border-slate-100 hover:border-slate-200">
                    <p className={`text-[10px] font-black uppercase mb-1 ${t.textDark}`}>{p.id}</p>
                    <p className={`text-[9px] font-bold mb-0.5 ${t.text}`}>{p.param}</p>
                    <p className="text-[8px] font-black text-orange-500 mb-1">{p.rest}</p>
                    <p className="text-[8px] text-slate-500 italic">{p.desc}</p>
                 </div>
               ))}
             </div>
           </div>

           {/* PSIKOLOGI */}
           <div className="border p-8 rounded-3xl bg-slate-900 text-white shadow-inner h-80 flex flex-col">
             <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
               <h2 className="font-black uppercase flex items-center gap-2 tracking-tighter text-sm"><Brain className={`w-5 h-5 ${t.text}`}/> Asesmen Psikologi Bertarung</h2>
               <span className="text-[8px] font-black uppercase text-slate-500 tracking-widest italic">by fiqhipondaa9 system</span>
             </div>
             <div className="grid grid-cols-3 gap-4 flex-1 content-start">
                {mentalData.map((item, idx) => (
                  <div key={item.id} className="space-y-2 text-center group flex flex-col items-center">
                    <input value={item.label} onChange={e => { 
                       const newData = mentalData.map((m, i) => i === idx ? { ...m, label: e.target.value } : m); setMentalData(newData); 
                    }} className="bg-transparent text-[9px] font-black text-slate-400 uppercase outline-none text-center focus:text-white transition-colors w-full" />
                    <div className="bg-slate-800 p-3 rounded-2xl border border-slate-700 shadow-md transition-all w-24" style={{ '--tw-border-opacity': 1, borderColor: item.score >= 8 ? t.hex : '#334155' }}>
                      <input type="number" min="1" max="9" value={item.score} onChange={e => { 
                         const newData = mentalData.map((m, i) => i === idx ? { ...m, score: Number(e.target.value) } : m); setMentalData(newData); 
                      }} className="bg-transparent w-full text-center font-black text-2xl outline-none" style={{ color: t.hex }} />
                    </div>
                  </div>
                ))}
             </div>
           </div>
        </div>

        {/* FOOTER HAK CIPTA */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex justify-between items-center opacity-50 px-8 pb-4 print:hidden">
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic print:text-black">ANNUAL TRAINING PLAN SYSTEM | Designed by fiqhipondaa9</p>
           <div className="flex gap-4 items-center no-print">
              <Globe className="w-3 h-3 text-slate-400"/><select value={terminology} onChange={e => setTerminology(e.target.value)} className="bg-transparent font-black outline-none uppercase text-[9px] cursor-pointer text-slate-400"><option value="Eropa">Mazhab Eropa</option><option value="Amerika">Mazhab Amerika</option></select>
           </div>
        </div>
      </div>
    </div>
  );
};

export default App;