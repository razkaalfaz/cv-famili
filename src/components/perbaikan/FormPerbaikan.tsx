"use client";

import { fetcher } from "@/lib/helper";
import { useState } from "react";
import useSWR from "swr";
import Button from "../button/Button";
import Snackbar from "../snackbar/Snackbar";
import { CheckIcon } from "@heroicons/react/24/solid";
import PengajuanPerbaikanModal from "../utils/PengajuanPerbaikanModal";

export default function FormPerbaikan() {
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const [alatToFix, setAlatToFix] = useState<IDetailPerbaikan | null>(null);

  const { data: alat, isLoading: loadingData } = useSWR(
    "/api/list-alat",
    fetcher
  );

  function showModal(detailPerbaikan: IDetailPerbaikan | null) {
    if (detailPerbaikan) {
      const alatRusak: AlatRusak = {
        ID_ALAT: detailPerbaikan.detail_alat.ID_ALAT,
        KETERANGAN_RUSAK: detailPerbaikan.KETERANGAN,
        KODE_UNIT_ALAT: detailPerbaikan.KODE_ALAT,
        TINGKAT_KERUSAKAN: detailPerbaikan.TINGKAT_KERUSAKAN,
      };

      return (
        <PengajuanPerbaikanModal
          ALAT_RUSAK={alatRusak}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          setMessage={setMessage}
          setSuccess={setSuccess}
        />
      );
    } else {
      return null;
    }
  }

  function onOpen(detailPerbaikan: IDetailPerbaikan | null) {
    setAlatToFix(detailPerbaikan);
    setIsOpen(true);
  }

  const inputContainer = "flex flex-col gap-2";
  const labelStyles = "text-sm text-gray-500";

  function renderDetailAlat() {
    if (alat) {
      const dataAlat: Alat[] = alat.result;
      const detailAlat = dataAlat.flatMap((alat) => alat.detail_alat);
      const alatRusak = detailAlat.filter(
        (detail) => detail.STATUS === "RUSAK"
      );
      const availableAlat = alatRusak.filter(
        (detail) => detail.detail_perbaikan?.ID_PERBAIKAN === null
      );
      return availableAlat;
    } else {
      return [];
    }
  }

  return (
    <>
      <div className="w-full flex flex-col gap-4">
        <div className={inputContainer}>
          <label htmlFor="id_alat" className={labelStyles}>
            Alat yang harus diperbaiki
          </label>

          {loadingData && (
            <div className="w-full grid place-items-center">
              Loading data...
            </div>
          )}

          {alat && (
            <table>
              <thead className="bg-orange-500 text-white font-bold text-center">
                <tr>
                  <td className="p-2 border border-gray-300">No.</td>
                  <td className="p-2 border border-gray-300">Nama Alat</td>
                  <td className="p-2 border border-gray-300">Kode Alat</td>
                  <td className="p-2 border border-gray-300">Keterangan</td>
                  <td className="p-2 border border-gray-300">
                    Tingkat Kerusakan
                  </td>
                  <td className="p-2 border border-gray-300">Aksi</td>
                </tr>
              </thead>

              <tbody>
                {renderDetailAlat().length > 0 ? (
                  <>
                    {renderDetailAlat().map((detail, index: number) => (
                      <tr key={detail.KODE_ALAT}>
                        <td className="p-2 border border-gray-300 text-center">
                          {index + 1}.
                        </td>
                        <td className="p-2 border border-gray-300">
                          {detail.alat.NAMA_ALAT}
                        </td>
                        <td className="p-2 border border-gray-300 text-center">
                          {detail.KODE_ALAT}
                        </td>
                        <td className="p-2 border border-gray-300">
                          {detail.detail_perbaikan?.KETERANGAN}
                        </td>
                        <td className="p-2 border border-gray-300 text-center">
                          {detail.detail_perbaikan?.TINGKAT_KERUSAKAN}
                        </td>
                        <td className="p-2 border border-gray-300 text-center">
                          <Button
                            variants="ACCENT"
                            fullWidth
                            onClick={() => onOpen(detail.detail_perbaikan)}
                          >
                            Ajukan Perbaikan
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </>
                ) : (
                  <tr className="w-full p-2 bg-green-950 text-white">
                    <td colSpan={6} className="p-2 text-center">
                      <div className="flex flex-row gap-2 items-center">
                        <CheckIcon className="w-4 h-4" />
                        <p>Tidak ada alat rusak</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isOpen && showModal(alatToFix)}

      {success && (
        <Snackbar
          variant="SUCCESS"
          message={success}
          autoHide
          duration={5000}
        />
      )}
      {message && (
        <Snackbar
          variant="SUCCESS"
          message={message}
          autoHide
          duration={5000}
        />
      )}
    </>
  );
}
