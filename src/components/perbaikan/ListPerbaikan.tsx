"use client";

import { decimalNumber, fetcher } from "@/lib/helper";
import useSWR from "swr";
import Loading from "../indikator/Loading";
import Link from "next/link";

export default function ListPerbaikan() {
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
        <table>
          <thead className="bg-orange-500 text-white">
            <tr>
              <td className={tdStyle + " text-center font-bold"}>No.</td>
              <td className={tdStyle + " text-center font-bold"}>
                ID Perbaikan
              </td>
              <td className={tdStyle + " text-center font-bold"}>ID Alat</td>
              <td className={tdStyle + " text-center font-bold"}>Nama Alat</td>
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
                <td className={tdStyle}>{perbaikan.ID_ALAT}</td>
                <td className={tdStyle}>{perbaikan.alat.NAMA_ALAT}</td>
                <td className={tdStyle + " text-center"}>
                  {perbaikan.JUMLAH_ALAT}
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
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  }
}
