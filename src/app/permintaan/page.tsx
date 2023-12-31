"use client";

import Button from "@/components/button/Button";
import Snackbar from "@/components/snackbar/Snackbar";
import KirimPesanan from "@/components/utils/KirimPesanan";
import ShowModal from "@/components/utils/ShowModal";
import TerimaPesanan from "@/components/utils/TerimaPesanan";
import VerifikasiPengembalian from "@/components/utils/VerifikasiPengembalian";
import { VARIABEL_PERMINTAAN } from "@/lib/constants";
import { decimalNumber, fetcher, sortPermintaan } from "@/lib/helper";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";

export default function Permintaan() {
  const [idPermintaan, setIdPermintaan] = useState<string | null>(null);
  const [permintaanToUpdate, setPermintaanToUpdate] =
    useState<Permintaan | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [opsiVerifikasi, setOpsiVerifikasi] = useState<
    keyof typeof StatusPermintaan | null
  >(null);
  const [modalShown, setModalShown] = useState<string | null>(null);
  const [isKirim, setIsKirim] = useState(false);
  const [isTerima, setIsTerima] = useState(false);
  const [opsiArmada, setOpsiArmada] = useState<string | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const { data: session } = useSession();

  const userId = session ? session.user.ID_USER : null;

  function convertToDate(value: any) {
    const date = new Date(value);
    const day = date.getDate();
    const month = date.getMonth();
    const years = date.getFullYear();
    const dateToReturn = `${decimalNumber(day)}/${decimalNumber(
      month + 1
    )}/${years}`;
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

  function tambahWaktuPengembalian(permintaan: Permintaan) {
    setPermintaanToUpdate(permintaan);
    setModalShown("extend-pengembalian");
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

  function pengembalianBarang(permintaan: Permintaan) {
    setModalShown("pengajuan-pengembalian");
    setPermintaanToUpdate(permintaan);
  }

  async function verifikasiPengembalian(permintaan: Permintaan) {
    setPermintaanToUpdate(permintaan);
    setOpsiArmada("pengambilan");
    setIsKirim(true);
  }

  function hapusPermintaan(permintaan: Permintaan) {
    setPermintaanToUpdate(permintaan);
    setModalShown("hapus-permintaan");
  }

  function kirimPermintaan(permintaan: Permintaan) {
    setPermintaanToUpdate(permintaan);
    setOpsiArmada("pengiriman");
    setIsKirim(true);
  }

  function pengembalianSelesai(permintaan: Permintaan) {
    setPermintaanToUpdate(permintaan);
    setIsCompleted(true);
  }

  function terimaPermintaan(permintaan: Permintaan) {
    setPermintaanToUpdate(permintaan);
    setIsTerima(true);
  }

  function onCloseKirim() {
    setPermintaanToUpdate(null);
    setIsKirim(false);
  }
  function onCloseTerima() {
    setPermintaanToUpdate(null);
    setIsTerima(false);
  }

  function renderDataPermintaan() {
    if (dataPermintaan) {
      if (dataPermintaan.result.length > 0) {
        return (
          <div className="w-full px-8 py-8 flex flex-col gap-8 overflow-hidden">
            {dataPermintaan.result.map(
              (permintaan: Permintaan, index: number) => (
                <div
                  key={permintaan.ID_PERMINTAAN}
                  className="w-full px-2 py-2 rounded-md border border-gray-300 overflow-hidden flex flex-col gap-8"
                >
                  {permintaan.KETERANGAN && (
                    <b>Catatan: {permintaan.KETERANGAN}</b>
                  )}
                  {permintaan?.user?.NAME && (
                    <b>Permintaan dari: {permintaan?.user?.NAME}</b>
                  )}
                  <div className="inline-block min-w-full">
                    <div className="overflow-x-auto">
                      <table className="min-w-full">
                        <thead className="table-header-group bg-orange-500 text-white text-center font-bold">
                          <tr>
                            <td className="px-2 py-2 border border-gray-300">
                              No.
                            </td>
                            <td className="shrink-0 whitespace-nowrap px-2 py-2 border border-gray-300">
                              ID Permintaan
                            </td>
                            <td className="shrink-0 whitespace-nowrap px-2 py-2 border border-gray-300">
                              Nama Proyek
                            </td>
                            <td className="shrink-0 whitespace-nowrap px-2 py-2 border border-gray-300">
                              Lokasi Proyek
                            </td>
                            {permintaan.detail_permintaan_alat
                              .map((detail) => detail.ID_ALAT !== null)
                              .includes(true) && (
                              <td className="shrink-0 whitespace-nowrap px-2 py-2 border border-gray-300">
                                Alat
                              </td>
                            )}
                            {permintaan.detail_permintaan
                              .map((detail) => detail.bahan !== null)
                              .includes(true) && (
                              <td className="shrink-0 whitespace-nowrap px-2 py-2 border border-gray-300">
                                Bahan
                              </td>
                            )}
                            <td className="shrink-0 whitespace-nowrap px-2 py-2 border border-gray-300">
                              Tanggal Penggunaan
                            </td>
                            <td className="shrink-0 whitespace-nowrap px-2 py-2 border border-gray-300">
                              Tanggal Pengembalian
                            </td>
                            <td className="shrink-0 whitespace-nowrap px-2 py-2 border border-gray-300">
                              Status Permintaan
                            </td>
                            <td className="shrink-0 whitespace-nowrap px-2 py-2 border border-gray-300">
                              Aksi
                            </td>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="whitespace-nowrap p-2 text-center border border-gray-300">
                              {index + 1}
                            </td>
                            <td className="whitespace-nowrap p-2 border border-gray-300">
                              {permintaan.ID_PERMINTAAN}
                            </td>
                            <td className="whitespace-nowrap p-2 border border-gray-300">
                              {permintaan.NAMA_PROYEK}
                            </td>
                            <td className="whitespace-nowrap p-2 border border-gray-300">
                              {permintaan.LOKASI_PROYEK}
                            </td>
                            {permintaan.detail_permintaan_alat
                              .map((detail) => detail.ID_ALAT !== null)
                              .includes(true) && (
                              <td className="whitespace-nowrap p-2 border border-gray-300 w-max shrink-0">
                                {permintaan.detail_permintaan_alat.map(
                                  (detailPermintaan) => (
                                    <p
                                      key={detailPermintaan.ID_PERMINTAAN_ALAT}
                                    >
                                      {detailPermintaan.alat.NAMA_ALAT} -{" "}
                                      {detailPermintaan.JUMLAH_ALAT}{" "}
                                      {detailPermintaan.alat.UNIT_ALAT}
                                    </p>
                                  )
                                )}
                              </td>
                            )}
                            {permintaan.detail_permintaan
                              .map((detail) => detail.bahan !== null)
                              .includes(true) && (
                              <td className="whitespace-nowrap p-2 border border-gray-300">
                                {permintaan.detail_permintaan.map(
                                  (detailPermintaan) => (
                                    <>
                                      {detailPermintaan.bahan && (
                                        <div
                                          key={
                                            detailPermintaan.ID_DETAIL_PERMINTAAN
                                          }
                                          className="flex flex-row gap-2 items-center"
                                        >
                                          <p>
                                            {detailPermintaan.bahan.NAMA_BAHAN}{" "}
                                            - {detailPermintaan.JUMLAH_BAHAN}{" "}
                                            {detailPermintaan.bahan.UNIT_BAHAN}
                                          </p>
                                        </div>
                                      )}
                                    </>
                                  )
                                )}
                              </td>
                            )}
                            <td className="whitespace-nowrap p-2 text-center border border-gray-300">
                              {convertToDate(permintaan.TGL_PENGGUNAAN)}
                            </td>
                            <td className="whitespace-nowrap p-2 text-center border border-gray-300">
                              {convertToDate(permintaan.TGL_PENGEMBALIAN)}
                            </td>
                            <td className="whitespace-nowrap p-2 text-center border border-gray-300">
                              {permintaan.STATUS}
                            </td>
                            {session?.user.ROLE === "USER" ? (
                              <td className="whitespace-nowrap p-2 text-center border border-gray-300">
                                <div className="flex flex-row items-center gap-2">
                                  {permintaan.STATUS === "PENDING" && (
                                    <>
                                      {/* <Link
                                        href={
                                          "/permintaan/edit/" +
                                          permintaan.ID_PERMINTAAN
                                        }
                                        target="__blank"
                                        className="px-2 py-2 grid place-items-center bg-green-950 text-white rounded-md"
                                      >
                                        <PencilIcon className="w-4 h-4 text-white" />
                                      </Link> */}
                                      <Button
                                        variants="ERROR"
                                        onClick={() =>
                                          hapusPermintaan(permintaan)
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
                                        terimaPermintaan(permintaan)
                                      }
                                    >
                                      Barang Diterima
                                    </Button>
                                  )}
                                  {permintaan.STATUS === "DITERIMA" && (
                                    <div className="flex flex-col gap-2">
                                      <Button
                                        variants="ACCENT"
                                        onClick={() =>
                                          tambahWaktuPengembalian(permintaan)
                                        }
                                        fullWidth
                                      >
                                        Perpanjang Waktu Pengembalian
                                      </Button>
                                      <Button
                                        variants="PRIMARY"
                                        onClick={() =>
                                          pengembalianBarang(permintaan)
                                        }
                                        fullWidth
                                      >
                                        Kembalikan Barang
                                      </Button>
                                    </div>
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
                              <td className="whitespace-nowrap p-2 text-center border border-gray-300">
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
                                          tolakPermintaan(
                                            permintaan.ID_PERMINTAAN
                                          )
                                        }
                                      >
                                        TOLAK
                                      </Button>
                                    </>
                                  )}
                                  {permintaan.STATUS === "PENGEMBALIAN" && (
                                    <p className="text-gray-500">
                                      Pengembalian barang sedang diverifikasi
                                      oleh petugas peralatan
                                    </p>
                                  )}
                                  {permintaan.STATUS === "DIKIRIM" && (
                                    <p className="text-gray-500">
                                      Barang sedang dikirim oleh petugas
                                      peralatan
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
                              <td className="whitespace-nowrap p-2 text-center border border-gray-300">
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
                                          kirimPermintaan(permintaan)
                                        }
                                      >
                                        Kirim
                                      </Button>
                                      <Button
                                        fullWidth
                                        variants="ERROR"
                                        onClick={() =>
                                          tolakPermintaan(
                                            permintaan.ID_PERMINTAAN
                                          )
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
                                      Ambil Barang Permintaan
                                    </Button>
                                  )}

                                  {permintaan.STATUS === "PENGAMBILAN" && (
                                    <Button
                                      fullWidth
                                      variants="ACCENT"
                                      onClick={() =>
                                        pengembalianSelesai(permintaan)
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
                  </div>
                  {permintaan?.pengembalian && (
                    <div className="w-full flex flex-col gap-2">
                      <p>
                        <b>ID Pengembalian:</b>{" "}
                        {permintaan.pengembalian.ID_PENGEMBALIAN}
                      </p>
                      <p>
                        <b>Catatan Pengembalian:</b>{" "}
                        {permintaan.pengembalian.CATATAN === ""
                          ? "-"
                          : permintaan.pengembalian.CATATAN}
                      </p>
                    </div>
                  )}
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
              dataPermintaan={permintaanToUpdate}
            />
            <KirimPesanan
              isOpen={isKirim}
              onClose={onCloseKirim}
              permintaan={permintaanToUpdate}
              setMessage={setMessage}
              setSuccess={setSuccess}
              opsi={opsiArmada ?? ""}
            />
            <TerimaPesanan
              isOpen={isTerima}
              setMessage={setMessage}
              permintaan={permintaanToUpdate}
              onClose={onCloseTerima}
              setSuccess={setSuccess}
            />
            <VerifikasiPengembalian
              isOpen={isCompleted}
              onClose={() => setIsCompleted(false)}
              permintaan={permintaanToUpdate}
              setMessage={setMessage}
              setSuccess={setSuccess}
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
    isValidating,
  } = useSWR(
    session?.user.ROLE === "ADMIN" || session?.user.ROLE === "PERALATAN"
      ? "/api/semua_permintaan"
      : "/api/permintaan-user/" + userId,
    fetcher
  );

  if (loadingData || isValidating) {
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
