import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

async function handler(request: NextRequest) {
  const alat = await db.alat.findMany();

  if (alat) {
    return NextResponse.json({ ok: true, result: alat });
  } else {
    return NextResponse.json({ ok: false, result: null });
  }
}

export { handler as GET };
