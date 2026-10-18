import React from 'react';
import { BarChart2, Activity, Flame, ShieldAlert, CheckCircle, Info } from 'lucide-react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, Cell, Tooltip } from 'recharts';

const microTypesDesc = {
  'Developmental': 'Peningkatan adaptasi fungsional, keterampilan teknik, & kualitas biomotor dasar.',
  'Shock': 'Kelebihan beban terencana (planned overreaching) untuk memicu superkompensasi tertunda.',
  'Regeneration': 'Pemulihan aktif (deloading), meredakan ketegangan saraf & mempercepat pembuangan laktat.',
  'Peaking / Unloading': 'Pembongkaran beban intensitas (Tapering) menuju kesiapan kompetisi puncak.'
};

const MicrocyclePanel = ({ 
  microType, 
  setMicroType, 
  dailySessions, 
  setSelectedDay, 
  setShowDailyModal, 
  t 
}) => {
  
  // Hitung Beban Latihan Harian (Foster Method: Durasi x RPE)
  const barData = Object.entries(dailySessions).map(([day, s]) => {
    const mDur = s.morning?.duration ?? 90;
    const mRpe = s.morning?.rpe ?? (s.morning?.int || 5);
    const aDur = s.afternoon?.duration ?? 90;
    const aRpe = s.afternoon?.rpe ?? (s.afternoon?.int || 5);

    const mLoad = s.morning?.menu ? (mDur * mRpe) : 0;
    const aLoad = s.afternoon?.menu ? (aDur * aRpe) : 0;
    const totalDayLoad = mLoad + aLoad;

    return {
      day, 
      val: totalDayLoad,
      hasMorning: !!s.morning?.menu,
      hasAfternoon: !!s.afternoon?.menu
    };
  });

  const weeklyTotalLoad = barData.reduce((acc, curr) => acc + curr.val, 0);

  // Status Kelelahan & Beban Mingguan (Sports Science Foster Guidelines)
  const getWorkloadStatus = (totalLoad) => {
    if (totalLoad > 5500) {
      return {
        label: 'BEBAN SANGAT TINGGI (RISIKO KELELAHAN)',
        color: 'text-rose-700 bg-rose-50 border-rose-200',
        desc: 'Perhatikan pemulihan aktif dan asupan gizi atlet guna mencegah overtraining.'
      };
    }
    if (totalLoad >= 2500) {
      return {
        label: 'BEBAN LATIHAN OPTIMAL',
        color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        desc: 'Stimulus adaptasi fisiologis berjalan efektif dan terukur.'
      };
    }
    return {
      label: 'BEBAN RINGAN / TAPER & REGENERASI',
      color: 'text-blue-700 bg-blue-50 border-blue-200',
      desc: 'Ideal untuk fase tapering menjelang laga atau minggu deloading.'
    };
  };

  const workloadStatus = getWorkloadStatus(weeklyTotalLoad);

  const handleBarClick = (d) => {
    if (d && d.activeLabel) {
      setSelectedDay(d.activeLabel);
      setShowDailyModal(true);
    }
  };

  return (
    <div className="border p-6 rounded-3xl bg-white shadow-sm flex flex-col justify-between border-slate-200">
      <div>
        <div className="flex flex-wrap justify-between items-center mb-3 border-b pb-3 gap-2">
          <div>
            <h2 className={`font-black uppercase flex items-center gap-2 tracking-tight text-sm ${t.textDark}`}>
              <BarChart2 className="w-5 h-5"/> Monitoring Beban Harian (RPE Foster Load)
            </h2>
            <p className="text-[9px] font-bold text-slate-400">
              Perhitungan beban latihan objektif: Durasi Sesi (menit) × Skala RPE (1–10)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[9px] font-black uppercase text-slate-500">Total Beban:</span>
            <span className="px-2.5 py-1 rounded-xl bg-slate-900 text-white font-black text-xs shadow-sm">
              {weeklyTotalLoad} AU
            </span>
          </div>
        </div>
        
        {/* PILIHAN TIPE MIKRO */}
        <div className="mb-4 bg-slate-50 p-3 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-black uppercase text-slate-500">Tipe Minggu Mikro:</span>
            <select 
              value={microType} 
              onChange={(e) => setMicroType(e.target.value)} 
              className={`flex-1 bg-white border border-slate-200 rounded-lg p-1 text-[10px] font-black outline-none cursor-pointer uppercase ${t.text}`}
            >
              {Object.keys(microTypesDesc).map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <p className="text-[8.5px] font-bold text-slate-500 italic mt-0.5">{microTypesDesc[microType]}</p>
        </div>

        {/* GRAFIK BATANG BEBAN HARIAN (AU) */}
        <div className="h-44 mb-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} onClick={handleBarClick}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }}/>
              <YAxis tick={{ fontSize: 8, fill: '#94a3b8' }} width={30} tickFormatter={v => `${v}`} />
              <Tooltip 
                contentStyle={{ fontSize: '10px', fontWeight: 'bold', borderRadius: '12px', border: '1px solid #e2e8f0' }}
                formatter={(val) => [`${val} AU (Beban Harian)`, 'Workload']}
              />
              <Bar isAnimationActive={false} dataKey="val" radius={[8, 8, 0, 0]} barSize={36} cursor="pointer">
                {barData.map((entry, idx) => {
                  let fill = '#e2e8f0'; // Kosong
                  if (entry.val > 800) fill = '#ef4444'; // Beban sangat tinggi
                  else if (entry.val > 450) fill = t.hex; // Beban sedang/optimal
                  else if (entry.val > 0) fill = '#38bdf8'; // Beban ringan
                  
                  return <Cell key={`cell-${idx}`} fill={fill} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* INDIKATOR KELELAHAN DAN MONITORING RISIKO */}
      <div className={`p-3 rounded-2xl border flex items-center justify-between gap-3 ${workloadStatus.color}`}>
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 flex-shrink-0" />
          <div>
            <span className="font-black text-[9px] uppercase tracking-wide block">
              {workloadStatus.label}
            </span>
            <span className="text-[8px] font-bold opacity-90 block">
              {workloadStatus.desc}
            </span>
          </div>
        </div>
        <button 
          type="button"
          onClick={() => {
            setSelectedDay('Sen');
            setShowDailyModal(true);
          }}
          className="px-3 py-1.5 bg-white border border-current rounded-xl text-[8px] font-black uppercase whitespace-nowrap shadow-sm hover:scale-105 transition-transform"
        >
          ✏️ Edit Menu
        </button>
      </div>
    </div>
  );
};

export default MicrocyclePanel;