"use client";

import useSWR from "swr";
import ListConditionalAlat from "@/components/alat/ListConditionalAlat";
import { fetcher } from "@/lib/helper";

export default function LaporanAlat() {
  const {
    data: dataAlat,
    isLoading,
    error,
  } = useSWR("/api/list-alat", fetcher);

  if (isLoading) {
    return (
      <div className="w-full flex flex-col gap-8 p-8">
        <div className="w-full h-72 bg-gray-300 rounded-md animate-pulse" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-red-950 italic">
        Terjadi kesalahan ketika mendapatkan data alat...
      </p>
    );
  }

  if (dataAlat) {
    return (
      <div className="w-full flex flex-col gap-8 p-8">
        <div className="w-full flex flex-col gap-2">
          <p className="text-2xl font-medium">List Alat</p>
          <div className="w-32 h-px bg-orange-500" />
        </div>
        <ListConditionalAlat dataAlat={dataAlat.result} />
      </div>
    );
  }
}
