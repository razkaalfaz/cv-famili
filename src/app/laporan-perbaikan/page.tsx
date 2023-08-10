import ListPerbaikan from "@/components/perbaikan/ListPerbaikan";

export default function LaporanPerbaikan() {
  return (
    <div className="w-full flex flex-col gap-8 px-8 py-8">
      <div className="flex flex-col gap-2">
        <p className="text-2xl">Surat Perbaikan</p>
        <p className="text-sm text-gray-500">
          Berikut merupakan data alat yang harus diperbaiki.
        </p>
      </div>

      <div className="w-full">
        <ListPerbaikan />
      </div>
    </div>
  );
}
