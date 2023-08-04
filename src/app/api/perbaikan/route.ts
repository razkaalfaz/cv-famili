import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  ID_ALAT: string;
  KETERANGAN: string;
  SELECTED_ALAT: string[];
  TINGKAT_KERUSAKAN: TingkatKerusakan;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const kodifikasiPerbaikan = `PBK-${body.ID_ALAT}`;
  const currentDate = new Date();

  const pengajuanPerbaikan = await db.perbaikan.upsert({
    where: {
      ID_PERBAIKAN: kodifikasiPerbaikan,
    },
    create: {
      ID_PERBAIKAN: kodifikasiPerbaikan,
      KETERANGAN: body.KETERANGAN,
      TINGKAT_KERUSAKAN: body.TINGKAT_KERUSAKAN,
      TGL_PENGAJUAN: currentDate,
      detail_alat: {
        connect: body.SELECTED_ALAT.map((kodeAlat) => ({
          KODE_ALAT: kodeAlat,
        })),
      },
    },
    update: {
      KETERANGAN: body.KETERANGAN,
      TGL_PENGAJUAN: currentDate,
      TINGKAT_KERUSAKAN: body.TINGKAT_KERUSAKAN,
      detail_alat: {
        updateMany: {
          where: {
            KODE_ALAT: {
              in: body.SELECTED_ALAT,
            },
          },
          data: {
            STATUS: "RUSAK",
          },
        },
        connect: body.SELECTED_ALAT.map((kodeAlat) => ({
          KODE_ALAT: kodeAlat,
        })),
      },
    },
  });

  if (pengajuanPerbaikan) {
    await db.detail_alat.updateMany({
      where: {
        KODE_ALAT: {
          in: body.SELECTED_ALAT,
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
}

export { handler as POST };
