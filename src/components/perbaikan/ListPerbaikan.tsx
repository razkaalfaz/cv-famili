"use client";

import { decimalNumber, fetcher } from "@/lib/helper";
import useSWR from "swr";
import Loading from "../indikator/Loading";
import Link from "next/link";
import Button from "../button/Button";
import ModalPerbaikan from "./ModalPerbaikan";
import { useState } from "react";
import Snackbar from "../snackbar/Snackbar";
import { CheckIcon } from "@heroicons/react/24/solid";

export default function ListPerbaikan() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataPerbaikan, setDataPerbaikan] = useState<Perbaikan | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { data, isLoading } = useSWR("/api/list-perbaikan", fetcher);

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

  function hideModal() {
    setIsModalOpen(false);
    setDataPerbaikan(null);
  }

  function showModal(perbaikan: Perbaikan) {
    setMessage(null);
    setSuccess(null);
    setIsModalOpen(true);
    setDataPerbaikan(perbaikan);
  }

  const tdStyle = "px-2 py-2 border border-gray-300";

  if (isLoading) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <Loading />
      </div>
    );
  }

  if (data) {
    const perbaikan = data.result;

    if (perbaikan.length > 0) {
      return (
        <>
          <table>
            <thead className="bg-orange-500 text-white">
              <tr>
                <td className={tdStyle + " text-center font-bold"}>No.</td>
                <td className={tdStyle + " text-center font-bold"}>
                  ID Perbaikan
                </td>
                <td className={tdStyle + " text-center font-bold"}>ID Alat</td>
                <td className={tdStyle + " text-center font-bold"}>
                  Kode Unit Alat
                </td>
                <td className={tdStyle + " text-center font-bold"}>
                  Tingkat Kerusakan
                </td>
                <td className={tdStyle + " text-center font-bold"}>
                  Jumlah Alat
                </td>
                <td className={tdStyle + " text-center font-bold"}>
                  Tanggal Pengajuan
                </td>
                <td className={tdStyle + " text-center font-bold"}>Aksi</td>
              </tr>
            </thead>

            <tbody>
              {perbaikan.map((perbaikan: Perbaikan, index: number) => (
                <tr key={perbaikan.ID_PERBAIKAN}>
                  <td className={tdStyle + " text-center"}>{index + 1}</td>
                  <td className={tdStyle}>{perbaikan.ID_PERBAIKAN}</td>
                  <td className={tdStyle}>
                    {
                      perbaikan.detail_alat.map(
                        (detail) => detail.alat.ID_ALAT
                      )[0]
                    }
                  </td>
                  <td className={tdStyle}>
                    <div className="shrink-0 flex flex-col gap-2">
                      {perbaikan.detail_alat.map((detail) => (
                        <p key={detail.KODE_ALAT}>{detail.KODE_ALAT}</p>
                      ))}
                    </div>
                  </td>
                  <td className={tdStyle + " text-center"}>
                    {perbaikan.TINGKAT_KERUSAKAN === "BERAT"
                      ? "Rusak Berat"
                      : "Rusak Ringan"}
                  </td>
                  <td className={tdStyle + " text-center"}>
                    {perbaikan.detail_alat.length}
                  </td>
                  <td className={tdStyle + " text-center"}>
                    {convertToDate(perbaikan.TGL_PENGAJUAN)}
                  </td>
                  <td className={tdStyle}>
                    <div className="w-full flex flex-col gap-2">
                      <Link
                        href={
                          "/laporan-perbaikan/print/" + perbaikan.ID_PERBAIKAN
                        }
                        target="_blank"
                        className="px-2 py-2 bg-orange-500 text-white rounded-md grid place-items-center w-full"
                      >
                        Detail
                      </Link>
                      {perbaikan.STATUS === "PENDING" && (
                        <Button
                          variants="ACCENT"
                          onClick={() => showModal(perbaikan)}
                          fullWidth
                        >
                          Verifikasi
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ModalPerbaikan
            isOpen={isModalOpen}
            dataPerbaikan={dataPerbaikan}
            onClose={hideModal}
            setMessage={setMessage}
            setSuccess={setSuccess}
          />
          {message && <Snackbar message={message} variant="ERROR" />}
          {success && <Snackbar message={success} variant="SUCCESS" />}
        </>
      );
    } else {
      return (
        <div className="w-full text-white p-2 rounded-md bg-green-950">
          <div className="flex flex-row gap-2 items-center">
            <CheckIcon className="w-4 h-4" />
            <p>Tidak ada alat yang rusak</p>
          </div>
        </div>
      );
    }
  }
}
