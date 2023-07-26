import FormPengajuanAlat from "@/components/form/FormPengajuanAlat";

export default function PengajuanAlatBaru() {
  return (
    <div className="w-full flex flex-col gap-8 px-8 py-8">
      <div className="w-full flex flex-col gap-2">
        <p className="text-xl font-medium">Pengajuan Alat Baru</p>
        <div className="w-32 h-px bg-orange-500" />
      </div>

      <FormPengajuanAlat />
    </div>
  );
}
