import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  ID_USER: number;
  ALAT: PermintaanBarang;
  BAHAN: PermintaanBarang;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth();
  const years = currentDate.getFullYear();
  const kodifikasiPermintaanAlat = `P-${day < 10 ? `0${day}` : day}${
    month < 10 ? `0${month + 1}` : month
  }${years}-${body.ID_USER}`;

  async function cekPermintaan() {
    if (body.ALAT) {
      const kodifikasiDetailPermintaanAlat =
        kodifikasiPermintaanAlat + body.ALAT.ID_BARANG;
      const permintaan = await db.permintaan.upsert({
        where: {
          ID_PERMINTAAN: kodifikasiPermintaanAlat,
        },
        create: {
          ID_PERMINTAAN: kodifikasiPermintaanAlat,
          detail_permintaan: {
            connectOrCreate: {
              where: {
                ID_DETAIL_PERMINTAAN: kodifikasiDetailPermintaanAlat,
              },
              create: {
                ID_DETAIL_PERMINTAAN: kodifikasiDetailPermintaanAlat,
                ID_ALAT: body.ALAT.ID_BARANG,
                JUMLAH_ALAT: body.ALAT.JUMLAH_BARANG,
              },
            },
          },
          ID_USER: body.ID_USER,
        },
        update: {
          detail_permintaan: {
            upsert: {
              where: {
                ID_DETAIL_PERMINTAAN: kodifikasiDetailPermintaanAlat,
              },
              create: {
                ID_DETAIL_PERMINTAAN: kodifikasiDetailPermintaanAlat,
                ID_ALAT: body.ALAT.ID_BARANG,
                JUMLAH_ALAT: body.ALAT.JUMLAH_BARANG,
              },
              update: {
                JUMLAH_ALAT: body.ALAT.JUMLAH_BARANG,
              },
            },
          },
          ID_USER: body.ID_USER,
        },
      });
      return permintaan;
    } else if (body.BAHAN) {
      const kodifikasiDetailPermintaanBahan =
        kodifikasiPermintaanAlat + body.BAHAN.ID_BARANG;
      const permintaan = await db.permintaan.upsert({
        where: {
          ID_PERMINTAAN: kodifikasiPermintaanAlat,
        },
        create: {
          ID_PERMINTAAN: kodifikasiPermintaanAlat,
          detail_permintaan: {
            connectOrCreate: {
              where: {
                ID_DETAIL_PERMINTAAN: kodifikasiDetailPermintaanBahan,
              },
              create: {
                ID_DETAIL_PERMINTAAN: kodifikasiDetailPermintaanBahan,
                ID_BAHAN: body.BAHAN.ID_BARANG,
                JUMLAH_BAHAN: body.BAHAN.JUMLAH_BARANG,
              },
            },
          },
          ID_USER: body.ID_USER,
        },
        update: {
          detail_permintaan: {
            upsert: {
              where: {
                ID_DETAIL_PERMINTAAN: kodifikasiDetailPermintaanBahan,
              },
              create: {
                ID_DETAIL_PERMINTAAN: kodifikasiDetailPermintaanBahan,
                ID_BAHAN: body.BAHAN.ID_BARANG,
                JUMLAH_BAHAN: body.BAHAN.JUMLAH_BARANG,
              },
              update: {
                JUMLAH_BAHAN: body.BAHAN.JUMLAH_BARANG,
              },
            },
          },
          ID_USER: body.ID_USER,
        },
      });
      return permintaan;
    } else {
      return null;
    }
  }

  const responsePermintaan = await cekPermintaan();

  if (responsePermintaan) {
    return NextResponse.json({ ok: true, result: responsePermintaan });
  } else {
    return NextResponse.json({ ok: false, result: null });
  }
}

export { handler as POST };
