import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  ID_PERMINTAAN: string;
  STATUS: keyof typeof StatusPermintaan;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const permintaan = await db.permintaan.findUnique({
    where: {
      ID_PERMINTAAN: body.ID_PERMINTAAN,
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

  if (permintaan && body.STATUS === "DITERIMA") {
    const detailPermintaan = permintaan.detail_permintaan;
    for (const detail of detailPermintaan) {
      if (detail && detail.alat) {
        await db.alat.update({
          where: {
            ID_ALAT: detail.alat.ID_ALAT,
          },
          data: {
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

    const updateStatusPermintaan = await db.permintaan.update({
      where: {
        ID_PERMINTAAN: body.ID_PERMINTAAN,
      },
      data: {
        STATUS: "DITERIMA",
      },
    });

    if (updateStatusPermintaan) {
      return NextResponse.json({
        ok: true,
        message: "Berhasil merubah status permintaan.",
      });
    } else {
      return NextResponse.json({ ok: false, message: "Terjadi kesalahan..." });
    }
  } else {
    const updatePermintaan = await db.permintaan.update({
      where: {
        ID_PERMINTAAN: body.ID_PERMINTAAN,
      },
      data: {
        STATUS: "DIVERIFIKASI",
      },
    });

    if (updatePermintaan) {
      return NextResponse.json({
        ok: true,
        message: "Berhasil merubah status permintaan.",
      });
    } else {
      return NextResponse.json({ ok: false, message: "Terjadi kesalahan..." });
    }
  }
}

export { handler as POST };
