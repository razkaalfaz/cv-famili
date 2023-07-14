import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  namaAlat: string;
  jumlahAlat: number;
  unitAlat: string;
  alatLayak: number;
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
      JUMLAH_ALAT: body.jumlahAlat,
      ALAT_LAYAK: body.alatLayak,
      ALAT_TIDAK_LAYAK: body.alatTidakLayak,
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
