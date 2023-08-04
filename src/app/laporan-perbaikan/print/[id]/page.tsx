"use client";

import Loading from "@/components/indikator/Loading";
import GeneratePDF from "@/components/pdf/GeneratePDF";
import { decimalNumber, fetcher } from "@/lib/helper";
import { Open_Sans } from "next/font/google";
import Image from "next/image";
import { useRef } from "react";
import useSWR from "swr";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export default function DetailPerbaikan({
  params,
}: {
  params: { id: string };
}) {
  const { data, isLoading } = useSWR(
    "/api/get-perbaikan/" + params.id,
    fetcher
  );
  const ref = useRef<HTMLDivElement | null>(null);

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

  const currentDate = new Date();
  function convertToDateString(value: any) {
    const date = new Date(value);

    const bulan = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];

    const tanggal = date.getDate();
    const month = date.getMonth();
    const tahun = date.getFullYear();

    const dateToReturn = `${decimalNumber(tanggal)} ${bulan[month]} ${tahun}`;

    return dateToReturn;
  }

  if (isLoading) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <Loading />
      </div>
    );
  }

  if (data) {
    const perbaikan: Perbaikan = data.result;

    return (
      <div className={openSans.className}>
        <div className="w-full flex flex-col gap-8 px-8 py-8" ref={ref}>
          <div id="image" className="w-full flex flex-row gap-4 items-center">
            <Image src="/logo.png" width={128} height={128} alt="logo" />
            <div className="w-px bg-orange-700 h-32" />
            <div className="flex flex-col gap-4">
              <b className="text-orange-700 text-4xl">
                CV. FAMILI SEJAHTERA UTAMA
              </b>
              <div className="flex flex-col gap-0 text-sm">
                <p className="font-semibold">
                  Jl. RA Kosasih No. 86 Cibereum, Kec. Sukaraja Kab. Sukabumi
                </p>
                <p className="font-semibold">
                  Email: familisejahterautama@gmail.com
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <b>Laporan Perbaikan</b>
            <table className="w-fit">
              <tbody>
                <tr>
                  <td className="font-bold">ID Perbaikan</td>
                  <td>:</td>
                  <td>{perbaikan.ID_PERBAIKAN}</td>
                </tr>
                <tr>
                  <td className="font-bold">Status Perbaikan</td>
                  <td>:</td>
                  <td>
                    {perbaikan.STATUS === "PENDING"
                      ? "Menunggu verifikasi"
                      : "Diperbaiki"}
                  </td>
                </tr>
                <tr>
                  <td className="font-bold">Tanggal Pengajuan</td>
                  <td>:</td>
                  <td>{convertToDate(perbaikan.TGL_PENGAJUAN)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="w-full items-start justify-center flex flex-col gap-4">
            <p>
              Berikut ini merupakan detail keterangan pengajuan perbaikan alat
            </p>
            <table className="w-full font-medium">
              <thead className="font-bold text-center">
                <tr>
                  <td className="border border-gray-300 px-2 py-2">ID Alat</td>
                  <td className="border border-gray-300 px-2 py-2">
                    Kode Unit Alat
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    Tingkat Kerusakan
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    Jumlah Alat
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    Keterangan
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-2 py-2 border border-gray-300 text-center">
                    {perbaikan.detail_alat.map((detail) => detail.ID_ALAT)[0]}
                  </td>
                  <td className="px-2 py-2 border border-gray-300 text-center">
                    <div className="flex flex-col gap-2">
                      {perbaikan.detail_alat.map((detail) => (
                        <p key={detail.KODE_ALAT}>{detail.KODE_ALAT}</p>
                      ))}
                    </div>
                  </td>
                  <td className="px-2 py-2 border border-gray-300 text-center">
                    {perbaikan.TINGKAT_KERUSAKAN === "BERAT"
                      ? "Rusak Berat"
                      : "Rusak Ringan"}
                  </td>
                  <td className="px-2 py-2 border border-gray-300 text-center">
                    {perbaikan.detail_alat.length}
                  </td>
                  <td className="px-2 py-2 border border-gray-300 text-center">
                    {perbaikan.KETERANGAN}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="w-full flex justify-end items-end">
            <table>
              <thead>
                <tr>
                  <td className="font-bold">
                    Sukabumi, {convertToDateString(currentDate.toDateString())}
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-14"></td>
                </tr>
                <tr>
                  <td className="font-bold text-center">Admin</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {ref && <GeneratePDF html={ref} fileName={perbaikan.ID_PERBAIKAN} />}
      </div>
    );
  }
}
