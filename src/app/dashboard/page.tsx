"use client";

import { fetcher, hitungJumlahAlat, hitungJumlahBahan } from "@/lib/helper";
import { useSession } from "next-auth/react";
import useSWR from "swr";

export default function Dashboard() {
  const { data: session } = useSession();
  const {
    data: alat,
    isLoading,
    isValidating,
    error: errorAlat,
  } = useSWR("/api/list-alat", fetcher);
  const { data: bahan, error: errorBahan } = useSWR("/api/list_bahan", fetcher);

  if (isLoading || isValidating) {
    return "Loading...";
  }

  if (errorAlat || errorBahan) {
    return "Error mendapatkan data.";
  }

  if (alat && bahan) {
    const dataAlat = hitungJumlahAlat(alat.result);
    const dataBahan = hitungJumlahBahan(bahan.result);
    return (
      <div className="w-full flex flex-col gap-8 px-8 py-8">
        <div className="flex flex-col gap-2">
          <p className="text-2xl font-semibold">Data Barang</p>
          <p className="text-lg">
            Berikut merupakan total data barang yang tersedia di CV. Famili
            Sejahtera Utama
          </p>
          <div className="w-28 rounded-md bg-orange-700 h-1" />
        </div>

        <div className="w-full flex flex-row gap-8 items-center">
          <div className="px-4 py-4 rounded-md overflow-hidden bg-orange-700 text-white flex flex-col gap-4">
            <p className="text-2xl font-bold">Alat</p>
            <div className="grid grid-cols-2">
              <p>Jumlah Jenis Alat: {alat.result.length} alat</p>
              <p>Total Alat Tersedia: {dataAlat.totalAlat} alat</p>
              <p>Alat Layak: {dataAlat.alatLayak} alat</p>
              <p>Alat Tidak Layak: {dataAlat.alatTidakLayak} alat</p>
              <p>Alat Berat: {dataAlat.alatBesar.length} alat</p>
              <p>Alat Ringan: {dataAlat.alatRingan.length} alat</p>
            </div>
          </div>

          <div className="px-4 py-4 rounded-md overflow-hidden bg-teal-300 text-slate-800 flex flex-col gap-4">
            <p className="text-2xl font-bold">Bahan</p>
            <div className="flex flex-col gap-2">
              <p>Jumlah Jenis Bahan: {dataBahan.totalJenis}</p>
              <p>Jumlah Stock Bahan: {dataBahan.totalStock}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
