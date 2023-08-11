"use cient";

import { decimalNumber } from "@/lib/helper";
import Link from "next/link";

interface ComponentProps {
  dataPermintaan: Permintaan[] | null;
}

export default function ListPermintaan({ dataPermintaan }: ComponentProps) {
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

  if (dataPermintaan) {
    if (dataPermintaan.length > 0) {
      return (
        <>
          {dataPermintaan.map((permintaan) => (
            <div
              key={permintaan.ID_PERMINTAAN}
              className="w-full px-2 py-2 rounded-md border border-gray-300 overflow-hidden flex flex-col gap-8"
            >
              {permintaan.KETERANGAN && <b>Catatan: {permintaan.KETERANGAN}</b>}
              {permintaan?.user?.NAME && (
                <b>Permintaan dari: {permintaan?.user?.NAME}</b>
              )}
              <div className="inline-block min-w-full">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-orange-500 text-white font-bold text-center">
                      <tr>
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
                          <td className="whitespace-nowrap p-2 border border-gray-300 w-max shrink-0 flex flex-col gap-2">
                            {permintaan.detail_permintaan_alat.map(
                              (detailPermintaan) => (
                                <p key={detailPermintaan.ID_PERMINTAAN_ALAT}>
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
                                        {detailPermintaan.bahan.NAMA_BAHAN} -{" "}
                                        {detailPermintaan.JUMLAH_BAHAN}{" "}
                                        {detailPermintaan.bahan.UNIT_BAHAN}
                                      </p>
                                    </div>
                                  )}
                                </>
                              )
                            )}
                          </td>
                        )}
                        <td className="whitespace-nowrap p-2 border border-gray-300 text-center">
                          {convertToDate(permintaan.TGL_PENGGUNAAN)}
                        </td>
                        <td className="whitespace-nowrap p-2 border border-gray-300 text-center">
                          {convertToDate(permintaan.TGL_PENGEMBALIAN)}
                        </td>
                        <td className="whitespace-nowrap p-2 border border-gray-300 text-center">
                          {permintaan.STATUS === "DITERIMA"
                            ? "SEDANG DIGUNAKAN"
                            : permintaan.STATUS}
                        </td>
                        <td className="whitespace-nowrap p-2 border border-gray-300 text-center">
                          <Link
                            className="px-2 py-2 rounded-md grid place-items-center overflow-hidden bg-orange-500 text-white"
                            href={`/permintaan/laporan/print/${permintaan.ID_PERMINTAAN}`}
                            target="_blank"
                          >
                            Detail
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ))}
        </>
      );
    } else {
      return (
        <div className="w-full px-2 py-2 grid place-items-center text-gray-500">
          Tidak ada data permintaan ditemukan...
        </div>
      );
    }
  }
}
