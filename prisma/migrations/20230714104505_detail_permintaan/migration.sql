/*
  Warnings:

  - The primary key for the `permintaan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `ID_DETAIL_PERMINTAAN` on the `permintaan` table. All the data in the column will be lost.
  - You are about to drop the `_alattopermintaan` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_bahantopermintaan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `_alattopermintaan` DROP FOREIGN KEY `_alatTopermintaan_A_fkey`;

-- DropForeignKey
ALTER TABLE `_alattopermintaan` DROP FOREIGN KEY `_alatTopermintaan_B_fkey`;

-- DropForeignKey
ALTER TABLE `_bahantopermintaan` DROP FOREIGN KEY `_bahanTopermintaan_A_fkey`;

-- DropForeignKey
ALTER TABLE `_bahantopermintaan` DROP FOREIGN KEY `_bahanTopermintaan_B_fkey`;

-- DropIndex
DROP INDEX `permintaan_ID_DETAIL_PERMINTAAN_key` ON `permintaan`;

-- AlterTable
ALTER TABLE `permintaan` DROP PRIMARY KEY,
    DROP COLUMN `ID_DETAIL_PERMINTAAN`,
    MODIFY `ID_PERMINTAAN` VARCHAR(13) NOT NULL,
    ADD PRIMARY KEY (`ID_PERMINTAAN`);

-- DropTable
DROP TABLE `_alattopermintaan`;

-- DropTable
DROP TABLE `_bahantopermintaan`;

-- CreateTable
CREATE TABLE `DetailPermintaan` (
    `ID_DETAIL_PERMINTAAN` VARCHAR(191) NOT NULL,
    `ID_PERMINTAAN` VARCHAR(191) NULL,
    `ID_ALAT` VARCHAR(191) NULL,
    `ID_BAHAN` VARCHAR(191) NULL,
    `JUMLAH_ALAT` INTEGER NULL,
    `JUMLAH_BAHAN` INTEGER NULL,

    UNIQUE INDEX `DetailPermintaan_ID_PERMINTAAN_key`(`ID_PERMINTAAN`),
    UNIQUE INDEX `DetailPermintaan_ID_ALAT_key`(`ID_ALAT`),
    UNIQUE INDEX `DetailPermintaan_ID_BAHAN_key`(`ID_BAHAN`),
    PRIMARY KEY (`ID_DETAIL_PERMINTAAN`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DetailPermintaan` ADD CONSTRAINT `DetailPermintaan_ID_ALAT_fkey` FOREIGN KEY (`ID_ALAT`) REFERENCES `alat`(`ID_ALAT`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailPermintaan` ADD CONSTRAINT `DetailPermintaan_ID_BAHAN_fkey` FOREIGN KEY (`ID_BAHAN`) REFERENCES `bahan`(`ID_BAHAN`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `DetailPermintaan` ADD CONSTRAINT `DetailPermintaan_ID_PERMINTAAN_fkey` FOREIGN KEY (`ID_PERMINTAAN`) REFERENCES `permintaan`(`ID_PERMINTAAN`) ON DELETE CASCADE ON UPDATE CASCADE;
