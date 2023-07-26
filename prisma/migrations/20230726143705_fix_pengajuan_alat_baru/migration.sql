/*
  Warnings:

  - Changed the type of `JUMLAH_ALAT` on the `pengajuan_alat_baru` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "pengajuan_alat_baru" DROP COLUMN "JUMLAH_ALAT",
ADD COLUMN     "JUMLAH_ALAT" INTEGER NOT NULL;
