/*
  Warnings:

  - You are about to drop the column `ALAT_KELUAR` on the `alat` table. All the data in the column will be lost.
  - You are about to drop the column `JUMLAH_ALAT` on the `alat` table. All the data in the column will be lost.
  - Added the required column `KODE_UNIT` to the `alat` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "STATUS_ALAT" AS ENUM ('DIGUNAKAN', 'TERSEDIA', 'DIPERBAIKI', 'RUSAK');

-- AlterTable
ALTER TABLE "alat" DROP COLUMN "ALAT_KELUAR",
DROP COLUMN "JUMLAH_ALAT",
ADD COLUMN     "KODE_UNIT" TEXT NOT NULL,
ADD COLUMN     "STATUS" "STATUS_ALAT" NOT NULL DEFAULT 'TERSEDIA';
