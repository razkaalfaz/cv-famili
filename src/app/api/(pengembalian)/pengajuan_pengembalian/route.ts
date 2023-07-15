import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  permintaan: Permintaan;
  ID_USER: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth();
  const years = currentDate.getFullYear();
  const kodifikasiPengembalian = `PB-${day < 10 ? `0${day}` : day}${
    month < 10 ? `0${month + 1}` : month
  }${years}-${body.ID_USER}`;

  const permintaan = await db.permintaan.findFirst({
    where: { ID_PERMINTAAN: body.permintaan.ID_PERMINTAAN },
    include: {
      detail_permintaan: {
        include: {
          alat: true,
        },
      },
    },
  });

  if (permintaan) {
    const detailPermintaan = permintaan.detail_permintaan;

    for (const detail of detailPermintaan) {
      if (detail && detail.alat) {
        await db.alat.update({
          where: {
            ID_ALAT: detail.ID_ALAT ?? "",
          },
          data: {
            JUMLAH_ALAT: {
              increment: detail.JUMLAH_ALAT ?? 0,
            },
          },
        });
      }
    }
  }

  const pengembalian = await db.pengembalian.create({
    data: {
      ID_PENGEMBALIAN: kodifikasiPengembalian,
      ID_PERMINTAAN: body.permintaan.ID_PERMINTAAN,
    },
  });

  const detailPengembalian = await db.detail_permintaan.updateMany({
    where: {
      ID_PERMINTAAN: body.permintaan.ID_PERMINTAAN,
    },
    data: {
      ID_PENGEMBALIAN: pengembalian.ID_PENGEMBALIAN,
    },
  });

  await db.permintaan.update({
    where: {
      ID_PERMINTAAN: body.permintaan.ID_PERMINTAAN,
    },
    data: {
      STATUS: "DIKEMBALIKAN",
    },
  });

  if (detailPengembalian) {
    return NextResponse.json({
      ok: true,
      message: "Barang berhasil di kembalikan",
    });
  } else {
    return NextResponse.json({
      ok: false,
      message: "Telah terjadi kesalahan...",
    });
  }
}

export { handler as POST };
