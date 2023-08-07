"use client";

import { useState } from "react";
import Button from "../button/Button";
import Link from "next/link";

interface ComponentProps {
  dataAlat: Alat[];
}

export default function ListConditionalAlat({ dataAlat }: ComponentProps) {
  const [listOptions, setListOptions] = useState("all");

  const listAlat = () => {
    if (dataAlat) {
      const detailAlat: IDetailAlat[] = dataAlat.flatMap(
        (alat: Alat) => alat.detail_alat
      );
      const alatDigunakan = detailAlat.filter(
        (detail) => detail.STATUS === "DIGUNAKAN"
      );
      const alatRusak = detailAlat.filter(
        (detail) => detail.STATUS === "RUSAK"
      );
      const alatTersedia = detailAlat.filter(
        (detail) => detail.STATUS === "TERSEDIA"
      );
      const alatPengajuan = detailAlat.filter(
        (detail) => detail.STATUS === "PENGAJUAN"
      );

      switch (listOptions) {
        case "all":
          return detailAlat;
        case "digunakan":
          return alatDigunakan;
        case "tersedia":
          return alatTersedia;
        case "rusak":
          return alatRusak;
        case "pengajuan":
          return alatPengajuan;
        default:
          return detailAlat;
      }
    } else {
      return [];
    }
  };

  const tdStyles = "p-2 border border-gray-300";

  if (dataAlat) {
    return (
      <div className="w-full flex flex-col gap-4">
        <div className="w-full flex flex-row justify-between gap-4 items-center">
          <Button
            variants={listOptions === "all" ? "PRIMARY" : "SECONDARY"}
            fullWidth
            onClick={() => setListOptions("all")}
          >
            Semua
          </Button>
          <Button
            variants={listOptions === "digunakan" ? "PRIMARY" : "SECONDARY"}
            fullWidth
            onClick={() => setListOptions("digunakan")}
          >
            Digunakan
          </Button>
          <Button
            variants={listOptions === "tersedia" ? "PRIMARY" : "SECONDARY"}
            fullWidth
            onClick={() => setListOptions("tersedia")}
          >
            Tersedia
          </Button>
          <Button
            variants={listOptions === "pengajuan" ? "PRIMARY" : "SECONDARY"}
            fullWidth
            onClick={() => setListOptions("pengajuan")}
          >
            Pengajuan
          </Button>
          <Button
            variants={listOptions === "rusak" ? "PRIMARY" : "SECONDARY"}
            fullWidth
            onClick={() => setListOptions("rusak")}
          >
            Rusak
          </Button>
        </div>

        <table>
          <thead className="bg-orange-500 text-white font-bold text-center">
            <tr>
              <td className={tdStyles}>No.</td>
              <td className={tdStyles}>ID Alat</td>
              <td className={tdStyles}>Nama Alat</td>
              <td className={tdStyles}>Kode Unit Alat</td>
              <td className={tdStyles}>Status Alat</td>
              <td className={tdStyles}>Detail Kerusakan</td>
            </tr>
          </thead>

          <tbody>
            {listAlat().length < 1 ? (
              <tr>
                <td>Tidak ada data alat dalam status ini...</td>
              </tr>
            ) : (
              <>
                {listAlat().map((detail, index: number) => (
                  <tr key={detail.KODE_ALAT}>
                    <td className={tdStyles + " text-center"}>{index + 1}.</td>
                    <td className={tdStyles + " text-center"}>
                      {detail.ID_ALAT}
                    </td>
                    <td className={tdStyles}>{detail.alat.NAMA_ALAT}</td>
                    <td className={tdStyles + " text-center"}>
                      {detail.KODE_ALAT}
                    </td>
                    <td className={tdStyles + " text-center"}>
                      {detail.STATUS}
                    </td>
                    {detail.STATUS === "RUSAK" ? (
                      <td className={tdStyles + " text-center"}>
                        <Link
                          className="rounded-md p-2 bg-green-950 text-white grid place-items-center"
                          href={"/laporan-perbaikan/detail/" + detail.KODE_ALAT}
                        >
                          Detail
                        </Link>
                      </td>
                    ) : (
                      <td className={tdStyles + " text-center"}>-</td>
                    )}
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>
    );
  } else {
    return (
      <div className="w-full grid place-items-center text-gray-500 italic">
        Tidak ada data alat...
      </div>
    );
  }
}
