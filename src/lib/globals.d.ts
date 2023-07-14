type Alat = {
  ID_ALAT: string;
  NAMA_ALAT: string;
  JUMLAH_ALAT: number;
  UNIT_ALAT: string;
  ALAT_LAYAK: number;
  ALAT_TIDAK_LAYAK: number;
};

type PermintaanBarang = {
  ID_BARANG: string;
  JUMLAH_BARANG: number;
};

type Bahan = {
  ID_BAHAN: string;
  NAMA_BAHAN: string;
  STOCK_BAHAN: number;
  UNIT_BAHAN: string;
};

type VariabelBarang = {
  id: string;
  name: string;
};

type Tab = {
  id: string;
  url: string;
  name: string;
};

type UserLogin = {
  username?: string;
  password?: string;
};

type Permintaan = {
  ID_PERMINTAAN: string;
  ID_USER: number;
  TGL_PERMINTAAN: Date;
  STATUS: StatusPermintaan;
  detail_permintaan: DetailPermintaan[];
  user: User;
};

type User = {
  ID_USER: number;
  NAME: string;
};

type DetailPermintaan = {
  ID_DETAIL_PERMINTAAN: string;
  alat: Alat;
  bahan: Bahan;
  JUMLAH_ALAT: number;
  JUMLAH_BAHAN: number;
};

enum StatusPermintaan {
  PENDING = "PENDING",
  DIVERIFIKASI = "DIVERIFIKASI",
  DITERIMA = "DITERIMA",
}
