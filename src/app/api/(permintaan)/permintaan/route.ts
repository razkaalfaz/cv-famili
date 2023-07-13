import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  ID_USER: number;
  ALAT: Alat[];
  BAHAN: Bahan[];
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const idAlat = body.ALAT.map((alat: Alat) => ({ ID_ALAT: alat.ID_ALAT }));
  const idBahan = body.BAHAN.map((bahan: Bahan) => ({
    ID_BAHAN: bahan.ID_BAHAN,
  }));

  const permintaan = await db.permintaan.create({
    data: {
      alat: {
        connect: idAlat,
      },
      bahan: {
        connect: idBahan,
      },
      ID_USER: body.ID_USER,
    },
  });

  if (permintaan) {
    return NextResponse.json({ ok: true, result: permintaan });
  } else {
    return NextResponse.json({ ok: false, result: null });
  }
}

export { handler as POST };
