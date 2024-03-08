/*
  Warnings:

  - You are about to drop the `class` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX `Teacher_username_key` ON `teacher`;

-- DropTable
DROP TABLE `class`;

-- CreateTable
CREATE TABLE `Classes` (
    `class_id` INTEGER NOT NULL AUTO_INCREMENT,
    `school_id` INTEGER NOT NULL,
    `class_name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`class_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
