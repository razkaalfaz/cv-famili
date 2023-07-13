/*
  Warnings:

  - You are about to alter the column `STOCK_BAHAN` on the `bahan` table. The data in that column could be lost. The data in that column will be cast from `VarChar(35)` to `Int`.

*/
-- AlterTable
ALTER TABLE `bahan` MODIFY `STOCK_BAHAN` INTEGER NULL;
