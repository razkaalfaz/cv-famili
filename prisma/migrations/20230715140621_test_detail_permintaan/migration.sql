-- DropForeignKey
ALTER TABLE "detail_permintaan" DROP CONSTRAINT "detail_permintaan_ID_ALAT_fkey";

-- DropForeignKey
ALTER TABLE "detail_permintaan" DROP CONSTRAINT "detail_permintaan_ID_BAHAN_fkey";

-- CreateTable
CREATE TABLE "_alatTodetail_permintaan" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_bahanTodetail_permintaan" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_alatTodetail_permintaan_AB_unique" ON "_alatTodetail_permintaan"("A", "B");

-- CreateIndex
CREATE INDEX "_alatTodetail_permintaan_B_index" ON "_alatTodetail_permintaan"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_bahanTodetail_permintaan_AB_unique" ON "_bahanTodetail_permintaan"("A", "B");

-- CreateIndex
CREATE INDEX "_bahanTodetail_permintaan_B_index" ON "_bahanTodetail_permintaan"("B");

-- AddForeignKey
ALTER TABLE "_alatTodetail_permintaan" ADD CONSTRAINT "_alatTodetail_permintaan_A_fkey" FOREIGN KEY ("A") REFERENCES "alat"("ID_ALAT") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_alatTodetail_permintaan" ADD CONSTRAINT "_alatTodetail_permintaan_B_fkey" FOREIGN KEY ("B") REFERENCES "detail_permintaan"("ID_DETAIL_PERMINTAAN") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_bahanTodetail_permintaan" ADD CONSTRAINT "_bahanTodetail_permintaan_A_fkey" FOREIGN KEY ("A") REFERENCES "bahan"("ID_BAHAN") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_bahanTodetail_permintaan" ADD CONSTRAINT "_bahanTodetail_permintaan_B_fkey" FOREIGN KEY ("B") REFERENCES "detail_permintaan"("ID_DETAIL_PERMINTAAN") ON DELETE CASCADE ON UPDATE CASCADE;
