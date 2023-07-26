import { db } from "@/lib/db";
import { idPrefixMaker } from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  NAMA_TRANSPORTASI: string;
  ID_ARMADA: string;
  JUMLAH_TRANSPORTASI: number;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  try {
    const currentTransportasi = await db.transportasi.aggregate({
      _max: {
        ID_TRANSPORTASI: true,
      },
    });

    const maxValue = currentTransportasi?._max?.ID_TRANSPORTASI;
    const urutan = Number(
      maxValue?.substring(maxValue?.length - 3, maxValue?.length)
    );

    const createManyTransportations = () => {
      let transportasi = [];
      for (let i = 0; i < body.JUMLAH_TRANSPORTASI; i++) {
        transportasi.push({
          ID_TRANSPORTASI: `TP${idPrefixMaker(
            urutan ? urutan + 1 + i : i + 1
          )}`,
          NAMA_TRANSPORTASI: body.NAMA_TRANSPORTASI,
          ID_ARMADA: body.ID_ARMADA,
        });
      }

      return transportasi;
    };

    const newTransportations = await db.transportasi.createMany({
      data: createManyTransportations(),
    });

    if (newTransportations) {
      return NextResponse.json({
        ok: true,
        message: "Berhasil menambahkan data transportasi",
      });
    } else {
      return NextResponse.json({
        ok: false,
        message: "Terjadi kesalahan dalam menambahkan data transportasi...",
      });
    }
  } catch (err) {
    console.error(err);
  }
}

export { handler as POST };
