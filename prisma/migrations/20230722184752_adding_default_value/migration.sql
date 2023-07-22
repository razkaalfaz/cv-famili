/*
  Warnings:

  - Made the column `TGL_PENGAJUAN` on table `perbaikan` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "perbaikan" ALTER COLUMN "TGL_PENGAJUAN" SET NOT NULL,
ALTER COLUMN "TGL_PENGAJUAN" SET DEFAULT CURRENT_TIMESTAMP;
