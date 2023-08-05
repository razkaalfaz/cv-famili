import { db } from "@/lib/db";
import { idPrefixMaker } from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  ID_ARMADA: string;
  TRANSPORTASI: ITransportasi[];
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

    const newTransportations = await db.transportasi.createMany({
      data: body.TRANSPORTASI.map((transportasi, index: number) => ({
        ID_ARMADA: body.ID_ARMADA,
        NAMA_TRANSPORTASI: transportasi.namaTransportasi,
        PLAT_NOMOR: transportasi.platNomor,
        ID_TRANSPORTASI: `TP${idPrefixMaker(
          urutan ? urutan + index + 1 : index + 1
        )}`,
      })),
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
