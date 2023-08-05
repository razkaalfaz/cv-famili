import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { idPrefixMaker } from "@/lib/helper";

interface RequestBody {
  ID_ALAT: string;
  NAMA_ALAT: string;
  KODE_UNIT: string;
  JUMLAH_ALAT: number;
  REMOVED_ALAT: IDetailAlat[];
}
async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();
  const updateAlat = await db.alat.update({
    where: {
      ID_ALAT: body.ID_ALAT,
    },
    data: {
      NAMA_ALAT: body.NAMA_ALAT,
      detail_alat: {
        deleteMany: {
          KODE_ALAT: {
            in: body.REMOVED_ALAT.map((detail) => detail.KODE_ALAT),
          },
        },
      },
    },
  });

  try {
    if (updateAlat) {
      if (body.JUMLAH_ALAT > 0) {
        const currentDetail = await db.detail_alat.aggregate({
          where: {
            ID_ALAT: body.ID_ALAT,
          },
          _max: {
            KODE_ALAT: true,
          },
        });
        const maxValue =
          currentDetail._max.KODE_ALAT?.substring(0, 2) === body.KODE_UNIT
            ? currentDetail._max.KODE_ALAT
            : "";
        const urutan = Number(maxValue.substring(3, maxValue.length));

        for (let i = 0; i < body.JUMLAH_ALAT; i++) {
          const kodifikasiDetail = `${body.KODE_UNIT}-${idPrefixMaker(
            urutan ? urutan + i + 1 : i + 1
          )}`;
          await db.detail_alat.create({
            data: {
              KODE_ALAT: kodifikasiDetail,
              ID_ALAT: body.ID_ALAT,
            },
          });
        }
      }
      return NextResponse.json({
        ok: true,
        message: "Berhasil mengubah data alat",
      });
    } else {
      return NextResponse.json({ ok: false, message: "Terjadi kesalahan..." });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, message: "Terjadi kesalahan..." });
  }
}

export { handler as POST };
