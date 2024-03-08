/*
  Warnings:

  - You are about to drop the column `class_name` on the `student` table. All the data in the column will be lost.
  - Added the required column `class_id` to the `Student` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `student` DROP COLUMN `class_name`,
    ADD COLUMN `class_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `Attendance` ADD CONSTRAINT `Attendance_student_id_fkey` FOREIGN KEY (`student_id`) REFERENCES `Student`(`student_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Student` ADD CONSTRAINT `Student_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `Classes`(`class_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
