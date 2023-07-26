import ListLaporanPengajuanAlat from "@/components/laporan/pengajuan_alat/ListLaporanPengajuanAlat";

export default function LaporanPengajuanAlat() {
  return (
    <div className="w-full flex flex-col gap-8 px-8 py-8">
      <div className="w-full flex flex-col gap-2">
        <p className="text-2xl font-medium">Laporan Pengajuan Alat Baru</p>
        <div className="w-32 h-px bg-orange-500" />
      </div>

      <ListLaporanPengajuanAlat />
    </div>
  );
}
