/*
  Warnings:

  - You are about to drop the column `material` on the `hot_material` table. All the data in the column will be lost.
  - You are about to drop the column `material` on the `mark_material` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[item_id]` on the table `hot_material` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[item_id]` on the table `mark_material` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `item_id` to the `hot_material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `item_id` to the `mark_material` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `hot_material` DROP COLUMN `material`,
    ADD COLUMN `item_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `mark_material` DROP COLUMN `material`,
    ADD COLUMN `item_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `profile_image` TEXT NOT NULL DEFAULT '';

-- CreateTable
CREATE TABLE `variety` (
    `variety_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`variety_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `material` (
    `item_id` INTEGER NOT NULL AUTO_INCREMENT,
    `variety_id` INTEGER NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `unit` VARCHAR(100) NOT NULL,
    `delta` FLOAT NOT NULL,

    PRIMARY KEY (`item_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `hot_material_item_id_key` ON `hot_material`(`item_id`);

-- CreateIndex
CREATE UNIQUE INDEX `mark_material_item_id_key` ON `mark_material`(`item_id`);

-- AddForeignKey
ALTER TABLE `material` ADD CONSTRAINT `material_variety_id_fkey` FOREIGN KEY (`variety_id`) REFERENCES `variety`(`variety_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mark_material` ADD CONSTRAINT `mark_material_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `material`(`item_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hot_material` ADD CONSTRAINT `hot_material_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `material`(`item_id`) ON DELETE CASCADE ON UPDATE CASCADE;
