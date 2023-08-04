import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { idPrefixMaker } from "@/lib/helper";

interface RequestBody {
  namaAlat: string;
  kodeUnit: string;
  jumlahAlat: number;
  jenisAlat: string;
  unitAlat: string;
}
async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();
  try {
    const currentAlat = await db.alat.aggregate({
      _max: {
        ID_ALAT: true,
      },
    });

    const maxValue = currentAlat._max.ID_ALAT;
    const urutan = Number(
      maxValue?.substring(maxValue.length - 3, maxValue.length)
    );

    const createManyDetails = () => {
      let detailAlat = [];
      for (let i = 0; i < body.jumlahAlat; i++) {
        detailAlat.push({
          KODE_ALAT: `${body.kodeUnit}-${idPrefixMaker(i + 1)}`,
        });
      }

      return detailAlat;
    };

    const newAlat = await db.alat.create({
      data: {
        ID_ALAT: `${body.jenisAlat}${idPrefixMaker(urutan ? urutan + 1 : 1)}`,
        NAMA_ALAT: body.namaAlat,
        UNIT_ALAT: body.unitAlat,
        detail_alat: {
          createMany: {
            data: createManyDetails(),
            skipDuplicates: true,
          },
        },
      },
    });

    if (newAlat) {
      return NextResponse.json({
        ok: true,
        message: "Berhasil menambahkan alat.",
        result: newAlat,
      });
    } else {
      return NextResponse.json({
        ok: false,
        message: "Terjadi kesalahan ketika menambahkan alat...",
        result: null,
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      ok: false,
      message: "Terjadi kesalahan ketika menambahkan alat...",
      result: null,
    });
  }
}

export { handler as POST };
