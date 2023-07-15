import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  query: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const bahan = await db.bahan.findMany({
    where: {
      OR: [
        {
          ID_BAHAN: {
            contains: body.query,
          },
        },
        {
          NAMA_BAHAN: {
            contains: body.query,
            mode: "insensitive",
          },
        },
      ],
    },
  });

  if (bahan) {
    return NextResponse.json({ ok: true, result: bahan });
  } else {
    return NextResponse.json({ ok: false, result: null });
  }
}

export { handler as POST };
