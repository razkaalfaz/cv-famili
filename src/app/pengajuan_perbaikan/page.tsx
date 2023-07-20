import FormPerbaikan from "@/components/perbaikan/FormPerbaikan";

export default function PengajuanPerbaikan() {
  return (
    <div className="w-full px-8 py-8 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-2xl">Pengajuan Perbaikan Alat</p>
        <p className="text-sm text-gray-500">
          Harap isi input dibawah ini dengan data yang benar, sehingga
          memudahkan proses administrasi pengajuan perbaikan alat.
        </p>
      </div>

      <FormPerbaikan />
    </div>
  );
}
