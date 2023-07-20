import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function handler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const headersList = headers();
  const date = headersList.get("date");

  const dataPerbaikan = await db.perbaikan.findFirst({
    where: {
      ID_PERBAIKAN: params.id,
    },
    include: {
      alat: true,
    },
  });

  if (dataPerbaikan) {
    return NextResponse.json(
      { ok: true, result: dataPerbaikan },
      { headers: { date: date ?? Date.now().toLocaleString() } }
    );
  } else {
    return NextResponse.json(
      { ok: false, result: null },
      { headers: { date: date ?? Date.now().toLocaleString() } }
    );
  }
}

export { handler as GET };
