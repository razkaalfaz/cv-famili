import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function handler(request: NextRequest) {
  const perbaikan = await db.perbaikan.findMany({
    include: {
      detail_perbaikan: {
        include: {
          detail_alat: {
            include: {
              alat: true,
            },
          },
        },
      },
      alat: true,
    },
  });
  const headersList = headers();
  const date = headersList.get("date");

  if (perbaikan) {
    return NextResponse.json(
      { ok: true, result: perbaikan },
      { headers: { date: date ?? Date.now().toLocaleString() } }
    );
  } else {
    return NextResponse.json({ ok: false, result: null });
  }
}

export { handler as GET };
