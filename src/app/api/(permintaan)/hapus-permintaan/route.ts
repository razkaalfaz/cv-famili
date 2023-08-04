import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  ID_PERMINTAAN: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const updateStatusAlat = await db.detail_alat.updateMany({
    where: {
      detail_permintaan: {
        some: {
          ID_PERMINTAAN: body.ID_PERMINTAAN,
        },
      },
    },
    data: {
      STATUS: "TERSEDIA",
    },
  });

  if (updateStatusAlat) {
    await db.permintaan.delete({
      where: {
        ID_PERMINTAAN: body.ID_PERMINTAAN,
      },
    });
    return NextResponse.json({
      ok: true,
      message: "Berhasil menghapus data permintaan.",
    });
  } else {
    return NextResponse.json({
      ok: false,
      message: "Terjadi kesalahan ketika menghapus data...",
    });
  }
}

export { handler as DELETE };
