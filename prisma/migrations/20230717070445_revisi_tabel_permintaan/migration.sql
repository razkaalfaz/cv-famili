/*
  Warnings:

  - Added the required column `LOKASI_PROYEK` to the `permintaan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `NAMA_PROYEK` to the `permintaan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "STATUS_PERMINTAAN" ADD VALUE 'DIKIRIM';
ALTER TYPE "STATUS_PERMINTAAN" ADD VALUE 'DITOLAK';

-- AlterTable
ALTER TABLE "permintaan" ADD COLUMN     "LOKASI_PROYEK" TEXT NOT NULL,
ADD COLUMN     "NAMA_PROYEK" TEXT NOT NULL,
ADD COLUMN     "TGL_PENGEMBALIAN" TIMESTAMP(3),
ADD COLUMN     "TGL_PENGGUNAAN" TIMESTAMP(3);
