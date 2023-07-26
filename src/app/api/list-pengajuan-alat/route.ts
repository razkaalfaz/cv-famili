import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function handler(request: NextRequest) {
  const pengajuanAlatBaru = await db.pengajuan_alat_baru.findMany();
  const headersList = headers();
  const date = headersList.get("date");

  if (pengajuanAlatBaru) {
    return NextResponse.json(
      { ok: true, result: pengajuanAlatBaru },
      { headers: { date: date ?? Date.now().toLocaleString() } }
    );
  } else {
    return NextResponse.json({ ok: false, result: null });
  }
}

export { handler as GET };
