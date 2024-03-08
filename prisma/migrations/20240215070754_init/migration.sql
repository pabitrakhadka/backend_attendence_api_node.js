-- CreateTable
CREATE TABLE `Section` (
    `section_id` INTEGER NOT NULL AUTO_INCREMENT,
    `school_id` INTEGER NOT NULL,
    `class_id` INTEGER NOT NULL,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`section_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Section` ADD CONSTRAINT `Section_school_id_fkey` FOREIGN KEY (`school_id`) REFERENCES `Admin`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Section` ADD CONSTRAINT `Section_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `Classes`(`class_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
