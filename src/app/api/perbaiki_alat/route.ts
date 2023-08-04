import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

interface RequestBody {
  PERBAIKAN: Perbaikan;
}
async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();
  const updateStatusPerbaikan = await db.perbaikan.update({
    where: {
      ID_PERBAIKAN: body.PERBAIKAN.ID_PERBAIKAN,
    },
    data: {
      STATUS: "DIPERBAIKI",
      detail_alat: {
        updateMany: {
          where: {
            ID_PERBAIKAN: body.PERBAIKAN.ID_PERBAIKAN,
          },
          data: {
            STATUS: "TERSEDIA",
          },
        },
        disconnect: body.PERBAIKAN.detail_alat.map((detail) => ({
          KODE_ALAT: detail.KODE_ALAT,
        })),
      },
    },
  });

  try {
    if (updateStatusPerbaikan) {
      await db.perbaikan.delete({
        where: {
          ID_PERBAIKAN: body.PERBAIKAN.ID_PERBAIKAN,
        },
      });
      return NextResponse.json({
        ok: true,
        message: "Berhasil memverifikasi data perbaikan.",
      });
    } else {
      return NextResponse.json({
        ok: false,
        message: "Terjadi kesalahan ketika memverifikasi perbaikan",
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      ok: false,
      message: "Terjadi kesalahan ketika memverifikasi perbaikan",
    });
  }
}

export { handler as PATCH };
