import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  PERMINTAAN: Permintaan;
  SELECTED_ALAT: string[];
  SELECTED_BAHAN: string[];
  NAMA_PROYEK: string;
  LOKASI_PROYEK: string;
  TGL_PENGGUNAAN: Date;
  TGL_PENGEMBALIAN: Date;
  JUMLAH_BARANG: { ID_BARANG: string; JUMLAH: number };
  DELETED_BARANG: string[];
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const kodifikasiDetailPermintaan = (ID_BARANG: string) =>
    body.PERMINTAAN.ID_PERMINTAAN + "-" + ID_BARANG;

  const barang =
    body.SELECTED_ALAT.concat(body.SELECTED_BAHAN) ??
    body.SELECTED_BAHAN.concat(body.SELECTED_ALAT);

  const cekDetailPermintaan = async (barang: string) => {
    const currentPermintaan = await db.detail_permintaan.findFirst({
      where: {
        OR: [
          {
            AND: [
              {
                ID_ALAT: barang,
              },
              {
                ID_PERMINTAAN: body.PERMINTAAN.ID_PERMINTAAN,
              },
            ],
          },
          {
            AND: [
              {
                ID_BAHAN: barang,
              },
              {
                ID_PERMINTAAN: body.PERMINTAAN.ID_PERMINTAAN,
              },
            ],
          },
        ],
      },
    });

    const dataDetailPermintaan = await db.detail_permintaan.findMany({
      where: {
        OR: [
          {
            ID_ALAT: barang,
          },
          {
            ID_BAHAN: barang,
          },
        ],
      },
    });

    const urutan = dataDetailPermintaan.length;

    return currentPermintaan
      ? currentPermintaan.ID_DETAIL_PERMINTAAN
      : kodifikasiDetailPermintaan(barang) + "-" + (urutan + 1);
  };

  const barangPromise = barang.map(async (barang) => {
    const idPermintaan = await cekDetailPermintaan(barang);

    return {
      ID_DETAIL_PERMINTAAN: idPermintaan,
      ID_ALAT: barang.substring(0, 1) !== "B" ? barang : null,
      ID_BAHAN: barang.substring(0, 1) === "B" ? barang : null,
      JUMLAH_BAHAN:
        barang.substring(0, 1) === "B"
          ? parseInt(
              body.JUMLAH_BARANG[
                barang as keyof typeof body.JUMLAH_BARANG
              ].toString()
            )
          : null,
    };
  });

  const cekPermintaan = async () => {
    const getBarang = Promise.all(barangPromise).then((res) => {
      return res;
    });

    const value = await getBarang;

    if (
      (body.SELECTED_ALAT && body.SELECTED_ALAT.length > 0) ||
      (body.SELECTED_BAHAN && body.SELECTED_BAHAN.length > 0)
    ) {
      const ajukanBarang = await db.permintaan.update({
        where: {
          ID_PERMINTAAN: body.PERMINTAAN.ID_PERMINTAAN,
        },
        data: {
          NAMA_PROYEK: body.NAMA_PROYEK,
          LOKASI_PROYEK: body.LOKASI_PROYEK,
          TGL_PENGGUNAAN: new Date(body.TGL_PENGGUNAAN),
          TGL_PENGEMBALIAN: new Date(body.TGL_PENGEMBALIAN),
          detail_permintaan: {
            upsert: value.map((x) => ({
              where: {
                ID_DETAIL_PERMINTAAN: x.ID_DETAIL_PERMINTAAN,
              },
              create: x,
              update: {
                JUMLAH_BAHAN: x.JUMLAH_BAHAN || null,
                ID_ALAT: x.ID_ALAT || null,
                ID_BAHAN: x.ID_BAHAN || null,
              },
            })),
            deleteMany: body.DELETED_BARANG.map((idBarang) => ({
              OR: [
                {
                  ID_ALAT: idBarang,
                },
                {
                  ID_BAHAN: idBarang,
                },
              ],
            })),
          },
        },
      });

      return ajukanBarang;
    } else {
      return null;
    }
  };

  try {
    const updatePermintaan = await cekPermintaan();

    if (updatePermintaan) {
      return NextResponse.json({
        ok: true,
        message: "Berhasil mengubah data permintaan.",
      });
    } else {
      return NextResponse.json({
        ok: false,
        message: "Terjadi kesalahan ketika mengubah data permintaan...",
      });
    }
  } catch (err) {
    console.error(err);
  }
}

export { handler as PATCH };
