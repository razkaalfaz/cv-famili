"use client";

import Button from "@/components/button/Button";
import { convertToDate, fetcher } from "@/lib/helper";
import Link from "next/link";
import useSWR from "swr";

export default function ListLaporanPengajuanAlat() {
  const {
    data: listPengajuanAlat,
    isLoading: loadingListPengajuanAlat,
    error,
  } = useSWR("/api/list-pengajuan-alat", fetcher);

  const variabelTabel = [
    "No.",
    "ID Pengajuan",
    "Tanggal Pengajuan",
    "Nama Alat",
    "Jumlah Alat",
    "Deskripsi",
    "Aksi",
  ];

  const tabelDataStyles = "px-2 py-2 border border-gray-300";

  if (error) {
    return (
      <div className="w-full grid place-items-center text-gray-500">
        Gagal mendapatkan list pengajuan alat
      </div>
    );
  } else {
    return (
      <table>
        <thead>
          <tr className="bg-orange-500 text-white font-bold">
            {variabelTabel.map((variabel: string, index: number) => (
              <td
                className="px-2 py-2 text-center border border-gray-300"
                key={index}
              >
                {variabel}
              </td>
            ))}
          </tr>
        </thead>

        <tbody>
          {listPengajuanAlat && (
            <>
              {listPengajuanAlat?.result?.length > 0 && (
                <>
                  {listPengajuanAlat?.result?.map(
                    (pengajuan: PengajuanAlatBaru, index: number) => (
                      <tr key={pengajuan.ID_PENGAJUAN}>
                        <td className={tabelDataStyles + " text-center"}>
                          {index + 1}.
                        </td>
                        <td className={tabelDataStyles + " text-center"}>
                          {pengajuan.ID_PENGAJUAN}
                        </td>
                        <td className={tabelDataStyles + " text-center"}>
                          {convertToDate(pengajuan.TGL_PENGAJUAN)}
                        </td>
                        <td className={tabelDataStyles}>
                          {pengajuan.NAMA_ALAT}
                        </td>
                        <td className={tabelDataStyles + " text-center"}>
                          {pengajuan.JUMLAH_ALAT}
                        </td>
                        <td className={tabelDataStyles}>
                          {pengajuan.DESKRIPSI}
                        </td>
                        <td className={tabelDataStyles}>
                          <Link
                            className="px-2 py-2 grid place-items-center bg-orange-500 text-white rounded-md"
                            href={
                              "/laporan_pengajuan_alat/print/" +
                              pengajuan.ID_PENGAJUAN
                            }
                            target="_blank"
                          >
                            Detail
                          </Link>
                        </td>
                      </tr>
                    )
                  )}
                </>
              )}

              {listPengajuanAlat?.result === null ||
                (listPengajuanAlat?.result?.length < 1 && (
                  <div className="w-full grid place-items-center text-gray-500">
                    Tidak ada data pengajuan alat baru...
                  </div>
                ))}
            </>
          )}

          {loadingListPengajuanAlat && (
            <>
              <tr>
                <td className={tabelDataStyles}>
                  <div className="w-full h-8 rounded-md animate-pulse bg-gray-300" />
                </td>
                <td className={tabelDataStyles}>
                  <div className="w-full h-8 rounded-md animate-pulse bg-gray-300" />
                </td>
                <td className={tabelDataStyles}>
                  <div className="w-full h-8 rounded-md animate-pulse bg-gray-300" />
                </td>
                <td className={tabelDataStyles}>
                  <div className="w-full h-8 rounded-md animate-pulse bg-gray-300" />
                </td>
                <td className={tabelDataStyles}>
                  <div className="w-full h-8 rounded-md animate-pulse bg-gray-300" />
                </td>
                <td className={tabelDataStyles}>
                  <div className="w-full h-8 rounded-md animate-pulse bg-gray-300" />
                </td>
                <td className={tabelDataStyles}>
                  <div className="w-full h-8 rounded-md animate-pulse bg-gray-300" />
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    );
  }
}
