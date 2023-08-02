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
      alat: {
        update: {
          where: {
            ID_ALAT: body.PERBAIKAN.ID_ALAT,
          },
          data: {
            ALAT_TIDAK_LAYAK: {
              decrement: body.PERBAIKAN.JUMLAH_ALAT ?? 0,
            },
          },
        },
      },
    },
  });

  try {
    if (updateStatusPerbaikan) {
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
