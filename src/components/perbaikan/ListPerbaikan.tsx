"use client";

import { decimalNumber, fetcher } from "@/lib/helper";
import useSWR from "swr";
import Loading from "../indikator/Loading";
import Link from "next/link";
import Button from "../button/Button";
import ModalPerbaikan from "./ModalPerbaikan";
import { useState } from "react";
import Snackbar from "../snackbar/Snackbar";
import { CheckIcon, PrinterIcon } from "@heroicons/react/24/solid";

export default function ListPerbaikan() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataPerbaikan, setDataPerbaikan] = useState<IDetailPerbaikan | null>(
    null
  );
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

  function showModal(detail_perbaikan: IDetailPerbaikan) {
    setMessage(null);
    setSuccess(null);
    setIsModalOpen(true);
    setDataPerbaikan(detail_perbaikan);
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
          <div className="min-w-full inline-block">
            <div className="overflow-x-auto">
              <table className="w-full">
                {perbaikan.map((dataPerbaikan: Perbaikan) => (
                  <>
                    <thead
                      className="bg-orange-500 text-white font-bold text-center"
                      key={dataPerbaikan.ID_ALAT}
                    >
                      <tr>
                        <td
                          className="p-2 border-b border-b-gray-300 text-center"
                          colSpan={5}
                        >
                          {dataPerbaikan.alat?.NAMA_ALAT}
                        </td>
                        <td className="p-2 text-center">
                          <Link
                            href={
                              "/laporan-perbaikan/print/" +
                              dataPerbaikan.ID_PERBAIKAN
                            }
                            target="_blank"
                            className="px-2 py-2 bg-orange-900 text-white rounded-md grid place-items-center w-full"
                          >
                            <PrinterIcon className="w-4 h-4" />
                          </Link>
                        </td>
                      </tr>
                      <tr>
                        <td className={tdStyle}>No.</td>
                        <td className={tdStyle}>ID Perbaikan</td>
                        <td className={tdStyle}>Kode Alat</td>
                        <td className={tdStyle}>Tingkat Kerusakan</td>
                        <td className={tdStyle}>Tanggal Pengajuan</td>
                        <td className={tdStyle}>Aksi</td>
                      </tr>
                    </thead>
                    <tbody key={dataPerbaikan.ID_PERBAIKAN}>
                      {dataPerbaikan.detail_perbaikan.map(
                        (detail, index: number) => (
                          <tr key={detail.KODE_ALAT}>
                            <td className={tdStyle + " text-center"}>
                              {index + 1}.
                            </td>
                            <td className={tdStyle}>{detail.ID_PERBAIKAN}</td>
                            <td className={tdStyle}>{detail.KODE_ALAT}</td>
                            <td className={tdStyle}>
                              {detail.TINGKAT_KERUSAKAN}
                            </td>
                            <td className={tdStyle + " text-center"}>
                              {convertToDate(detail.TGL_PENGAJUAN)}
                            </td>
                            <td className={tdStyle + " text-center"}>
                              <div className="flex flex-col gap-2">
                                <Button
                                  variants="PRIMARY"
                                  fullWidth
                                  onClick={() => showModal(detail)}
                                >
                                  Verifikasi
                                </Button>
                              </div>
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </>
                ))}
              </table>
            </div>
          </div>

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
