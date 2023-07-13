/*
  Warnings:

  - The primary key for the `alat` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `ID_ALAT` on the `alat` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `Int`.
  - You are about to alter the column `ID_ALAT` on the `detail_permintaan` table. The data in that column could be lost. The data in that column will be cast from `VarChar(10)` to `VarChar(4)`.
  - A unique constraint covering the columns `[KODIFIKASI_ALAT]` on the table `alat` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `KODIFIKASI_ALAT` to the `alat` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `detail_permintaan` DROP FOREIGN KEY `FK_RELATIONSHIP_3`;

-- AlterTable
ALTER TABLE `alat` DROP PRIMARY KEY,
    ADD COLUMN `KODIFIKASI_ALAT` VARCHAR(4) NOT NULL,
    MODIFY `ID_ALAT` INTEGER NOT NULL,
    ADD PRIMARY KEY (`ID_ALAT`);

-- AlterTable
ALTER TABLE `detail_permintaan` MODIFY `ID_ALAT` VARCHAR(4) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `alat_KODIFIKASI_ALAT_key` ON `alat`(`KODIFIKASI_ALAT`);

-- AddForeignKey
ALTER TABLE `detail_permintaan` ADD CONSTRAINT `FK_RELATIONSHIP_3` FOREIGN KEY (`ID_ALAT`) REFERENCES `alat`(`KODIFIKASI_ALAT`) ON DELETE RESTRICT ON UPDATE RESTRICT;
