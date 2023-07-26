import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  ID_PERMINTAAN: string;
  ID_TRANSPORTASI: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const updatePermintaan = await db.permintaan.update({
    where: {
      ID_PERMINTAAN: body.ID_PERMINTAAN,
    },
    data: {
      STATUS: "DIKIRIM",
      transportasi: {
        connect: {
          ID_TRANSPORTASI: body.ID_TRANSPORTASI,
        },
        update: {
          where: {
            ID_TRANSPORTASI: body.ID_TRANSPORTASI,
          },
          data: {
            STATUS: "DIPAKAI",
          },
        },
      },
    },
    include: {
      detail_permintaan: {
        include: {
          alat: true,
          bahan: true,
        },
      },
    },
  });

  if (updatePermintaan) {
    const detailPermintaan = updatePermintaan.detail_permintaan;
    for (const detail of detailPermintaan) {
      if (detail && detail.alat) {
        await db.alat.update({
          where: {
            ID_ALAT: detail.alat.ID_ALAT,
          },
          data: {
            ALAT_KELUAR: {
              increment: detail.JUMLAH_ALAT ?? 0,
            },
            JUMLAH_ALAT: {
              decrement: detail.JUMLAH_ALAT ?? 0,
            },
          },
        });
      }

      if (detail && detail.bahan) {
        await db.bahan.update({
          where: {
            ID_BAHAN: detail.bahan.ID_BAHAN,
          },
          data: {
            BAHAN_KELUAR: {
              increment: detail.JUMLAH_BAHAN ?? 0,
            },
            STOCK_BAHAN: {
              decrement: detail.JUMLAH_BAHAN ?? 0,
            },
          },
        });
      }
    }
    return NextResponse.json({
      ok: true,
      message: "Berhasil menugaskan pengiriman",
    });
  } else {
    return NextResponse.json({
      ok: false,
      message: "Terjadi kesalahan ketika menugaskan pengiriman...",
    });
  }
}

export { handler as POST };
