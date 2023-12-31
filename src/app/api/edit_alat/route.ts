import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  namaAlat: string;
  jumlahAlat: number;
  unitAlat: string;
  alatTidakLayak: number;
  idAlat: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const updatedAlat = await db.alat.update({
    where: {
      ID_ALAT: body.idAlat,
    },
    data: {
      NAMA_ALAT: body.namaAlat,
      UNIT_ALAT: body.unitAlat,
    },
  });

  if (updatedAlat) {
    return NextResponse.json({
      ok: true,
      message: "Data alat berhasil di update.",
    });
  } else {
    return NextResponse.json({
      ok: false,
      message: "Data alat gagal di update.",
    });
  }
}

export { handler as PATCH };
