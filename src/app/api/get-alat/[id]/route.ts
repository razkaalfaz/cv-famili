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
    include: {
      detail_alat: {
        include: {
          detail_permintaan: {
            select: {
              ID_PERMINTAAN: true,
            },
          },
          alat: true,
          perbaikan: {
            select: {
              ID_PERBAIKAN: true,
            },
          },
        },
      },
    },
  });

  if (alat) {
    return NextResponse.json({ ok: true, result: alat });
  } else {
    return NextResponse.json({ ok: false, result: null });
  }
}

export { handler as GET };
