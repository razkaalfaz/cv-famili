"use client";

import Loading from "@/components/indikator/Loading";
import TabelTransportasi from "@/components/tabel/TabelTransportasi";
import { fetcher } from "@/lib/helper";
import useSWR from "swr";

export default function DetailArmada({ params }: { params: { id: string } }) {
  const {
    data: armada,
    isLoading,
    error,
  } = useSWR("/api/get_armada/" + params.id, fetcher);

  if (error) {
    return (
      <div className="w-full grid place-items-center text-gray-500">
        Gagal mendapatkan data detail armada...
      </div>
    );
  } else {
    return (
      <div className="w-full flex flex-col gap-8 px-8 py-8">
        <div className="w-full flex flex-col gap-2">
          <p className="text-2xl font-medium">Detail Armada</p>
          <div className="w-32 h-px bg-orange-500" />
        </div>

        {isLoading && <Loading />}

        {armada && (
          <TabelTransportasi
            dataTransportasi={armada.result.transportasi ?? []}
          />
        )}
      </div>
    );
  }
}
