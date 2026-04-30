import React, { useState } from 'react';

const SEMUA_BULAN = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export default function App() {
  const [bulanMulai, setBulanMulai] = useState('Januari');
  const [bulanSelesai, setBulanSelesai] = useState('Desember');
  
  // STATE BARU: Untuk menyimpan isi ketikan dari setiap kotak (sel)
  const [dataGrid, setDataGrid] = useState({});

  const dapatkanRentangBulan = () => {
    const indeksMulai = SEMUA_BULAN.indexOf(bulanMulai);
    const indeksSelesai = SEMUA_BULAN.indexOf(bulanSelesai);
    if (indeksSelesai < indeksMulai) return [SEMUA_BULAN[indeksMulai]]; 
    return SEMUA_BULAN.slice(indeksMulai, indeksSelesai + 1);
  };

  const bulanAktif = dapatkanRentangBulan();

  const kategoriBaris = [
    { id: 'fase', label: 'Phase (Fase Utama)' },
    { id: 'sub_fase', label: 'Sub Phase' },
    { id: 'strength', label: 'Fokus Strength' },
    { id: 'endurance', label: 'Fokus Endurance' },
    { id: 'volume', label: 'Volume (%)' },
    { id: 'intensitas', label: 'Intensitas (%)' },
  ];

  // FUNGSI BARU: Untuk menyimpan data saat pelatih mengetik di kotak
  const tanganiPerubahanSel = (barisId, bulan, minggu, nilai) => {
    const kunciSel = `${barisId}-${bulan}-${minggu}`;
    setDataGrid(prev => ({
      ...prev,
      [kunciSel]: nilai
    }));
  };

  // FUNGSI BARU: Pewarnaan otomatis mirip Excel
  const dapatkanWarnaLatar = (nilai) => {
    if (!nilai) return 'transparent'; // Jika kosong, transparan
    const teks = nilai.toString().toUpperCase();
    
    // Logika warna berdasarkan kata kunci
    if (teks.includes('PERSIAPAN')) return '#bbf7d0'; // Hijau muda
    if (teks.includes('KOMPETISI') || teks.includes('UTAMA')) return '#fca5a5'; // Merah muda
    if (teks.includes('TRANSISI')) return '#bfdbfe'; // Biru muda
    if (teks.includes('PRA')) return '#fef08a'; // Kuning muda
    
    // Warna untuk Volume dan Intensitas tinggi (Angka > 80)
    if (!isNaN(teks) && Number(teks) >= 80) return '#fed7aa'; // Oranye
    
    return 'transparent';
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', minWidth: '1000px' }}>
      <h1 style={{ color: '#1e3a8a' }}>Annual Plan Periodization Builder</h1>
      <p style={{ color: '#555' }}>Ketik "Persiapan", "Kompetisi", "Transisi", atau angka &gt 80 untuk melihat warna otomatis.</p>

      {/* Kontrol Waktu */}
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

      {/* Tabel Dinamis */}
      <div style={{ overflowX: 'auto', border: '1px solid #ccc' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '12px' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #999', padding: '10px', backgroundColor: '#e5e7eb', width: '150px' }}>MAKRO</th>
              {bulanAktif.map(bulan => (
                <th key={bulan} colSpan={4} style={{ border: '1px solid #999', padding: '5px', backgroundColor: '#dbeafe', color: '#1e40af' }}>
                  {bulan.toUpperCase()}
                </th>
              ))}
            </tr>
            <tr>
              <th style={{ border: '1px solid #999', padding: '10px', backgroundColor: '#e5e7eb' }}>MESSO (Minggu)</th>
              {bulanAktif.map(bulan => (
                <React.Fragment key={`minggu-${bulan}`}>
                  {[1, 2, 3, 4].map(minggu => (
                    <th key={`${bulan}-m${minggu}`} style={{ border: '1px solid #999', padding: '2px', backgroundColor: '#f9fafb' }}>{minggu}</th>
                  ))}
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {kategoriBaris.map((baris) => (
              <tr key={baris.id}>
                <td style={{ border: '1px solid #999', padding: '8px', fontWeight: 'bold', backgroundColor: '#f3f4f6', textAlign: 'left' }}>
                  {baris.label}
                </td>
                
                {bulanAktif.map(bulan => (
                  <React.Fragment key={`cell-${baris.id}-${bulan}`}>
                    {[1, 2, 3, 4].map(minggu => {
                      const kunciSel = `${baris.id}-${bulan}-${minggu}`;
                      const nilaiSel = dataGrid[kunciSel] || ''; // Ambil nilai dari state, atau kosong
                      const warnaLatar = dapatkanWarnaLatar(nilaiSel); // Tentukan warna

                      return (
                        <td key={kunciSel} style={{ border: '1px solid #ccc', padding: '0', backgroundColor: warnaLatar }}>
                          <input 
                            type="text" 
                            value={nilaiSel}
                            onChange={(e) => tanganiPerubahanSel(baris.id, bulan, minggu, e.target.value)}
                            style={{ 
                              width: '100%', 
                              border: 'none', 
                              textAlign: 'center', 
                              padding: '8px 0', 
                              outline: 'none',
                              backgroundColor: 'transparent', // Agar input mengikuti warna background <td>
                              fontWeight: nilaiSel ? 'bold' : 'normal'
                            }} 
                          />
                        </td>
                      )
                    })}
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