import React from 'react';
import { X, Clock, Flame, Zap } from 'lucide-react';

const RPE_DESCRIPTIONS = {
  1: 'Sangat Ringan (Pemulihan Aktif)',
  2: 'Sangat Mudah',
  3: 'Mudah / Ringan (Aerobik Ringan)',
  4: 'Sedang (Percakapan Masih Nyaman)',
  5: 'Agak Berat (Mulai Terengah)',
  6: 'Keras (Latihan Intensitas Submaksimal)',
  7: 'Sangat Keras (Ambang Laktat)',
  8: 'Berat Sekali (VO2Max / Sulit Bicara)',
  9: 'Hampir Maksimal (Extreme Effort)',
  10: 'Maksimal / All-Out (Beban Mutlak)'
};

const DailyModal = ({ 
  showDailyModal, 
  setShowDailyModal, 
  selectedDay, 
  dailySessions, 
  setDailySessions, 
  athleteInfo, 
  t 
}) => {
  if (!showDailyModal) return null;

  const currentDayData = dailySessions[selectedDay] || {
    morning: { menu: '', int: 5, duration: 90, rpe: 5 },
    afternoon: { menu: '', int: 5, duration: 90, rpe: 5 }
  };

  const calculateDayTotalLoad = () => {
    const mDur = currentDayData.morning?.duration ?? 90;
    const mRpe = currentDayData.morning?.rpe ?? (currentDayData.morning?.int || 5);
    const aDur = currentDayData.afternoon?.duration ?? 90;
    const aRpe = currentDayData.afternoon?.rpe ?? (currentDayData.afternoon?.int || 5);
    
    const mLoad = currentDayData.morning?.menu ? mDur * mRpe : 0;
    const aLoad = currentDayData.afternoon?.menu ? aDur * aRpe : 0;
    return mLoad + aLoad;
  };

  const dayTotalLoad = calculateDayTotalLoad();

  return (
    <div className="fixed inset-0 z-[120] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 print:hidden">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        
        {/* HEADER MODAL */}
        <div className="p-4 bg-slate-900 text-white font-black uppercase flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="tracking-wider">Sesi Harian: {selectedDay}</span>
            <span className="bg-blue-600 text-[8px] px-2 py-0.5 rounded-full font-bold">
              Beban Hari Ini: {dayTotalLoad} AU
            </span>
          </div>
          <button 
            type="button"
            onClick={() => setShowDailyModal(false)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-5 h-5"/>
          </button>
        </div>
        
        {/* CONTENT */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {['morning', 'afternoon'].map(session => {
            const isMorning = session === 'morning';
            const sData = currentDayData[session] || { menu: '', int: 5, duration: 90, rpe: 5 };
            const currentIntensitas = sData.int || 5;
            const currentRpe = sData.rpe || currentIntensitas;
            const currentDuration = sData.duration !== undefined ? sData.duration : 90;
            
            const bpTarget = Math.round((currentIntensitas / 10) * (athleteInfo?.benchPress1RM || 100));
            const squatTarget = Math.round((currentIntensitas / 10) * (athleteInfo?.squat1RM || 100));
            const sessionLoad = sData.menu ? (currentDuration * currentRpe) : 0;

            const updateField = (field, val) => {
              setDailySessions({
                ...dailySessions,
                [selectedDay]: {
                  ...currentDayData,
                  [session]: {
                    ...sData,
                    [field]: val
                  }
                }
              });
            };

            return (
              <div key={session} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="font-black text-[11px] text-slate-700 uppercase flex items-center gap-1.5">
                    {isMorning ? '☀️ Sesi Pagi' : '🌙 Sesi Sore'}
                  </label>
                  <div className="flex items-center gap-2">
                    <span className="text-[8.5px] font-black uppercase px-2 py-0.5 bg-blue-100 text-blue-700 rounded-md">
                      Load: {sessionLoad} AU
                    </span>
                  </div>
                </div>

                {/* SLIDER RPE SKALA FOSTER */}
                <div>
                  <div className="flex justify-between items-center text-[8.5px] font-bold text-slate-500 mb-1">
                    <span className="flex items-center gap-1 font-black text-slate-700">
                      <Flame className="w-3 h-3 text-orange-500" /> Skala RPE (1–10):
                    </span>
                    <span className="font-black text-orange-600">
                      {currentRpe}/10 — {RPE_DESCRIPTIONS[currentRpe] || ''}
                    </span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={currentRpe} 
                    onChange={e => {
                      const val = Number(e.target.value);
                      updateField('rpe', val);
                      updateField('int', val);
                    }}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                  />
                </div>

                {/* DURASI SESI (MENIT) */}
                <div className="flex items-center justify-between gap-3 bg-white p-2 rounded-xl border border-slate-200">
                  <span className="text-[8.5px] font-black uppercase text-slate-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-blue-600" /> Durasi Sesi Latihan:
                  </span>
                  <div className="flex items-center gap-1">
                    <input 
                      type="number" 
                      min="15" 
                      max="300" 
                      step="15"
                      value={currentDuration} 
                      onChange={e => updateField('duration', Number(e.target.value))}
                      className="w-14 text-center font-black text-xs border rounded p-1 text-blue-600"
                    />
                    <span className="text-[8.5px] font-bold text-slate-400">menit</span>
                  </div>
                </div>

                {/* TARGET 1RM */}
                <div className="grid grid-cols-2 gap-2 text-[8px] font-black uppercase text-center">
                  <div className="bg-amber-50 text-amber-800 p-1.5 rounded-lg border border-amber-200 truncate">
                    🏋️‍♂️ BP: {bpTarget} kg
                  </div>
                  <div className="bg-amber-100 text-amber-900 p-1.5 rounded-lg border border-amber-300 truncate">
                    🦵 SQ: {squatTarget} kg
                  </div>
                </div>

                {/* MENU TEXTAREA */}
                <textarea 
                  value={sData.menu || ''} 
                  onChange={e => updateField('menu', e.target.value)} 
                  className="w-full border p-2.5 rounded-xl h-16 outline-none text-[10px] font-bold text-slate-700 bg-white focus:ring-1 focus:ring-opacity-50 shadow-sm transition-all" 
                  style={{ '--tw-ring-color': t.hex }} 
                  placeholder="Contoh: Warm-up dinamik, 4 Set x 6 Reps Power Clean, Interval Run..." 
                />
              </div>
            );
          })}
        </div>
        
        {/* FOOTER */}
        <div className="p-4 bg-slate-50 border-t flex justify-center">
          <button 
            type="button"
            onClick={() => setShowDailyModal(false)} 
            className={`text-white px-8 py-2.5 rounded-xl font-black text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg ${t.bg} ${t.hoverBg}`}
          >
            Simpan Menu Sesi Harian
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyModal;