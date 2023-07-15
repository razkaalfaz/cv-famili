/*
  Warnings:

  - You are about to drop the column `ID_ALAT` on the `detail_permintaan` table. All the data in the column will be lost.
  - You are about to drop the column `ID_BAHAN` on the `detail_permintaan` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ID_PERMINTAAN]` on the table `detail_permintaan` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "detail_permintaan" DROP CONSTRAINT "detail_permintaan_ID_ALAT_fkey";

-- DropForeignKey
ALTER TABLE "detail_permintaan" DROP CONSTRAINT "detail_permintaan_ID_BAHAN_fkey";

-- AlterTable
ALTER TABLE "detail_permintaan" DROP COLUMN "ID_ALAT",
DROP COLUMN "ID_BAHAN";

-- CreateTable
CREATE TABLE "_alatTodetail_permintaan" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_bahanTodetail_permintaan" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_alatTodetail_permintaan_AB_unique" ON "_alatTodetail_permintaan"("A", "B");

-- CreateIndex
CREATE INDEX "_alatTodetail_permintaan_B_index" ON "_alatTodetail_permintaan"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_bahanTodetail_permintaan_AB_unique" ON "_bahanTodetail_permintaan"("A", "B");

-- CreateIndex
CREATE INDEX "_bahanTodetail_permintaan_B_index" ON "_bahanTodetail_permintaan"("B");

-- CreateIndex
CREATE UNIQUE INDEX "detail_permintaan_ID_PERMINTAAN_key" ON "detail_permintaan"("ID_PERMINTAAN");

-- AddForeignKey
ALTER TABLE "_alatTodetail_permintaan" ADD CONSTRAINT "_alatTodetail_permintaan_A_fkey" FOREIGN KEY ("A") REFERENCES "alat"("ID_ALAT") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_alatTodetail_permintaan" ADD CONSTRAINT "_alatTodetail_permintaan_B_fkey" FOREIGN KEY ("B") REFERENCES "detail_permintaan"("ID_DETAIL_PERMINTAAN") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_bahanTodetail_permintaan" ADD CONSTRAINT "_bahanTodetail_permintaan_A_fkey" FOREIGN KEY ("A") REFERENCES "bahan"("ID_BAHAN") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_bahanTodetail_permintaan" ADD CONSTRAINT "_bahanTodetail_permintaan_B_fkey" FOREIGN KEY ("B") REFERENCES "detail_permintaan"("ID_DETAIL_PERMINTAAN") ON DELETE CASCADE ON UPDATE CASCADE;
