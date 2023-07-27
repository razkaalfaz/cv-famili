import { db } from "@/lib/db";
import { dateFormatMaker, decimalNumber } from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  ID_PERMINTAAN: string;
  CATATAN: string;
  ID_USER: number;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  try {
    const currentPengembalian = await db.pengembalian.aggregate({
      where: {
        permintaan: {
          ID_USER: {
            equals: body.ID_USER,
          },
        },
      },
      _max: {
        ID_PENGEMBALIAN: true,
      },
    });

    const maxValue = currentPengembalian._max.ID_PENGEMBALIAN;
    const urutan = Number(
      maxValue?.substring(maxValue.length - 2, maxValue.length)
    );

    const pengajuanPengembalian = await db.pengembalian.create({
      data: {
        ID_PENGEMBALIAN: `PB-${dateFormatMaker()}-${
          body.ID_USER
        }-${decimalNumber(urutan ? urutan + 1 : 1)}`,
        CATATAN: body.CATATAN,
      },
    });

    if (pengajuanPengembalian) {
      await db.permintaan.update({
        where: {
          ID_PERMINTAAN: body.ID_PERMINTAAN,
        },
        data: {
          STATUS: "PENGEMBALIAN",
          pengembalian: {
            connect: {
              ID_PENGEMBALIAN: pengajuanPengembalian.ID_PENGEMBALIAN,
            },
          },
        },
      });

      return NextResponse.json({
        ok: true,
        message: "Permintaan pengembalian berhasil di ajukan.",
      });
    } else {
      return NextResponse.json({
        ok: false,
        message: "Terjadi kesalahan dalam pengajuan pengembalian...",
      });
    }
  } catch (err) {
    console.error(err);
  }
}

export { handler as PATCH };
