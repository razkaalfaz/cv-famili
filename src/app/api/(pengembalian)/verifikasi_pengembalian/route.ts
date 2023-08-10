import { db } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  permintaan: Permintaan;
  ID_USER: number;
  IS_BROKEN: boolean;
  ALAT_RUSAK: AlatRusak[];
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();
  const currentDate = new Date();

  async function updateDataPermintaan() {
    const updatePermintaan = await db.permintaan.update({
      where: {
        ID_PERMINTAAN: body.permintaan.ID_PERMINTAAN,
      },
      data: {
        STATUS: "DIKEMBALIKAN",
        TGL_PENGEMBALIAN: currentDate,
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

      const detailAlat = detailPermintaan.map((detail) => detail.detail_alat);

      if (detailAlat) {
        await db.detail_alat.updateMany({
          where: {
            AND: [
              {
                KODE_ALAT: {
                  in: detailAlat.map((detail) => detail?.KODE_ALAT ?? ""),
                },
              },
              {
                KODE_ALAT: {
                  notIn: body.ALAT_RUSAK.map((detail) => detail.KODE_UNIT_ALAT),
                },
              },
            ],
          },
          data: {
            STATUS: "TERSEDIA",
          },
        });
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
        return {
          ok: true,
          message: "Barang pengembalian berhasil diterima.",
        };
      } else {
        return {
          ok: false,
          message: "Terjadi kesalahan...",
        };
      }
    } else {
      return { ok: false, message: "Terjadi kesalahan..." };
    }
  }

  try {
    if (body.IS_BROKEN) {
      const res = await fetch(
        process.env.NEXT_PUBLIC_API_PERBAIKAN_ON_PENGEMBALIAN!,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ALAT_RUSAK: body.ALAT_RUSAK,
          }),
        }
      );

      const response = await res.json();

      if (!response.ok) {
        return NextResponse.json({
          ok: false,
          message: response.message,
        });
      } else {
        const updateResponse = await updateDataPermintaan();
        return NextResponse.json(updateResponse);
      }
    } else {
      const updateResponse = await updateDataPermintaan();
      return NextResponse.json(updateResponse);
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ ok: false, message: "Terjadi kesalahan..." });
  }
}

export { handler as POST };
