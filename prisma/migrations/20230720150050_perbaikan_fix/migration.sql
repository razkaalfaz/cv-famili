/*
  Warnings:

  - The primary key for the `perbaikan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID_PERBAIKAIN` on the `perbaikan` table. All the data in the column will be lost.
  - Added the required column `ID_PERBAIKAN` to the `perbaikan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `JUMLAH_ALAT` to the `perbaikan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "perbaikan" DROP CONSTRAINT "perbaikan_pkey",
DROP COLUMN "ID_PERBAIKAIN",
ADD COLUMN     "ID_PERBAIKAN" TEXT NOT NULL,
ADD COLUMN     "JUMLAH_ALAT" INTEGER NOT NULL,
ADD CONSTRAINT "perbaikan_pkey" PRIMARY KEY ("ID_PERBAIKAN");
