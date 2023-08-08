import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

interface RequestBody {
  ALAT_RUSAK: AlatRusak[];
}
async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const currentDate = new Date();
  try {
    const response: boolean[] = [];

    for (const detailAlat of body.ALAT_RUSAK) {
      const detailPerbaikan = await db.detail_perbaikan.upsert({
        where: {
          ID_DETAIL_PERBAIKAN: `PBK-DETAIL-${detailAlat.KODE_UNIT_ALAT}`,
        },
        create: {
          ID_DETAIL_PERBAIKAN: `PBK-DETAIL-${detailAlat.KODE_UNIT_ALAT}`,
          KETERANGAN: detailAlat.KETERANGAN_RUSAK,
          TGL_PENGAJUAN: currentDate,
          TINGKAT_KERUSAKAN: detailAlat.TINGKAT_KERUSAKAN as TingkatKerusakan,
        },
        update: {
          KETERANGAN: detailAlat.KETERANGAN_RUSAK,
          TINGKAT_KERUSAKAN: detailAlat.TINGKAT_KERUSAKAN as TingkatKerusakan,
          TGL_PENGAJUAN: currentDate,
        },
      });

      if (detailPerbaikan) {
        response.push(true);
      } else {
        response.push(false);
      }
    }

    if (!response.includes(false)) {
      await db.detail_alat.updateMany({
        where: {
          KODE_ALAT: {
            in: body.ALAT_RUSAK.map((detailAlat) => detailAlat.KODE_UNIT_ALAT),
          },
        },
        data: {
          STATUS: "RUSAK",
        },
      });
      return NextResponse.json({
        ok: true,
        message: "Berhasil mengajukan perbaikan.",
      });
    } else {
      return NextResponse.json({
        ok: false,
        message: "Terjadi kesalahan ketika mengajukan perbaikan...",
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      ok: false,
      message: "Terjadi kesalahan ketika mengajukan perbaikan...",
    });
  }
}

export { handler as POST };
