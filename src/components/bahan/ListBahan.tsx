"use client";

import { VARIABEL_BAHAN } from "@/lib/constants";
import { fetcher } from "@/lib/helper";
import useSWR from "swr";
import Button from "../button/Button";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import ShowModal from "../utils/ShowModal";
import { useSession } from "next-auth/react";
import Loading from "../indikator/Loading";

interface ComponentProps {
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setSuccess: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function ListAlat({ setMessage, setSuccess }: ComponentProps) {
  const [modalShown, setModalShown] = useState<string | null>(null);
  const [idBahan, setIdBahan] = useState<string | null>(null);
  const [bahanToEdit, setBahanToEdit] = useState<Bahan | null>(null);

  const { data: session } = useSession();

  function editBahan(idBahan: string, bahan: Bahan) {
    setModalShown("edit-bahan");
    setIdBahan(idBahan);
    setBahanToEdit(bahan);
  }

  function hapusBahan(idBahan: string) {
    setModalShown("hapus-bahan");
    setIdBahan(idBahan);
  }

  function hideModal() {
    setIdBahan(null);
    setBahanToEdit(null);
    setModalShown(null);
  }

  function ajukanBahan(idBahan: string) {
    setIdBahan(idBahan);
    setModalShown("ajukan-permintaan");
  }

  const {
    data: hasilBahan,
    isLoading,
    error,
    isValidating,
  } = useSWR("/api/list_bahan", fetcher);

  if (isLoading || isValidating) {
    return (
      <div className="w-full grid place-items-center">
        <Loading />
      </div>
    );
  }

  if (error) {
    return "Gagal mendapatkan data bahan";
  }

  if (hasilBahan) {
    if (hasilBahan.result.length > 0) {
      return (
        <>
          <table className="w-full rounded-md overflow-hidden">
            <thead className="border border-gray-300 bg-orange-700 text-white font-medium">
              <tr>
                {VARIABEL_BAHAN.map((variabel: VariabelBarang) => (
                  <td
                    key={variabel.id}
                    className="text-center border border-gray-300 px-2 py-2"
                  >
                    <b>{variabel.name}</b>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {hasilBahan.result.map((bahan: Bahan, idx: number) => (
                <tr key={bahan.ID_BAHAN}>
                  <td className="text-center border border-gray-300 px-2 py-2">
                    <p>{idx + 1}.</p>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <p>{bahan.ID_BAHAN}</p>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <p>{bahan.NAMA_BAHAN}</p>
                  </td>
                  <td className="text-center border border-gray-300 px-2 py-2">
                    <p>{bahan.STOCK_BAHAN}</p>
                  </td>
                  <td className="text-center border border-gray-300 px-2 py-2">
                    <p>{bahan.UNIT_BAHAN}</p>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    {session?.user?.ROLE === "ADMIN" && (
                      <div className="w-full flex flex-row items-center justify-center gap-2">
                        <Button
                          variants="ACCENT"
                          onClick={() => editBahan(bahan.ID_BAHAN, bahan)}
                        >
                          <PencilIcon className="w-4 h-4 text-white" />
                        </Button>
                        <Button
                          variants="ERROR"
                          onClick={() => hapusBahan(bahan.ID_BAHAN)}
                        >
                          <TrashIcon className="w-4 h-4 text-white" />
                        </Button>
                      </div>
                    )}

                    {session?.user.ROLE === "USER" && (
                      <Button
                        variants="ACCENT"
                        fullWidth
                        onClick={() => ajukanBahan(bahan.ID_BAHAN)}
                      >
                        Ajukan Permintaan
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ShowModal
            onClose={hideModal}
            options={modalShown}
            setMessage={setMessage}
            setSuccess={setSuccess}
            idBahan={idBahan}
            dataBahan={bahanToEdit}
          />
        </>
      );
    } else {
      return (
        <div className="w-full">
          <p className="text-gray-500">Tidak ada data bahan...</p>
        </div>
      );
    }
  }
}
