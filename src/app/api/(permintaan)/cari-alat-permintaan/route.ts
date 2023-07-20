import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  query: string;
  dateFilter: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const date = new Date(body.dateFilter);

  if (body.query) {
    const hasilQuery = await db.permintaan.findMany({
      where: {
        detail_permintaan: {
          some: {
            alat: {
              NAMA_ALAT: {
                contains: body.query,
                mode: "insensitive",
              },
            },
          },
        },
      },
      include: {
        detail_permintaan: {
          include: {
            alat: true,
            bahan: true,
          },
        },
        user: true,
      },
    });

    if (hasilQuery) {
      return NextResponse.json({ ok: true, result: hasilQuery });
    } else {
      return NextResponse.json({ ok: false, result: null });
    }
  } else {
    const hasilQuery = await db.permintaan.findMany({
      where: {
        TGL_PENGGUNAAN: {
          equals: date,
        },
      },
      include: {
        detail_permintaan: {
          include: {
            alat: true,
            bahan: true,
          },
        },
        user: true,
      },
    });

    if (hasilQuery) {
      return NextResponse.json({ ok: true, result: hasilQuery });
    } else {
      return NextResponse.json({ ok: false, result: null });
    }
  }
}

export { handler as POST };
