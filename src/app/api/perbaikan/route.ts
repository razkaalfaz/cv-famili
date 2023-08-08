import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  ALAT_RUSAK: AlatRusak[];
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();
  const currentDate = new Date();

  try {
    const response: boolean[] = [];
    for (const alatRusak of body.ALAT_RUSAK) {
      const kodifikasiPerbaikan = `PBK-${alatRusak.ID_ALAT}`;
      const pengajuanPerbaikan = await db.perbaikan.upsert({
        where: {
          ID_PERBAIKAN: kodifikasiPerbaikan,
        },
        create: {
          ID_PERBAIKAN: kodifikasiPerbaikan,
          ID_ALAT: alatRusak.ID_ALAT,
          detail_perbaikan: {
            create: {
              ID_DETAIL_PERBAIKAN: `PBK-DETAIL-${alatRusak.KODE_UNIT_ALAT}`,
              KETERANGAN: alatRusak.KETERANGAN_RUSAK,
              TGL_PENGAJUAN: currentDate,
              TINGKAT_KERUSAKAN:
                alatRusak.TINGKAT_KERUSAKAN as TingkatKerusakan,
              KODE_ALAT: alatRusak.KODE_UNIT_ALAT,
            },
          },
        },
        update: {
          detail_perbaikan: {
            connectOrCreate: {
              where: {
                ID_DETAIL_PERBAIKAN: `PBK-DETAIL-${alatRusak.KODE_UNIT_ALAT}`,
              },
              create: {
                ID_DETAIL_PERBAIKAN: `PBK-DETAIL-${alatRusak.KODE_UNIT_ALAT}`,
                KETERANGAN: alatRusak.KETERANGAN_RUSAK,
                TGL_PENGAJUAN: currentDate,
                TINGKAT_KERUSAKAN:
                  alatRusak.TINGKAT_KERUSAKAN as TingkatKerusakan,
                KODE_ALAT: alatRusak.KODE_UNIT_ALAT,
              },
            },
          },
        },
      });

      if (pengajuanPerbaikan) {
        response.push(true);
      } else {
        response.push(false);
      }
    }

    if (!response.includes(false)) {
      await db.detail_alat.updateMany({
        where: {
          KODE_ALAT: {
            in: body.ALAT_RUSAK.map((alatRusak) => alatRusak.KODE_UNIT_ALAT),
          },
        },
        data: {
          STATUS: "RUSAK",
        },
      });
      return NextResponse.json({
        ok: true,
        message: "Berhasil mengajukan perbaikan alat.",
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
