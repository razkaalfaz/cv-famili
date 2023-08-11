-- CreateTable
CREATE TABLE "detail_permintaan_alat" (
    "ID_PERMINTAAN_ALAT" TEXT NOT NULL,
    "ID_ALAT" TEXT NOT NULL,
    "ID_PERMINTAAN" TEXT NOT NULL,
    "JUMLAH_ALAT" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "detail_permintaan_alat_pkey" PRIMARY KEY ("ID_PERMINTAAN_ALAT")
);

-- AddForeignKey
ALTER TABLE "detail_permintaan_alat" ADD CONSTRAINT "detail_permintaan_alat_ID_ALAT_fkey" FOREIGN KEY ("ID_ALAT") REFERENCES "alat"("ID_ALAT") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_permintaan_alat" ADD CONSTRAINT "detail_permintaan_alat_ID_PERMINTAAN_fkey" FOREIGN KEY ("ID_PERMINTAAN") REFERENCES "permintaan"("ID_PERMINTAAN") ON DELETE CASCADE ON UPDATE CASCADE;
