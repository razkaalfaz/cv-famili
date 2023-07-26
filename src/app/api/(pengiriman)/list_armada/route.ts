import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function handler(request: NextRequest) {
  const armada = await db.armada.findMany({
    include: {
      transportasi: true,
    },
  });
  const headersList = headers();
  const date = headersList.get("date");

  if (armada) {
    return NextResponse.json(
      { ok: true, result: armada },
      { headers: { date: date ?? Date.now().toLocaleString() } }
    );
  } else {
    return NextResponse.json({ ok: false, result: null });
  }
}

export { handler as GET };
