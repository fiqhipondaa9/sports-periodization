import React, { useState, useEffect, useMemo } from 'react';
import * as htmlToImage from 'html-to-image';

// --- KOMPONEN IKON SVG (Custom agar ringan dan mandiri) ---
const IconUser = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
const IconActivity = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>;
const IconScale = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21h10"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>;
const IconDownload = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>;
const IconAlert = () => <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>;
const IconMedal = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7.21 15 2.66 7.14a2 2 0 0 1 .13-2.2L4.4 2.8A2 2 0 0 1 6 2h12a2 2 0 0 1 1.6.8l1.6 2.14a2 2 0 0 1 .14 2.2L16.79 15"/><path d="M11 12 5.12 2.2"/><path d="M13 12l5.88-9.8"/><path d="M8 7h8"/><circle cx="12" cy="17" r="5"/><path d="M12 18v-2h-.5"/></svg>;
const IconReset = () => <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>;

// --- FUNGSI HELPER: TARGET EMAS (CHEAT SHEET) ---
const getTargetPlaceholder = (id, gender) => {
  const isM = gender === 'Putra';
  switch(id) {
    case 'sitReach': return isM ? 'Target: ≥ 32' : 'Target: ≥ 38';
    case 'pushUp': return isM ? 'Target: ≥ 75' : 'Target: ≥ 50';
    case 'sitUp': return isM ? 'Target: ≥ 110' : 'Target: ≥ 90';
    case 'core': return 'Target: Lvl 12';
    case 'vJump': return isM ? 'Target: ≥ 80' : 'Target: ≥ 65';
    case 'shuttle': return isM ? 'Target: ≤ 5.60' : 'Target: ≤ 5.90';
    case 'sprint': return isM ? 'Target: ≤ 2.75' : 'Target: ≤ 3.20';
    case 'hopRight': return isM ? 'Target: ≥ 10.6' : 'Target: ≥ 8.3';
    case 'hopLeft': return isM ? 'Target: ≥ 10.2' : 'Target: ≥ 7.9';
    default: return '0';
  }
};

// --- FUNGSI SCORING LOGIC (Berdasarkan PERMENPORA 15/2024 & Interpolasi Saintifik) ---
const getScore = (test, gender, value) => {
  if (value === '' || value === null || isNaN(value)) return 0;
  // Parse langsung
  const v = parseFloat(value); 
  const isM = gender === 'Putra';

  switch(test) {
    // Sesuai Lampiran II: 100%, 80%, 70%, 60%
    case 'sitReach': 
      return isM ? (v >= 32 ? 100 : v >= 25.6 ? 80 : v >= 22.4 ? 70 : v >= 19.2 ? 60 : 40) 
                 : (v >= 38 ? 100 : v >= 30.4 ? 80 : v >= 26.6 ? 70 : v >= 26.6 ? 60 : 40);
    
    case 'pushUp': 
      return isM ? (v >= 75 ? 100 : v >= 60 ? 80 : v >= 53 ? 70 : v >= 45 ? 60 : 40) 
                 : (v >= 50 ? 100 : v >= 40 ? 80 : v >= 35 ? 70 : v >= 35 ? 60 : 40);
    
    case 'sitUp': 
      return isM ? (v >= 110 ? 100 : v >= 88 ? 80 : v >= 77 ? 70 : v >= 66 ? 60 : 40) 
                 : (v >= 90 ? 100 : v >= 72 ? 80 : v >= 63 ? 70 : v >= 63 ? 60 : 40);
    
    case 'core': 
      return v >= 12 ? 100 : v >= 9 ? 80 : 40; // >= 9 mencakup 80, 70, 60 sesuai instruksi
    
    case 'vJump': 
      return isM ? (v >= 80 ? 100 : v >= 64 ? 80 : v >= 56 ? 70 : v >= 48 ? 60 : 40) 
                 : (v >= 65 ? 100 : v >= 52 ? 80 : v >= 46 ? 70 : v >= 46 ? 60 : 40);
    
    // Pro-rata Jarak (100% * persentase)
    case 'hopRight': 
      return isM ? (v >= 10.6 ? 100 : v >= 8.48 ? 80 : v >= 7.42 ? 70 : v >= 6.36 ? 60 : 40) 
                 : (v >= 8.3 ? 100 : v >= 6.64 ? 80 : v >= 5.81 ? 70 : v >= 4.98 ? 60 : 40);
    
    case 'hopLeft': 
      return isM ? (v >= 10.2 ? 100 : v >= 8.16 ? 80 : v >= 7.14 ? 70 : v >= 6.12 ? 60 : 40) 
                 : (v >= 7.9 ? 100 : v >= 6.32 ? 80 : v >= 5.53 ? 70 : v >= 4.74 ? 60 : 40);
    
    // Pro-rata Waktu (Semakin KECIL semakin BAEK). Target / persentase.
    case 'shuttle': 
      return isM ? (v <= 5.60 ? 100 : v <= 7.00 ? 80 : v <= 8.00 ? 70 : v <= 9.33 ? 60 : 40) 
                 : (v <= 5.90 ? 100 : v <= 7.37 ? 80 : v <= 8.42 ? 70 : v <= 9.83 ? 60 : 40);
    
    case 'sprint': 
      return isM ? (v <= 2.75 ? 100 : v <= 3.43 ? 80 : v <= 3.92 ? 70 : v <= 4.58 ? 60 : 40) 
                 : (v <= 3.20 ? 100 : v <= 4.00 ? 80 : v <= 4.57 ? 70 : v <= 5.33 ? 60 : 40);
    
    // Pro-rata VO2Max
    case 'beep': 
      return isM ? (v >= 65.0 ? 100 : v >= 52.0 ? 80 : v >= 45.5 ? 70 : v >= 39.0 ? 60 : 40) 
                 : (v >= 55.0 ? 100 : v >= 44.0 ? 80 : v >= 38.5 ? 70 : v >= 33.0 ? 60 : 40);
    
    default: return 0;
  }
};

// --- KOMPONEN RADAR CHART (Custom SVG) ---
// FIX: Tambahkan properti isBlanko ke dalam parameter
const RadarChart = ({ data, isBlanko }) => {
  const size = 320; const center = size / 2; const radius = 110;
  const labels = ['Sit/Reach', 'PushUp', 'SitUp', 'Core', 'V-Jump', '3-Hop(R)', '3-Hop(L)', 'Shuttle', 'Sprint', 'VO2Max'];
  const angleStep = (Math.PI * 2) / labels.length;

  const getCoordinates = (val, i) => {
    const r = (val / 100) * radius;
    const a = i * angleStep - Math.PI / 2;
    return { x: center + r * Math.cos(a), y: center + r * Math.sin(a) };
  };

  const dataPoints = data.map((val, i) => getCoordinates(val, i));
  const dataPath = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${size} ${size}`} className="overflow-visible">
      {[20, 40, 60, 80, 100].map(level => {
        const pts = labels.map((_, i) => getCoordinates(level, i));
        const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
        return <path key={level} d={path} fill="none" stroke={level === 100 ? '#facc15' : '#e5e7eb'} strokeWidth={level === 100 ? 2 : 1} strokeDasharray={level < 100 ? "4 4" : "none"} />
      })}
      
      {labels.map((label, i) => {
        const pOuter = getCoordinates(115, i);
        const pEdge = getCoordinates(100, i);
        return (
          <g key={i}>
            <line x1={center} y1={center} x2={pEdge.x} y2={pEdge.y} stroke="#e5e7eb" strokeWidth="1" />
            <text x={pOuter.x} y={pOuter.y} textAnchor="middle" dominantBaseline="middle" className="text-[10px] font-bold fill-gray-500">{label}</text>
          </g>
        );
      })}

      {/* FIX: Sembunyikan area kuning dan titik hitam jika ini adalah mode blanko kosong */}
      {!isBlanko && (
        <>
          <path d={dataPath} fill="rgba(250, 204, 21, 0.4)" stroke="#111827" strokeWidth="3" strokeLinejoin="round" />
          {dataPoints.map((p, i) => ( <circle key={i} cx={p.x} cy={p.y} r="4" fill="#111827" /> ))}
        </>
      )}
    </svg>
  );
};

export default function App() {
  const [identity, setIdentity] = useState({ name: '', origin: '', dob: '', gender: 'Putra' });
  const [anthro, setAnthro] = useState({ weight: '', height: '', armSpan: '', sitHeight: '' });
  const [tests, setTests] = useState({
    sitReach: '', pushUp: '', sitUp: '', core: '', vJump: '', hopRight: '', hopLeft: '', shuttle: '', sprint: '', beepLevel: '', beepShuttle: ''
  });
  
  const [isExporting, setIsExporting] = useState(false);

  const age = useMemo(() => {
    if (!identity.dob) return '-';
    const birthDate = new Date(identity.dob);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    // Kurangi umur 1 tahun jika bulan/tanggal hari ini belum melewati hari ulang tahun
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      calculatedAge--;
    }
    return calculatedAge;
  }, [identity.dob]);

  const bmiData = useMemo(() => {
    // FIX: Ubah nilai default BMI dari 0 menjadi '-' agar terlihat elegan saat form kosong
    if (!anthro.weight || !anthro.height || anthro.height <= 0) return { bmi: '-', status: '-', color: 'text-gray-400' };
  
  const hM = anthro.height / 100;
  const bmiValue = (anthro.weight / (hM * hM));
  const bmi = bmiValue.toFixed(1);
    let status = 'Kurus'; let color = 'text-blue-500';
    if (bmi >= 18.5 && bmi <= 24.9) { status = 'Ideal'; color = 'text-green-500'; }
    else if (bmi >= 25 && bmi <= 29.9) { status = 'Gemuk'; color = 'text-amber-500'; }
    else if (bmi >= 30) { status = 'Obesitas'; color = 'text-red-500'; }
    return { bmi, status, color };
  }, [anthro.weight, anthro.height]);

  const proportionData = useMemo(() => {
    const h = parseFloat(anthro.height);
    const arm = parseFloat(anthro.armSpan);
    const sit = parseFloat(anthro.sitHeight);

    let apeIndex = { value: 0, text: '-', color: 'text-gray-400', desc: 'Isi Tinggi & Lengan' };
    let legRatio = { value: 0, text: '-', color: 'text-gray-400', desc: 'Isi Tinggi Duduk' };

    if (h > 0 && arm > 0) {
      const ratio = arm / h;
      if (ratio > 1.02) apeIndex = { value: ratio.toFixed(2), text: 'Superior', color: 'text-green-600', desc: 'Reach Advantage +++' };
      else if (ratio >= 1.0) apeIndex = { value: ratio.toFixed(2), text: 'Ideal', color: 'text-blue-600', desc: 'Reach Advantage +' };
      else apeIndex = { value: ratio.toFixed(2), text: 'Standar', color: 'text-amber-600', desc: 'Jangkauan Normal' };
    }

    if (h > 0 && sit > 0 && sit < h) {
      const legLength = h - sit;
      const legPercentage = (legLength / h) * 100;
      if (legPercentage >= 50) legRatio = { value: legPercentage.toFixed(1) + '%', text: 'Tungkai Panjang', color: 'text-green-600', desc: 'Senjata Tendangan Jauh' };
      else if (legPercentage >= 47) legRatio = { value: legPercentage.toFixed(1) + '%', text: 'Tungkai Ideal', color: 'text-blue-600', desc: 'Proporsi Seimbang' };
      else legRatio = { value: legPercentage.toFixed(1) + '%', text: 'Tungkai Pendek', color: 'text-amber-600', desc: 'Fokus Power Jarak Dekat' };
    }

    return { apeIndex, legRatio };
  }, [anthro.height, anthro.armSpan, anthro.sitHeight]);

  const calculatedVO2Max = useMemo(() => {
    const l = parseInt(tests.beepLevel);
    const s = parseInt(tests.beepShuttle);
    if (!l || !s || l < 1 || s < 1) return '';
    const vo2max = 3.46 * (l + s / (l * 0.4325 + 7.0048)) + 12.2;
    return parseFloat(vo2max.toFixed(1));
  }, [tests.beepLevel, tests.beepShuttle]);

  const scores = useMemo(() => ({
    sitReach: getScore('sitReach', identity.gender, tests.sitReach),
    pushUp: getScore('pushUp', identity.gender, tests.pushUp),
    sitUp: getScore('sitUp', identity.gender, tests.sitUp),
    core: getScore('core', identity.gender, tests.core),
    vJump: getScore('vJump', identity.gender, tests.vJump),
    hopRight: getScore('hopRight', identity.gender, tests.hopRight),
    hopLeft: getScore('hopLeft', identity.gender, tests.hopLeft),
    shuttle: getScore('shuttle', identity.gender, tests.shuttle),
    sprint: getScore('sprint', identity.gender, tests.sprint),
    beep: getScore('beep', identity.gender, calculatedVO2Max),
  }), [tests, identity.gender, calculatedVO2Max]);

  const averageScore = useMemo(() => {
    const vals = Object.values(scores);
    return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
  }, [scores]);

  // Tambahan: Deteksi apakah form ini dicetak sebagai blanko kosong
  const isBlanko = !identity.name && averageScore === 0;

  const lsiData = useMemo(() => {
    const r = parseFloat(tests.hopRight);
    const l = parseFloat(tests.hopLeft);
    if (!r || !l || r === 0 || l === 0) return { lsi: 100, isDanger: false };
    const min = Math.min(r, l);
    const max = Math.max(r, l);
    const lsi = (min / max) * 100;
    return { lsi: lsi.toFixed(1), isDanger: lsi < 85, weakSide: r < l ? 'Kanan' : 'Kiri' };
  }, [tests.hopRight, tests.hopLeft]);

  // --- FUNGSI RESET DATA ---
  const handleReset = () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus semua data isian?")) {
      window.location.reload(); // Cara paling bersih untuk mereset seluruh form
    }
  };

// --- FUNGSI EXPORT (MENGGUNAKAN HTML-TO-IMAGE MODERN) ---
const handleDownloadImage = async () => {
  setIsExporting(true);
  
  // Tunggu DOM me-render kelas CSS `export-mode`
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  try {
    const element = document.getElementById('report-container');
    if (!element) throw new Error("ID report-container tidak ditemukan");
    
    // Menggunakan htmlToImage (support Tailwind v4 oklch)
    const dataUrl = await htmlToImage.toPng(element, { 
      quality: 1.0,
      backgroundColor: "#f3f4f6",
      pixelRatio: 2 // Membuat gambar menjadi resolusi tinggi (HD)
    });
    
    const safeName = identity?.name ? identity.name.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'atlet';
    const link = document.createElement("a");
    link.download = `Rapor_Fisik_Taekwondo_${safeName}.png`;
    link.href = dataUrl;
    link.click();
  } catch (error) {
    console.error("Gagal export:", error);
    alert("Gagal membuat gambar rapor. Silakan coba lagi.");
  } finally {
    setIsExporting(false);
  }
};

  return (
    <div id="report-container" className="min-h-screen bg-gray-100 flex flex-col items-center py-10 px-4 font-sans print:bg-white print:py-0 print:px-0">
      
      {isExporting && (
        <style dangerouslySetInnerHTML={{__html: `
          /* FIX: Mengembalikan warna abu-abu khas kotak Bento agar form terlihat memiliki batas ruang tulis jika diprint kosong */
          /* Kita hanya menyembunyikan elemen bawaan web (panah dropdown, spinner) dan memperbaiki padding */
          #report-container input, 
          #report-container select {
            appearance: none !important;
            -webkit-appearance: none;
            -moz-appearance: none;
            padding-bottom: 8px !important; /* Mencegah huruf ekor bawah terpotong */
          }
          
          /* Sembunyikan spinner pada input angka di Chrome/Safari */
          #report-container input[type="number"]::-webkit-inner-spin-button, 
          #report-container input[type="number"]::-webkit-outer-spin-button { 
            -webkit-appearance: none !important; 
            margin: 0 !important; 
          }

          /* Hilangkan efek biru fokus (glow) jika kursor tertinggal di dalam input saat mengeklik tombol unduh */
          #report-container input:focus,
          #report-container select:focus {
            box-shadow: none !important;
            border-color: #e5e7eb !important;
          }
        `}} />
      )}

      {/* HEADER */}
      <header className="bg-black text-white p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-400 rounded-full blur-3xl opacity-20 -mr-20 -mt-20" data-html2canvas-ignore="true"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="inline-block bg-yellow-400 text-black font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest mb-3 shadow-md">
              PERMENPORA 15 TAHUN 2024
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              KALKULATOR FISIK<br/><span className="text-yellow-400">TAEKWONDO</span>
            </h1>
          </div>
          <div className="text-right">
     {/* FIX: Sembunyikan tombol saat proses export */}
     {!isExporting && (
            <div className="no-print flex items-center justify-end gap-2 mb-4">
              <button onClick={handleReset} className="bg-white/10 hover:bg-red-500/90 text-white px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm font-bold tracking-wide backdrop-blur-sm border border-white/10 hover:border-red-500/50 shadow-lg">
                <IconReset /> <span className="hidden md:inline">Reset Data</span>
              </button>
              <button onClick={handleDownloadImage} disabled={isExporting} className="bg-tkd-yellow hover:bg-yellow-400 text-tkd-black px-6 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 text-sm font-black tracking-wide border border-yellow-300 shadow-[0_0_15px_rgba(250,204,21,0.3)] hover:shadow-[0_0_25px_rgba(250,204,21,0.5)] disabled:opacity-70 disabled:cursor-not-allowed">
                <IconDownload /> {isExporting ? 'Memproses...' : 'Unduh Rapor (PNG)'}
              </button>
            </div>
          )}
            <p className="font-bold text-gray-400 text-xs tracking-widest uppercase">Platform Olahraga<br/>by <span className="text-white">fiqhipondaa9</span></p>
          </div>
        </div>
      </header>

      {/* Pembungkus utama menggunakan width dinamis agar simetris saat diekspor */}
      <main className={`${isExporting ? 'w-[1100px]' : 'max-w-7xl'} mx-auto px-4 md:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6`}>
        
        {/* ================= KOLOM KIRI (Input Data) ================= */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
              <div className="bg-black text-yellow-400 p-2.5 rounded-2xl"><IconUser /></div>
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-wide">Identitas & Antropometri</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Nama Atlet</label>
                <input type="text" value={identity.name} onChange={e => setIdentity({...identity, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 font-bold text-gray-900 focus:outline-none focus:border-yellow-400 transition-all" placeholder={isExporting ? "" : "Masukkan nama..."} />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Klub / Provinsi</label>
                <input type="text" value={identity.origin} onChange={e => setIdentity({...identity, origin: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 font-bold text-gray-900 focus:outline-none focus:border-yellow-400 transition-all" placeholder={isExporting ? "" : "Asal daerah..."} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Tgl Lahir</label>
                  <input type="date" value={identity.dob} onChange={e => setIdentity({...identity, dob: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 font-bold text-gray-900 focus:outline-none focus:border-yellow-400 transition-all text-sm" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-gray-500 uppercase ml-1">Umur</label>
                  {/* FIX: Menggunakan invisible text (\u00A0) agar tinggi kotak stabil mutlak saat kosong */}
                  <div className="w-full bg-gray-100 border border-gray-200 rounded-2xl px-4 py-3 font-black text-gray-900 text-center">{age !== '-' ? `${age} Thn` : '\u00A0'}</div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-500 uppercase ml-1">Jenis Kelamin</label>
                <select value={identity.gender} onChange={e => setIdentity({...identity, gender: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 font-bold text-gray-900 focus:outline-none focus:border-yellow-400 transition-all cursor-pointer">
                  <option value="Putra">Putra (Male)</option>
                  <option value="Putri">Putri (Female)</option>
                </select>
              </div>
            </div>

            {/* FIX: Menghapus kelas export-transparent */}
            <div className="bg-gray-50 rounded-3xl p-5 border border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Tinggi (cm)</label>
                <input type="number" value={anthro.height} onChange={e => setAnthro({...anthro, height: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 font-bold text-center focus:border-yellow-400 outline-none" placeholder={isExporting ? "" : "0"} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Berat (kg)</label>
                <input type="number" value={anthro.weight} onChange={e => setAnthro({...anthro, weight: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 font-bold text-center focus:border-yellow-400 outline-none" placeholder={isExporting ? "" : "0"} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Rentang Lengan</label>
                <input type="number" value={anthro.armSpan} onChange={e => setAnthro({...anthro, armSpan: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 font-bold text-center focus:border-yellow-400 outline-none" placeholder={isExporting ? "" : "cm"} />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 uppercase">Tinggi Duduk</label>
                <input type="number" value={anthro.sitHeight} onChange={e => setAnthro({...anthro, sitHeight: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 font-bold text-center focus:border-yellow-400 outline-none" placeholder={isExporting ? "" : "cm"} />
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between bg-black text-white rounded-2xl p-4 shadow-md animate-in fade-in">
               <div className="flex items-center gap-3"><IconScale /> <span className="font-bold text-sm tracking-widest uppercase text-gray-300">Indeks Massa Tubuh</span></div>
               <div className="flex items-center gap-3">
                 <span className="text-2xl font-black">{bmiData.bmi}</span>
                 {/* FIX: Sembunyikan pil putih jika IMT masih kosong (-) */}
                 {bmiData.status !== '-' && (
                   <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-white ${bmiData.color}`}>{bmiData.status}</span>
                 )}
               </div>
            </div>

            {(anthro.height > 0 && (anthro.armSpan > 0 || anthro.sitHeight > 0)) && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col justify-center relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-yellow-400"></div>
                   <div className="flex justify-between items-start mb-2 pl-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ape Index (Lengan)</span>
                      <span className={`text-[10px] bg-gray-50 px-2 py-0.5 rounded-md font-black uppercase tracking-widest ${proportionData.apeIndex.color}`}>{proportionData.apeIndex.text}</span>
                   </div>
                   <div className="flex items-end gap-2 pl-2 mt-1">
                      <span className="text-3xl font-black text-gray-900 leading-none">{proportionData.apeIndex.value}</span>
                   </div>
                   <p className="text-xs font-bold text-gray-500 mt-2 pl-2">{proportionData.apeIndex.desc}</p>
                </div>
                
                <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col justify-center relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-1 h-full bg-black"></div>
                   <div className="flex justify-between items-start mb-2 pl-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Rasio Tungkai</span>
                      <span className={`text-[10px] bg-gray-50 px-2 py-0.5 rounded-md font-black uppercase tracking-widest ${proportionData.legRatio.color}`}>{proportionData.legRatio.text}</span>
                   </div>
                   <div className="flex items-end gap-2 pl-2 mt-1">
                      <span className="text-3xl font-black text-gray-900 leading-none">{proportionData.legRatio.value}</span>
                   </div>
                   <p className="text-xs font-bold text-gray-500 mt-2 pl-2">{proportionData.legRatio.desc}</p>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white rounded-[2rem] p-6 md:p-8 shadow-sm border border-gray-200">
            <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
              <div className="bg-yellow-400 text-black p-2.5 rounded-2xl"><IconActivity /></div>
              <h2 className="text-xl font-black text-gray-900 uppercase tracking-wide">Rekam Hasil Tes Fisik</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
               {[
                 { id: 'sitReach', label: 'Sit & Reach', unit: 'cm' },
                 { id: 'pushUp', label: 'Push Up (1 Min)', unit: 'reps' },
                 { id: 'sitUp', label: 'Sit Up (2 Min)', unit: 'reps' },
                 { id: 'core', label: 'Core Stability', unit: 'level' },
                 { id: 'vJump', label: 'Vertical Jump', unit: 'cm' },
                 { id: 'shuttle', label: 'Shuttle Run 4x5', unit: 'detik' },
                 { id: 'sprint', label: 'Sprint 20m', unit: 'detik' },
               ].map(item => (
                 <div key={item.id} className="flex flex-col">
                   <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1">{item.label}</label>
                   <div className="relative">
                     {/* Perhatikan placeholder tetap hidup khusus bagian input target sport science */}
                     <input type="number" step="0.1" value={tests[item.id]} onChange={e => setTests({...tests, [item.id]: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 font-black text-gray-900 focus:outline-none focus:border-yellow-400 transition-all pr-14 placeholder:text-[11px] placeholder:font-bold placeholder:text-gray-400/80" placeholder={getTargetPlaceholder(item.id, identity.gender)} />
                     <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">{item.unit}</span>
                   </div>
                 </div>
               ))}

               {/* FIX: Menghapus kelas export-transparent */}
               <div className="sm:col-span-2 bg-gray-50 p-5 rounded-3xl border border-gray-100 mt-2">
                 <div className="flex justify-between items-center mb-3">
                   <label className="text-sm font-black text-gray-800 uppercase block">Beep Test (Bleep)</label>
                   {calculatedVO2Max > 0 && (
                     <span className="bg-yellow-400 text-black px-3 py-1.5 rounded-xl text-xs font-black shadow-sm animate-in fade-in slide-in-from-right-2 flex items-center gap-2">
                       VO2Max: {calculatedVO2Max} <span className="text-[10px] opacity-70">ml/kg/min</span>
                     </span>
                   )}
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="relative">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 uppercase">Level</span>
                     <input type="number" min="1" value={tests.beepLevel} onChange={e => setTests({...tests, beepLevel: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-16 pr-4 font-black text-gray-900 focus:outline-none focus:border-yellow-400 transition-all text-right" placeholder={isExporting ? "" : "0"} />
                   </div>
                   <div className="relative">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 uppercase">Balikan</span>
                     <input type="number" min="1" value={tests.beepShuttle} onChange={e => setTests({...tests, beepShuttle: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-20 pr-4 font-black text-gray-900 focus:outline-none focus:border-yellow-400 transition-all text-right" placeholder={isExporting ? "" : "0"} />
                   </div>
                 </div>
                 <p className="text-[10px] font-bold text-gray-400 mt-3 text-center uppercase tracking-widest">
                   <span className="text-yellow-600">Target Emas VO2Max: {identity.gender === 'Putra' ? '≥ 65.0' : '≥ 55.0'}</span> • Sistem mengkonversi otomatis
                 </p>
               </div>
               
               {/* FIX: Menghapus kelas export-transparent */}
               <div className="sm:col-span-2 bg-gray-50 p-5 rounded-3xl border border-gray-100 mt-2">
                 <label className="text-sm font-black text-gray-800 uppercase mb-3 block">3 Hop Jump Distance</label>
                 <div className="grid grid-cols-2 gap-4">
                   <div className="relative">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 uppercase">Kanan</span>
                     <input type="number" step="0.1" value={tests.hopRight} onChange={e => setTests({...tests, hopRight: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-16 pr-10 font-black text-gray-900 focus:outline-none focus:border-yellow-400 transition-all text-right placeholder:text-[11px] placeholder:font-bold placeholder:text-gray-400/80" placeholder={getTargetPlaceholder('hopRight', identity.gender)} />
                     <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">m</span>
                   </div>
                   <div className="relative">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 uppercase">Kiri</span>
                     <input type="number" step="0.1" value={tests.hopLeft} onChange={e => setTests({...tests, hopLeft: e.target.value})} className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-16 pr-10 font-black text-gray-900 focus:outline-none focus:border-yellow-400 transition-all text-right placeholder:text-[11px] placeholder:font-bold placeholder:text-gray-400/80" placeholder={getTargetPlaceholder('hopLeft', identity.gender)} />
                     <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">m</span>
                   </div>
                 </div>
                 
                 {lsiData.isDanger && (
                   <div className="mt-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl p-4 flex gap-3 animate-pulse shadow-sm">
                     <div className="text-red-500 mt-0.5"><IconAlert /></div>
                     <div>
                       <h4 className="font-black text-sm uppercase tracking-wide">Peringatan Cedera!</h4>
                       <p className="text-xs font-medium mt-1">Limb Symmetry Index (LSI) &lt; 85%. Jarak kaki <b>{lsiData.weakSide}</b> tertinggal. Risiko cedera tinggi.</p>
                     </div>
                   </div>
                 )}
               </div>
            </div>
          </div>
        </div>

        {/* ================= KOLOM KANAN (Visualisasi & Keputusan) ================= */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          
          <div className={`rounded-[2rem] p-8 shadow-xl text-center relative overflow-hidden transition-colors duration-500 border ${averageScore > 80 ? 'bg-black text-white border-black' : averageScore < 60 && averageScore > 0 ? 'bg-red-600 text-white border-red-600' : 'bg-white border-gray-200'}`}>
            <h3 className={`text-xs font-bold uppercase tracking-widest mb-2 ${averageScore > 80 || (averageScore < 60 && averageScore > 0) ? 'text-gray-300' : 'text-gray-500'}`}>Skor Rata-Rata Fisik</h3>
            {/* FIX: Tampilkan strip (-) jika form blanko, jika tidak tampilkan skor */}
            <div className="text-7xl font-black tracking-tighter mb-4">{isBlanko ? '-' : averageScore || 0}</div>
            
            <div className="inline-flex items-center justify-center gap-2 px-6 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-sm font-black uppercase tracking-widest shadow-inner">
               {averageScore > 80 ? ( <><span className="text-yellow-400"><IconMedal /></span> PROMOSI (LAYAK)</> ) : 
                averageScore < 60 && averageScore > 0 ? 'EVALUASI / DEGRADASI' : 
                averageScore > 0 ? 'MEMENUHI SYARAT MINIMAL' : 
                isBlanko ? 'BLANKO TEMPLATE TES' : 'BELUM ADA DATA'}
            </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-200 flex-1 flex flex-col">
             <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest text-center mb-6">Profil Performa Atlet</h3>
             {/* FIX: Meneruskan variabel isBlanko ke dalam komponen RadarChart */}
             <div className="flex-1 flex items-center justify-center min-h-[250px] bg-gray-50 rounded-3xl p-4 border border-gray-100">
               <RadarChart data={Object.values(scores)} isBlanko={isBlanko} />
             </div>
             <p className="text-[10px] font-bold text-gray-400 text-center mt-4 uppercase tracking-widest">Garis Kuning = Standar Emas (100)</p>
          </div>

          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-200">
            <h3 className="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">Rincian Konversi Poin</h3>
            <div className="space-y-2">
              {[
                { label: 'Sit & Reach', val: scores.sitReach },
                { label: 'Push Up', val: scores.pushUp },
                { label: 'Sit Up', val: scores.sitUp },
                { label: 'Core Stabil', val: scores.core },
                { label: 'Vert. Jump', val: scores.vJump },
                { label: '3-Hop Right', val: scores.hopRight },
                { label: '3-Hop Left', val: scores.hopLeft },
                { label: 'Shuttle Run', val: scores.shuttle },
                { label: 'Sprint 20m', val: scores.sprint },
                { label: 'VO2Max', val: scores.beep }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center p-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                  <span className="text-xs font-bold text-gray-600 uppercase whitespace-nowrap">{item.label}</span>
                  {/* FIX: Membuat garis putus-putus membentang penuh (Leader Line) agar rapi */}
                  {isBlanko ? (
                    <div className="flex-1 ml-4 border-b-2 border-dashed border-gray-300 mt-1 h-1"></div>
                  ) : (
                    <div className="flex-1 flex justify-end items-center gap-3 ml-4">
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className={`h-full ${item.val >= 80 ? 'bg-green-500' : item.val >= 60 ? 'bg-yellow-400' : 'bg-red-500'}`} style={{ width: `${item.val}%` }}></div>
                      </div>
                      <span className="text-sm font-black w-8 text-right">{item.val}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}