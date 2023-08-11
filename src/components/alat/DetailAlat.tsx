"use client";

import { useState } from "react";
import Button from "../button/Button";
import Link from "next/link";

interface ComponentProps {
  dataAlat: Alat;
}

export default function DetailAlatComponent({ dataAlat }: ComponentProps) {
  const [condition, setCondition] = useState("all");
  const tdStyles = "p-2 border border-gray-300";

  function showDetailAlat() {
    const semuaDetail = dataAlat.detail_alat;
    const detailDigunakan = dataAlat.detail_alat.filter(
      (detail) => detail.STATUS === "DIGUNAKAN"
    );
    const detailTersedia = dataAlat.detail_alat.filter(
      (detail) => detail.STATUS === "TERSEDIA"
    );
    const detailRusak = dataAlat.detail_alat.filter(
      (detail) => detail.STATUS === "RUSAK"
    );
    const detailPengajuan = dataAlat.detail_alat.filter(
      (detail) => detail.STATUS === "PENGAJUAN"
    );
    switch (condition) {
      case "all":
        return semuaDetail;
      case "digunakan":
        return detailDigunakan;
      case "tersedia":
        return detailTersedia;
      case "rusak":
        return detailRusak;
      case "pengajuan":
        return detailPengajuan;
      default:
        return semuaDetail;
    }
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex flex-row justify-between gap-4 items-center">
        <Button
          variants={condition === "all" ? "PRIMARY" : "SECONDARY"}
          fullWidth
          onClick={() => setCondition("all")}
        >
          Semua
        </Button>
        <Button
          variants={condition === "digunakan" ? "PRIMARY" : "SECONDARY"}
          fullWidth
          onClick={() => setCondition("digunakan")}
        >
          Digunakan
        </Button>
        <Button
          variants={condition === "tersedia" ? "PRIMARY" : "SECONDARY"}
          fullWidth
          onClick={() => setCondition("tersedia")}
        >
          Tersedia
        </Button>
        <Button
          variants={condition === "pengajuan" ? "PRIMARY" : "SECONDARY"}
          fullWidth
          onClick={() => setCondition("pengajuan")}
        >
          Pengajuan
        </Button>
        <Button
          variants={condition === "rusak" ? "PRIMARY" : "SECONDARY"}
          fullWidth
          onClick={() => setCondition("rusak")}
        >
          Rusak
        </Button>
      </div>

      <table>
        <thead className="bg-orange-500 text-white font-bold text-center">
          <tr>
            <td className={tdStyles}>No.</td>
            <td className={tdStyles}>Kode Unit Alat</td>
            <td className={tdStyles}>Status Alat</td>
            {condition === "rusak" && (
              <>
                <td className={tdStyles}>ID Perbaikan</td>
                <td className={tdStyles}>Detail Kerusakan</td>
              </>
            )}
            {(condition === "pengajuan" || condition === "digunakan") && (
              <td className={tdStyles}>ID Permintaan</td>
            )}

            {condition === "all" && (
              <>
                <td className={tdStyles}>ID Permintaan</td>
                <td className={tdStyles}>ID Perbaikan</td>
                <td className={tdStyles}>Detail Kerusakan</td>
              </>
            )}
          </tr>
        </thead>

        <tbody>
          {showDetailAlat().length < 1 ? (
            <tr>
              <td>Tidak ada data alat dalam status ini...</td>
            </tr>
          ) : (
            <>
              {showDetailAlat().map((detail, index: number) => (
                <tr key={detail.KODE_ALAT}>
                  <td className={tdStyles + " text-center"}>{index + 1}.</td>
                  <td className={tdStyles + " text-center"}>
                    {detail.KODE_ALAT}
                  </td>
                  <td className={tdStyles + " text-center"}>{detail.STATUS}</td>
                  {condition === "rusak" && (
                    <>
                      <td className={tdStyles}>
                        {detail.perbaikan ? detail.perbaikan.ID_PERBAIKAN : "-"}
                      </td>
                      {detail.STATUS === "RUSAK" ? (
                        <td className={tdStyles + " text-center"}>
                          <Link
                            className="rounded-md p-2 bg-green-950 text-white grid place-items-center"
                            href={
                              "/laporan-perbaikan/detail/" + detail.KODE_ALAT
                            }
                          >
                            Detail
                          </Link>
                        </td>
                      ) : (
                        <td className={tdStyles + " text-center"}>-</td>
                      )}
                    </>
                  )}

                  {(condition === "pengajuan" || condition === "digunakan") && (
                    <td className={tdStyles}>
                      {detail.detail_permintaan
                        ? detail.detail_permintaan.map((x) => x.ID_PERMINTAAN)
                        : "-"}
                    </td>
                  )}

                  {condition === "all" && (
                    <>
                      <td className={tdStyles}>
                        {detail.detail_permintaan &&
                        detail.detail_permintaan.length > 0
                          ? detail.detail_permintaan.map((x) => x.ID_PERMINTAAN)
                          : "-"}
                      </td>
                      <td className={tdStyles}>
                        {detail.perbaikan ? detail.perbaikan.ID_PERBAIKAN : "-"}
                      </td>
                      {detail.STATUS === "RUSAK" ? (
                        <td className={tdStyles + " text-center"}>
                          <Link
                            className="rounded-md p-2 bg-green-950 text-white grid place-items-center"
                            href={
                              "/laporan-perbaikan/detail/" + detail.KODE_ALAT
                            }
                          >
                            Detail
                          </Link>
                        </td>
                      ) : (
                        <td className={tdStyles + " text-center"}>-</td>
                      )}
                    </>
                  )}
                </tr>
              ))}
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}
