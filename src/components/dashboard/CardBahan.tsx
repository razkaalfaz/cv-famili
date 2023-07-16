import { CubeIcon } from "@heroicons/react/24/solid";

export default function CardAlat({ dataBahan }: { dataBahan: Bahan[] }) {
  return (
    <div className="w-80 rounded-md overflow-hidden flex flex-row justify-between items-center px-4 py-4 shadow-lg border border-green-200 text-neutral-700">
      {dataBahan && (
        <>
          <div className="flex flex-col gap-2">
            <b className="text-4xl text-green-500">{dataBahan.length}</b>
            <p>Jumlah total bahan</p>
          </div>

          <div className="px-2 py-2 rounded-full border border-green-500 grid place-items-center">
            <CubeIcon className="w-12 h-12 text-green-500" />
          </div>
        </>
      )}
    </div>
  );
}
