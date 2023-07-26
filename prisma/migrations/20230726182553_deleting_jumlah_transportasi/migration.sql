/*
  Warnings:

  - You are about to drop the column `JUMLAH_TRANSPORTASI` on the `transportasi` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "STATUS_TRANSPORTASI" AS ENUM ('TERSEDIA', 'DIPAKAI');

-- AlterTable
ALTER TABLE "transportasi" DROP COLUMN "JUMLAH_TRANSPORTASI",
ADD COLUMN     "STATUS" "STATUS_TRANSPORTASI" NOT NULL DEFAULT 'TERSEDIA';
