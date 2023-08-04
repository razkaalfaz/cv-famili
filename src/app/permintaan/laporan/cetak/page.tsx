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

export default function Print() {
  const ref = useRef<HTMLDivElement | null>(null);
  const { data } = useSWR("/api/semua_permintaan", fetcher);
  const tdHeaderStyles = "p-2 text-center border border-gray-300 font-bold";
  const tdStyles = "p-2 border border-gray-300";

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
      ID_BARANG: permintaan?.detail_alat?.KODE_ALAT,
      NAMA_BARANG: permintaan?.detail_alat?.alat.NAMA_ALAT,
      UNIT_BARANG: permintaan?.detail_alat?.alat.UNIT_ALAT,
      JUMLAH_BARANG: 0,
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
    const permintaan = data.result as Permintaan[];
    const permintaanToShow = permintaan.filter(
      (permintaan) => permintaan.STATUS === "DIKEMBALIKAN"
    );
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

          <table>
            <thead>
              <tr>
                <td className={tdHeaderStyles}>No.</td>
                <td className={tdHeaderStyles}>ID Permintaan</td>
                <td className={tdHeaderStyles}>Nama Proyek</td>
                <td className={tdHeaderStyles}>Nama Kepala Proyek</td>
                <td className={tdHeaderStyles}>Lokasi Proyek</td>
                <td className={tdHeaderStyles}>List Barang</td>
                <td className={tdHeaderStyles}>Tanggal Penggunaan</td>
                <td className={tdHeaderStyles}>Tanggal Pengembalian</td>
              </tr>
            </thead>

            <tbody>
              {permintaanToShow.length > 0 &&
                permintaanToShow.map((permintaan, index: number) => (
                  <tr key={permintaan.ID_PERMINTAAN}>
                    <td className={tdStyles + " text-center"}>{index + 1}.</td>
                    <td className={tdStyles + " text-center"}>
                      {permintaan.ID_PERMINTAAN}
                    </td>
                    <td className={tdStyles}>{permintaan.NAMA_PROYEK}</td>
                    <td className={tdStyles}>{permintaan.user.NAME}</td>
                    <td className={tdStyles}>{permintaan.LOKASI_PROYEK}</td>
                    <td className={tdStyles}>
                      {dataBarang(permintaan.detail_permintaan).map(
                        (barang) => (
                          <div
                            className="flex flex-col gap-2"
                            key={barang.ID_BARANG}
                          >
                            <p>
                              {barang.ID_BARANG} - {barang.NAMA_BARANG}{" "}
                              {barang.JUMLAH_BARANG !== 0
                                ? `- ${barang.JUMLAH_BARANG} ${barang.UNIT_BARANG}`
                                : ""}
                            </p>
                          </div>
                        )
                      )}
                    </td>
                    <td className={tdStyles + " text-center"}>
                      {convertToDate(permintaan.TGL_PENGGUNAAN)}
                    </td>
                    <td className={tdStyles + " text-center"}>
                      {convertToDate(permintaan.TGL_PENGEMBALIAN)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <p className="text-justify">
            Laporan ini telah melalui proses evaluasi dan analisis yang teliti
            untuk memastikan keakuratan dan kelayakan dari setiap permintaan
            barang. Setiap item yang dimasukkan dalam laporan ini memiliki
            justifikasi yang jelas dan sesuai dengan kegiatan operasional yang
            dilakukan oleh kepala proyek.
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

        {ref && (
          <GeneratePDF
            html={ref}
            fileName={"laporan-pengajuan-alat-dan-bahan"}
          />
        )}
      </div>
    );
  }
}
