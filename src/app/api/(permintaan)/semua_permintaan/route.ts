import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function handler(request: NextRequest) {
  const headersList = headers();
  const date = headersList.get("date");

  const semuaPermintaan = await db.permintaan.findMany({
    include: {
      detail_permintaan: {
        include: {
          alat: true,
          bahan: true,
        },
      },
      user: true,
      transportasi: true,
    },
  });

  if (semuaPermintaan) {
    return NextResponse.json(
      { ok: true, result: semuaPermintaan },
      { headers: { date: date ?? Date.now().toLocaleString() } }
    );
  } else {
    return NextResponse.json({ ok: false, result: null });
  }
}

export { handler as GET };
