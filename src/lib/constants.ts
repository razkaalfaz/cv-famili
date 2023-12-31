export const ROUTES = {
  LANDING: "/",
  ADMIN: {
    DASHBOARD: "/dashboard",
    USERS: {
      LIST: "/users",
      ADD: "/tambah_user",
    },
    PERMINTAAN: "/permintaan",
  },
  BARANG: {
    ALAT: {
      TAMBAH: "/alat/tambah",
      EDIT: (idAlat: string) => `/alat/edit/${idAlat}`,
    },
    BAHAN: {
      TAMBAH: "/bahan/tambah",
      EDIT: (idBahan: string) => `/bahan/edit/${idBahan}`,
    },
    LANDING: "/barang",
    PENGAJUAN_ALAT: "/pengajuan_alat_baru",
  },
};

export const VARIABEL_ALAT = [
  { id: "number", name: "No." },
  { id: "id_alat", name: "ID Alat" },
  { id: "nama_alat", name: "Nama Alat" },
  { id: "jumlah_alat", name: "Jumlah Alat" },
  { id: "unit_alat", name: "Unit Alat" },
  { id: "jumlah_alat_tidak_layak", name: "Jumlah Alat Tidak Layak" },
  { id: "aksi", name: "Aksi" },
];

export const VARIABEL_BAHAN = [
  { id: "number", name: "No." },
  { id: "id_bahan", name: "ID Bahan" },
  { id: "nama_bahan", name: "Nama Bahan" },
  { id: "stock_bahan", name: "Stock Bahan" },
  { id: "unit_bahan", name: "Unit Bahan" },
  { id: "aksi", name: "Aksi" },
];

export const NAVIGATION_TABS = [
  {
    id: "dashboard",
    url: ROUTES.ADMIN.DASHBOARD,
    name: "Dashboard",
  },
  {
    id: "list-barang",
    url: ROUTES.BARANG.LANDING,
    name: "Data Barang",
  },
  {
    id: "permintaan",
    url: ROUTES.ADMIN.PERMINTAAN,
    name: "Permintaan",
  },
];

export const USERS_TABLE_VARIABLES = [
  {
    id: "number",
    name: "No.",
  },
  {
    id: "name",
    name: "Nama",
  },
  {
    id: "username",
    name: "Username",
  },
  {
    id: "role",
    name: "Role",
  },
  {
    id: "aksi",
    name: "Aksi",
  },
];

export const VARIABEL_PERMINTAAN = [
  {
    id: "number",
    name: "No.",
  },
  {
    id: "idPermintaan",
    name: "ID Permintaan",
  },
  {
    id: "namaProyek",
    name: "Nama Proyek",
  },
  {
    id: "lokasiProyek",
    name: "Lokasi Proyek",
  },
  {
    id: "alat",
    name: "Alat",
  },
  {
    id: "bahan",
    name: "Bahan",
  },
  {
    id: "tgl_penggunaan",
    name: "Tanggal Penggunaan",
  },
  {
    id: "tgl_pengembalian",
    name: "Tanggal Pengembalian",
  },
  {
    id: "status",
    name: "Status Permintaan",
  },
  {
    id: "aksi",
    name: "Aksi",
  },
];

export const CAROUSEL_ASSETS = [
  "/carousel-1.jpg",
  "/carousel-2.jpg",
  "/carousel-3.jpg",
];

export const VARIABEL_PILIHAN_ALAT = [
  { id: "checkbox", name: "" },
  { id: "id_alat", name: "ID Alat" },
  { id: "nama_alat", name: "Nama Alat" },
  { id: "jumlah_alat", name: "Jumlah Alat Tersedia" },
];

export const VARIABEL_PILIHAN_BAHAN = [
  { id: "checkbox", name: "" },
  { id: "id_bahan", name: "ID Bahan" },
  { id: "nama_banahn", name: "Nama Bahan" },
  { id: "stock_bahan", name: "Jumlah Bahan Tersedia" },
];

export const ADMIN_DROPDOWN_TABS = {
  DATA: [
    {
      id: "barang",
      url: "/barang",
      name: "Data Alat dan Bahan",
    },
    {
      id: "alat",
      url: "/laporan_alat",
      name: "Detail Alat",
    },
    {
      id: "users",
      url: "/users",
      name: "Data User",
    },
    {
      id: "armada",
      url: "/armada",
      name: "Data Armada",
    },
    {
      id: "transportasi",
      url: "/transportasi",
      name: "Data Transportasi",
    },
  ] as Tab[],
  LAPORAN: [
    {
      id: "lap_permintaan",
      url: "/permintaan/laporan",
      name: "Laporan Permintaan",
    },
  ] as Tab[],
  PERMINTAAN: [
    {
      id: "permintaan",
      url: "/permintaan",
      name: "Permintaan Alat dan Bahan",
    },
    {
      id: "lap_pengajuan_alat",
      url: "/laporan_pengajuan_alat",
      name: "Permintaan Alat Baru",
    },
    {
      id: "lap_perbaikan",
      url: "/laporan-perbaikan",
      name: "Permintaan Perbaikan Alat",
    },
  ] as Tab[],
};

export const PERALATAN_DROPDOWN_TABS = {
  DATA: [
    {
      id: "barang",
      url: "/barang",
      name: "Data Alat dan Bahan",
    },
    {
      id: "alat",
      url: "/laporan_alat",
      name: "Detail Alat",
    },
    {
      id: "armada",
      url: "/armada",
      name: "Data Armada",
    },
    {
      id: "transportasi",
      url: "/transportasi",
      name: "Data Transportasi",
    },
  ] as Tab[],
  PENGAJUAN: [
    {
      id: "pengajuan-perbaikan",
      url: "/pengajuan_perbaikan",
      name: "Pengajuan Perbaikan",
    },
    {
      id: "pengajuan-alat-baru",
      url: "/pengajuan_alat_baru",
      name: "Pengajuan Alat Baru",
    },
  ] as Tab[],
  PERMINTAAN: [
    {
      id: "permintaan-alat-dan-bahan",
      url: "/permintaan",
      name: "Permintaan Alat dan Bahan",
    },
    {
      id: "pengajuan-alat-baru",
      url: "/pengajuan_alat_baru",
      name: "Permintaan Alat Baru",
    },
    {
      id: "pengajuan-perbaikan",
      url: "/pengajuan_perbaikan",
      name: "Permintaan Perbaikan Alat",
    },
  ] as Tab[],
};
