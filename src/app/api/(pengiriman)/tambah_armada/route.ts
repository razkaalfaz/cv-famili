import { db } from "@/lib/db";
import { decimalNumber } from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  NAMA_ARMADA: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  try {
    const currentArmada = await db.armada.aggregate({
      _max: {
        ID_ARMADA: true,
      },
    });

    const maxValue = currentArmada?._max?.ID_ARMADA;
    const urutan = Number(
      maxValue?.substring(maxValue?.length - 2, maxValue.length)
    );
    const kodifikasiIDArmada = `ARM${decimalNumber(urutan ? urutan + 1 : 1)}`;

    const newArmada = await db.armada.create({
      data: {
        ID_ARMADA: kodifikasiIDArmada,
        NAMA_ARMADA: body.NAMA_ARMADA,
      },
    });

    if (newArmada) {
      return NextResponse.json({
        ok: true,
        result: newArmada,
        message: "Berhasil menambahkan armada baru.",
      });
    } else {
      return NextResponse.json({
        ok: false,
        result: null,
        message: "Terjadi kesalahan ketika menambahkan armada...",
      });
    }
  } catch (err) {
    console.error(err);
  }
}

export { handler as POST };
