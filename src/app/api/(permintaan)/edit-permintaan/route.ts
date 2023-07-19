import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  PERMINTAAN: Permintaan;
  BARANG: BarangPermintaan[];
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

  const alat = body.BARANG.filter(
    (barang) => barang.ID_BARANG.substring(0, 1) === "A"
  );
  const bahan = body.BARANG.filter(
    (barang) => barang.ID_BARANG.substring(0, 1) === "B"
  );

  const barang = alat.concat(bahan);

  const deleteBarang = body.DELETED_BARANG.map((idBarang) => ({
    ID_BARANG: idBarang,
  }));

  const cekDetailPermintaan = async (barang: BarangPermintaan) => {
    const currentPermintaan = await db.detail_permintaan.findFirst({
      where: {
        OR: [
          {
            AND: [
              {
                ID_ALAT: barang.ID_BARANG,
              },
              {
                ID_PERMINTAAN: body.PERMINTAAN.ID_PERMINTAAN,
              },
            ],
          },
          {
            AND: [
              {
                ID_BAHAN: barang.ID_BARANG,
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
            ID_ALAT: barang.ID_BARANG,
          },
          {
            ID_BAHAN: barang.ID_BARANG,
          },
        ],
      },
    });

    const urutan = dataDetailPermintaan.length;

    return currentPermintaan
      ? currentPermintaan.ID_DETAIL_PERMINTAAN
      : kodifikasiDetailPermintaan(barang.ID_BARANG) + "-" + (urutan + 1);
  };

  const barangPromise = barang.map(async (barang) => {
    const idPermintaan = await cekDetailPermintaan(barang);

    return {
      ID_DETAIL_PERMINTAAN: idPermintaan,
      ID_ALAT:
        barang.ID_BARANG.substring(0, 1) === "A" ? barang.ID_BARANG : null,
      JUMLAH_ALAT:
        barang.ID_BARANG.substring(0, 1) === "A"
          ? parseInt(
              body.JUMLAH_BARANG[
                barang.ID_BARANG as keyof typeof body.JUMLAH_BARANG
              ].toString()
            )
          : null,
      ID_BAHAN:
        barang.ID_BARANG.substring(0, 1) === "B" ? barang.ID_BARANG : null,
      JUMLAH_BAHAN:
        barang.ID_BARANG.substring(0, 1) === "B"
          ? parseInt(
              body.JUMLAH_BARANG[
                barang.ID_BARANG as keyof typeof body.JUMLAH_BARANG
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

    if ((alat && alat.length > 0) || (bahan && bahan.length > 0)) {
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
                JUMLAH_ALAT: x.JUMLAH_ALAT || null,
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
