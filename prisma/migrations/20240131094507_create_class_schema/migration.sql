/*
  Warnings:

  - A unique constraint covering the columns `[class]` on the table `Attendence` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Attendence_class_key` ON `Attendence`(`class`);
