import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  ID_ALAT: string;
  JUMLAH_ALAT: string;
  KETERANGAN: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const kodifikasiPerbaikan = `PBK-${body.ID_ALAT}`;

  const pengajuanPerbaikan = await db.perbaikan.upsert({
    where: {
      ID_PERBAIKAN: kodifikasiPerbaikan,
    },
    create: {
      ID_PERBAIKAN: kodifikasiPerbaikan,
      KETERANGAN: body.KETERANGAN,
      ID_ALAT: body.ID_ALAT,
      JUMLAH_ALAT: parseInt(body.JUMLAH_ALAT),
    },
    update: {
      JUMLAH_ALAT: parseInt(body.JUMLAH_ALAT),
      STATUS: "PENDING",
    },
  });

  if (pengajuanPerbaikan) {
    return NextResponse.json({
      ok: true,
      message: "Berhasil mengajukan perbaikan alat.",
    });
  } else {
    return NextResponse.json({ ok: false, message: "Terjadi kesalahan..." });
  }
}

export { handler as POST };
