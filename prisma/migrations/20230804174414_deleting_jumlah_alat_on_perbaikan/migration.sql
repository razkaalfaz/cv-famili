/*
  Warnings:

  - You are about to drop the column `JUMLAH_ALAT` on the `perbaikan` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "detail_alat" DROP CONSTRAINT "detail_alat_ID_PERBAIKAN_fkey";

-- AlterTable
ALTER TABLE "perbaikan" DROP COLUMN "JUMLAH_ALAT";

-- AddForeignKey
ALTER TABLE "detail_alat" ADD CONSTRAINT "detail_alat_ID_PERBAIKAN_fkey" FOREIGN KEY ("ID_PERBAIKAN") REFERENCES "perbaikan"("ID_PERBAIKAN") ON DELETE SET NULL ON UPDATE CASCADE;
