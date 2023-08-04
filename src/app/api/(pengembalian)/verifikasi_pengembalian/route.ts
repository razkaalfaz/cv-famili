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
        transportasi: {
          update: {
            data: {
              STATUS: "TERSEDIA",
            },
          },
          disconnect: {
            ID_PERMINTAAN: body.permintaan.ID_PERMINTAAN,
          },
        },
      },
      include: {
        detail_permintaan: {
          include: {
            detail_alat: {
              include: {
                alat: true,
              },
            },
            bahan: true,
          },
        },
      },
    });

    if (updatePermintaan) {
      const detailPermintaan = updatePermintaan.detail_permintaan;

      for (const detail of detailPermintaan) {
        if (detail && detail.detail_alat) {
          await db.detail_alat.update({
            where: {
              KODE_ALAT: detail.detail_alat.KODE_ALAT,
            },
            data: {
              STATUS: "TERSEDIA",
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
