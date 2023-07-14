import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

async function handler(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const idUser = parseInt(params.id);

  const permintaanUser = await db.permintaan.findMany({
    where: {
      user: {
        ID_USER: idUser,
      },
    },
    include: {
      detailPermintaan: {
        include: {
          alat: true,
          bahan: true,
        },
      },
    },
  });

  if (permintaanUser) {
    return NextResponse.json({ ok: true, result: permintaanUser });
  } else {
    return NextResponse.json({ ok: false, result: null });
  }
}

export { handler as GET };
