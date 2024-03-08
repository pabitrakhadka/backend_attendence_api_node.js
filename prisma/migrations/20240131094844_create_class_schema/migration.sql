/*
  Warnings:

  - A unique constraint covering the columns `[class_name]` on the table `Class` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Class_class_name_key` ON `Class`(`class_name`);
