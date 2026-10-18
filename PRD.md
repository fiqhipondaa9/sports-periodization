# 📋 PRODUCT REQUIREMENTS DOCUMENT (PRD)
## Annual Training Plan System — Sports Periodization Software
**Sistem Digital Perencanaan Program Periodisasi Tahunan Berbasis Sports Science (Tudor O. Bompa)**

---

| Dokumen | Keterangan |
| :--- | :--- |
| **Versi PRD** | 1.0.0 |
| **Status** | Active / Baseline & Enhancement Blueprint |
| **Penyusun / Lead** | fiqhipondaa9 |
| **Target Pengguna** | Pelatih Olahraga, Praktisi Sports Science, Mahasiswa Ilmu Keolahragaan, Tim Pelatda / Pelatnas |
| **Tech Stack** | React 18, Vite, Tailwind CSS 4, Recharts, SheetJS (XLSX), Lucide Icons, html-to-image |

---

## 1. 🎯 Ringkasan Eksekutif & Visi Produk

### 1.1 Visi
Menyediakan perangkat lunak perencanaan latihan tahunan (*Annual Training Plan*) yang presisi, mudah digunakan, dan sesuai standar metodologi **Tudor O. Bompa** bagi ekosistem olahraga prestasi di Indonesia, menjembatani kesenjangan antara teori *sports science* dengan praktik lapangan pelatih.

### 1.2 Masalah yang Diselesaikan (*Problem Statement*)
1. **Manual & Rentan Error:** Banyak pelatih masih menyusun periodisasi menggunakan spreadsheet Excel statis tanpa validasi logika beban atau kalkulasi 1RM.
2. **Ketiadaan Visualisasi Dinamis:** Hubungan antara Volume, Intensitas, dan *Peaking Index* sering kali tidak sinkron dengan kalender pertandingan riil.
3. **Penyusunan Rumit:** Pelatih kesulitan menghitung mundur (*backward planning*) dari tanggal kejuaraan utama ke fase persiapan umum.
4. **Isolasi Aspek Penunjang:** Program latihan fisik sering terpisah dari pemantauan gizi, profil psikologis, dan jadwal evaluasi berkala.

---

## 2. 👥 Profil Pengguna (*Target Personas*)

1. **Pelatih Kepala / Head Coach:**
   - Membutuhkan gambaran makro tahunan (*big picture*), jadwal kompetisi, serta kemudahan presentasi ke pengurus cabor (*Projector Mode*).
2. **Pelatih Fisik (Strength & Conditioning Coach):**
   - Membutuhkan rincian biomotorik, penyesuaian beban (% volume/intensitas), kalkulasi 1RM otomatis (*Bench Press/Squat*), dan mikro harian.
3. **Staf Medis, Gizi & Psikolog Olahraga:**
   - Membutuhkan input pemantauan status mental atlet (6 pilar) dan panduan nutrisi/suplemen yang sinkron dengan intensitas latihan.
4. **Pengurus Cabor / Stakeholder (KONI/Dispora):**
   - Membutuhkan dokumen cetak rapi (PDF/Excel) untuk transparansi rencana anggaran dan target capaian medali.

---

## 3. 📚 Landasan Metodologi Ilmu Kepelatihan (Tudor Bompa)

Sistem wajib mengakomodasi terminologi dan prinsip dasar periodisasi Bompa:
- **Tiga Periode Utama:**
  1. **Periode Persiapan (*Preparatory*):** Tahap Persiapan Umum (TPU) dan Tahap Persiapan Khusus (TPK).
  2. **Periode Pertandingan (*Competitive*):** Pra-Kompetisi dan Kompetisi Utama (*Peaking/Tapering*).
  3. **Periode Transisi (*Transition*):** Pemulihan aktif (*Active Rest*).
- **Dual Terminologi:**
  - **Mazhab Eropa / Bompa:** Preparasi Umum, Preparasi Khusus, Pra-Kompetisi, Kompetisi Utama, Transisi.
  - **Mazhab Amerika:** Makrosiklus, Mesosiklus, Mikrosiklus.
- **Hukum Dinamika Beban:**
  - Volume tinggi di awal persiapan, menurun menjelang kompetisi.
  - Intensitas rendah di awal, meningkat tajam menuju fase pertandingan.
  - Peaking Index bernilai maksimal (P4–P5) saat kompetisi utama berlangsung.

---

## 4. 🔍 Analisis Kondisi Saat Ini (*AS-IS System Architecture*)

Aplikasi saat ini sudah memiliki modul fungsional inti:

| Modul | Komponen React | Status Saat Ini |
| :--- | :--- | :--- |
| **Identitas & Waktu** | `ControlPanel.jsx` (Step 1) | Input nama atlet, cabor, target, durasi mingguan, 1RM, tahun & bulan mulai-selesai. |
| **Pembagian Fase** | `ControlPanel.jsx` (Step 2) | Slider persentase fase persiapan vs khusus via *Backward Planning*. |
| **Peaking & Uji Coba** | `ControlPanel.jsx` (Step 3) | Seleksi minggu kompetisi utama (Merah), Try Out (Ungu), dan Try In (Oranye). |
| **Komponen Latihan** | `ControlPanel.jsx` (Step 4) | 7 komponen bawaan Bompa terkunci + fitur tambah materi cabor bebas. |
| **Beban & Peaking** | `ControlPanel.jsx` (Step 5) | Input bulanan Volume %, Intensitas %, Peak Index (1-5), hitung menit/minggu & kg 1RM. |
| **Faktor Latihan** | `ControlPanel.jsx` (Step 6) | Input proporsi bulanan: Fisik, Teknik, Taktik, Psikis. |
| **Matriks Visual** | `PeriodizationTable.jsx` | Matriks checkbox minggu mikro per komponen, baris laga, dan jadwal tes. |
| **Grafik Beban** | `App.jsx` (`Recharts`) | Composed chart (Area Volume, Line Intensitas, Bar Peak Index, garis referensi Peak). |
| **Biomotorik** | `BiomotorPanel.jsx` | Panduan kekuatan, ketahanan, dan kecepatan sesuai fase. |
| **Asesmen Psikis** | `PsychologicalPanel.jsx` | Slider 6 parameter mental atlet (1-10) dengan visualisasi radar/bar. |
| **Mikro Harian** | `MicrocyclePanel.jsx` & `DailyModal.jsx` | Sesi pagi & sore Senin–Minggu + kalkulasi intensitas 1RM. |
| **Evaluasi & Gizi** | `EvaluationPanel.jsx` & `NutritionPanel.jsx` | Evaluasi 1 tes fisik (waktu/skor) dan 1 textarea bebas catatan nutrisi. |
| **Utilitas** | `App.jsx` | Save/Load JSON lokal, Ekspor Excel (SheetJS), Ekspor PNG, 9 Tema Warna, Mode Proyektor. |

---

## 5. ⚠️ Identifikasi Kesenjangan & Bagian Kurang Relevan (*Gap Analysis*)

Berdasarkan tinjauan kebutuhan modernisasi aplikasi, ditemukan sejumlah keterbatasan pada sistem yang ada:

### 5.1 Keterbatasan Struktur Kalender & Minggu
- **Masalah:** Sistem saat ini mematok **selalu 4 minggu per bulan (W1–W4)**. 
- **Dampak Lapangan:** Pada kalender nyata, ada bulan dengan 5 minggu (atau 52 minggu per tahun kalender riil, bukan 48 minggu). Pelatih tidak bisa menyesuaikan dengan tanggal pasti kejuaraan (misal: 14–20 Oktober).

### 5.2 Beban Bersifat Rata Per Bulan (*Flat Loading*)
- **Masalah:** Volume dan intensitas diinput per bulan dan nilainya flat sama di W1, W2, W3, W4 pada bulan tersebut.
- **Dampak Lapangan:** Teori periodisasi modern mewajibkan variasi mingguan (*Undulating / Step Loading*, contoh pola 3:1: minggu 1 sedang, minggu 2 tinggi, minggu 3 sangat tinggi, minggu 4 pemulihan/deloading).

### 5.3 Modul Evaluasi Fisik Terlalu Sederhana
- **Masalah:** Hanya mampu menampung 1 tes fisik tunggal dengan 1 target.
- **Dampak Lapangan:** Evaluasi atlet membutuhkan baterai tes lengkap (*multitest battery*: Bleep Test/VO2Max, Sprint 20m, Agility T-Test, Vertical Jump, Push-up, Sit-up, dsb.) dengan skor per tes.

### 5.4 Modul Gizi Masih Berupa Textarea Bebas
- **Masalah:** `NutritionPanel.jsx` hanya sebuah kotak teks biasa tanpa struktur.
- **Dampak Lapangan:** Tidak ada panduan makronutrisi (karbohidrat, protein, lemak dalam gram/kg berat badan), kebutuhan kalori harian, atau target berat badan/lemak tubuh atlet sesuai fase latihan.

### 5.5 Manajemen Penyimpanan & Multi-Atlet
- **Masalah:** State hanya ada di memori browser dan file JSON manual; jika browser di-refresh tanpa sengaja sebelum disimpan, data berisiko hilang.
- **Dampak Lapangan:** Belum ada penyimpanan otomatis (*auto-save* ke `localStorage` atau profil tersimpan untuk banyak atlet sekaligus).

---

## 6. 🚀 Rencana Penyempurnaan (*Target System / TO-BE Roadmap*)

### Fase 1: Penyempurnaan Kalender & Undulasi Beban (High Priority) — ✅ SELESAI
- [x] **Dukungan Kalender Nyata / Minggu Fleksibel:** Input tanggal mulai latihan riil dengan rentang tanggal kalender otomatis di header matriks mingguan (W1, W2, W3, W4).
- [x] **Microcycle Wave Generator (Pola 3:1 & 2:1 Tudor Bompa):** Generator pola undulasi beban mingguan (Step Loading & Deloading) dengan toggle grafik interaktif mingguan vs bulanan.
- [x] **Auto-save `localStorage`:** Penyimpanan otomatis saat mengedit data dengan indikator status real-time dan opsi Reset Program.

### Fase 2: Penguatan Modul Sports Science (Medium Priority)
- [ ] **Baterai Tes Fisik (*Multitest Battery*):** Pelatih dapat menambah beberapa jenis tes fisik sekaligus (Daya Tahan, Kecepatan, Kelincahan, Daya Ledak) dengan grade otomatis per cabor.
- [ ] **Kalkulator Makronutrisi & Gizi Terstruktur:** Formula perhitungan BMR/TDEE sederhana berdasarkan fase (fase volume tinggi = karbohidrat tinggi, fase kompetisi = pemeliharaan masa otot).
- [ ] **Korelasikan Skor Psikologi dengan Riwayat Latihan:** Grafik radar psikologis yang dapat disimpan per fase (awal TPU vs menjelang kompetisi).

### Fase 3: Kolaborasi & Ekspor Lanjutan (Future Enhancement)
- [ ] **Penyempurnaan Ekspor PDF:** Format cetak langsung berorientasi *Landscape* standar pelatnas yang memuat seluruh tabel tanpa terpotong.
- [ ] **Manajemen Multi-Atlet / Skuad:** Kemampuan berganti profil atlet dalam satu akun tanpa harus menimpa data atlet lain.
- [ ] **Integrasi Monitoring RPE (Rate of Perceived Exertion) & Kelelahan Atlet.**

---

## 7. 🗄️ Model Data Aplikasi (*Data Schema Specifications*)

```typescript
// Model Utama State Periodisasi
interface AnnualTrainingPlan {
  meta: {
    version: string;
    lastUpdated: string;
  };
  athleteInfo: {
    cabor: string;
    name: string;
    age: string;
    prov: string;
    coach: string;
    target: string;
    maxDuration: number;     // menit/minggu
    benchPress1RM: number;   // kg
    squat1RM: number;        // kg
  };
  timeline: {
    startYear: number;
    startMonth: number;      // 0 - 11
    endMonth: number;        // 0 - 11
    activeMonths: string[];
    competitionWeeks: string[]; // e.g. ["Okt-W4"]
    tryOutWeeks: Record<string, boolean>; // e.g. {"Agt-W2": true}
    tryInWeeks: Record<string, boolean>;
  };
  macroPlanning: {
    phaseProps: { prep: number; comp: number; transWeeks: number };
    macroValues: Record<string, { vol: number; int: number; peak: number }>;
    trainingFactors: Record<string, { fisik: number; teknik: number; taktik: number; psikis: number }>;
  };
  matrixData: Record<string, boolean>; // e.g. {"Okt-W1-Speed": true}
  testSchedule: Record<string, string>; // e.g. {"Mei-W4": "Fisik"}
  nutrition: {
    notes: string;
    targetCalories?: number;
    targetProtein?: number;
  };
  psychologicalData: Array<{
    id: string;
    label: string;
    score: number; // 1 - 10
  }>;
  evaluations: Array<{
    id: string;
    name: string;
    score: number;
    target: number;
    unit: string;
    isTime: boolean;
  }>;
}
```

---

## 8. 🛡️ Kriteria Kualitas & Non-Fungsional (*NFR*)

1. **Responsif & Kompatibel:** Tampilan tabel dapat di-scroll horizontal dengan kolom parameter tetap terkunci (*sticky column*).
2. **Kinerja Ekspor:** Pembuatan file Excel (.xlsx) dan render gambar (PNG) harus selesai dalam waktu kurang dari 3 detik.
3. **Integritas Metodologi:** Tidak boleh ada persentase faktor latihan bulanan atau pembagian fase yang menghasilkan nilai tak hingga (*NaN/Infinite*).
4. **Offline Capability:** Aplikasi dapat dijalankan penuh secara luring (*offline*) di laptop pelatih tanpa ketergantungan koneksi internet.

---

## 9. 📌 Kesimpulan & Langkah Eksekusi

Dokumen PRD ini menjadi acuan tunggal (*single source of truth*) dalam memetakan fungsi yang sudah ada serta memandu agenda refaktor dan modernisasi aplikasi ke depan. Dengan berpegang pada PRD ini, setiap pembaruan fitur akan tetap konsisten dengan prinsip ilmu kepelatihan Tudor Bompa dan kebutuhan pelatih di lapangan.
