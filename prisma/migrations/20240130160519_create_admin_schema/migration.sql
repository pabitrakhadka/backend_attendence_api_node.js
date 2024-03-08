/*
  Warnings:

  - You are about to drop the column `address` on the `admin` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `admin` table. All the data in the column will be lost.
  - You are about to drop the column `schoolName` on the `admin` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `Teacher` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `school_name` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Admin_email_key` ON `admin`;

-- AlterTable
ALTER TABLE `admin` DROP COLUMN `address`,
    DROP COLUMN `name`,
    DROP COLUMN `schoolName`,
    ADD COLUMN `school_name` VARCHAR(191) NOT NULL,
    MODIFY `email` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Admin_username_key` ON `Admin`(`username`);

-- CreateIndex
CREATE UNIQUE INDEX `Teacher_username_key` ON `Teacher`(`username`);
