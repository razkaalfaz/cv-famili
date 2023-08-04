/*
  Warnings:

  - You are about to drop the column `JUMLAH_ALAT` on the `alat` table. All the data in the column will be lost.
  - You are about to drop the column `STATUS` on the `alat` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ID_ALAT]` on the table `detail_permintaan` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "detail_permintaan" DROP CONSTRAINT "detail_permintaan_ID_ALAT_fkey";

-- DropForeignKey
ALTER TABLE "perbaikan" DROP CONSTRAINT "perbaikan_ID_ALAT_fkey";

-- AlterTable
ALTER TABLE "alat" DROP COLUMN "JUMLAH_ALAT",
DROP COLUMN "STATUS";

-- CreateIndex
CREATE UNIQUE INDEX "detail_permintaan_ID_ALAT_key" ON "detail_permintaan"("ID_ALAT");

-- AddForeignKey
ALTER TABLE "perbaikan" ADD CONSTRAINT "perbaikan_ID_ALAT_fkey" FOREIGN KEY ("ID_ALAT") REFERENCES "detail_alat"("KODE_ALAT") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_permintaan" ADD CONSTRAINT "detail_permintaan_ID_ALAT_fkey" FOREIGN KEY ("ID_ALAT") REFERENCES "detail_alat"("KODE_ALAT") ON DELETE CASCADE ON UPDATE CASCADE;
