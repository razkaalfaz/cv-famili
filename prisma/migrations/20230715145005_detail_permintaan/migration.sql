/*
  Warnings:

  - You are about to drop the `_alatTodetail_permintaan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_bahanTodetail_permintaan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_alatTodetail_permintaan" DROP CONSTRAINT "_alatTodetail_permintaan_A_fkey";

-- DropForeignKey
ALTER TABLE "_alatTodetail_permintaan" DROP CONSTRAINT "_alatTodetail_permintaan_B_fkey";

-- DropForeignKey
ALTER TABLE "_bahanTodetail_permintaan" DROP CONSTRAINT "_bahanTodetail_permintaan_A_fkey";

-- DropForeignKey
ALTER TABLE "_bahanTodetail_permintaan" DROP CONSTRAINT "_bahanTodetail_permintaan_B_fkey";

-- DropTable
DROP TABLE "_alatTodetail_permintaan";

-- DropTable
DROP TABLE "_bahanTodetail_permintaan";

-- AddForeignKey
ALTER TABLE "detail_permintaan" ADD CONSTRAINT "detail_permintaan_ID_ALAT_fkey" FOREIGN KEY ("ID_ALAT") REFERENCES "alat"("ID_ALAT") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "detail_permintaan" ADD CONSTRAINT "detail_permintaan_ID_BAHAN_fkey" FOREIGN KEY ("ID_BAHAN") REFERENCES "bahan"("ID_BAHAN") ON DELETE CASCADE ON UPDATE CASCADE;
