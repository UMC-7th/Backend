/*
  Warnings:

  - You are about to alter the column `difficulty` on the `meal` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `Int`.

*/
-- AlterTable
ALTER TABLE `meal` MODIFY `difficulty` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `survey` (
    `survey_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `goal` VARCHAR(100) NOT NULL,
    `meals` VARCHAR(200) NOT NULL,
    `allergy` VARCHAR(100) NOT NULL,
    `allergyDetails` VARCHAR(200) NULL,
    `healthCondition` VARCHAR(100) NOT NULL,
    `gender` VARCHAR(10) NOT NULL,
    `birth_year` INTEGER NOT NULL,
    `height` INTEGER NOT NULL,
    `current_weight` INTEGER NOT NULL,
    `target_weight` INTEGER NOT NULL,
    `exercise_frequency` INTEGER NOT NULL,
    `job` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`survey_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `survey` ADD CONSTRAINT `survey_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
