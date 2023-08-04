/*
  Warnings:

  - You are about to drop the column `ID_ALAT` on the `perbaikan` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "perbaikan" DROP CONSTRAINT "perbaikan_ID_ALAT_fkey";

-- DropIndex
DROP INDEX "perbaikan_ID_ALAT_key";

-- AlterTable
ALTER TABLE "detail_alat" ADD COLUMN     "ID_PERBAIKAN" TEXT;

-- AlterTable
ALTER TABLE "perbaikan" DROP COLUMN "ID_ALAT";

-- AddForeignKey
ALTER TABLE "detail_alat" ADD CONSTRAINT "detail_alat_ID_PERBAIKAN_fkey" FOREIGN KEY ("ID_PERBAIKAN") REFERENCES "perbaikan"("ID_PERBAIKAN") ON DELETE CASCADE ON UPDATE CASCADE;
