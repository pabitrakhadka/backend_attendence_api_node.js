/*
  Warnings:

  - Added the required column `day` to the `Attendence` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `attendence` ADD COLUMN `day` VARCHAR(191) NOT NULL,
    MODIFY `is_present` VARCHAR(191) NOT NULL;
