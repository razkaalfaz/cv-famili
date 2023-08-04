import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  query: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const alat = await db.alat.findMany({
    where: {
      OR: [
        {
          ID_ALAT: {
            contains: body.query,
          },
        },
        {
          NAMA_ALAT: {
            contains: body.query,
            mode: "insensitive",
          },
        },
      ],
    },
    include: {
      detail_alat: true,
    },
  });

  if (alat) {
    return NextResponse.json({ ok: true, result: alat });
  } else {
    return NextResponse.json({ ok: false, result: null });
  }
}

export { handler as POST };
