import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function handler(request: NextRequest) {
  const alat = await db.alat.findMany({
    include: {
      detail_alat: {
        include: {
          detail_permintaan: true,
        },
      },
    },
  });
  const headersList = headers();
  const date = headersList.get("date");

  if (alat) {
    return NextResponse.json(
      { ok: true, result: alat },
      { headers: { date: date ?? Date.now().toLocaleString() } }
    );
  } else {
    return NextResponse.json({ ok: false, result: null });
  }
}

export { handler as GET };
