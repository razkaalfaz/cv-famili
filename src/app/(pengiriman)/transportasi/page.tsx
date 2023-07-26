"use client";

import Button from "@/components/button/Button";
import TabelTransportasi from "@/components/tabel/TabelTransportasi";
import { fetcher } from "@/lib/helper";
import { PlusIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import useSWR from "swr";

export default function Transportasi() {
  const {
    data: transportasi,
    isLoading,
    error,
  } = useSWR("/api/list_transportasi", fetcher);

  if (error) {
    return (
      <div className="w-full grid place-items-center text-gray-500">
        Gagal mendapatkan data transportasi
      </div>
    );
  } else {
    return (
      <div className="w-full flex flex-col gap-8 px-8 py-8">
        <div className="w-full flex flex-col gap-2">
          <p className="text-2xl font-medium">Data Transportasi</p>
          <div className="w-32 h-px bg-orange-500" />
        </div>

        <div className="w-full grid place-items-end">
          <Link
            href="/transportasi/tambah"
            className="px-2 py-2 bg-orange-700 text-white rounded-md grid place-items-center"
          >
            <div className="flex flex-row gap-2 items-center">
              <PlusIcon className="w-4 h-4" />
              <p>Tambah Transportasi</p>
            </div>
          </Link>
        </div>

        {isLoading && (
          <table>
            <thead>
              <tr>
                <td className="px-2 py-2 bg-orange-500 border border-gray-300">
                  <div className="w-full h-4 animate-pulse bg-gray-300 rounded-md text-transparent">
                    No.
                  </div>
                </td>
                <td className="px-2 py-2 bg-orange-500 border border-gray-300">
                  <div className="w-full h-4 animate-pulse bg-gray-300 rounded-md text-transparent">
                    ID Transportasi
                  </div>
                </td>
                <td className="px-2 py-2 bg-orange-500 border border-gray-300">
                  <div className="w-full h-4 animate-pulse bg-gray-300 rounded-md text-transparent">
                    ID Armada
                  </div>
                </td>
                <td className="px-2 py-2 bg-orange-500 border border-gray-300">
                  <div className="w-full h-4 animate-pulse bg-gray-300 rounded-md text-transparent">
                    Nama Transportasi
                  </div>
                </td>
                <td className="px-2 py-2 bg-orange-500 border border-gray-300">
                  <div className="w-full h-4 animate-pulse bg-gray-300 rounded-md text-transparent">
                    Status
                  </div>
                </td>
                <td className="px-2 py-2 bg-orange-500 border border-gray-300">
                  <div className="w-full h-4 animate-pulse bg-gray-300 rounded-md text-transparent">
                    Aksi
                  </div>
                </td>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td className="px-2 py-2 border border-gray-300">
                  <div className="w-full h-4 animate-pulse bg-gray-300 rounded-md text-transparent">
                    No.
                  </div>
                </td>
                <td className="px-2 py-2 border border-gray-300">
                  <div className="w-full h-4 animate-pulse bg-gray-300 rounded-md text-transparent">
                    ID Transportasi
                  </div>
                </td>
                <td className="px-2 py-2 border border-gray-300">
                  <div className="w-full h-4 animate-pulse bg-gray-300 rounded-md text-transparent">
                    ID Armada
                  </div>
                </td>
                <td className="px-2 py-2 border border-gray-300">
                  <div className="w-full h-4 animate-pulse bg-gray-300 rounded-md text-transparent">
                    Nama Transportasi
                  </div>
                </td>
                <td className="px-2 py-2 border border-gray-300">
                  <div className="w-full h-4 animate-pulse bg-gray-300 rounded-md text-transparent">
                    Status
                  </div>
                </td>
                <td className="px-2 py-2 border border-gray-300">
                  <div className="w-full h-4 animate-pulse bg-gray-300 rounded-md text-transparent">
                    Aksi
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {transportasi && transportasi.result && (
          <TabelTransportasi
            dataTransportasi={transportasi.result ?? []}
            showAksi={true}
          />
        )}
      </div>
    );
  }
}
