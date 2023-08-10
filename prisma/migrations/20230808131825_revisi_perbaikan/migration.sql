/*
  Warnings:

  - You are about to drop the column `ID_PERBAIKAN` on the `detail_alat` table. All the data in the column will be lost.
  - You are about to drop the column `KETERANGAN` on the `perbaikan` table. All the data in the column will be lost.
  - You are about to drop the column `STATUS` on the `perbaikan` table. All the data in the column will be lost.
  - You are about to drop the column `TGL_PENGAJUAN` on the `perbaikan` table. All the data in the column will be lost.
  - You are about to drop the column `TINGKAT_KERUSAKAN` on the `perbaikan` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[ID_DETAIL_PERBAIKAN]` on the table `detail_alat` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ID_ALAT]` on the table `perbaikan` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "detail_alat" DROP CONSTRAINT "detail_alat_ID_PERBAIKAN_fkey";

-- AlterTable
ALTER TABLE "alat" ADD COLUMN     "ID_PERBAIKAN" TEXT;

-- AlterTable
ALTER TABLE "detail_alat" DROP COLUMN "ID_PERBAIKAN",
ADD COLUMN     "ID_DETAIL_PERBAIKAN" TEXT;

-- AlterTable
ALTER TABLE "perbaikan" DROP COLUMN "KETERANGAN",
DROP COLUMN "STATUS",
DROP COLUMN "TGL_PENGAJUAN",
DROP COLUMN "TINGKAT_KERUSAKAN",
ADD COLUMN     "ID_ALAT" TEXT;

-- CreateTable
CREATE TABLE "detail_perbaikan" (
    "ID_DETAIL_PERBAIKAN" TEXT NOT NULL,
    "ID_PERBAIKAN" TEXT,
    "KODE_ALAT" TEXT,
    "KETERANGAN" TEXT NOT NULL,
    "STATUS" "STATUS_PERBAIKAN" NOT NULL DEFAULT 'PENDING',
    "TGL_PENGAJUAN" TIMESTAMP(3) NOT NULL,
    "TINGKAT_KERUSAKAN" "TINGKAT_KERUSAKAN" NOT NULL,

    CONSTRAINT "detail_perbaikan_pkey" PRIMARY KEY ("ID_DETAIL_PERBAIKAN")
);

-- CreateIndex
CREATE UNIQUE INDEX "detail_alat_ID_DETAIL_PERBAIKAN_key" ON "detail_alat"("ID_DETAIL_PERBAIKAN");

-- CreateIndex
CREATE UNIQUE INDEX "perbaikan_ID_ALAT_key" ON "perbaikan"("ID_ALAT");

-- AddForeignKey
ALTER TABLE "detail_alat" ADD CONSTRAINT "detail_alat_ID_DETAIL_PERBAIKAN_fkey" FOREIGN KEY ("ID_DETAIL_PERBAIKAN") REFERENCES "detail_perbaikan"("ID_DETAIL_PERBAIKAN") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "perbaikan" ADD CONSTRAINT "perbaikan_ID_ALAT_fkey" FOREIGN KEY ("ID_ALAT") REFERENCES "alat"("ID_ALAT") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_perbaikan" ADD CONSTRAINT "detail_perbaikan_ID_PERBAIKAN_fkey" FOREIGN KEY ("ID_PERBAIKAN") REFERENCES "perbaikan"("ID_PERBAIKAN") ON DELETE CASCADE ON UPDATE CASCADE;
