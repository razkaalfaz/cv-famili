import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  ID_PERMINTAAN: string;
  ID_TRANSPORTASI: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();
  const currentDate = new Date();

  const updatePermintaan = await db.permintaan.update({
    where: {
      ID_PERMINTAAN: body.ID_PERMINTAAN,
    },
    data: {
      STATUS: "DITERIMA",
      TGL_PENGGUNAAN: currentDate,
      transportasi: {
        update: {
          where: {
            ID_TRANSPORTASI: body.ID_TRANSPORTASI,
          },
          data: {
            STATUS: "TERSEDIA",
          },
        },
        disconnect: {
          ID_PERMINTAAN: body.ID_PERMINTAAN,
        },
      },
    },
    include: {
      detail_permintaan: {
        select: {
          detail_alat: {
            select: {
              KODE_ALAT: true,
            },
          },
        },
      },
    },
  });

  if (updatePermintaan) {
    for (const detail of updatePermintaan.detail_permintaan) {
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
    }

    return NextResponse.json({
      ok: true,
      message: "Berhasil menerima permintaan.",
    });
  } else {
    return NextResponse.json({
      ok: false,
      message: "Terjadi kesalahan saat menerima permintaan...",
    });
  }
}

export { handler as POST };
