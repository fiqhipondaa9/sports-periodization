import React, { useState } from 'react';

// Daftar semua bulan dalam setahun
const SEMUA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function App() {
  // 1. State untuk mengatur rentang waktu program
  const [bulanMulai, setBulanMulai] = useState('Januari');
  const [bulanSelesai, setBulanSelesai] = useState('Desember');

  // 2. Fungsi untuk menghasilkan array bulan berdasarkan pilihan
  const dapatkanRentangBulan = () => {
    const indeksMulai = SEMUA_BULAN.indexOf(bulanMulai);
    const indeksSelesai = SEMUA_BULAN.indexOf(bulanSelesai);

    // Jika bulan selesai lebih kecil dari bulan mulai (misal lintas tahun), 
    // untuk MVP ini kita batasi agar urutannya dalam 1 tahun yang sama.
    if (indeksSelesai < indeksMulai) {
      return [SEMUA_BULAN[indeksMulai]]; 
    }
    return SEMUA_BULAN.slice(indeksMulai, indeksSelesai + 1);
  };

  const bulanAktif = dapatkanRentangBulan();

  // Daftar kategori baris berdasarkan gambar (bisa ditambah nanti)
  const kategoriBaris = [
    { id: 'fase', label: 'Phase (Fase)' },
    { id: 'sub_fase', label: 'Sub Phase' },
    { id: 'strength', label: 'Strength' },
    { id: 'endurance', label: 'Endurance' },
    { id: 'volume', label: 'Volume (%)' },
    { id: 'intensitas', label: 'Intensitas (%)' },
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', minWidth: '1000px' }}>
      <h1 style={{ color: '#1e3a8a' }}>Annual Plan Periodization Builder</h1>
      <p style={{ color: '#555' }}>Sesuaikan durasi program untuk melihat perubahan pada tabel.</p>

      {/* --- KONTROL RENTANG WAKTU --- */}
      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f3f4f6', borderRadius: '8px', display: 'flex', gap: '20px' }}>
        <div>
          <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Bulan Mulai:</label>
          <select value={bulanMulai} onChange={(e) => setBulanMulai(e.target.value)} style={{ padding: '5px' }}>
            {SEMUA_BULAN.map(bulan => <option key={`mulai-${bulan}`} value={bulan}>{bulan}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 'bold', marginRight: '10px' }}>Bulan Selesai:</label>
          <select value={bulanSelesai} onChange={(e) => setBulanSelesai(e.target.value)} style={{ padding: '5px' }}>
            {SEMUA_BULAN.map(bulan => <option key={`selesai-${bulan}`} value={bulan}>{bulan}</option>)}
          </select>
        </div>
      </div>

      {/* --- TABEL MATRIKS DINAMIS --- */}
      <div style={{ overflowX: 'auto', border: '1px solid #ccc' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '12px' }}>
          
          {/* HEADER 1: Nama Bulan (Makrosiklus) */}
          <thead>
            <tr>
              <th style={{ border: '1px solid #999', padding: '10px', backgroundColor: '#e5e7eb', width: '150px' }}>
                MAKRO
              </th>
              {bulanAktif.map(bulan => (
                // colSpan=4 karena asumsi kita menggunakan 4 minggu per bulan (Mesosiklus)
                <th key={bulan} colSpan={4} style={{ border: '1px solid #999', padding: '5px', backgroundColor: '#dbeafe', color: '#1e40af' }}>
                  {bulan.toUpperCase()}
                </th>
              ))}
            </tr>

            {/* HEADER 2: Minggu (Mesosiklus 1-4) */}
            <tr>
              <th style={{ border: '1px solid #999', padding: '10px', backgroundColor: '#e5e7eb' }}>
                MESSO (Minggu)
              </th>
              {bulanAktif.map(bulan => (
                <React.Fragment key={`minggu-${bulan}`}>
                  <th style={{ border: '1px solid #999', padding: '2px', backgroundColor: '#f9fafb' }}>1</th>
                  <th style={{ border: '1px solid #999', padding: '2px', backgroundColor: '#f9fafb' }}>2</th>
                  <th style={{ border: '1px solid #999', padding: '2px', backgroundColor: '#f9fafb' }}>3</th>
                  <th style={{ border: '1px solid #999', padding: '2px', backgroundColor: '#f9fafb' }}>4</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>

          {/* BADAN TABEL: Kategori dan Input */}
          <tbody>
            {kategoriBaris.map((baris) => (
              <tr key={baris.id}>
                <td style={{ border: '1px solid #999', padding: '8px', fontWeight: 'bold', backgroundColor: '#f3f4f6', textAlign: 'left' }}>
                  {baris.label}
                </td>
                
                {/* Looping sel input untuk setiap minggu dalam bulan yang aktif */}
                {bulanAktif.map(bulan => (
                  <React.Fragment key={`cell-${baris.id}-${bulan}`}>
                    <td style={{ border: '1px solid #eee', padding: '0' }}>
                      <input type="text" style={{ width: '100%', border: 'none', textAlign: 'center', padding: '8px 0', outline: 'none' }} placeholder="-" />
                    </td>
                    <td style={{ border: '1px solid #eee', padding: '0' }}>
                      <input type="text" style={{ width: '100%', border: 'none', textAlign: 'center', padding: '8px 0', outline: 'none' }} placeholder="-" />
                    </td>
                    <td style={{ border: '1px solid #eee', padding: '0' }}>
                      <input type="text" style={{ width: '100%', border: 'none', textAlign: 'center', padding: '8px 0', outline: 'none' }} placeholder="-" />
                    </td>
                    <td style={{ border: '1px solid #eee', padding: '0' }}>
                      <input type="text" style={{ width: '100%', border: 'none', textAlign: 'center', padding: '8px 0', outline: 'none' }} placeholder="-" />
                    </td>
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}