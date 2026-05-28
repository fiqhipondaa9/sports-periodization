import React from 'react';
import { BarChart2, Activity } from 'lucide-react';
import { ResponsiveContainer, BarChart, XAxis, YAxis, Bar, Cell } from 'recharts';

const microTypesDesc = {
  'Developmental': 'Peningkatan adaptasi fungsional, keterampilan, & kualitas biomotor.',
  'Shock': 'Kelebihan beban terencana (planned overreaching) untuk efek tertunda.',
  'Regeneration': 'Pemulihan aktif, meredakan ketegangan saraf & membuang laktat.',
  'Peaking / Unloading': 'Pembongkaran beban (Tapering) menuju superkompensasi puncak.'
};

const MicrocyclePanel = ({ 
  microType, 
  setMicroType, 
  dailySessions, 
  setSelectedDay, 
  setShowDailyModal, 
  t 
}) => {
  
  const barData = Object.entries(dailySessions).map(([day, s]) => ({
    day, 
    val: (s.morning?.menu ? 50 : 0) + (s.afternoon?.menu ? 50 : 0)
  }));

  const handleBarClick = (d) => {
    if (d && d.activeLabel) {
      setSelectedDay(d.activeLabel);
      setShowDailyModal(true);
    }
  };

  return (
    <div className="border p-6 rounded-3xl bg-white shadow-sm flex flex-col justify-between border-slate-200">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className={`font-black uppercase flex items-center gap-2 tracking-tighter ${t.textDark}`}>
            <BarChart2 className="w-4 h-4"/> Template Siklus Mikro Aktif
          </h2>
        </div>
        
        <div className="mb-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-black uppercase text-slate-400">Tipe Minggu Latihan:</span>
            <select 
              value={microType} 
              onChange={(e) => setMicroType(e.target.value)} 
              className={`flex-1 bg-transparent text-[11px] font-black outline-none cursor-pointer uppercase ${t.text}`}
            >
              {Object.keys(microTypesDesc).map(k => <option key={k} value={k}>{k}</option>)}
            </select>
          </div>
          <p className="text-[9px] font-bold text-slate-500 italic">{microTypesDesc[microType]}</p>
        </div>
        
        <div className="h-40 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} onClick={handleBarClick}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold' }}/>
              <YAxis hide domain={[0, 100]}/>
              <Bar isAnimationActive={false} dataKey="val" radius={[8, 8, 0, 0]} barSize={40} cursor="pointer">
                {Object.entries(dailySessions).map(([day, s], idx) => {
                  const hasMorning = !!s.morning?.menu;
                  const hasAfternoon = !!s.afternoon?.menu;
                  
                  let fill = '#f1f5f9'; // Kosong
                  if (hasMorning && hasAfternoon) fill = t.hex; // Sesi Penuh
                  else if (hasMorning || hasAfternoon) fill = '#eab308'; // Terisi Sebagian
                  
                  return <Cell key={`cell-${idx}`} fill={fill} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="mt-2 p-3 bg-green-50 rounded-xl border border-green-100 flex items-center gap-2">
        <Activity className="w-5 h-5 text-green-600 flex-shrink-0"/>
        <span className="text-[9px] font-bold text-green-700 leading-tight">
          Klik batang grafik untuk menyusun menu. Grafik ini bertindak sebagai kerangka/template harian bagi pelatih asisten.
        </span>
      </div>
    </div>
  );
};

export default MicrocyclePanel;