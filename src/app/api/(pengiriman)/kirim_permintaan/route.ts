import { db } from "@/lib/db";
import { decimalNumber } from "@/lib/helper";
import { NextRequest, NextResponse } from "next/server";

interface RequestBody {
  ID_PERMINTAAN: string;
  ID_TRANSPORTASI: string;
  SELECTED_ALAT: string[];
}

async function handler(request: NextRequest) {
  const body: RequestBody = await request.json();

  const createManyDetailPermintaan = async () => {
    const kodifikasiDetailPermintaan = (idAlat: string) =>
      body.ID_PERMINTAAN + "-" + idAlat;

    const cekDetailPermintaan = async (ID_ALAT: string) => {
      const dataDetailPermintaan = await db.detail_permintaan.aggregate({
        where: {
          ID_ALAT: ID_ALAT,
        },
        _max: {
          ID_DETAIL_PERMINTAAN: true,
        },
      });

      const maxValue = dataDetailPermintaan._max.ID_DETAIL_PERMINTAAN;
      const urutan = Number(
        maxValue?.substring(maxValue.length - 2, maxValue.length)
      );

      return (
        kodifikasiDetailPermintaan(ID_ALAT) +
        "-" +
        decimalNumber(urutan ? urutan + 1 : 1)
      );
    };

    const createDetailPermintaan = body.SELECTED_ALAT.map(async (kodeAlat) => {
      const idPermintaan = await cekDetailPermintaan(kodeAlat);

      return {
        ID_DETAIL_PERMINTAAN: idPermintaan,
        ID_ALAT: kodeAlat,
        ID_PERMINTAAN: body.ID_PERMINTAAN,
      };
    });

    return await Promise.all(createDetailPermintaan).then((res) => res);
  };

  const updatePermintaan = await db.permintaan.update({
    where: {
      ID_PERMINTAAN: body.ID_PERMINTAAN,
    },
    data: {
      STATUS: "DIKIRIM",
      transportasi: {
        connect: {
          ID_TRANSPORTASI: body.ID_TRANSPORTASI,
        },
        update: {
          where: {
            ID_TRANSPORTASI: body.ID_TRANSPORTASI,
          },
          data: {
            STATUS: "DIPAKAI",
          },
        },
      },
    },
    include: {
      detail_permintaan: {
        include: {
          bahan: true,
        },
      },
      detail_permintaan_alat: {
        include: {
          alat: true,
        },
      },
    },
  });

  if (updatePermintaan) {
    const detailPermintaan = updatePermintaan.detail_permintaan;
    const detailPermintaanBaru = await createManyDetailPermintaan();
    for (const detail of detailPermintaan) {
      if (detail && detail.bahan) {
        await db.bahan.update({
          where: {
            ID_BAHAN: detail.bahan.ID_BAHAN,
          },
          data: {
            BAHAN_KELUAR: {
              increment: detail.JUMLAH_BAHAN ?? 0,
            },
            STOCK_BAHAN: {
              decrement: detail.JUMLAH_BAHAN ?? 0,
            },
          },
        });
      }
    }

    await db.detail_permintaan.createMany({
      data: detailPermintaanBaru,
    });

    if (detailPermintaanBaru) {
      await db.detail_alat.updateMany({
        where: {
          KODE_ALAT: {
            in: body.SELECTED_ALAT,
          },
        },
        data: {
          STATUS: "PENGAJUAN",
        },
      });
      return NextResponse.json({
        ok: true,
        message: "Berhasil menugaskan pengiriman",
      });
    } else {
      return NextResponse.json({
        ok: false,
        message: "Terjadi kesalahan ketika menugaskan pengiriman...",
      });
    }
  } else {
    return NextResponse.json({
      ok: false,
      message: "Terjadi kesalahan ketika menugaskan pengiriman...",
    });
  }
}

export { handler as POST };
