export const fetcher = (url: string) =>
  fetch(url, { cache: "no-store" }).then((res) => res.json());

export function hitungJumlahAlat(alat: Alat[]) {
  const alatBesar = alat.filter(
    (alat: Alat) => alat.ID_ALAT.substring(0, 2) === "AB"
  );
  const alatRingan = alat.filter(
    (alat: Alat) => alat.ID_ALAT.substring(0, 2) === "AR"
  );

  const alatLayak = alat.reduce((a, b) => a + b.ALAT_LAYAK, 0);

  const alatTidakLayak = alat.reduce((a, b) => a + b.ALAT_TIDAK_LAYAK, 0);

  const totalAlat = alat.reduce((a, b) => a + b.JUMLAH_ALAT, 0);

  return { alatBesar, alatRingan, alatLayak, alatTidakLayak, totalAlat };
}

export function hitungJumlahBahan(bahan: Bahan[]) {
  const totalStock = bahan.reduce((a, b) => a + b.STOCK_BAHAN, 0);
  const totalJenis = bahan.length;

  return { totalStock, totalJenis };
}

export function sortPermintaan(permintaan: Permintaan[]) {
  const permintaanDiterima = permintaan.filter(
    (permintaan: Permintaan) => permintaan.STATUS === "DITERIMA"
  );

  return permintaanDiterima;
}
