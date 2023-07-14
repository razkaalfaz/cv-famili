import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  ID_PERMINTAAN: number;
  STATUS: StatusPermintaan;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const updateStatusPermintaan = await db.permintaan.update({
    where: {
      ID_PERMINTAAN: body.ID_PERMINTAAN,
    },
    data: {
      STATUS: body.STATUS,
    },
  });

  if (updateStatusPermintaan) {
    return NextResponse.json({
      ok: true,
      message: "Status permintaan telah berhasil di ubah.",
    });
  } else {
    return NextResponse.json({
      ok: false,
      message: "Terjadi kesalahan ketika mengubah status permintaan.",
    });
  }
}

export { handler as POST };
