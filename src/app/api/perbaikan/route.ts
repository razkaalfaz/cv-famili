import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  ALAT_RUSAK: AlatRusak;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();
  const currentDate = new Date();

  try {
    const kodifikasiPerbaikan = `PBK-${body.ALAT_RUSAK.ID_ALAT}`;
    const pengajuanPerbaikan = await db.perbaikan.upsert({
      where: {
        ID_PERBAIKAN: kodifikasiPerbaikan,
      },
      create: {
        ID_PERBAIKAN: kodifikasiPerbaikan,
        ID_ALAT: body.ALAT_RUSAK.ID_ALAT,
        detail_perbaikan: {
          connectOrCreate: {
            where: {
              ID_DETAIL_PERBAIKAN: `PBK-DETAIL-${body.ALAT_RUSAK.KODE_UNIT_ALAT}`,
            },
            create: {
              ID_DETAIL_PERBAIKAN: `PBK-DETAIL-${body.ALAT_RUSAK.KODE_UNIT_ALAT}`,
              KETERANGAN: body.ALAT_RUSAK.KETERANGAN_RUSAK,
              TGL_PENGAJUAN: currentDate,
              TINGKAT_KERUSAKAN: body.ALAT_RUSAK
                .TINGKAT_KERUSAKAN as TingkatKerusakan,
              KODE_ALAT: body.ALAT_RUSAK.KODE_UNIT_ALAT,
            },
          },
        },
      },
      update: {
        detail_perbaikan: {
          connectOrCreate: {
            where: {
              ID_DETAIL_PERBAIKAN: `PBK-DETAIL-${body.ALAT_RUSAK.KODE_UNIT_ALAT}`,
            },
            create: {
              ID_DETAIL_PERBAIKAN: `PBK-DETAIL-${body.ALAT_RUSAK.KODE_UNIT_ALAT}`,
              KETERANGAN: body.ALAT_RUSAK.KETERANGAN_RUSAK,
              TGL_PENGAJUAN: currentDate,
              TINGKAT_KERUSAKAN: body.ALAT_RUSAK
                .TINGKAT_KERUSAKAN as TingkatKerusakan,
              KODE_ALAT: body.ALAT_RUSAK.KODE_UNIT_ALAT,
            },
          },
        },
      },
    });

    if (pengajuanPerbaikan) {
      await db.detail_alat.update({
        where: {
          KODE_ALAT: body.ALAT_RUSAK.KODE_UNIT_ALAT,
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
