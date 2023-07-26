/*
  Warnings:

  - Added the required column `ID_USER` to the `pengajuan_alat_baru` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pengajuan_alat_baru" ADD COLUMN     "ID_USER" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "pengajuan_alat_baru" ADD CONSTRAINT "pengajuan_alat_baru_ID_USER_fkey" FOREIGN KEY ("ID_USER") REFERENCES "user"("ID_USER") ON DELETE CASCADE ON UPDATE CASCADE;
