/*
  Warnings:

  - You are about to drop the column `ALAT_TIDAK_LAYAK` on the `alat` table. All the data in the column will be lost.
  - You are about to drop the column `KODE_UNIT` on the `alat` table. All the data in the column will be lost.
  - Added the required column `JUMLAH_ALAT` to the `alat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "alat" DROP COLUMN "ALAT_TIDAK_LAYAK",
DROP COLUMN "KODE_UNIT",
ADD COLUMN     "JUMLAH_ALAT" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "detail_alat" (
    "KODE_ALAT" TEXT NOT NULL,
    "ID_ALAT" TEXT NOT NULL,
    "STATUS" "STATUS_ALAT" NOT NULL DEFAULT 'TERSEDIA',

    CONSTRAINT "detail_alat_pkey" PRIMARY KEY ("KODE_ALAT")
);

-- AddForeignKey
ALTER TABLE "detail_alat" ADD CONSTRAINT "detail_alat_ID_ALAT_fkey" FOREIGN KEY ("ID_ALAT") REFERENCES "alat"("ID_ALAT") ON DELETE CASCADE ON UPDATE CASCADE;
