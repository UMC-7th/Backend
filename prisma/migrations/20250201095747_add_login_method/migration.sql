/*
  Warnings:

  - Added the required column `loginMethod` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `agreement` DROP FOREIGN KEY `agreement_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `delivery_address` DROP FOREIGN KEY `delivery_address_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `eat_meal` DROP FOREIGN KEY `eat_meal_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `kart_sub` DROP FOREIGN KEY `kart_sub_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `mark_material` DROP FOREIGN KEY `mark_material_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `meal_sub` DROP FOREIGN KEY `meal_sub_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `meal_sub` DROP FOREIGN KEY `meal_sub_meal_id_fkey`;

-- DropForeignKey
ALTER TABLE `meal_user` DROP FOREIGN KEY `meal_user_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `subscribe` DROP FOREIGN KEY `subscribe_user_id_fkey`;

-- DropIndex
DROP INDEX `agreement_user_id_fkey` ON `agreement`;

-- DropIndex
DROP INDEX `delivery_address_user_id_fkey` ON `delivery_address`;

-- DropIndex
DROP INDEX `eat_meal_user_id_fkey` ON `eat_meal`;

-- DropIndex
DROP INDEX `kart_sub_user_id_fkey` ON `kart_sub`;

-- DropIndex
DROP INDEX `mark_material_user_id_fkey` ON `mark_material`;

-- DropIndex
DROP INDEX `meal_sub_category_id_fkey` ON `meal_sub`;

-- DropIndex
DROP INDEX `meal_sub_meal_id_fkey` ON `meal_sub`;

-- DropIndex
DROP INDEX `meal_user_user_id_fkey` ON `meal_user`;

-- DropIndex
DROP INDEX `subscribe_user_id_fkey` ON `subscribe`;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `loginMethod` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `delivery_address` ADD CONSTRAINT `delivery_address_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_user` ADD CONSTRAINT `meal_user_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mark_material` ADD CONSTRAINT `mark_material_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agreement` ADD CONSTRAINT `agreement_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscribe` ADD CONSTRAINT `subscribe_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kart_sub` ADD CONSTRAINT `kart_sub_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_sub` ADD CONSTRAINT `meal_sub_meal_id_fkey` FOREIGN KEY (`meal_id`) REFERENCES `meal`(`meal_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_sub` ADD CONSTRAINT `meal_sub_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `meal_sub_category`(`category_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eat_meal` ADD CONSTRAINT `eat_meal_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
