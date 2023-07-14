/*
  Warnings:

  - You are about to drop the `detailpermintaan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `detailpermintaan` DROP FOREIGN KEY `DetailPermintaan_ID_ALAT_fkey`;

-- DropForeignKey
ALTER TABLE `detailpermintaan` DROP FOREIGN KEY `DetailPermintaan_ID_BAHAN_fkey`;

-- DropForeignKey
ALTER TABLE `detailpermintaan` DROP FOREIGN KEY `DetailPermintaan_ID_PERMINTAAN_fkey`;

-- DropTable
DROP TABLE `detailpermintaan`;

-- CreateTable
CREATE TABLE `detail_permintaan` (
    `ID_DETAIL_PERMINTAAN` VARCHAR(191) NOT NULL,
    `ID_PERMINTAAN` VARCHAR(191) NOT NULL,
    `ID_ALAT` VARCHAR(191) NULL,
    `ID_BAHAN` VARCHAR(191) NULL,
    `JUMLAH_ALAT` INTEGER NULL,
    `JUMLAH_BAHAN` INTEGER NULL,

    UNIQUE INDEX `DetailPermintaan_ID_ALAT_key`(`ID_ALAT`),
    UNIQUE INDEX `DetailPermintaan_ID_BAHAN_key`(`ID_BAHAN`),
    INDEX `DetailPermintaan_ID_PERMINTAAN_key`(`ID_PERMINTAAN`),
    PRIMARY KEY (`ID_DETAIL_PERMINTAAN`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `detail_permintaan` ADD CONSTRAINT `DetailPermintaan_ID_ALAT_fkey` FOREIGN KEY (`ID_ALAT`) REFERENCES `alat`(`ID_ALAT`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_permintaan` ADD CONSTRAINT `DetailPermintaan_ID_BAHAN_fkey` FOREIGN KEY (`ID_BAHAN`) REFERENCES `bahan`(`ID_BAHAN`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `detail_permintaan` ADD CONSTRAINT `DetailPermintaan_ID_PERMINTAAN_fkey` FOREIGN KEY (`ID_PERMINTAAN`) REFERENCES `permintaan`(`ID_PERMINTAAN`) ON DELETE CASCADE ON UPDATE CASCADE;
