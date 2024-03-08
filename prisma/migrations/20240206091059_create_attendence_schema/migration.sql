/*
  Warnings:

  - You are about to drop the column `present` on the `attendence` table. All the data in the column will be lost.
  - Added the required column `is_present` to the `Attendence` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `attendence` DROP COLUMN `present`,
    ADD COLUMN `is_present` INTEGER NOT NULL;
