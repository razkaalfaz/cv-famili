import DataPerbaikan from "@/components/perbaikan/DataPerbaikan";

export default function DetailPerbaikan({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div className="w-full p-8 flex flex-col gap-4">
      <div className="w-full flex flex-col gap-2">
        <p className="text-2xl font-medium">Detail Perbaikan</p>
        <div className="w-32 h-px bg-orange-500" />
      </div>

      <DataPerbaikan id={params.id} />
    </div>
  );
}
