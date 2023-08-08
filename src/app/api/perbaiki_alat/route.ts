import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

interface RequestBody {
  DETAIL_PERBAIKAN: IDetailPerbaikan;
}
async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();
  const updatePerbaikan = await db.perbaikan.update({
    where: {
      ID_PERBAIKAN: body.DETAIL_PERBAIKAN.ID_PERBAIKAN ?? "",
    },
    data: {
      detail_perbaikan: {
        update: {
          where: {
            ID_DETAIL_PERBAIKAN: body.DETAIL_PERBAIKAN.ID_DETAIL_PERBAIKAN,
          },
          data: {
            detail_alat: {
              update: {
                STATUS: "TERSEDIA",
              },
            },
          },
        },
      },
    },
    include: {
      detail_perbaikan: true,
    },
  });

  try {
    if (updatePerbaikan) {
      if (updatePerbaikan.detail_perbaikan.length > 1) {
        await db.detail_perbaikan.delete({
          where: {
            ID_DETAIL_PERBAIKAN: body.DETAIL_PERBAIKAN.ID_DETAIL_PERBAIKAN,
          },
        });
      } else {
        await db.perbaikan.delete({
          where: {
            ID_PERBAIKAN: body.DETAIL_PERBAIKAN.ID_PERBAIKAN ?? "",
          },
        });
      }
      return NextResponse.json({
        ok: true,
        message: "Berhasil memverifikasi data perbaikan.",
      });
    } else {
      return NextResponse.json({
        ok: false,
        message: "Terjadi kesalahan ketika memverifikasi perbaikan",
      });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({
      ok: false,
      message: "Terjadi kesalahan ketika memverifikasi perbaikan",
    });
  }
}

export { handler as PATCH };
