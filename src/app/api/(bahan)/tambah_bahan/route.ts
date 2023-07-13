import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  namaBahan: string;
  stockBahan: number;
  unitBahan: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const maxValue = await db.bahan.aggregate({
    _max: {
      ID_BAHAN: true,
    },
  });

  const urutan = Number(maxValue._max.ID_BAHAN?.substring(1)) || 0;

  function kodifikasiBahan(jumlah: number) {
    const prefix = "B";
    if (jumlah >= 10) {
      return `${prefix}0${jumlah}`;
    } else if (jumlah >= 100) {
      return `${prefix}${jumlah}`;
    } else {
      return `${prefix}00${jumlah + 1}`;
    }
  }

  const bahanBaru = await db.bahan.create({
    data: {
      ID_BAHAN: kodifikasiBahan(urutan),
      NAMA_BAHAN: body.namaBahan,
      STOCK_BAHAN: body.stockBahan,
      UNIT_BAHAN: body.unitBahan,
    },
  });

  if (bahanBaru) {
    return NextResponse.json({ ok: true, result: bahanBaru });
  } else {
    return NextResponse.json({ ok: false, result: null });
  }
}

export { handler as POST };
