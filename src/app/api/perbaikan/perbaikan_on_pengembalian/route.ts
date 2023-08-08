import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

interface RequestBody {
  BROKEN_ALAT: IDetailAlat[];
  KETERANGAN_RUSAK: string;
  TINGKAT_KERUSAKAN: string;
}
async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const currentDate = new Date();
  try {
    const response: boolean[] = [];
    for (const detailAlat of body.BROKEN_ALAT) {
      const dataPerbaikan = await db.perbaikan.upsert({
        where: {
          ID_PERBAIKAN: `PBK-${detailAlat.ID_ALAT}`,
        },
        create: {
          ID_PERBAIKAN: `PBK-${detailAlat.ID_ALAT}`,
          KETERANGAN: body.KETERANGAN_RUSAK,
          TINGKAT_KERUSAKAN: body.TINGKAT_KERUSAKAN as TingkatKerusakan,
          detail_alat: {
            connect: {
              KODE_ALAT: detailAlat.KODE_ALAT,
            },
          },
        },
        update: {
          detail_alat: {
            connect: {
              KODE_ALAT: detailAlat.KODE_ALAT,
            },
            update: {
              where: {
                KODE_ALAT: detailAlat.KODE_ALAT,
              },
              data: {
                STATUS: "RUSAK",
              },
            },
          },
          KETERANGAN: body.KETERANGAN_RUSAK,
          TINGKAT_KERUSAKAN: body.TINGKAT_KERUSAKAN as TingkatKerusakan,
          TGL_PENGAJUAN: currentDate,
        },
      });

      if (dataPerbaikan) {
        response.push(true);
      } else {
        response.push(false);
      }
    }

    if (!response.includes(false)) {
      await db.detail_alat.updateMany({
        where: {
          KODE_ALAT: {
            in: body.BROKEN_ALAT.map((detailAlat) => detailAlat.KODE_ALAT),
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
