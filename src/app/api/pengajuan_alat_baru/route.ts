import { db } from "@/lib/db";
import { decimalNumber } from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  NAMA_ALAT: string;
  JUMLAH_ALAT: number;
  DESKRIPSI: string;
  ID_USER: number;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();
  const currentDate = new Date();
  const tanggal = decimalNumber(currentDate.getDate());
  const bulan = decimalNumber(currentDate.getMonth() + 1);
  const tahun = currentDate.getFullYear();

  try {
    const currentCount = await db.pengajuan_alat_baru.aggregate({
      where: {
        ID_USER: body.ID_USER,
      },
      _max: {
        ID_PENGAJUAN: true,
      },
    });
    const maxValue = currentCount._max.ID_PENGAJUAN;
    const urutan = Number(
      maxValue?.substring(maxValue.length - 2, maxValue.length)
    );
    const kodifikasiIDPengajuan = `PAB-${tanggal}${bulan}${tahun}-${
      body.ID_USER
    }-${decimalNumber(urutan ? urutan + 1 : 1)}`;

    const pengajuanBaru = await db.pengajuan_alat_baru.create({
      data: {
        ID_PENGAJUAN: kodifikasiIDPengajuan,
        NAMA_ALAT: body.NAMA_ALAT,
        JUMLAH_ALAT: body.JUMLAH_ALAT,
        DESKRIPSI: body.DESKRIPSI,
        ID_USER: body.ID_USER,
      },
    });

    if (pengajuanBaru) {
      return NextResponse.json({
        ok: true,
        result: pengajuanBaru,
        message: "Berhasil membuat pengajuan.",
      });
    } else {
      return NextResponse.json({
        ok: false,
        result: null,
        message: "Terjadi kesalahan dalam membuat pengajuan...",
      });
    }
  } catch (err) {
    console.error(err);
  }
}

export { handler as POST };
