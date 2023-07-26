import TabelArmada from "@/components/tabel/TabelArmada";

export default function Armada() {
  return (
    <div className="w-full flex flex-col gap-8 px-8 py-8">
      <div className="w-full flex flex-col gap-2">
        <p className="text-2xl font-medium">List Armada</p>
        <div className="w-32 h-px bg-orange-500" />
      </div>

      <TabelArmada />
    </div>
  );
}
