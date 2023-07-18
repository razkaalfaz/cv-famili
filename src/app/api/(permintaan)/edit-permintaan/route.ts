import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  PERMINTAAN: Permintaan;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  try {
    const updatePermintaan = await db.permintaan.update({
      where: {
        ID_PERMINTAAN: body.PERMINTAAN.ID_PERMINTAAN,
      },
      data: {
        detail_permintaan: {
          updateMany: {
            where: {
              ID_PERMINTAAN: body.PERMINTAAN.ID_PERMINTAAN,
            },
            data: body.PERMINTAAN.detail_permintaan,
          },
        },
      },
    });

    if (updatePermintaan) {
      return NextResponse.json({
        ok: true,
        message: "Berhasil mengubah data permintaan.",
      });
    } else {
      return NextResponse.json({
        ok: false,
        message: "Terjadi kesalahan ketika mengubah data permintaan...",
      });
    }
  } catch (err) {
    console.error(err);
  }
}

export { handler as PATCH };
