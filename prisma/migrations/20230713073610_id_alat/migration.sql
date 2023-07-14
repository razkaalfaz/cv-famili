/*
  Warnings:

  - The primary key for the `alat` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE `alat` DROP PRIMARY KEY,
    MODIFY `ID_ALAT` VARCHAR(5) NOT NULL,
    ADD PRIMARY KEY (`ID_ALAT`);
