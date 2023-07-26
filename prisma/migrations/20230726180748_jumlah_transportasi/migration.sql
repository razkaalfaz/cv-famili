/*
  Warnings:

  - You are about to drop the column `JENIS_TRANSPORTASI` on the `transportasi` table. All the data in the column will be lost.
  - Added the required column `JUMLAH_TRANSPORTASI` to the `transportasi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "transportasi" DROP COLUMN "JENIS_TRANSPORTASI",
ADD COLUMN     "JUMLAH_TRANSPORTASI" INTEGER NOT NULL;
