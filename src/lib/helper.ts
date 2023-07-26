export const fetcher = (url: string) =>
  fetch(url, { cache: "no-store" }).then((res) => res.json());

export function hitungJumlahAlat(alat: Alat[]) {
  const alatBesar = alat?.filter(
    (alat: Alat) => alat?.ID_ALAT.substring(0, 2) === "AB"
  );
  const alatRingan = alat?.filter(
    (alat: Alat) => alat?.ID_ALAT.substring(0, 2) === "AR"
  );

  const alatTidakLayak = alat?.reduce((a, b) => a + b.ALAT_TIDAK_LAYAK, 0);

  const totalAlat = alat?.reduce((a, b) => a + b.JUMLAH_ALAT, 0);

  return { alatBesar, alatRingan, alatTidakLayak, totalAlat };
}

export function hitungJumlahBahan(bahan: Bahan[]) {
  const totalStock = bahan?.reduce((a, b) => a + b.STOCK_BAHAN, 0);
  const totalJenis = bahan?.length;

  return { totalStock, totalJenis };
}

export function sortPermintaan(permintaan: Permintaan[]) {
  const permintaanDiterima = permintaan.filter(
    (permintaan: Permintaan) =>
      permintaan.STATUS !== "PENDING" || "DIVERIFIKASI"
  );

  return permintaanDiterima;
}

export function decimalNumber(input: number) {
  if (input < 10) {
    return `0${input}`;
  } else {
    return input;
  }
}

export function dateToString(input: string) {
  const currentDate = new Date(input);
  const date = currentDate.getDate();
  const month = currentDate.getMonth();
  const years = currentDate.getFullYear();

  const dateToReturn = `${years}-${decimalNumber(month + 1)}-${decimalNumber(
    date
  )}`;

  return dateToReturn;
}

export function convertToDate(value: any) {
  const date = new Date(value);
  const day = date.getDate();
  const month = date.getMonth();
  const years = date.getFullYear();
  const dateToReturn = `${decimalNumber(day)}/${decimalNumber(
    month + 1
  )}/${years}`;
  return dateToReturn;
}

export function idPrefixMaker(value: number) {
  return value <= 9
    ? `00${value}`
    : value <= 99 && value >= 9
    ? `0${value}`
    : `${value}`;
}
