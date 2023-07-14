import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

async function handler(request: NextRequest) {
  const bahan = await db.bahan.findMany();

  if (bahan) {
    return NextResponse.json({ ok: true, result: bahan });
  } else {
    return NextResponse.json({ ok: false, result: null });
  }
}

export { handler as GET };
