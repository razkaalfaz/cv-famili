/*
  Warnings:

  - You are about to drop the column `ID_ALAT` on the `detail_permintaan` table. All the data in the column will be lost.
  - You are about to drop the column `ID_BAHAN` on the `detail_permintaan` table. All the data in the column will be lost.
  - You are about to drop the column `JUMLAH_ALAT` on the `detail_permintaan` table. All the data in the column will be lost.
  - You are about to drop the column `JUMLAH_BAHAN` on the `detail_permintaan` table. All the data in the column will be lost.
  - You are about to drop the column `RAB` on the `detail_permintaan` table. All the data in the column will be lost.
  - You are about to alter the column `STATUS` on the `permintaan` table. The data in that column could be lost. The data in that column will be cast from `VarChar(30)` to `Enum(EnumId(0))`.
  - A unique constraint covering the columns `[ID_PERMINTAAN]` on the table `detail_permintaan` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[ID_DETAIL_PERMINTAAN]` on the table `permintaan` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `detail_permintaan` DROP FOREIGN KEY `FK_RELATIONSHIP_3`;

-- DropForeignKey
ALTER TABLE `detail_permintaan` DROP FOREIGN KEY `FK_RELATIONSHIP_4`;

-- DropForeignKey
ALTER TABLE `detail_permintaan` DROP FOREIGN KEY `FK_RELATIONSHIP_5`;

-- AlterTable
ALTER TABLE `detail_permintaan` DROP COLUMN `ID_ALAT`,
    DROP COLUMN `ID_BAHAN`,
    DROP COLUMN `JUMLAH_ALAT`,
    DROP COLUMN `JUMLAH_BAHAN`,
    DROP COLUMN `RAB`;

-- AlterTable
ALTER TABLE `permintaan` ADD COLUMN `ID_DETAIL_PERMINTAAN` INTEGER NULL,
    MODIFY `TGL_PERMINTAAN` DATE NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `STATUS` ENUM('PENDING', 'DIVERIFIKASI', 'DITERIMA') NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE `_alatTopermintaan` (
    `A` VARCHAR(5) NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_alatTopermintaan_AB_unique`(`A`, `B`),
    INDEX `_alatTopermintaan_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_bahanTopermintaan` (
    `A` VARCHAR(4) NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_bahanTopermintaan_AB_unique`(`A`, `B`),
    INDEX `_bahanTopermintaan_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `detail_permintaan_ID_PERMINTAAN_key` ON `detail_permintaan`(`ID_PERMINTAAN`);

-- CreateIndex
CREATE UNIQUE INDEX `permintaan_ID_DETAIL_PERMINTAAN_key` ON `permintaan`(`ID_DETAIL_PERMINTAAN`);

-- AddForeignKey
ALTER TABLE `permintaan` ADD CONSTRAINT `permintaan_ID_DETAIL_PERMINTAAN_fkey` FOREIGN KEY (`ID_DETAIL_PERMINTAAN`) REFERENCES `detail_permintaan`(`ID_DETAIL_PERMINTAAN`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_alatTopermintaan` ADD CONSTRAINT `_alatTopermintaan_A_fkey` FOREIGN KEY (`A`) REFERENCES `alat`(`ID_ALAT`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_alatTopermintaan` ADD CONSTRAINT `_alatTopermintaan_B_fkey` FOREIGN KEY (`B`) REFERENCES `permintaan`(`ID_PERMINTAAN`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_bahanTopermintaan` ADD CONSTRAINT `_bahanTopermintaan_A_fkey` FOREIGN KEY (`A`) REFERENCES `bahan`(`ID_BAHAN`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_bahanTopermintaan` ADD CONSTRAINT `_bahanTopermintaan_B_fkey` FOREIGN KEY (`B`) REFERENCES `permintaan`(`ID_PERMINTAAN`) ON DELETE CASCADE ON UPDATE CASCADE;
