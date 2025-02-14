-- AlterTable
ALTER TABLE `meal_user` ADD COLUMN `is_hate` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `user` MODIFY `profile_image` TEXT NOT NULL DEFAULT '';
