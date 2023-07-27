import { db } from "@/lib/db";
import { decimalNumber } from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  ID_USER: number;
  BARANG: BarangPermintaan[];
  NAMA_PROYEK: string;
  LOKASI_PROYEK: string;
  TGL_PENGGUNAAN: Date;
  TGL_PENGEMBALIAN: Date;
  JUMLAH_BARANG: { ID_BARANG: string; JUMLAH: number };
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  try {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth();
    const years = currentDate.getFullYear();
    const kodifikasiPermintaan = `P-${day < 10 ? `0${day}` : day}${
      month < 10 ? `0${month + 1}` : month
    }${years}-${body.ID_USER}`;
    const kodifikasiDetailPermintaan = (ID_BARANG: string) =>
      kodifikasiPermintaan + "-" + ID_BARANG;

    const alat = body.BARANG.filter(
      (barang) => barang.ID_BARANG.substring(0, 1) === "A"
    );
    const bahan = body.BARANG.filter(
      (barang) => barang.ID_BARANG.substring(0, 1) === "B"
    );

    const barang = alat.concat(bahan);

    const cekDetailPermintaan = async (ID_BARANG: string) => {
      const dataDetailPermintaan = await db.detail_permintaan.aggregate({
        where: {
          OR: [
            {
              ID_ALAT: ID_BARANG,
            },
            {
              ID_BAHAN: ID_BARANG,
            },
          ],
        },
        _max: {
          ID_DETAIL_PERMINTAAN: true,
        },
      });

      const maxValue = dataDetailPermintaan._max.ID_DETAIL_PERMINTAAN;
      const urutan = Number(
        maxValue?.substring(maxValue.length - 2, maxValue.length)
      );

      return (
        kodifikasiDetailPermintaan(ID_BARANG) +
        "-" +
        decimalNumber(urutan ? urutan + 1 : 1)
      );
    };

    const barangPromise = barang.map(async (barang) => {
      const idPermintaan = await cekDetailPermintaan(barang.ID_BARANG);

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
      const dataPermintaan = await db.permintaan.findMany({
        where: {
          ID_USER: body.ID_USER,
        },
      });

      const urutan = dataPermintaan.length;

      const getBarang = Promise.all(barangPromise).then((res) => {
        return res;
      });

      const value = await getBarang;

      if ((alat && alat.length > 0) || (bahan && bahan.length > 0)) {
        const ajukanBarang = await db.permintaan.create({
          data: {
            ID_PERMINTAAN: kodifikasiPermintaan + "-" + (urutan + 1),
            ID_USER: body.ID_USER,
            NAMA_PROYEK: body.NAMA_PROYEK,
            LOKASI_PROYEK: body.LOKASI_PROYEK,
            TGL_PENGGUNAAN: new Date(body.TGL_PENGGUNAAN),
            TGL_PENGEMBALIAN: new Date(body.TGL_PENGEMBALIAN),
            detail_permintaan: {
              createMany: {
                data: value,
              },
            },
          },
        });

        return ajukanBarang;
      } else {
        return null;
      }
    };

    const responsePermintaan = await cekPermintaan();

    if (responsePermintaan) {
      return NextResponse.json({ ok: true, result: responsePermintaan });
    } else {
      return NextResponse.json({ ok: false, result: null });
    }
  } catch (err) {
    console.error(err);
  }
}

export { handler as POST };
