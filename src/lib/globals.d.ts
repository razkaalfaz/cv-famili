type Alat = {
  ID_ALAT: string;
  NAMA_ALAT: string;
  UNIT_ALAT: string;
  detail_alat: IDetailAlat[];
};

type IDetailAlat = {
  KODE_ALAT: string;
  ID_ALAT: string;
  STATUS: STATUS_ALAT;
  detail_permintaan: DetailPermintaan | null;
  alat: Alat;
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
  transportasi: Transportasi | null;
  pengembalian: Pengembalian | null;
};

type Pengembalian = {
  ID_PENGEMBALIAN: string;
  CATATAN: string | null;
};

type Perbaikan = {
  ID_PERBAIKAN: string;
  KETERANGAN: string;
  TGL_PENGAJUAN: string;
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
  detail_alat: IDetailAlat;
  bahan: Bahan;
  JUMLAH_BAHAN: number;
};

type BarangPermintaan = {
  ID_BARANG: string;
  NAMA_BARANG: string;
  UNIT_BARANG: string;
};

type PengajuanAlatBaru = {
  ID_PENGAJUAN: string;
  NAMA_ALAT: string;
  JUMLAH_ALAT: number;
  DESKRIPSI: string;
  TGL_PENGAJUAN: Date;
  PROYEK: string | null;
  user: User;
};

type Transportasi = {
  ID_TRANSPORTASI: string;
  ID_ARMADA: string;
  NAMA_TRANSPORTASI: string;
  ID_PERMINTAAN: string | null;
  STATUS: StatusTransportasi;
  permintaan: Permintaan | null;
  armada: Armada;
};

type Armada = {
  ID_ARMADA: string;
  NAMA_ARMADA: string;
  transportasi: Transportasi[];
};

enum StatusPermintaan {
  PENDING = "PENDING",
  DIVERIFIKASI = "DIVERIFIKASI",
  DITERIMA = "DITERIMA",
  DIKEMBALIKAN = "DIKEMBALIKAN",
  PENGEMBALIAN = "PENGEMBALIAN",
  DITOLAK = "DITOLAK",
  DIKIRIM = "DIKIRIM",
  PENGAMBILAN = "PENGAMBILAN",
}

enum StatusPerbaikan {
  PENDING = "PENDING",
  DIAJUKAN = "DIAJUKAN",
  DITOLAK = "DITOLAK",
  DIPERBAIKI = "DIPERBAIKI",
}

enum StatusTransportasi {
  TERSEDIA = "TERSEDIA",
  DIPAKAI = "DIPAKAI",
}

enum STATUS_ALAT {
  DIGUNAKAN = "DIGUNAKAN",
  TERSEDIA = "TERSEDIA",
  DIPERBAIKI = "DIPERBAIKI",
  RUSAK = "RUSAK",
}
