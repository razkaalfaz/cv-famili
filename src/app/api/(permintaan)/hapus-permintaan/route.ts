import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  ID_PERMINTAAN: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const hapusPermintaan = await db.permintaan.delete({
    where: {
      ID_PERMINTAAN: body.ID_PERMINTAAN,
    },
  });

  if (hapusPermintaan) {
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
