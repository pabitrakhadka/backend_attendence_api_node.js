/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `superAdmin` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `superAdmin_username_key` ON `superAdmin`(`username`);
