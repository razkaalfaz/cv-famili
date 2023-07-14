"use client";

import { VARIABEL_ALAT } from "@/lib/constants";
import { fetcher } from "@/lib/helper";
import useSWR from "swr";
import Button from "../button/Button";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import ShowModal from "../utils/ShowModal";
import { useSession } from "next-auth/react";

interface ComponentProps {
  setSuccess: React.Dispatch<React.SetStateAction<string | null>>;
  setMessage: React.Dispatch<React.SetStateAction<string | null>>;
}

export default function ListAlat({ setSuccess, setMessage }: ComponentProps) {
  const [modalShown, setModalShown] = useState<string | null>(null);
  const [idAlat, setIdAlat] = useState<string | null>(null);
  const [alatToUpdate, setAlatToUpdate] = useState<Alat | null>(null);

  const { data: session } = useSession();

  function hideModal() {
    setIdAlat(null);
    setModalShown(null);
  }

  function hapusAlat(idAlat: string) {
    setModalShown("hapus-alat");
    setIdAlat(idAlat);
  }

  function editAlat(idAlat: string, alat: Alat) {
    setModalShown("edit-alat");
    setIdAlat(idAlat);
    setAlatToUpdate(alat);
  }

  function ajukanAlat(idAlat: string) {
    setModalShown("ajukan-permintaan");
    setIdAlat(idAlat);
  }

  const {
    data: hasilAlat,
    isLoading,
    error,
    isValidating,
  } = useSWR("/api/list-alat", fetcher);

  if (isLoading || isValidating) {
    return "Loading alat...";
  }

  if (error) {
    return "Gagal mendapatkan data alat";
  }

  if (hasilAlat) {
    if (hasilAlat.result.length > 0) {
      return (
        <>
          <table className="w-full">
            <thead className="border border-gray-300">
              <tr>
                {VARIABEL_ALAT.map((variabel: VariabelBarang) => (
                  <td
                    key={variabel.id}
                    className="border border-gray-300 px-2 py-2"
                  >
                    <b>{variabel.name}</b>
                  </td>
                ))}
              </tr>
            </thead>
            <tbody>
              {hasilAlat.result.map((alat: Alat, idx: number) => (
                <tr key={alat.ID_ALAT}>
                  <td className="border border-gray-300 px-2 py-2">
                    <p>{idx + 1}.</p>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <p>{alat.ID_ALAT}</p>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <p>{alat.NAMA_ALAT}</p>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <p>{alat.JUMLAH_ALAT}</p>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <p>{alat.UNIT_ALAT}</p>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <p>{alat.ALAT_LAYAK}</p>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    <p>{alat.ALAT_TIDAK_LAYAK}</p>
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    {session?.user?.ROLE === "ADMIN" && (
                      <div className="w-full flex flex-row items-center justify-center gap-2">
                        <Button
                          variants="PRIMARY"
                          onClick={() => editAlat(alat.ID_ALAT, alat)}
                        >
                          <PencilIcon className="w-4 h-4 text-white" />
                        </Button>
                        <Button
                          variants="ERROR"
                          onClick={() => hapusAlat(alat.ID_ALAT)}
                        >
                          <TrashIcon className="w-4 h-4 text-white" />
                        </Button>
                      </div>
                    )}

                    {session?.user.ROLE === "USER" && (
                      <Button
                        variants="PRIMARY"
                        fullWidth
                        onClick={() => ajukanAlat(alat.ID_ALAT)}
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
            setSuccess={setSuccess}
            setMessage={setMessage}
            idAlat={idAlat}
            dataAlat={alatToUpdate}
          />
        </>
      );
    } else {
      return (
        <div className="w-full">
          <p className="text-gray-500">Tidak ada data alat...</p>
        </div>
      );
    }
  }
}
