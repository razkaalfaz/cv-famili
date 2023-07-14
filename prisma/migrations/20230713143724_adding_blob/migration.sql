/*
  Warnings:

  - Added the required column `RAB` to the `detail_permintaan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `detail_permintaan` ADD COLUMN `RAB` BLOB NOT NULL;
