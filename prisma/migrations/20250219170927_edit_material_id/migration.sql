/*
  Warnings:

  - The primary key for the `material` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `material_id` to the `material` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `hot_material` DROP FOREIGN KEY `hot_material_item_id_fkey`;

-- DropForeignKey
ALTER TABLE `mark_material` DROP FOREIGN KEY `mark_material_item_id_fkey`;

-- AlterTable
ALTER TABLE `material` DROP PRIMARY KEY,
    ADD COLUMN `material_id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `item_id` INTEGER NOT NULL,
    ADD PRIMARY KEY (`material_id`);

-- AlterTable
ALTER TABLE `user` MODIFY `profile_image` TEXT NOT NULL DEFAULT '';

-- AddForeignKey
ALTER TABLE `mark_material` ADD CONSTRAINT `mark_material_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `material`(`material_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hot_material` ADD CONSTRAINT `hot_material_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `material`(`material_id`) ON DELETE CASCADE ON UPDATE CASCADE;
