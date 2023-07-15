"use client";

import Button from "@/components/button/Button";
import Snackbar from "@/components/snackbar/Snackbar";
import ShowModal from "@/components/utils/ShowModal";
import { fetcher, sortPermintaan } from "@/lib/helper";
import { useSession } from "next-auth/react";
import { useState } from "react";
import useSWR from "swr";

export default function Permintaan() {
  const [idPermintaan, setIdPermintaan] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [opsiVerifikasi, setOpsiVerifikasi] = useState<
    keyof typeof StatusPermintaan | null
  >(null);
  const [modalShown, setModalShown] = useState<string | null>(null);

  const { data: session } = useSession();

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

  function hideModal() {
    setModalShown(null);
    setIdPermintaan(null);
  }

  async function pengembalianBarang(permintaan: Permintaan) {
    if (session) {
      setIsLoading(true);
      try {
        const res = await fetch(
          process.env.NEXT_PUBLIC_API_PENGAJUAN_PENGEMBALIAN!,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              permintaan: permintaan,
              ID_USER: session.user.ID_USER,
            }),
          }
        );

        const response = await res.json();
        if (!response.ok) {
          setIsLoading(false);
          setMessage(response.message);
        } else {
          setIsLoading(false);
          setSuccess(response.message);
        }
      } catch (err) {
        console.error(err);
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

  if (loadingData || isValidating || isLoading) {
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

  if (dataPermintaan) {
    if (dataPermintaan.result.length > 0) {
      if (session && session.user.ROLE === "PERALATAN") {
        const dataPermintaanDiterima = sortPermintaan(dataPermintaan.result);
        if (dataPermintaanDiterima.length > 0) {
          return (
            <div className="w-full px-8 py-8 flex flex-col gap-8">
              {dataPermintaanDiterima.map((permintaan: Permintaan) => (
                <div
                  key={permintaan.ID_PERMINTAAN}
                  className="w-full px-2 py-2 rounded-md border border-gray-300 overflow-hidden flex flex-row justify-between gap-8"
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <b>ID Permintaan: {permintaan.ID_PERMINTAAN}</b>
                      <p>
                        Diajukan pada tanggal:{" "}
                        {convertToDate(permintaan.TGL_PERMINTAAN)}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <b>Daftar barang yang di ajukan:</b>
                      <div className="flex flex-col gap-2">
                        {permintaan.detail_permintaan.map(
                          (detailPermintaan: DetailPermintaan) => (
                            <div
                              key={detailPermintaan.ID_DETAIL_PERMINTAAN}
                              className="flex flex-col gap-4"
                            >
                              <div className="flex flex-row gap-2 items-center">
                                <p>
                                  {detailPermintaan.alat?.NAMA_ALAT ||
                                    detailPermintaan.bahan?.NAMA_BAHAN}
                                </p>
                                <div className="w-8 h-px bg-gray-500" />
                                <p>
                                  Sebanyak:{" "}
                                  {detailPermintaan?.JUMLAH_ALAT ||
                                    detailPermintaan?.JUMLAH_BAHAN}{" "}
                                  {detailPermintaan.alat?.UNIT_ALAT ||
                                    detailPermintaan.bahan?.UNIT_BAHAN}
                                </p>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <b>
                      Total barang yang di ajukan:{" "}
                      {permintaan.detail_permintaan.length} jenis barang.
                    </b>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <b>Status permintaan: {permintaan.STATUS}</b>
                  </div>
                </div>
              ))}

              {message && <Snackbar variant="ERROR" message={message} />}
              {success && <Snackbar variant="SUCCESS" message={success} />}
              <ShowModal
                onClose={hideModal}
                options={modalShown}
                setMessage={setMessage}
                setSuccess={setSuccess}
                idPermintaan={idPermintaan}
                statusPermintaan={opsiVerifikasi}
              />
            </div>
          );
        } else {
          return (
            <p className="text-gray-500">
              Tidak ada atau belum ada data permintaan yang diterima...
            </p>
          );
        }
      }

      return (
        <div className="w-full px-8 py-8 flex flex-col gap-8">
          {dataPermintaan.result.map((permintaan: Permintaan) => (
            <div
              key={permintaan.ID_PERMINTAAN}
              className="w-full px-2 py-2 rounded-md border border-gray-300 overflow-hidden flex flex-row justify-between gap-8"
            >
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <b>ID Permintaan: {permintaan.ID_PERMINTAAN}</b>
                  <p>
                    Diajukan pada tanggal:{" "}
                    {convertToDate(permintaan.TGL_PERMINTAAN)}
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <b>Daftar barang yang di ajukan:</b>
                  <div className="flex flex-col gap-2">
                    {permintaan.detail_permintaan.map(
                      (detailPermintaan: DetailPermintaan) => (
                        <div
                          key={detailPermintaan.ID_DETAIL_PERMINTAAN}
                          className="flex flex-col gap-4"
                        >
                          <div className="flex flex-row gap-2 items-center">
                            <p>
                              {detailPermintaan.alat?.NAMA_ALAT ||
                                detailPermintaan.bahan?.NAMA_BAHAN}
                            </p>
                            <div className="w-8 h-px bg-gray-500" />
                            <p>
                              Sebanyak:{" "}
                              {detailPermintaan?.JUMLAH_ALAT ||
                                detailPermintaan?.JUMLAH_BAHAN}{" "}
                              {detailPermintaan.alat?.UNIT_ALAT ||
                                detailPermintaan.bahan?.UNIT_BAHAN}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <b>
                  Total barang yang di ajukan:{" "}
                  {permintaan.detail_permintaan.length} jenis barang.
                </b>
              </div>

              <div className="flex flex-col items-center gap-4">
                <b>Status permintaan: {permintaan.STATUS}</b>
                {session?.user.ROLE === "USER" &&
                  permintaan.STATUS === "DITERIMA" && (
                    <Button
                      variants="ACCENT"
                      fullWidth
                      onClick={() => pengembalianBarang(permintaan)}
                    >
                      Kembalikan Barang
                    </Button>
                  )}
                {session?.user.ROLE === "ADMIN" && (
                  <>
                    <p>Permintaan dari: {permintaan.user.NAME}</p>
                    {permintaan.STATUS === "PENDING" && (
                      <>
                        <Button
                          variants="ACCENT"
                          fullWidth
                          onClick={() =>
                            verifikasiPermintaan(
                              permintaan.ID_PERMINTAAN,
                              "DITERIMA"
                            )
                          }
                        >
                          Setujui
                        </Button>
                        <Button
                          variants="ERROR"
                          fullWidth
                          onClick={() =>
                            verifikasiPermintaan(
                              permintaan.ID_PERMINTAAN,
                              "DIVERIFIKASI"
                            )
                          }
                        >
                          Verifikasi
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}

          {message && <Snackbar variant="ERROR" message={message} />}
          {success && <Snackbar variant="SUCCESS" message={success} />}
          <ShowModal
            onClose={hideModal}
            options={modalShown}
            setMessage={setMessage}
            setSuccess={setSuccess}
            idPermintaan={idPermintaan}
            statusPermintaan={opsiVerifikasi}
          />
        </div>
      );
    } else {
      return (
        <div className="px-8 py-8 text-gray-500">Tidak ada data permintaan</div>
      );
    }
  }
}
