import React from 'react';
import { X } from 'lucide-react';

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

  return (
    <div className="fixed inset-0 z-[120] bg-slate-900/60 flex items-center justify-center p-4 print:hidden">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden border animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 bg-slate-900 text-white font-black uppercase flex justify-between items-center">
          <span className="tracking-wider">SESI HARIAN: {selectedDay}</span>
          <X className="cursor-pointer hover:scale-110 transition-transform w-5 h-5 text-slate-400 hover:text-white" onClick={() => setShowDailyModal(false)}/>
        </div>
        
        <div className="p-6 space-y-5">
          {['morning', 'afternoon'].map(session => {
            const currentIntensitas = dailySessions[selectedDay]?.[session]?.int || 5;
            const bpTarget = Math.round((currentIntensitas / 10) * (athleteInfo.benchPress1RM || 100));
            const squatTarget = Math.round((currentIntensitas / 10) * (athleteInfo.squat1RM || 100));

            return (
              <div key={session} className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-2">
                <div className="flex justify-between items-center">
                  <label className="font-black text-[10px] text-slate-500 uppercase tracking-wide">
                    {session === 'morning' ? '☀️ Sesi Pagi' : '🌙 Sesi Sore'}
                  </label>
                  <div className="flex items-center gap-1.5 bg-white px-2 py-0.5 rounded-lg border shadow-sm text-[9px] font-black">
                    <span className="text-red-500">Intensitas: {currentIntensitas}/10</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-inner">
                  <input 
                    type="range" 
                    min="1" 
                    max="10" 
                    value={currentIntensitas} 
                    onChange={e => setDailySessions({
                      ...dailySessions, 
                      [selectedDay]: {
                        ...dailySessions[selectedDay], 
                        [session]: { ...dailySessions[selectedDay][session], int: Number(e.target.value) }
                      }
                    })}
                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-current text-blue-600"
                    style={{ color: t.hex }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-1.5 text-[8px] font-black uppercase text-center">
                  <div className="bg-amber-50 text-amber-700 p-1 rounded-md border border-amber-100 truncate">
                    🏋️‍♂️ BP: {bpTarget} kg
                  </div>
                  <div className="bg-amber-100 text-amber-900 p-1 rounded-md border border-amber-200 truncate">
                    🦵 SQ: {squatTarget} kg
                  </div>
                </div>

                <textarea 
                  value={dailySessions[selectedDay]?.[session]?.menu || ''} 
                  onChange={e => setDailySessions({
                    ...dailySessions, 
                    [selectedDay]: {
                      ...dailySessions[selectedDay], 
                      [session]: { ...dailySessions[selectedDay][session], menu: e.target.value }
                    }
                  })} 
                  className="w-full border p-2.5 rounded-xl h-16 outline-none text-[10px] font-bold text-slate-700 bg-white focus:ring-1 focus:ring-opacity-50 shadow-sm transition-all" 
                  style={{ '--tw-ring-color': t.hex }} 
                  placeholder="Contoh: 4 Set x 8 Reps Squat..." 
                />
              </div>
            );
          })}
        </div>
        
        <div className="p-4 bg-slate-50 border-t flex justify-center">
          <button onClick={() => setShowDailyModal(false)} className={`text-white px-10 py-2.5 rounded-xl font-black text-xs tracking-widest uppercase transition-all shadow-md hover:shadow-lg ${t.bg} ${t.hoverBg}`}>
            SIMPAN MENU LATIHAN
          </button>
        </div>
      </div>
    </div>
  );
};

export default DailyModal;