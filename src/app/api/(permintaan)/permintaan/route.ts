import { db } from "@/lib/db";
import { decimalNumber } from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  ID_USER: number;
  SELECTED_ALAT: string[];
  SELECTED_BAHAN: string[];
  NAMA_PROYEK: string;
  LOKASI_PROYEK: string;
  TGL_PENGGUNAAN: Date;
  TGL_PENGEMBALIAN: Date;
  JUMLAH_BAHAN: { ID_BARANG: string; JUMLAH: number };
  JUMLAH_ALAT: { ID_BARANG: string; JUMLAH: number };
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth();
  const years = currentDate.getFullYear();
  const kodifikasiPermintaan = `P-${day < 10 ? `0${day}` : day}${
    month < 10 ? `0${month + 1}` : month
  }${years}-${body.ID_USER}`;
  const kodifikasiDetailPermintaan = (ID_BARANG: string) =>
    kodifikasiPermintaan + "-" + ID_BARANG;

  try {
    const detailPermintaanHandler = async () => {
      const cekDetailPermintaan = async (ID_BARANG: string) => {
        const dataDetailPermintaan = await db.detail_permintaan.aggregate({
          where: {
            ID_BAHAN: ID_BARANG,
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

      const createDetailPermintaan = body.SELECTED_BAHAN.map(async (id) => {
        const idPermintaan = await cekDetailPermintaan(id);

        return {
          where: {
            ID_DETAIL_PERMINTAAN: idPermintaan,
          },
          create: {
            ID_BAHAN: id,
            ID_DETAIL_PERMINTAAN: idPermintaan,
            JUMLAH_BAHAN: parseInt(
              body.JUMLAH_BAHAN[id as keyof typeof body.JUMLAH_BAHAN].toString()
            ),
          },
        };
      });

      return await Promise.all(createDetailPermintaan).then((res) => res);
    };

    const detailPermintaanAlatHandler = async () => {
      const cekDetailPermintaanAlat = async (ID_ALAT: string) => {
        const dataDetailPermintaanAlat =
          await db.detail_permintaan_alat.aggregate({
            where: {
              ID_ALAT: ID_ALAT,
            },
            _max: {
              ID_PERMINTAAN_ALAT: true,
            },
          });

        const maxValue = dataDetailPermintaanAlat._max.ID_PERMINTAAN_ALAT;
        const urutan = Number(
          maxValue?.substring(maxValue.length - 2, maxValue.length)
        );

        return (
          kodifikasiDetailPermintaan(ID_ALAT) +
          "-" +
          decimalNumber(urutan ? urutan + 1 : 1)
        );
      };

      const createDetailPermintaan = body.SELECTED_ALAT.map(async (id) => {
        const idPermintaan = await cekDetailPermintaanAlat(id);

        return {
          where: {
            ID_PERMINTAAN_ALAT: idPermintaan,
          },
          create: {
            ID_PERMINTAAN_ALAT: idPermintaan,
            ID_ALAT: id,
            JUMLAH_ALAT: parseInt(
              body.JUMLAH_ALAT[id as keyof typeof body.JUMLAH_ALAT].toString()
            ),
          },
        };
      });

      return await Promise.all(createDetailPermintaan).then((res) => res);
    };

    const currentPermintaan = await db.permintaan.aggregate({
      _max: {
        ID_PERMINTAAN: true,
      },
    });

    const permintaanMaxValue = currentPermintaan._max.ID_PERMINTAAN;
    const urutanPermintaan = Number(
      permintaanMaxValue?.substring(
        permintaanMaxValue.length - 2,
        permintaanMaxValue.length
      )
    );

    const detailPermintaan = await detailPermintaanHandler();
    const detailPermintaanAlat = await detailPermintaanAlatHandler();

    const newPermintaan = await db.permintaan.create({
      data: {
        ID_PERMINTAAN:
          kodifikasiPermintaan +
          "-" +
          decimalNumber(urutanPermintaan ? urutanPermintaan + 1 : 1),
        ID_USER: body.ID_USER,
        LOKASI_PROYEK: body.LOKASI_PROYEK,
        NAMA_PROYEK: body.NAMA_PROYEK,
        TGL_PENGGUNAAN: new Date(body.TGL_PENGGUNAAN),
        TGL_PENGEMBALIAN: new Date(body.TGL_PENGEMBALIAN),
        detail_permintaan: {
          connectOrCreate: detailPermintaan,
        },
        detail_permintaan_alat: {
          connectOrCreate: detailPermintaanAlat,
        },
      },
    });

    if (newPermintaan) {
      return NextResponse.json({ ok: true, result: newPermintaan });
    } else {
      return NextResponse.json({ ok: false, result: null });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, result: null });
  }
}

export { handler as POST };
