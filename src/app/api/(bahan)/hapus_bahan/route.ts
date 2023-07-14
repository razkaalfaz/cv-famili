import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  idBahan: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const hapusBahan = await db.bahan.delete({
    where: {
      ID_BAHAN: body.idBahan,
    },
  });

  if (hapusBahan) {
    return NextResponse.json({
      ok: true,
      message: "Berhasil menghapus bahan.",
    });
  } else {
    return NextResponse.json({ ok: false, message: "Gagal menghapus bahan." });
  }
}

export { handler as DELETE };
