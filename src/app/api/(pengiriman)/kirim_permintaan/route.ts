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
          detail_alat: {
            include: {
              alat: true,
            },
          },
          bahan: true,
        },
      },
    },
  });

  if (updatePermintaan) {
    const detailPermintaan = updatePermintaan.detail_permintaan;
    for (const detail of detailPermintaan) {
      if (detail && detail.detail_alat) {
        await db.detail_alat.update({
          where: {
            KODE_ALAT: detail.detail_alat.KODE_ALAT,
          },
          data: {
            STATUS: "DIGUNAKAN",
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
