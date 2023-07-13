/*
  Warnings:

  - The primary key for the `alat` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `KODIFIKASI_ALAT` on the `alat` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `detail_permintaan` DROP FOREIGN KEY `FK_RELATIONSHIP_3`;

-- DropIndex
DROP INDEX `alat_KODIFIKASI_ALAT_key` ON `alat`;

-- AlterTable
ALTER TABLE `alat` DROP PRIMARY KEY,
    DROP COLUMN `KODIFIKASI_ALAT`,
    MODIFY `ID_ALAT` VARCHAR(4) NOT NULL,
    ADD PRIMARY KEY (`ID_ALAT`);

-- AddForeignKey
ALTER TABLE `detail_permintaan` ADD CONSTRAINT `FK_RELATIONSHIP_3` FOREIGN KEY (`ID_ALAT`) REFERENCES `alat`(`ID_ALAT`) ON DELETE RESTRICT ON UPDATE RESTRICT;
