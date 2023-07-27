import { db } from "@/lib/db";
import { decimalNumber } from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  permintaan: Permintaan;
  ID_USER: string;
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  try {
    const updatePermintaan = await db.permintaan.update({
      where: {
        ID_PERMINTAAN: body.permintaan.ID_PERMINTAAN,
      },
      data: {
        STATUS: "DIKEMBALIKAN",
      },
      include: {
        detail_permintaan: {
          include: {
            alat: true,
            bahan: true,
          },
        },
      },
    });

    if (updatePermintaan) {
      const detailPermintaan = updatePermintaan.detail_permintaan;

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
              ALAT_KELUAR: {
                decrement: detail.JUMLAH_ALAT ?? 0,
              },
            },
          });
        }
      }

      const updateDetailPermintaan = await db.detail_permintaan.updateMany({
        where: {
          ID_PERMINTAAN: body.permintaan.ID_PERMINTAAN,
        },
        data: {
          ID_PENGEMBALIAN: updatePermintaan.ID_PENGEMBALIAN,
        },
      });

      if (updateDetailPermintaan) {
        return NextResponse.json({
          ok: true,
          message: "Barang pengembalian berhasil diterima.",
        });
      } else {
        return NextResponse.json({
          ok: false,
          message: "Terjadi kesalahan...",
        });
      }
    } else {
      return NextResponse.json({ ok: false, message: "Terjadi kesalahan..." });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, message: "Terjadi kesalahan..." });
  }
}

export { handler as POST };
