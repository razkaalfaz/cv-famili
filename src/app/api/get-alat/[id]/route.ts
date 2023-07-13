import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

async function handler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const idAlat = params.id;

  const alat = await db.alat.findFirst({
    where: {
      ID_ALAT: idAlat,
    },
  });

  if (alat) {
    return NextResponse.json({ ok: true, result: alat });
  } else {
    return NextResponse.json({ ok: false, result: null });
  }
}

export { handler as GET };
