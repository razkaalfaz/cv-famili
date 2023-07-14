/*
  Warnings:

  - You are about to drop the column `STATUS_KELAYAKAN` on the `alat` table. All the data in the column will be lost.
  - The primary key for the `bahan` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `ID_BAHAN` on the `bahan` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `VarChar(4)`.
  - You are about to alter the column `ID_BAHAN` on the `detail_permintaan` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `VarChar(4)`.

*/
-- DropForeignKey
ALTER TABLE `detail_permintaan` DROP FOREIGN KEY `FK_RELATIONSHIP_3`;

-- DropForeignKey
ALTER TABLE `detail_permintaan` DROP FOREIGN KEY `FK_RELATIONSHIP_5`;

-- AlterTable
ALTER TABLE `alat` DROP COLUMN `STATUS_KELAYAKAN`,
    ADD COLUMN `ALAT_LAYAK` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `ALAT_TIDAK_LAYAK` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `bahan` DROP PRIMARY KEY,
    MODIFY `ID_BAHAN` VARCHAR(4) NOT NULL,
    ADD PRIMARY KEY (`ID_BAHAN`);

-- AlterTable
ALTER TABLE `detail_permintaan` MODIFY `ID_ALAT` VARCHAR(5) NULL,
    MODIFY `ID_BAHAN` VARCHAR(4) NULL;

-- AddForeignKey
ALTER TABLE `detail_permintaan` ADD CONSTRAINT `FK_RELATIONSHIP_3` FOREIGN KEY (`ID_ALAT`) REFERENCES `alat`(`ID_ALAT`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `detail_permintaan` ADD CONSTRAINT `FK_RELATIONSHIP_5` FOREIGN KEY (`ID_BAHAN`) REFERENCES `bahan`(`ID_BAHAN`) ON DELETE RESTRICT ON UPDATE RESTRICT;
