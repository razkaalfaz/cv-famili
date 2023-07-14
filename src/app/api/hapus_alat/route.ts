import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  idAlat: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const deletedAlat = await db.alat.delete({
    where: {
      ID_ALAT: body.idAlat,
    },
  });

  if (deletedAlat) {
    return NextResponse.json({
      ok: true,
      message: "Data alat berhasil di hapus.",
    });
  } else {
    return NextResponse.json({
      ok: false,
      message: "Data alat gagal di hapus.",
    });
  }
}

export { handler as DELETE };
