"use cient";

import { VARIABEL_PERMINTAAN } from "@/lib/constants";
import { decimalNumber } from "@/lib/helper";
import Button from "../button/Button";
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

  const variabelTabel = () => {
    const variabel = VARIABEL_PERMINTAAN.filter((x) => x.id !== "number");

    return variabel;
  };

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
              <table className="w-full">
                <thead>
                  <tr>
                    {variabelTabel().map((variabel) => (
                      <td
                        className="px-2 py-2 bg-orange-500 text-white text-center border border-gray-300 font-bold"
                        key={variabel.id}
                      >
                        {variabel.name}
                      </td>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-2 py-2 border border-gray-300">
                      {permintaan.ID_PERMINTAAN}
                    </td>
                    <td className="px-2 py-2 border border-gray-300">
                      {permintaan.NAMA_PROYEK}
                    </td>
                    <td className="px-2 py-2 border border-gray-300">
                      {permintaan.LOKASI_PROYEK}
                    </td>
                    <td className="px-2 py-2 border border-gray-300">
                      {permintaan.detail_permintaan.map((detailPermintaan) => (
                        <>
                          {detailPermintaan.detail_alat && (
                            <div
                              key={detailPermintaan.ID_DETAIL_PERMINTAAN}
                              className="flex flex-row gap-2 items-center"
                            >
                              <p>{detailPermintaan?.detail_alat?.KODE_ALAT}</p>
                              <div className="w-4 h-px bg-gray-300" />
                              <p>
                                {detailPermintaan?.detail_alat.alat.UNIT_ALAT}
                              </p>
                            </div>
                          )}
                        </>
                      ))}
                    </td>
                    <td className="px-2 py-2 border border-gray-300">
                      {permintaan.detail_permintaan.map((detailPermintaan) => (
                        <>
                          {detailPermintaan.bahan && (
                            <div
                              key={detailPermintaan.ID_DETAIL_PERMINTAAN}
                              className="flex flex-row gap-2 items-center"
                            >
                              <p>{detailPermintaan?.bahan?.NAMA_BAHAN}</p>
                              <div className="w-4 h-px bg-gray-300" />
                              <p>{detailPermintaan?.JUMLAH_BAHAN}</p>
                              <p>{detailPermintaan?.bahan?.UNIT_BAHAN}</p>
                            </div>
                          )}
                        </>
                      ))}
                    </td>
                    <td className="px-2 py-2 border border-gray-300 text-center">
                      {convertToDate(permintaan.TGL_PENGGUNAAN)}
                    </td>
                    <td className="px-2 py-2 border border-gray-300 text-center">
                      {convertToDate(permintaan.TGL_PENGEMBALIAN)}
                    </td>
                    <td className="px-2 py-2 border border-gray-300 text-center">
                      {permintaan.STATUS === "DITERIMA"
                        ? "SEDANG DIGUNAKAN"
                        : permintaan.STATUS}
                    </td>
                    <td className="px-2 py-2 border border-gray-300 text-center">
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
