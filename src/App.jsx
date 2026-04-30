import React, { useState, useMemo, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { Layout, Calendar, Trophy, Zap, Brain, Apple, Dumbbell, Activity, Target, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

const App = () => {
  const BRANDING = "PERIODISASI OLAHRAGA by fiqhipondaa9";
  const reportRef = useRef(null); // Referensi untuk area yang akan dicetak PDF

  // State Management Makrosiklus
  const [startMonth, setStartMonth] = useState(0);
  const [endMonth, setEndMonth] = useState(11);
  const [peakingIndex, setPeakingIndex] = useState(5);
  const [currentStrengthPhase, setCurrentStrengthPhase] = useState('Adaptasi Anatomi');
  const [competitionMonth, setCompetitionMonth] = useState('Okt');

  // FITUR 1: State Manajemen Modul Mental (Skala 1-9)
  const [mentalScores, setMentalScores] = useState({
    Positif: 8, Motivasi: 8, Goals: 7, Social: 8, 'Self-Talk': 7,
    Imagery: 8, Anxiety: 7, Emosi: 8, Fokus: 9
  });

  // State Modul Scoring Fisik
  const [testName, setTestName] = useState('VO2 Max');
  const [athleteScore, setAthleteScore] = useState(55);
  const [targetScore, setTargetScore] = useState(60);
  const [isTimeBased, setIsTimeBased] = useState(false);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const activeMonths = useMemo(() => months.slice(startMonth, endMonth + 1), [startMonth, endMonth]);

  // Algoritma Auto-Tapering
  const chartData = useMemo(() => {
    return activeMonths.map((m, i) => {
      let baseVolume = peakingIndex * 18 - (i * 2);
      let baseIntensity = (6 - peakingIndex) * 18 + (i * 2);

      if (m === competitionMonth) {
        baseVolume = baseVolume * 0.5; // Potong 50%
        baseIntensity = Math.min(baseIntensity * 1.2, 100); // Naik 20%
      }

      return { name: m, Intensitas: baseIntensity, Volume: baseVolume };
    });
  }, [activeMonths, peakingIndex, competitionMonth]);

  // Logika Kalkulasi Fisik Dinamis
  const calculateScore = () => {
    if (!athleteScore || !targetScore) return { percentage: 0, label: "-", color: "text-slate-400", barColor: "bg-slate-200" };
    let percentage = isTimeBased ? (targetScore / athleteScore) * 100 : (athleteScore / targetScore) * 100;
    const roundedPercent = Math.round(percentage);

    if (roundedPercent >= 100) return { percentage: roundedPercent, label: "Sangat Baik", color: "text-green-600", barColor: "bg-green-500" };
    if (roundedPercent >= 80) return { percentage: roundedPercent, label: "Baik", color: "text-blue-600", barColor: "bg-blue-500" };
    if (roundedPercent >= 60) return { percentage: roundedPercent, label: "Cukup", color: "text-yellow-600", barColor: "bg-yellow-500" };
    return { percentage: roundedPercent, label: "Kurang (Evaluasi)", color: "text-red-600", barColor: "bg-red-500" };
  };

  const getNutrition = (phase) => {
    if (phase === 'Persiapan Umum' || currentStrengthPhase === 'Adaptasi Anatomi') return "High Protein (Anatomy Adaptation)";
    if (phase === 'Persiapan Khusus') return "Mix (Balance)";
    return "High Carbohydrate (Glycogen Loading)";
  };

  const currentResult = calculateScore();

  // FITUR 2: Fungsi Cetak PDF
  const handleExportPDF = async () => {
    const element = reportRef.current;
    if (!element) return;
    
    // Simpan warna asli background
    const originalBg = element.style.backgroundColor;
    element.style.backgroundColor = '#f8fafc'; // Warna slate-50

    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Laporan_Periodisasi_${new Date().getTime()}.pdf`);
    } catch (error) {
      console.error("Gagal mengekspor PDF:", error);
      alert("Terjadi kesalahan saat mencetak PDF.");
    } finally {
      // Kembalikan ke warna asli
      element.style.backgroundColor = originalBg;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-900">
      
      {/* Tombol Cetak Laporan (Di luar area cetak agar tombol tidak ikut terfoto) */}
      <div className="max-w-[1200px] mx-auto flex justify-end mb-4">
        <button 
          onClick={handleExportPDF}
          className="bg-slate-900 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg hover:bg-slate-800 transition-all hover:-translate-y-1"
        >
          <Download className="w-5 h-5" /> Cetak Laporan PDF
        </button>
      </div>

      {/* AREA YANG AKAN DICETAK KE PDF */}
      <div ref={reportRef} className="max-w-[1200px] mx-auto p-4 bg-slate-50">
        
        {/* Header Dashboard */}
        <header className="mb-6 flex flex-col md:flex-row md:items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-200 gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-blue-900 uppercase">{BRANDING}</h1>
            <p className="text-slate-500 font-medium">Laporan Sistem Perencanaan & Manajemen Performa</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="bg-blue-50 px-4 py-2 rounded-xl flex items-center gap-3 border border-blue-100">
              <Calendar className="text-blue-600 w-5 h-5" />
              <span className="font-bold text-blue-900">{activeMonths[0]} - {activeMonths[activeMonths.length - 1]}</span>
            </div>
            <div className="bg-red-50 px-4 py-2 rounded-xl flex items-center gap-3 border border-red-100">
              <Target className="text-red-600 w-5 h-5" />
              <select value={competitionMonth} onChange={(e) => setCompetitionMonth(e.target.value)} className="bg-transparent font-bold text-red-900 outline-none cursor-pointer">
                {activeMonths.map(m => <option key={`comp-${m}`} value={m}>Target Tanding: {m}</option>)}
              </select>
            </div>
          </div>
        </header>

        {/* Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Modul 1: Peaking Index & Auto-Tapering */}
          <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="flex items-center gap-2 font-bold text-lg"><Zap className="w-5 h-5 text-orange-500" /> Beban Latihan & Tapering</h2>
              <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl">
                <span className="text-xs font-bold text-slate-500 uppercase">Peaking Index</span>
                <input type="range" min="1" max="5" value={peakingIndex} onChange={(e) => setPeakingIndex(e.target.value)} className="accent-orange-500" />
                <span className="font-black text-orange-600">{peakingIndex}</span>
              </div>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 20, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 'bold'}} />
                  <YAxis hide />
                  <Tooltip contentStyle={{borderRadius: '12px'}} />
                  <Legend iconType="circle" />
                  {activeMonths.includes(competitionMonth) && (
                    <ReferenceLine x={competitionMonth} stroke="#ef4444" strokeDasharray="5 5" label={{ position: 'top', value: 'TAPERING AKTIF', fill: '#ef4444', fontSize: 10, fontWeight: 'bold' }} />
                  )}
                  <Line type="monotone" dataKey="Intensitas" stroke="#ef4444" strokeWidth={4} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="Volume" stroke="#3b82f6" strokeWidth={4} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Modul 2: Auto-Nutrition & Evaluasi Fisik */}
          <div className="flex flex-col gap-6">
            <div className="bg-emerald-600 p-6 rounded-3xl shadow-lg text-white">
              <h2 className="flex items-center gap-2 font-bold text-lg mb-4"><Apple className="w-5 h-5 text-emerald-200" /> Auto-Nutrition</h2>
              <div className="bg-white/20 p-4 rounded-2xl border border-white/20 backdrop-blur-sm">
                <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-widest mb-1">Status Metabolisme</p>
                <p className="font-bold text-base leading-tight">{getNutrition('Persiapan Umum')}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex-1">
              <h2 className="flex items-center gap-2 font-bold text-lg mb-4"><Trophy className="w-5 h-5 text-yellow-500" /> Evaluasi Tes Fisik</h2>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <input type="text" value={testName} onChange={(e) => setTestName(e.target.value)} className="col-span-2 p-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-center" placeholder="Nama Tes..." />
                <input type="number" value={athleteScore} onChange={(e) => setAthleteScore(Number(e.target.value))} className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-center text-blue-600" placeholder="Skor Atlet" />
                <input type="number" value={targetScore} onChange={(e) => setTargetScore(Number(e.target.value))} className="p-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-center text-slate-500" placeholder="Target" />
              </div>
              <div className="flex items-center gap-2 mb-4">
                <input type="checkbox" checked={isTimeBased} onChange={(e) => setIsTimeBased(e.target.checked)} className="accent-indigo-600" />
                <label className="text-[10px] font-bold text-slate-500">Tes Waktu (Makin kecil makin baik)</label>
              </div>
              <div className={`p-4 rounded-2xl border flex flex-col items-center justify-center ${currentResult.barColor.replace('bg-', 'bg-').replace('500', '50')} ${currentResult.barColor.replace('bg-', 'border-').replace('500', '200')}`}>
                <span className={`text-2xl font-black ${currentResult.color}`}>{currentResult.percentage}%</span>
                <span className={`text-[10px] font-bold uppercase ${currentResult.color}`}>{currentResult.label}</span>
              </div>
            </div>
          </div>

          {/* Modul 3: Fase Kekuatan */}
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="flex items-center gap-2 font-bold text-lg mb-4"><Dumbbell className="w-5 h-5 text-slate-700" /> Fase Kekuatan Utama</h2>
            <div className="space-y-2">
              {['Adaptasi Anatomi', 'MXS', 'Konversi (Power)', 'Maintenance', 'Cessation'].map((phase) => (
                <button
                  key={phase}
                  onClick={() => setCurrentStrengthPhase(phase)}
                  className={`w-full p-3 rounded-2xl border-2 transition-all text-left text-xs font-black uppercase ${
                    currentStrengthPhase === phase ? 'border-red-500 bg-red-50 text-red-600' : 'border-slate-100 bg-slate-50 hover:border-slate-300 text-slate-500'
                  }`}
                >
                  {phase}
                </button>
              ))}
            </div>
          </div>

          {/* Modul 4: 9 Rule S Mental (KINI INTERAKTIF) */}
          <div className="md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="flex items-center gap-2 font-bold text-lg mb-4 text-purple-900"><Brain className="w-5 h-5" /> Asesmen Keterampilan Mental (Skala 1-9)</h2>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {Object.entries(mentalScores).map(([rule, score]) => (
                <div key={rule} className="p-3 bg-purple-50 rounded-2xl border border-purple-100 flex flex-col items-center justify-center relative group">
                  <p className="text-[10px] font-black text-purple-400 uppercase tracking-wider mb-2">{rule}</p>
                  {/* Input Angka Interaktif */}
                  <input 
                    type="number" 
                    min="1" max="9" 
                    value={score}
                    onChange={(e) => {
                      let val = Number(e.target.value);
                      if (val > 9) val = 9; if (val < 1) val = 1;
                      setMentalScores({...mentalScores, [rule]: val});
                    }}
                    className="w-full bg-transparent text-center text-xl font-black text-purple-900 outline-none appearance-none cursor-pointer"
                  />
                  {/* Indikator Peringatan jika mental < 5 */}
                  {score <= 5 && <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white"></div>}
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-4 text-center font-medium">*Klik pada angka untuk mengubah skor evaluasi mental atlet (Standar Elit: &gt; 7).</p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default App;