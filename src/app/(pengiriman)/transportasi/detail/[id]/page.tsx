"use client";

import Loading from "@/components/indikator/Loading";
import TabelTransportasi from "@/components/tabel/TabelTransportasi";
import { fetcher } from "@/lib/helper";
import useSWR from "swr";

export default function DetailTransportasi({
  params,
}: {
  params: { id: string };
}) {
  const {
    data: transportasi,
    isLoading,
    error,
  } = useSWR("/api/get_transportasi/" + params.id, fetcher);

  if (error) {
    return (
      <div className="w-full grid place-items-center text-gray-500">
        Gagal mendapatkan detail transportasi
      </div>
    );
  } else {
    return (
      <div className="w-full flex flex-col gap-8 px-8 py-8">
        <div className="w-full flex flex-col gap-2">
          <p className="text-2xl font-medium">Detail Transportasi</p>
          <div className="w-32 h-px bg-orange-500" />
        </div>

        {isLoading && <Loading />}

        {transportasi && transportasi.result && (
          <TabelTransportasi
            dataTransportasi={[transportasi.result]}
            showPermintaan={transportasi.result.STATUS === "DIPAKAI"}
          />
        )}
      </div>
    );
  }
}
