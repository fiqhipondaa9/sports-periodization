import React from 'react';
import { FileSpreadsheet } from 'lucide-react';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

const PeriodizationTable = ({
  activeMonths,
  competitionWeeks,
  tryOutWeeks,
  tryInWeeks,
  materials,
  macroValues,
  trainingFactors,
  matrixData,
  setMatrixData,
  testSchedule,
  setTestSchedule,
  athleteInfo,
  terminology,
  t
}) => {

  const LOCKED_COMPONENTS = ['Endurance', 'Strength', 'Speed', 'Fleksibilitas', 'Teknik Dasar', 'Teknik Lanjutan', 'Mental / Psikologis'];
  const allMaterials = Array.from(new Set([...LOCKED_COMPONENTS, ...materials]));

  // LOGIKA DIAGRAM COOR (WAVE PLANNER MATRIX)
  const getIntensityColor = (val) => {
    if (!val || val <= 0) return 'bg-slate-50';
    if (val >= 80) return 'bg-red-500 text-white font-black';
    if (val >= 60) return 'bg-orange-400 text-white font-black';
    if (val >= 40) return 'bg-yellow-400 text-slate-900 font-black';
    return 'bg-green-400 text-white font-black';
  };

  const getVolumeColor = (val) => {
    if (!val || val <= 0) return 'bg-slate-50';
    if (val >= 80) return 'bg-blue-600 text-white font-black';
    if (val >= 60) return 'bg-blue-400 text-white font-black';
    if (val >= 40) return 'bg-sky-300 text-slate-900 font-black';
    return 'bg-sky-100 text-slate-800 font-bold';
  };

  return (
    <div id="periodization-matrix-root" className="bg-white rounded-3xl p-6 shadow-xl border border-slate-200 overflow-x-auto custom-scrollbar">
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <div>
          <h2 className={`font-black text-lg uppercase flex items-center gap-2 tracking-tighter ${t.textDark}`}>
            <FileSpreadsheet className="w-5 h-5"/> MATRIKS PROGRAM PERIODISASI TAHUNAN
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
            MODEL TRADISIONAL TUDOR BOMPA | MAZHAB: {terminology === 'Eropa' ? 'EROPA (PREPARASI / KOMPETISI)' : 'AMERIKA (MACRO / MESOCYCLE)'}
          </p>
        </div>
      </div>

      <table className="w-full text-left border-collapse border border-slate-300">
        <thead>
          <tr className="bg-slate-900 text-white text-[9px] font-black uppercase tracking-wider">
            <th className="p-3 border border-slate-700 min-w-[160px] shadow-sm sticky left-0 bg-slate-900 z-10">STRUKTUR / PARAMETER</th>
            {activeMonths.map(m => (
              <th key={`th-month-${m}`} colSpan="4" className="p-3 border border-slate-700 text-center uppercase tracking-widest bg-slate-850">
                {m}
              </th>
            ))}
          </tr>
          <tr className="bg-slate-800 text-slate-300 text-[8px] font-black text-center border-b">
            <th className="p-2 border border-slate-700 text-left sticky left-0 bg-slate-800 z-10 uppercase">Siklus / Minggu Mikro</th>
            {activeMonths.map(m => [1,2,3,4].map(w => (
              <th key={`th-week-${m}-W${w}`} className="p-2 border border-slate-700 font-bold min-w-[40px]">
                W{w}
              </th>
            )))}
          </tr>
        </thead>
        <tbody className="text-[9px] font-bold text-slate-700">
          
          {/* BARIS TANGGAPAN MEDIS: PEAKING TARGET */}
          <tr className="bg-red-50/40 text-center">
            <td className="p-2 border border-slate-200 text-left font-black text-red-700 uppercase sticky left-0 bg-red-50 z-10">🎯 KELAYAKAN PEAKING</td>
            {activeMonths.map(m => [1,2,3,4].map(w => {
              const key = `${m}-W${w}`;
              const isComp = competitionWeeks.includes(key);
              return (
                <td key={`td-peak-${key}`} className={`p-2 border border-slate-200 transition-all ${isComp ? 'bg-red-600 text-white font-black animate-pulse shadow-inner' : ''}`}>
                  {isComp ? 'PEAK' : '-'}
                </td>
              );
            }))}
          </tr>

          {/* BARIS JADWAL LAGA UJI COBA (TRY OUT / TRY IN) */}
          <tr className="bg-slate-50 text-center">
            <td className="p-2 border border-slate-200 text-left font-black text-slate-600 uppercase sticky left-0 bg-slate-50 z-10">✈️ / 🏠 JADWAL LAGA</td>
            {activeMonths.map(m => [1,2,3,4].map(w => {
              const key = `${m}-W${w}`;
              const isTO = !!tryOutWeeks[key];
              const isTI = !!tryInWeeks[key];
              
              let bgClass = '';
              let label = '-';
              if (isTO) { bgClass = 'bg-purple-600 text-white font-black'; label = 'TO'; }
              else if (isTI) { bgClass = 'bg-orange-500 text-white font-black'; label = 'TI'; }

              return (
                <td key={`td-laga-${key}`} className={`p-2 border border-slate-200 transition-all ${bgClass}`}>
                  {label}
                </td>
              );
            }))}
          </tr>

          {/* BARIS DINAMIKA BEBAN: VOLUME BULANAN */}
          <tr className="text-center">
            <td className="p-2 border border-slate-200 text-left font-black text-blue-700 uppercase sticky left-0 bg-white z-10">📉 VOLUME MAKRO (%)</td>
            {activeMonths.map(m => {
              const val = macroValues[m]?.vol || 0;
              const bg = getVolumeColor(val);
              return [1,2,3,4].map(w => (
                <td key={`td-vol-${m}-W${w}`} className={`p-2 border border-slate-200 ${bg}`}>
                  {val}%
                </td>
              ));
            })}
          </tr>

          {/* BARIS DINAMIKA BEBAN: INTENSITAS BULANAN */}
          <tr className="text-center">
            <td className="p-2 border border-slate-200 text-left font-black text-red-700 uppercase sticky left-0 bg-white z-10">📈 INTENSITAS MAKRO (%)</td>
            {activeMonths.map(m => {
              const val = macroValues[m]?.int || 0;
              const bg = getIntensityColor(val);
              return [1,2,3,4].map(w => (
                <td key={`td-int-${m}-W${w}`} className={`p-2 border border-slate-200 ${bg}`}>
                  {val}%
                </td>
              ));
            })}
          </tr>

          {/* BARIS PROPORSI FAKTOR FOKUS LATIHAN */}
          {['fisik', 'teknik', 'taktik', 'psikis'].map(factor => (
            <tr key={`tr-factor-${factor}`} className="text-center bg-slate-50/30">
              <td className="p-2 border border-slate-200 text-left font-black uppercase sticky left-0 bg-white z-10 text-slate-500 pl-4">
                • Proporsi {factor} (%)
              </td>
              {activeMonths.map(m => {
                const val = trainingFactors[m]?.[factor] || 0;
                return [1,2,3,4].map(w => (
                  <td key={`td-factor-${factor}-${m}-W${w}`} className="p-2 border border-slate-200 text-slate-600 font-bold">
                    {val}%
                  </td>
                ));
              })}
            </tr>
          ))}

          {/* RENDERING DINAMIS DAFTAR KOMPONEN MATERI LATIHAN */}
          <tr className="bg-slate-100"><td colSpan={1 + activeMonths.length * 4} className="p-1.5 border border-slate-300 font-black text-[8px] text-slate-500 uppercase tracking-widest">Pembagian Sub-Materi Biomaterial & Cabor</td></tr>
          
          {allMaterials.map(mName => (
            <tr key={`tr-material-${mName}`} className="hover:bg-slate-50">
              <td className="p-2 border border-slate-200 text-left font-black uppercase text-slate-800 shadow-sm sticky left-0 bg-white z-10 truncate max-w-[160px]">
                {mName}
              </td>
              {activeMonths.map(m => [1,2,3,4].map(w => {
                const key = `${m}-W${w}-${mName}`;
                const isChecked = !!matrixData[key];
                return (
                  <td 
                    key={`td-matrix-${key}`} 
                    onClick={() => setMatrixData(prev => ({ ...prev, [key]: !prev[key] }))} 
                    className={`p-2 border border-slate-200 text-center cursor-pointer transition-all select-none ${isChecked ? `${t.bg} text-white font-black shadow-sm` : 'hover:bg-slate-100 text-slate-300 font-normal'}`}
                  >
                    {isChecked ? '✓' : '-'}
                  </td>
                );
              }))}
            </tr>
          ))}
          {/* BARIS TES & EVALUASI */}
          <tr className="bg-slate-100"><td colSpan={1 + activeMonths.length * 4} className="p-1.5 border border-slate-300 font-black text-[8px] text-slate-500 uppercase tracking-widest">Jadwal Tes & Evaluasi (Klik untuk ceklis)</td></tr>
          {['Tes Kesehatan', 'Tes Fisik', 'Tes Teknik', 'Tes Psikis'].map(testName => (
            <tr key={`tr-test-${testName}`} className="hover:bg-slate-50">
              <td className="p-2 border border-slate-200 text-left font-black uppercase text-slate-800 shadow-sm sticky left-0 bg-white z-10 truncate max-w-[160px]">
                {testName === 'Tes Kesehatan' && '🩺'} {testName === 'Tes Fisik' && '🏃'} {testName === 'Tes Teknik' && '🎯'} {testName === 'Tes Psikis' && '🧠'} {testName}
              </td>
              {activeMonths.map(m => [1,2,3,4].map(w => {
                const key = `${m}-W${w}-${testName}`;
                const isChecked = !!(testSchedule && testSchedule[key]);
                return (
                  <td
                    key={`td-test-${key}`}
                    onClick={() => setTestSchedule(prev => ({ ...prev, [key]: !prev[key] }))}
                    className={`p-2 border border-slate-200 text-center cursor-pointer transition-all select-none ${isChecked ? 'bg-amber-500 text-white font-black shadow-sm' : 'hover:bg-slate-100 text-slate-300 font-normal'}`}
                  >
                    {isChecked ? '✓' : '-'}
                  </td>
                );
              }))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PeriodizationTable;