/*
  Warnings:

  - You are about to drop the column `TGL_PERBAIKAN` on the `perbaikan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "perbaikan" DROP COLUMN "TGL_PERBAIKAN",
ADD COLUMN     "TGL_PENGAJUAN" TIMESTAMP(3);
