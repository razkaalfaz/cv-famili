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
      STATUS: "DITERIMA",
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
  });

  if (updatePermintaan) {
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
