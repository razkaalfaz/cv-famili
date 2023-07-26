import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function handler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const headersList = headers();
  const date = headersList.get("date");

  const dataPerbaikan = await db.pengajuan_alat_baru.findFirst({
    where: {
      ID_PENGAJUAN: params.id,
    },
    include: {
      user: true,
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
