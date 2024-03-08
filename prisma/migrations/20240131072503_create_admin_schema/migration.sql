/*
  Warnings:

  - A unique constraint covering the columns `[course_name]` on the table `Course` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Course_course_name_key` ON `Course`(`course_name`);
