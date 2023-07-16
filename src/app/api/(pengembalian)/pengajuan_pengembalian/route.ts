import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  ID_PERMINTAAN: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const pengajuanPengembalian = await db.permintaan.update({
    where: {
      ID_PERMINTAAN: body.ID_PERMINTAAN,
    },
    data: {
      STATUS: "PENGEMBALIAN",
    },
  });

  if (pengajuanPengembalian) {
    return NextResponse.json({
      ok: true,
      message: "Permintaan pengembalian berhasil di ajukan.",
    });
  } else {
    return NextResponse.json({
      ok: false,
      message: "Terjadi kesalahan dalam pengajuan pengembalian...",
    });
  }
}

export { handler as PATCH };
