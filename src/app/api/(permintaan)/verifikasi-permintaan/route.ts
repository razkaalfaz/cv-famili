import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  ID_PERMINTAAN: string;
  STATUS: keyof typeof StatusPermintaan;
  KETERANGAN: string | null;
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

  if (permintaan && body.STATUS === "DIKIRIM") {
    const detailPermintaan = permintaan.detail_permintaan;
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

    const updateStatusPermintaan = await db.permintaan.update({
      where: {
        ID_PERMINTAAN: body.ID_PERMINTAAN,
      },
      data: {
        STATUS: "DIKIRIM",
        KETERANGAN: body.KETERANGAN,
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
  } else if (permintaan && body.STATUS === "DITOLAK") {
    const tolakPermintaan = await db.permintaan.update({
      where: {
        ID_PERMINTAAN: body.ID_PERMINTAAN,
      },
      data: {
        STATUS: "DITOLAK",
        KETERANGAN: body.KETERANGAN,
        detail_permintaan: {
          deleteMany: {
            ID_PERMINTAAN: body.ID_PERMINTAAN,
          },
        },
      },
    });

    if (tolakPermintaan) {
      return NextResponse.json({
        ok: true,
        message: "Berhasil merubah status permintaan.",
      });
    } else {
      return NextResponse.json({
        ok: false,
        message: "Terjadi kesalahan...",
      });
    }
  } else {
    const updatePermintaan = await db.permintaan.update({
      where: {
        ID_PERMINTAAN: body.ID_PERMINTAAN,
      },
      data: {
        STATUS: body.STATUS,
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
