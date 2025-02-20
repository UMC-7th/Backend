/*
  Warnings:

  - You are about to drop the column `item_id` on the `hot_material` table. All the data in the column will be lost.
  - You are about to drop the column `item_id` on the `mark_material` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[material_id]` on the table `hot_material` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[material_id]` on the table `mark_material` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `material_id` to the `hot_material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `material_id` to the `mark_material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `delta_abs` to the `material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `material` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `hot_material` DROP FOREIGN KEY `hot_material_item_id_fkey`;

-- DropForeignKey
ALTER TABLE `mark_material` DROP FOREIGN KEY `mark_material_item_id_fkey`;

-- DropIndex
DROP INDEX `hot_material_item_id_key` ON `hot_material`;

-- DropIndex
DROP INDEX `mark_material_item_id_key` ON `mark_material`;

-- AlterTable
ALTER TABLE `hot_material` DROP COLUMN `item_id`,
    ADD COLUMN `material_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `mark_material` DROP COLUMN `item_id`,
    ADD COLUMN `material_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `material` ADD COLUMN `delta_abs` FLOAT NOT NULL,
    ADD COLUMN `type` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `profile_image` TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX `hot_material_material_id_key` ON `hot_material`(`material_id`);

-- CreateIndex
CREATE UNIQUE INDEX `mark_material_material_id_key` ON `mark_material`(`material_id`);

-- AddForeignKey
ALTER TABLE `mark_material` ADD CONSTRAINT `mark_material_material_id_fkey` FOREIGN KEY (`material_id`) REFERENCES `material`(`material_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `hot_material` ADD CONSTRAINT `hot_material_material_id_fkey` FOREIGN KEY (`material_id`) REFERENCES `material`(`material_id`) ON DELETE CASCADE ON UPDATE CASCADE;
