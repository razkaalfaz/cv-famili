"use client";

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

export default function Print({ params }: { params: { id: string } }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { data } = useSWR("/api/get-permintaan/" + params.id, fetcher);

  const currentDate = new Date();

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

  const dataBarang = (detailPermintaan: DetailPermintaan[]) => {
    const alat = detailPermintaan.map((permintaan) => ({
      ID_BARANG: permintaan?.alat?.ID_ALAT,
      NAMA_BARANG: permintaan?.alat?.NAMA_ALAT,
      UNIT_BARANG: permintaan?.alat?.UNIT_ALAT,
      JUMLAH_BARANG: permintaan?.JUMLAH_ALAT,
    }));
    const bahan = detailPermintaan.map((permintaan) => ({
      ID_BARANG: permintaan?.bahan?.ID_BAHAN,
      NAMA_BARANG: permintaan?.bahan?.NAMA_BAHAN,
      UNIT_BARANG: permintaan?.bahan?.UNIT_BAHAN,
      JUMLAH_BARANG: permintaan?.JUMLAH_BAHAN,
    }));
    const barang = alat ? alat.concat(bahan) : bahan.concat(alat);

    return barang.filter((dataBarang) => dataBarang.ID_BARANG !== undefined);
  };

  if (data) {
    const permintaan = data.result as Permintaan;
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
            <b>Laporan Permintaan</b>
            <table className="w-fit">
              <tbody>
                <tr>
                  <td className="font-bold">ID Permintaan</td>
                  <td>:</td>
                  <td>{permintaan.ID_PERMINTAAN}</td>
                </tr>
                <tr>
                  <td className="font-bold">Tanggal Penggunaan</td>
                  <td>:</td>
                  <td>{convertToDate(permintaan.TGL_PENGGUNAAN)}</td>
                </tr>
                <tr>
                  <td className="font-bold">Nama Pengaju</td>
                  <td>:</td>
                  <td>{permintaan.user.NAME}</td>
                </tr>
                <tr>
                  <td className="font-bold">Lokasi Proyek</td>
                  <td>:</td>
                  <td>{permintaan.LOKASI_PROYEK}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="w-full items-start justify-center flex flex-col gap-4">
            <p>
              Berikut ini merupakan daftar barang yang diajukan oleh{" "}
              {permintaan.user.NAME}:
            </p>
            <table className="w-full font-medium">
              <thead className="font-bold text-center">
                <tr>
                  <td className="border border-gray-300 px-2 py-2">No.</td>
                  <td className="border border-gray-300 px-2 py-2">
                    ID Barang
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    Nama Barang
                  </td>
                  <td className="border border-gray-300 px-2 py-2">
                    Jumlah Barang
                  </td>
                </tr>
              </thead>
              <tbody>
                {dataBarang(permintaan.detail_permintaan).map(
                  (barang, index: number) => (
                    <tr key={barang.ID_BARANG}>
                      <td className="px-2 py-2 border border-gray-300 text-center">
                        {index + 1}.
                      </td>
                      <td className="px-2 py-2 border border-gray-300 text-center">
                        {barang.ID_BARANG}
                      </td>
                      <td className="px-2 py-2 border border-gray-300 text-center">
                        {barang.NAMA_BARANG}
                      </td>
                      <td className="px-2 py-2 border border-gray-300 text-center">
                        {barang.JUMLAH_BARANG} {barang.UNIT_BARANG}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>

          <p className="text-justify">
            Laporan ini telah melalui proses evaluasi dan analisis yang teliti
            untuk memastikan keakuratan dan kelayakan dari setiap permintaan
            barang. Setiap item yang dimasukkan dalam laporan ini memiliki
            justifikasi yang jelas dan sesuai dengan kegiatan operasional{" "}
            {permintaan.NAMA_PROYEK} yang berlokasi di{" "}
            {permintaan.LOKASI_PROYEK}.
          </p>

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

        {ref && <GeneratePDF html={ref} fileName={permintaan.ID_PERMINTAAN} />}
      </div>
    );
  }
}
