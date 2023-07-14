/*
  Warnings:

  - The primary key for the `permintaan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `detail_permintaan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_alattopermintaan` DROP FOREIGN KEY `_alatTopermintaan_B_fkey`;

-- DropForeignKey
ALTER TABLE `_bahantopermintaan` DROP FOREIGN KEY `_bahanTopermintaan_B_fkey`;

-- DropForeignKey
ALTER TABLE `permintaan` DROP FOREIGN KEY `permintaan_ID_DETAIL_PERMINTAAN_fkey`;

-- AlterTable
ALTER TABLE `_alattopermintaan` MODIFY `B` VARCHAR(11) NOT NULL;

-- AlterTable
ALTER TABLE `_bahantopermintaan` MODIFY `B` VARCHAR(11) NOT NULL;

-- AlterTable
ALTER TABLE `permintaan` DROP PRIMARY KEY,
    MODIFY `ID_PERMINTAAN` VARCHAR(11) NOT NULL,
    ADD PRIMARY KEY (`ID_PERMINTAAN`);

-- AlterTable
ALTER TABLE `user` MODIFY `REGISTER` DATE NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `detail_permintaan`;

-- AddForeignKey
ALTER TABLE `_alatTopermintaan` ADD CONSTRAINT `_alatTopermintaan_B_fkey` FOREIGN KEY (`B`) REFERENCES `permintaan`(`ID_PERMINTAAN`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_bahanTopermintaan` ADD CONSTRAINT `_bahanTopermintaan_B_fkey` FOREIGN KEY (`B`) REFERENCES `permintaan`(`ID_PERMINTAAN`) ON DELETE CASCADE ON UPDATE CASCADE;
