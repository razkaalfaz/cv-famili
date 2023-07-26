"use client";

import { fetcher } from "@/lib/helper";
import Link from "next/link";
import useSWR from "swr";
import Button from "../button/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import ShowModal from "../utils/ShowModal";
import Snackbar from "../snackbar/Snackbar";

export default function TabelArmada() {
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [modalShown, setModalShown] = useState<string | null>(null);
  const {
    data: armada,
    isLoading,
    error,
  } = useSWR("/api/list_armada", fetcher);

  const tableDataStyles = "px-2 py-2 border border-gray-300";

  if (error) {
    return (
      <div className="w-full grid place-items-center text-gray-500">
        Gagal mendapatkan data armada
      </div>
    );
  } else {
    return (
      <div className="w-full flex flex-col gap-8">
        <div className="w-full grid place-items-end">
          <Button
            variants="PRIMARY"
            onClick={() => setModalShown("tambah-armada")}
          >
            <div className="flex flex-row gap-2 items-center">
              <PlusIcon className="w-4 h-4" />
              <p>Tambah Armada</p>
            </div>
          </Button>
        </div>

        <table>
          <thead>
            <tr>
              <td className="px-2 py-2 text-center bg-orange-500 text-white border border-gray-300 font-bold">
                No.
              </td>
              <td className="px-2 py-2 text-center bg-orange-500 text-white border border-gray-300 font-bold">
                ID Armada
              </td>
              <td className="px-2 py-2 text-center bg-orange-500 text-white border border-gray-300 font-bold">
                Nama Armada
              </td>
              <td className="px-2 py-2 text-center bg-orange-500 text-white border border-gray-300 font-bold">
                Jumlah Transportasi
              </td>
              <td className="px-2 py-2 text-center bg-orange-500 text-white border border-gray-300 font-bold">
                Aksi
              </td>
            </tr>
          </thead>

          <tbody>
            {isLoading && (
              <tr>
                <td className={tableDataStyles}>
                  <div className="w-full h-6 animate-pulse rounded-md bg-gray-300" />
                </td>
                <td className={tableDataStyles}>
                  <div className="w-full h-6 animate-pulse rounded-md bg-gray-300" />
                </td>
                <td className={tableDataStyles}>
                  <div className="w-full h-6 animate-pulse rounded-md bg-gray-300" />
                </td>
                <td className={tableDataStyles}>
                  <div className="w-full h-6 animate-pulse rounded-md bg-gray-300" />
                </td>
                <td className={tableDataStyles}>
                  <div className="w-full h-6 animate-pulse rounded-md bg-gray-300" />
                </td>
              </tr>
            )}

            {armada && armada.result && (
              <>
                {armada.result.length > 0 ? (
                  <>
                    {armada.result.map((armada: Armada, index: number) => (
                      <tr key={armada.ID_ARMADA}>
                        <td className={tableDataStyles + " text-center"}>
                          {index + 1}
                        </td>
                        <td className={tableDataStyles + " text-center"}>
                          {armada.ID_ARMADA}
                        </td>
                        <td className={tableDataStyles}>
                          {armada.NAMA_ARMADA}
                        </td>
                        <td className={tableDataStyles + " text-center"}>
                          {armada.transportasi?.length ?? 0}
                        </td>
                        <td className={tableDataStyles + " text-center"}>
                          <Link
                            href={"/armada/detail/" + armada.ID_ARMADA}
                            className="px-2 py-2 rounded-md grid place-items-center bg-orange-500 text-white"
                          >
                            Detail
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr>
                    <p className="text-gray-500">Tidak ada data armada...</p>
                  </tr>
                )}
              </>
            )}
          </tbody>
        </table>

        {message && <Snackbar variant="ERROR" message={message} />}
        {success && <Snackbar variant="SUCCESS" message={success} />}

        <ShowModal
          onClose={() => setModalShown(null)}
          options={modalShown}
          setMessage={setMessage}
          setSuccess={setSuccess}
        />
      </div>
    );
  }
}
