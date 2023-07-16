import { WrenchScrewdriverIcon } from "@heroicons/react/24/solid";

export default function CardAlat({ dataAlat }: { dataAlat: Alat[] }) {
  return (
    <div className="w-80 shrink-0 rounded-md overflow-hidden flex flex-row justify-between items-center px-4 py-4 shadow-lg border border-orange-200 text-neutral-700">
      <div className="flex flex-col gap-2">
        <b className="text-4xl text-orange-500">{dataAlat.length}</b>
        <p>Jumlah total alat</p>
      </div>

      <div className="px-2 py-2 rounded-full border border-orange-500 grid place-items-center">
        <WrenchScrewdriverIcon className="w-12 h-12 text-orange-500" />
      </div>
    </div>
  );
}
