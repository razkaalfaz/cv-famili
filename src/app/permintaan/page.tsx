"use client";

import { fetcher } from "@/lib/helper";
import { useSession } from "next-auth/react";
import useSWR from "swr";

export default function Permintaan() {
  const { data: session } = useSession();

  const userId = session ? session.user.USER_ID : null;

  function convertToDate(value: any) {
    const date = new Date(value);
    const dateToReturn = date.toLocaleDateString();
    return dateToReturn;
  }

  const {
    data: dataPermintaan,
    error,
    isLoading,
    isValidating,
  } = useSWR(
    session?.user.ROLE === "ADMIN"
      ? "/api/semua_permintaan"
      : "/api/permintaan-user/" + userId,
    fetcher
  );

  if (isLoading || isValidating) {
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

                <div className="flex flex-col gap-4">
                  <b className="text-lg">Daftar barang yang di ajukan:</b>
                  <div className="flex flex-col gap-2">
                    {permintaan.detailPermintaan.map(
                      (detailPermintaan: DetailPermintaan) => (
                        <div
                          key={detailPermintaan.ID_DETAIL_PERMINTAAN}
                          className="flex flex-col gap-4"
                        >
                          <div className="flex flex-row gap-2 items-center">
                            <b>
                              {detailPermintaan.alat?.NAMA_ALAT ||
                                detailPermintaan.bahan?.NAMA_BAHAN}
                            </b>
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
              </div>

              <b>Status permintaan: {permintaan.STATUS}</b>
            </div>
          ))}
        </div>
      );
    } else {
      return (
        <div className="px-8 py-8 text-gray-500">Tidak ada data permintaan</div>
      );
    }
  }
}
