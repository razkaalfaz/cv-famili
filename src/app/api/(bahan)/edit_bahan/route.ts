import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  namaBahan: string;
  stockBahan: number;
  unitBahan: string;
  idBahan: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const updatedBahan = await db.bahan.update({
    where: {
      ID_BAHAN: body.idBahan,
    },
    data: {
      NAMA_BAHAN: body.namaBahan,
      STOCK_BAHAN: body.stockBahan,
      UNIT_BAHAN: body.unitBahan,
    },
  });

  if (updatedBahan) {
    return NextResponse.json({
      ok: true,
      message: "Data bahan berhasil di edit.",
    });
  } else {
    return NextResponse.json({
      ok: false,
      message: "Terjadi kesalahan ketika mengedit data bahan.",
    });
  }
}

export { handler as PATCH };
