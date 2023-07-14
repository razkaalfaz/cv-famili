import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

async function handler(request: NextRequest) {
  const semuaPermintaan = await db.permintaan.findMany({
    include: {
      alat: true,
      bahan: true,
      user: true,
    },
  });

  if (semuaPermintaan) {
    return NextResponse.json({ ok: true, result: semuaPermintaan });
  } else {
    return NextResponse.json({ ok: false, result: null });
  }
}

export { handler as GET };
