import { db } from "@/lib/db";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

async function handler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const headersList = headers();
  const date = headersList.get("date");

  const dataPermintaan = await db.permintaan.findFirst({
    where: {
      ID_PERMINTAAN: params.id,
    },
    include: {
      detail_permintaan: {
        include: {
          detail_alat: {
            include: {
              alat: true,
            },
          },
          bahan: true,
        },
      },
      detail_permintaan_alat: {
        include: {
          alat: true,
        },
      },
      user: true,
    },
  });

  if (dataPermintaan) {
    return NextResponse.json(
      { ok: true, result: dataPermintaan },
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
