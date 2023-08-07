import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

async function handler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const headerLists = headers();
  const date = headerLists.get("date");

  const detailPerbaikan = await db.detail_alat.findFirst({
    where: {
      KODE_ALAT: params.id,
    },
    include: {
      perbaikan: true,
      alat: true,
    },
  });

  if (detailPerbaikan) {
    return NextResponse.json({ ok: true, result: detailPerbaikan });
  } else {
    return NextResponse.json({ ok: false, result: null });
  }
}

export { handler as GET };
