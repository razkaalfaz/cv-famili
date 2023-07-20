type Alat = {
  ID_ALAT: string;
  NAMA_ALAT: string;
  JUMLAH_ALAT: number;
  UNIT_ALAT: string;
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
  NAMA_PROYEK: string;
  LOKASI_PROYEK: string;
  TGL_PERMINTAAN: Date;
  TGL_PENGGUNAAN: Date;
  TGL_PENGEMBALIAN: Date;
  STATUS: StatusPermintaan;
  detail_permintaan: DetailPermintaan[];
  user: User;
  KETERANGAN: string | null;
};

type Perbaikan = {
  ID_PERBAIKAN: string;
  KETERANGAN: string;
  TGL_PERBAIKAN: string;
  ID_ALAT: string;
  alat: Alat;
  JUMLAH_ALAT: number;
  STATUS: StatusPerbaikan;
};

type User = {
  ID_USER: number;
  NAME: string;
  ROLE: string;
  USERNAME: string;
};

type DetailPermintaan = {
  ID_DETAIL_PERMINTAAN: string;
  alat: Alat;
  bahan: Bahan;
  JUMLAH_ALAT: number;
  JUMLAH_BAHAN: number;
};

type BarangPermintaan = {
  ID_BARANG: string;
  NAMA_BARANG: string;
  UNIT_BARANG: string;
};

enum StatusPermintaan {
  PENDING = "PENDING",
  DIVERIFIKASI = "DIVERIFIKASI",
  DITERIMA = "DITERIMA",
  DIKEMBALIKAN = "DIKEMBALIKAN",
  PENGEMBALIAN = "PENGEMBALIAN",
  DITOLAK = "DITOLAK",
  DIKIRIM = "DIKIRIM",
}

enum StatusPerbaikan {
  PENDING = "PENDING",
  DIAJUKAN = "DIAJUKAN",
  DITOLAK = "DITOLAK",
  DIPERBAIKI = "DIPERBAIKI",
}
