import React, { useState } from 'react';
import { Utensils, Droplets, Zap, ShieldAlert, Sparkles, Scale } from 'lucide-react';

const NUTRITION_PHASES = {
  TPU: {
    name: 'Fase TPU (Volume Tinggi)',
    desc: 'Fokus glikogen & daya tahan aerobik',
    carbsPerKg: 8.5,
    proteinPerKg: 1.8,
    fatPerKg: 1.0,
    kcalMultiplier: 45
  },
  TPK: {
    name: 'Fase TPK (Intensitas & Kekuatan)',
    desc: 'Pemulihan serat otot & adaptasi anaerobik',
    carbsPerKg: 7.5,
    proteinPerKg: 2.1,
    fatPerKg: 1.1,
    kcalMultiplier: 47
  },
  KOMPETISI: {
    name: 'Fase Kompetisi & Tapering',
    desc: 'Carbo-loading & kesiapan energi maksimal',
    carbsPerKg: 9.0,
    proteinPerKg: 1.8,
    fatPerKg: 0.9,
    kcalMultiplier: 46
  },
  TRANSISI: {
    name: 'Fase Transisi / Regenerasi',
    desc: 'Pemulihan aktif & detoksifikasi sistem',
    carbsPerKg: 5.0,
    proteinPerKg: 1.5,
    fatPerKg: 1.0,
    kcalMultiplier: 35
  }
};

const NutritionPanel = ({ nutritionNote, setNutritionNote, athleteInfo, setAthleteInfo, t }) => {
  const [selectedPhase, setSelectedPhase] = useState('TPU');
  
  const weight = Number(athleteInfo?.weight) || 65;
  const phaseConfig = NUTRITION_PHASES[selectedPhase] || NUTRITION_PHASES.TPU;

  // Kalkulasi Sports Nutrition
  const totalCalories = Math.round(weight * phaseConfig.kcalMultiplier);
  const carbsGram = Math.round(weight * phaseConfig.carbsPerKg);
  const proteinGram = Math.round(weight * phaseConfig.proteinPerKg);
  const fatGram = Math.round(weight * phaseConfig.fatPerKg);
  const waterLiters = (weight * 0.04).toFixed(1); // 40ml per kg

  return (
    <div className="border p-6 rounded-3xl bg-white shadow-sm border-slate-200 flex flex-col flex-1">
      <div className="flex flex-wrap items-center justify-between mb-4 border-b pb-3 gap-2">
        <div>
          <h2 className="font-black uppercase flex items-center gap-2 text-orange-600 tracking-tight text-sm">
            <Utensils className="w-5 h-5"/> Kalkulator Gizi & Makronutrisi Atlet
          </h2>
          <p className="text-[9px] font-bold text-slate-400">
            Rekomendasi asupan energi berbasis Sports Science & Tudor Bompa Periodization
          </p>
        </div>

        {/* INPUT BERAT BADAN ATLET */}
        <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-xl">
          <Scale className="w-4 h-4 text-orange-600" />
          <span className="text-[9px] font-black uppercase text-orange-900">Berat Badan:</span>
          <input 
            type="number"
            value={athleteInfo?.weight || 65}
            onChange={e => {
              if (setAthleteInfo) {
                setAthleteInfo({ ...athleteInfo, weight: Number(e.target.value) });
              }
            }}
            className="w-12 text-center font-black text-xs bg-white border border-orange-200 rounded p-0.5 text-orange-800"
          />
          <span className="text-[9px] font-black uppercase text-orange-900">KG</span>
        </div>
      </div>

      {/* PILIHAN FASE GIZI */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 custom-scrollbar">
        {Object.entries(NUTRITION_PHASES).map(([key, item]) => (
          <button
            key={key}
            type="button"
            onClick={() => setSelectedPhase(key)}
            className={`flex-1 min-w-[110px] p-2 rounded-xl border text-[8px] font-black uppercase transition-all text-left flex flex-col justify-between ${
              selectedPhase === key 
                ? 'bg-orange-600 text-white border-transparent shadow-sm' 
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <span className="font-black">{item.name}</span>
            <span className={`text-[7px] mt-1 ${selectedPhase === key ? 'text-orange-100' : 'text-slate-400'}`}>
              {item.carbsPerKg}g Karbo/kg
            </span>
          </button>
        ))}
      </div>

      {/* METRIC CARDS MAKRONUTRISI */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {/* TOTAL KALORI */}
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-3 rounded-2xl border border-orange-200 text-center">
          <div className="flex items-center justify-center gap-1 text-orange-600 mb-1">
            <Zap className="w-3.5 h-3.5" />
            <span className="text-[8px] font-black uppercase tracking-wider">Energi (TDEE)</span>
          </div>
          <div className="text-base font-black text-slate-800">{totalCalories}</div>
          <span className="text-[7.5px] font-bold text-slate-400 uppercase">kkal / hari</span>
        </div>

        {/* KARBOHIDRAT */}
        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-3 rounded-2xl border border-amber-200 text-center">
          <div className="flex items-center justify-center gap-1 text-amber-700 mb-1">
            <span className="text-xs">🍚</span>
            <span className="text-[8px] font-black uppercase tracking-wider">Karbohidrat</span>
          </div>
          <div className="text-base font-black text-slate-800">{carbsGram}g</div>
          <span className="text-[7.5px] font-bold text-amber-800 uppercase">{phaseConfig.carbsPerKg} g/kg BB</span>
        </div>

        {/* PROTEIN */}
        <div className="bg-gradient-to-br from-red-50 to-rose-50 p-3 rounded-2xl border border-red-200 text-center">
          <div className="flex items-center justify-center gap-1 text-red-600 mb-1">
            <span className="text-xs">🥩</span>
            <span className="text-[8px] font-black uppercase tracking-wider">Protein</span>
          </div>
          <div className="text-base font-black text-slate-800">{proteinGram}g</div>
          <span className="text-[7.5px] font-bold text-red-700 uppercase">{phaseConfig.proteinPerKg} g/kg BB</span>
        </div>

        {/* HIDRASI */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-2xl border border-blue-200 text-center">
          <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
            <Droplets className="w-3.5 h-3.5" />
            <span className="text-[8px] font-black uppercase tracking-wider">Hidrasi</span>
          </div>
          <div className="text-base font-black text-slate-800">{waterLiters}L</div>
          <span className="text-[7.5px] font-bold text-blue-700 uppercase">40 ml/kg BB</span>
        </div>
      </div>

      {/* CATATAN TAMBAHAN / SUPLEMEN */}
      <div className="flex-1 flex flex-col">
        <label className="text-[8px] font-black uppercase text-slate-400 mb-1 tracking-wider">
          Catatan Khusus Medis, Suplemen & Pantangan Atlet:
        </label>
        <textarea 
          value={nutritionNote} 
          onChange={e => setNutritionNote(e.target.value)} 
          className="w-full bg-slate-50 border border-slate-200 p-3 rounded-xl outline-none font-bold text-slate-700 leading-relaxed text-[10px] focus:border-orange-400 flex-1 min-h-[60px]" 
          placeholder="Input menu harian, creatine, bcaa, vitamin, jadwal penimbangan berat badan, dsb..." 
        />
      </div>
    </div>
  );
};

export default NutritionPanel;