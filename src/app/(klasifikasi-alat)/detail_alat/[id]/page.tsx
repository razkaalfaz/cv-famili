"use client";

import DetailAlatComponent from "@/components/alat/DetailAlat";
import { fetcher } from "@/lib/helper";
import useSWR from "swr";

interface PageProps {
  params: {
    id: string;
  };
}

export default function DetailAlat({ params }: PageProps) {
  const {
    data: dataAlat,
    isLoading,
    error,
  } = useSWR("/api/get-alat/" + params.id, fetcher);

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
    const alat: Alat = dataAlat.result;

    return (
      <div className="w-full flex flex-col gap-8 p-8">
        <div className="w-full flex flex-col gap-2">
          <p className="text-2xl font-medium">List Detail Alat</p>
          <div className="w-32 h-px bg-orange-500" />
        </div>
        <DetailAlatComponent dataAlat={alat} />
      </div>
    );
  }
}
