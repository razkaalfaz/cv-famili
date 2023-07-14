import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function handler(request: NextRequest) {
  const bahan = await db.bahan.findMany();
  const headersList = headers();
  const date = headersList.get("date");

  if (bahan) {
    return NextResponse.json(
      { ok: true, result: bahan },
      { headers: { date: date ?? Date.now().toLocaleString() } }
    );
  } else {
    return NextResponse.json({ ok: false, result: null });
  }
}

export { handler as GET };
