"use client";

import Button from "@/components/button/Button";
import Snackbar from "@/components/snackbar/Snackbar";
import ShowModal from "@/components/utils/ShowModal";
import { VARIABEL_PERMINTAAN } from "@/lib/constants";
import { fetcher, sortPermintaan } from "@/lib/helper";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import useSWR, { useSWRConfig } from "swr";

export default function Permintaan() {
  const [idPermintaan, setIdPermintaan] = useState<string | null>(null);
  const [dataPengembalian, setDataPengembalian] = useState<Permintaan | null>(
    null
  );
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [opsiVerifikasi, setOpsiVerifikasi] = useState<
    keyof typeof StatusPermintaan | null
  >(null);
  const [modalShown, setModalShown] = useState<string | null>(null);

  const { data: session } = useSession();
  const { mutate } = useSWRConfig();

  const userId = session ? session.user.ID_USER : null;

  function convertToDate(value: any) {
    const date = new Date(value);
    const dateToReturn = date.toLocaleDateString();
    return dateToReturn;
  }

  function verifikasiPermintaan(
    idPermintaan: string,
    opsi: keyof typeof StatusPermintaan
  ) {
    setIdPermintaan(idPermintaan);
    setOpsiVerifikasi(opsi);
    setModalShown("verifikasi-permintaan");
  }

  function tolakPermintaan(idPermintaan: string) {
    setIdPermintaan(idPermintaan);
    setOpsiVerifikasi("DITOLAK");
    setModalShown("tolak-permintaan");
  }

  function hideModal() {
    setModalShown(null);
    setIdPermintaan(null);
  }

  function pengembalianBarang(ID_PERMINTAAN: string) {
    setModalShown("pengajuan-pengembalian");
    setIdPermintaan(ID_PERMINTAAN);
  }

  async function verifikasiPengembalian(permintaan: Permintaan) {
    setDataPengembalian(permintaan);
    setModalShown("verifikasi-pengembalian");
  }

  function hapusPermintaan(ID_PERMINTAAN: string) {
    setIdPermintaan(ID_PERMINTAAN);
    setModalShown("hapus-permintaan");
  }

  function renderDataPermintaan() {
    if (dataPermintaan) {
      if (dataPermintaan.result.length > 0) {
        return (
          <div className="w-full px-8 py-8 flex flex-col gap-8">
            {dataPermintaan.result.map(
              (permintaan: Permintaan, index: number) => (
                <div
                  key={permintaan.ID_PERMINTAAN}
                  className="w-full px-2 py-2 rounded-md border border-gray-300 overflow-hidden flex flex-col gap-8"
                >
                  {permintaan.KETERANGAN && (
                    <b>Catatan: {permintaan.KETERANGAN}</b>
                  )}
                  <table className="w-full">
                    <thead>
                      <tr>
                        {VARIABEL_PERMINTAAN.map((variabel) => (
                          <td
                            className="px-2 py-2 bg-orange-500 text-white text-center border border-gray-300 font-bold"
                            key={variabel.id}
                          >
                            {variabel.name}
                          </td>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-2 py-2 border border-gray-300 text-center">
                          {index + 1}
                        </td>
                        <td className="px-2 py-2 border border-gray-300">
                          {permintaan.ID_PERMINTAAN}
                        </td>
                        <td className="px-2 py-2 border border-gray-300">
                          {permintaan.NAMA_PROYEK}
                        </td>
                        <td className="px-2 py-2 border border-gray-300">
                          {permintaan.LOKASI_PROYEK}
                        </td>
                        <td className="px-2 py-2 border border-gray-300">
                          {permintaan.detail_permintaan.map(
                            (detailPermintaan) => (
                              <>
                                {detailPermintaan.alat && (
                                  <div
                                    key={detailPermintaan.ID_DETAIL_PERMINTAAN}
                                    className="flex flex-row gap-2 items-center"
                                  >
                                    <p>{detailPermintaan?.alat?.NAMA_ALAT}</p>
                                    <div className="w-4 h-px bg-gray-300" />
                                    <p>{detailPermintaan?.JUMLAH_ALAT}</p>
                                    <p>{detailPermintaan?.alat?.UNIT_ALAT}</p>
                                  </div>
                                )}
                              </>
                            )
                          )}
                        </td>
                        <td className="px-2 py-2 border border-gray-300">
                          {permintaan.detail_permintaan.map(
                            (detailPermintaan) => (
                              <>
                                {detailPermintaan.bahan && (
                                  <div
                                    key={detailPermintaan.ID_DETAIL_PERMINTAAN}
                                    className="flex flex-row gap-2 items-center"
                                  >
                                    <p>{detailPermintaan?.bahan?.NAMA_BAHAN}</p>
                                    <div className="w-4 h-px bg-gray-300" />
                                    <p>{detailPermintaan?.JUMLAH_BAHAN}</p>
                                    <p>{detailPermintaan?.bahan?.UNIT_BAHAN}</p>
                                  </div>
                                )}
                              </>
                            )
                          )}
                        </td>
                        <td className="px-2 py-2 border border-gray-300 text-center">
                          {convertToDate(permintaan.TGL_PENGGUNAAN)}
                        </td>
                        <td className="px-2 py-2 border border-gray-300 text-center">
                          {convertToDate(permintaan.TGL_PENGEMBALIAN)}
                        </td>
                        <td className="px-2 py-2 border border-gray-300 text-center">
                          {permintaan.STATUS}
                        </td>
                        {session?.user.ROLE === "USER" ? (
                          <td className="px-2 py-2 border border-gray-300 text-center">
                            <div className="flex flex-row items-center gap-2">
                              {permintaan.STATUS === "PENDING" && (
                                <>
                                  <Link
                                    href={
                                      "/permintaan/edit/" +
                                      permintaan.ID_PERMINTAAN
                                    }
                                    target="__blank"
                                    className="px-2 py-2 grid place-items-center bg-green-950 text-white rounded-md"
                                  >
                                    <PencilIcon className="w-4 h-4 text-white" />
                                  </Link>
                                  <Button
                                    variants="ERROR"
                                    onClick={() =>
                                      hapusPermintaan(permintaan.ID_PERMINTAAN)
                                    }
                                  >
                                    <TrashIcon className="w-4 h-4 text-white" />
                                  </Button>
                                </>
                              )}
                              {permintaan.STATUS === "DIVERIFIKASI" && (
                                <p className="text-gray-500">
                                  Pengajuan sedang diverifikasi...
                                </p>
                              )}
                              {permintaan.STATUS === "DIKIRIM" && (
                                <Button
                                  variants="ACCENT"
                                  onClick={() =>
                                    verifikasiPermintaan(
                                      permintaan.ID_PERMINTAAN,
                                      "DITERIMA"
                                    )
                                  }
                                >
                                  Barang Diterima
                                </Button>
                              )}
                              {permintaan.STATUS === "DITERIMA" && (
                                <Button
                                  variants="PRIMARY"
                                  onClick={() =>
                                    pengembalianBarang(permintaan.ID_PERMINTAAN)
                                  }
                                >
                                  Kembalikan Barang
                                </Button>
                              )}
                              {permintaan.STATUS === "PENGEMBALIAN" && (
                                <p className="text-gray-500">
                                  Pengembalian sedang diverifikasi
                                </p>
                              )}
                              {permintaan.STATUS === "DIKEMBALIKAN" && (
                                <b className="text-green-950">
                                  Barang telah dikembalikan.
                                </b>
                              )}
                              {permintaan.STATUS === "DITOLAK" && (
                                <p className="text-gray-500">
                                  Permintaan telah ditolak
                                </p>
                              )}
                            </div>
                          </td>
                        ) : session?.user.ROLE === "ADMIN" ? (
                          <td className="px-2 py-2 border border-gray-300 text-center">
                            <div className="w-full flex flex-col gap-2">
                              {permintaan.STATUS === "PENDING" && (
                                <>
                                  <Button
                                    fullWidth
                                    variants="ACCENT"
                                    onClick={() =>
                                      verifikasiPermintaan(
                                        permintaan.ID_PERMINTAAN,
                                        "DIVERIFIKASI"
                                      )
                                    }
                                  >
                                    Verifikasi
                                  </Button>
                                  <Button
                                    fullWidth
                                    variants="ERROR"
                                    onClick={() =>
                                      tolakPermintaan(permintaan.ID_PERMINTAAN)
                                    }
                                  >
                                    TOLAK
                                  </Button>
                                </>
                              )}
                              {permintaan.STATUS === "PENGEMBALIAN" && (
                                <p className="text-gray-500">
                                  Pengembalian barang sedang diverifikasi oleh
                                  petugas peralatan
                                </p>
                              )}
                              {permintaan.STATUS === "DIKIRIM" && (
                                <p className="text-gray-500">
                                  Barang sedang dikirim oleh petugas peralatan
                                </p>
                              )}
                              {permintaan.STATUS === "DIKEMBALIKAN" && (
                                <b className="text-green-950">
                                  Permintaan telah selesai.
                                </b>
                              )}
                              {permintaan.STATUS === "DITOLAK" && (
                                <p className="text-gray-500">
                                  Permintaan telah ditolak
                                </p>
                              )}
                              {permintaan.STATUS === "DITERIMA" && (
                                <p className="text-gray-500">
                                  Permintaan telah diterima kepala proyek
                                </p>
                              )}
                              {permintaan.STATUS === "DIVERIFIKASI" && (
                                <p className="text-gray-500">
                                  Permintaan telah dikirimkan ke petugas
                                  peralatan
                                </p>
                              )}
                            </div>
                          </td>
                        ) : (
                          <td className="px-2 py-2 border border-gray-300 text-center">
                            <div className="w-full flex flex-col gap-2">
                              {permintaan.STATUS === "PENDING" && (
                                <p className="text-gray-500">
                                  Permintaan sedang ditinjau oleh Admin.
                                </p>
                              )}
                              {permintaan.STATUS === "DIVERIFIKASI" && (
                                <>
                                  <Button
                                    fullWidth
                                    variants="ACCENT"
                                    onClick={() =>
                                      verifikasiPermintaan(
                                        permintaan.ID_PERMINTAAN,
                                        "DIKIRIM"
                                      )
                                    }
                                  >
                                    Kirim
                                  </Button>
                                  <Button
                                    fullWidth
                                    variants="ERROR"
                                    onClick={() =>
                                      tolakPermintaan(permintaan.ID_PERMINTAAN)
                                    }
                                  >
                                    Tolak
                                  </Button>
                                </>
                              )}
                              {permintaan.STATUS === "PENGEMBALIAN" && (
                                <Button
                                  fullWidth
                                  variants="ACCENT"
                                  onClick={() =>
                                    verifikasiPengembalian(permintaan)
                                  }
                                >
                                  Barang Diterima
                                </Button>
                              )}
                              {permintaan.STATUS === "DIKEMBALIKAN" && (
                                <b className="text-green-950">
                                  Permintaan telah selesai.
                                </b>
                              )}
                              {permintaan.STATUS === "DITOLAK" && (
                                <p className="text-gray-500">
                                  Permintaan telah ditolak
                                </p>
                              )}
                              {permintaan.STATUS === "DIKEMBALIKAN" && (
                                <b className="text-green-950">
                                  Permintaan telah selesai.
                                </b>
                              )}
                              {permintaan.STATUS === "DITERIMA" && (
                                <p className="text-gray-500">
                                  Permintaan telah diterima kepala proyek
                                </p>
                              )}
                              {permintaan.STATUS === "DIKIRIM" && (
                                <p className="text-gray-500">
                                  Barang sedang dikirimkan oleh petugas
                                  peralatan
                                </p>
                              )}
                            </div>
                          </td>
                        )}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )
            )}

            {message && <Snackbar variant="ERROR" message={message} />}
            {success && <Snackbar variant="SUCCESS" message={success} />}
            <ShowModal
              onClose={hideModal}
              options={modalShown}
              setMessage={setMessage}
              setSuccess={setSuccess}
              idPermintaan={idPermintaan}
              statusPermintaan={opsiVerifikasi}
              dataPermintaan={dataPengembalian}
            />
          </div>
        );
      } else {
        return (
          <div className="px-8 py-8 text-gray-500">
            Tidak ada data permintaan
          </div>
        );
      }
    }
  }

  const {
    data: dataPermintaan,
    error,
    isLoading: loadingData,
  } = useSWR(
    session?.user.ROLE === "ADMIN" || session?.user.ROLE === "PERALATAN"
      ? "/api/semua_permintaan"
      : "/api/permintaan-user/" + userId,
    fetcher
  );

  if (loadingData) {
    return (
      <div className="w-full px-8 py-8 flex flex-col gap-8">
        <p className="text-gray-500">Loading data permintaan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-8 py-8 flex flex-col gap-8">
        <p className="text-gray-500">Gagal mendapatkan data permintaan...</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="w-full px-8 py-8 flex flex-row items-center justify-between">
        <div className="flex flex-col gap-2">
          <p className="text-xl font-medium">Daftar Permintaan</p>
          <div className="w-32 h-px bg-orange-500" />
        </div>
        {session?.user.ROLE === "USER" && (
          <Link
            className="px-2 py-2 rounded-md bg-orange-700 text-white grid place-items-center"
            href="/form_permintaan"
          >
            Ajukan Permintaan
          </Link>
        )}
      </div>
      {renderDataPermintaan()}
    </div>
  );
}
