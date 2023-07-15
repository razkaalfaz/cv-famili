/*
  Warnings:

  - You are about to drop the `_alatTodetail_permintaan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_bahanTodetail_permintaan` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[ID_ALAT]` on the table `detail_permintaan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ID_BAHAN]` on the table `detail_permintaan` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "_alatTodetail_permintaan" DROP CONSTRAINT "_alatTodetail_permintaan_A_fkey";

-- DropForeignKey
ALTER TABLE "_alatTodetail_permintaan" DROP CONSTRAINT "_alatTodetail_permintaan_B_fkey";

-- DropForeignKey
ALTER TABLE "_bahanTodetail_permintaan" DROP CONSTRAINT "_bahanTodetail_permintaan_A_fkey";

-- DropForeignKey
ALTER TABLE "_bahanTodetail_permintaan" DROP CONSTRAINT "_bahanTodetail_permintaan_B_fkey";

-- DropIndex
DROP INDEX "detail_permintaan_ID_PERMINTAAN_key";

-- AlterTable
ALTER TABLE "alat" ADD COLUMN     "ALAT_KELUAR" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "bahan" ADD COLUMN     "BAHAN_KELUAR" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "detail_permintaan" ADD COLUMN     "ID_ALAT" TEXT,
ADD COLUMN     "ID_BAHAN" TEXT;

-- DropTable
DROP TABLE "_alatTodetail_permintaan";

-- DropTable
DROP TABLE "_bahanTodetail_permintaan";

-- CreateIndex
CREATE UNIQUE INDEX "detail_permintaan_ID_ALAT_key" ON "detail_permintaan"("ID_ALAT");

-- CreateIndex
CREATE UNIQUE INDEX "detail_permintaan_ID_BAHAN_key" ON "detail_permintaan"("ID_BAHAN");

-- AddForeignKey
ALTER TABLE "detail_permintaan" ADD CONSTRAINT "detail_permintaan_ID_ALAT_fkey" FOREIGN KEY ("ID_ALAT") REFERENCES "alat"("ID_ALAT") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_permintaan" ADD CONSTRAINT "detail_permintaan_ID_BAHAN_fkey" FOREIGN KEY ("ID_BAHAN") REFERENCES "bahan"("ID_BAHAN") ON DELETE CASCADE ON UPDATE CASCADE;
