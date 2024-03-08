/*
  Warnings:

  - You are about to drop the column `class` on the `attendence` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[class_name]` on the table `Attendence` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `class_name` to the `Attendence` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Attendence_class_key` ON `attendence`;

-- AlterTable
ALTER TABLE `attendence` DROP COLUMN `class`,
    ADD COLUMN `class_name` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Attendence_class_name_key` ON `Attendence`(`class_name`);
