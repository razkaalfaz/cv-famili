import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  ID_PERMINTAAN: string;
  TGL_PENGEMBALIAN: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();
  const TGL_PENGEMBALIAN = new Date(body.TGL_PENGEMBALIAN);

  const updatedPermintaan = await db.permintaan.update({
    where: {
      ID_PERMINTAAN: body.ID_PERMINTAAN,
    },
    data: {
      TGL_PENGEMBALIAN: TGL_PENGEMBALIAN,
    },
  });

  if (updatedPermintaan) {
    return NextResponse.json({
      ok: true,
      message: "Berhasil merubah tanggal pengembalian.",
    });
  } else {
    return NextResponse.json({
      ok: false,
      message: "Telah terjadi kesalahan...",
    });
  }
}

export { handler as PATCH };
