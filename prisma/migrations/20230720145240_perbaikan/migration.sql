/*
  Warnings:

  - You are about to drop the column `ALAT_LAYAK` on the `alat` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "STATUS_PERBAIKAN" AS ENUM ('PENDING', 'DIAJUKAN', 'DITOLAK', 'DIPERBAIKI');

-- AlterTable
ALTER TABLE "alat" DROP COLUMN "ALAT_LAYAK",
ALTER COLUMN "ALAT_TIDAK_LAYAK" DROP NOT NULL;

-- CreateTable
CREATE TABLE "perbaikan" (
    "ID_PERBAIKAIN" TEXT NOT NULL,
    "ID_ALAT" TEXT,
    "KETERANGAN" TEXT NOT NULL,
    "CATATAN" TEXT,
    "TGL_PERBAIKAN" TEXT,
    "STATUS" "STATUS_PERBAIKAN" NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "perbaikan_pkey" PRIMARY KEY ("ID_PERBAIKAIN")
);

-- CreateIndex
CREATE UNIQUE INDEX "perbaikan_ID_ALAT_key" ON "perbaikan"("ID_ALAT");

-- AddForeignKey
ALTER TABLE "perbaikan" ADD CONSTRAINT "perbaikan_ID_ALAT_fkey" FOREIGN KEY ("ID_ALAT") REFERENCES "alat"("ID_ALAT") ON DELETE CASCADE ON UPDATE CASCADE;
