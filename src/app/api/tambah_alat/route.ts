import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  namaAlat: string;
  jumlahAlat: number;
  unitAlat: string;
  alatTidakLayak: number;
  jenisAlat: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const maxValue = await db.alat.aggregate({
    where: {
      ID_ALAT: {
        contains: body.jenisAlat,
      },
    },
    _max: {
      ID_ALAT: true,
    },
  });

  const urutan =
    maxValue._max.ID_ALAT?.substring(
      maxValue._max.ID_ALAT.length,
      maxValue._max.ID_ALAT.length - 3
    ) || "0";

  console.log(kodifikasiAlat(parseInt(urutan) + 1));

  function kodifikasiAlat(jumlah: number) {
    if (jumlah > 9) {
      return `${body.jenisAlat}0${jumlah}`;
    } else if (jumlah >= 100) {
      return `${body.jenisAlat}${jumlah}`;
    } else {
      return `${body.jenisAlat}00${jumlah}`;
    }
  }

  const alatBaru = await db.alat.create({
    data: {
      ID_ALAT: kodifikasiAlat(parseInt(urutan) + 1),
      JUMLAH_ALAT: body.jumlahAlat,
      NAMA_ALAT: body.namaAlat,
      UNIT_ALAT: body.unitAlat,
      ALAT_TIDAK_LAYAK: body.alatTidakLayak,
    },
  });

  if (alatBaru) {
    return NextResponse.json({ ok: true, result: alatBaru });
  } else {
    return NextResponse.json({ ok: false, result: null });
  }
}

export { handler as POST };
