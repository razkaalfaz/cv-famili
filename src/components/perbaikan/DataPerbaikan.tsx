"use client";

import { fetcher } from "@/lib/helper";
import useSWR from "swr";

interface ComponentProps {
  id: string;
}

export default function DataPerbaikan({ id }: ComponentProps) {
  const { data, isLoading, error } = useSWR("/api/perbaikan/" + id, fetcher);

  if (isLoading) {
    return (
      <div className="w-full grid place-items-center">
        Memuat data perbaikan...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full grid place-items-center">
        Gagal mendapatkan data perbaikan...
      </div>
    );
  }

  if (data) {
    const dataAlat: IDetailAlat = data.result;

    return (
      <div className="inline-block min-w-full">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-orange-500 text-white font-bold text-center">
              <tr>
                <td className="p-2 whitespace-nowrap border border-gray-300">
                  ID Perbaikan
                </td>
                <td className="p-2 whitespace-nowrap border border-gray-300">
                  Nama Alat
                </td>
                <td className="p-2 whitespace-nowrap border border-gray-300">
                  Kode Unit Alat
                </td>
                <td className="p-2 whitespace-nowrap border border-gray-300">
                  Tingkat Kerusakan
                </td>
                <td className="p-2 whitespace-nowrap border border-gray-300">
                  Keterangan
                </td>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="p-2 border border-gray-300 whitespace-nowrap text-center">
                  {dataAlat.perbaikan?.ID_PERBAIKAN}
                </td>
                <td className="p-2 border border-gray-300 whitespace-nowrap">
                  {dataAlat.alat.NAMA_ALAT}
                </td>
                <td className="p-2 border border-gray-300 whitespace-nowrap">
                  {dataAlat.KODE_ALAT}
                </td>
                <td className="p-2 border border-gray-300 whitespace-nowrap">
                  {dataAlat.perbaikan?.TINGKAT_KERUSAKAN}
                </td>
                <td className="p-2 border border-gray-300 whitespace-nowrap">
                  {dataAlat.perbaikan?.KETERANGAN}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}
