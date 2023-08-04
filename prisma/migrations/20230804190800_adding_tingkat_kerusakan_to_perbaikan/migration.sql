/*
  Warnings:

  - Added the required column `TINGKAT_KERUSAKAN` to the `perbaikan` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TINGKAT_KERUSAKAN" AS ENUM ('RINGAN', 'BERAT');

-- AlterTable
ALTER TABLE "perbaikan" ADD COLUMN     "TINGKAT_KERUSAKAN" "TINGKAT_KERUSAKAN" NOT NULL;
