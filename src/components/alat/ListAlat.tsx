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

  function cekJenisAlat(idAlat: string) {
    const jenisAlat = idAlat.substring(0, 2);
    if (jenisAlat === "AB") {
      return "Alat Besar";
    } else {
      return "Alat Ringan";
    }
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
        <div className="w-full flex flex-col gap-8">
          {hasilAlat.result.map((alat: Alat) => (
            <div
              key={alat.ID_ALAT}
              className="w-full px-4 py-4 rounded-md border border-gray-300 overflow-hidden flex flex-row justify-between items-center"
            >
              <div className="flex flex-col gap-4">
                <b className="text-sm">ID Alat: {alat.ID_ALAT}</b>
                <p className="text-lg">{alat.NAMA_ALAT}</p>
                <p className="text-base">
                  Jenis alat: {cekJenisAlat(alat.ID_ALAT)}
                </p>
              </div>

              <div className="flex flex-col gap-4">
                <Button
                  variants="ACCENT"
                  fullWidth
                  onClick={() => editAlat(alat.ID_ALAT, alat)}
                >
                  Edit Alat
                </Button>
                <Button
                  variants="ERROR"
                  fullWidth
                  onClick={() => hapusAlat(alat.ID_ALAT)}
                >
                  Hapus Alat
                </Button>
                <b>
                  Jumlah alat: {alat.JUMLAH_ALAT} {alat.UNIT_ALAT}
                </b>
              </div>
            </div>
          ))}

          <ShowModal
            onClose={hideModal}
            options={modalShown}
            setSuccess={setSuccess}
            setMessage={setMessage}
            idAlat={idAlat}
            dataAlat={alatToUpdate}
          />
        </div>
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
