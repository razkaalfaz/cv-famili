/*
  Warnings:

  - Made the column `ID_PERMINTAAN` on table `detailpermintaan` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `detailpermintaan` DROP FOREIGN KEY `DetailPermintaan_ID_PERMINTAAN_fkey`;

-- AlterTable
ALTER TABLE `detailpermintaan` MODIFY `ID_PERMINTAAN` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `detailPermintaan` ADD CONSTRAINT `DetailPermintaan_ID_PERMINTAAN_fkey` FOREIGN KEY (`ID_PERMINTAAN`) REFERENCES `permintaan`(`ID_PERMINTAAN`) ON DELETE CASCADE ON UPDATE CASCADE;
