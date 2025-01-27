/*
  Warnings:

  - You are about to drop the `DeliveryAddress` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `KartSub` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Subscribe` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `DeliveryAddress` DROP FOREIGN KEY `DeliveryAddress_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `KartSub` DROP FOREIGN KEY `KartSub_meal_sub_id_fkey`;

-- DropForeignKey
ALTER TABLE `KartSub` DROP FOREIGN KEY `KartSub_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `Subscribe` DROP FOREIGN KEY `Subscribe_meal_sub_id_fkey`;

-- DropForeignKey
ALTER TABLE `Subscribe` DROP FOREIGN KEY `Subscribe_user_id_fkey`;

-- DropTable
DROP TABLE `DeliveryAddress`;

-- DropTable
DROP TABLE `KartSub`;

-- DropTable
DROP TABLE `Subscribe`;

-- CreateTable
CREATE TABLE `delivery_address` (
    `address_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `address` VARCHAR(200) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `phone_num` VARCHAR(100) NOT NULL,
    `receive_loc` VARCHAR(200) NOT NULL,
    `is_default` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`address_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subscribe` (
    `sub_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `meal_sub_id` INTEGER NOT NULL,
    `review` TEXT NOT NULL,
    `score` INTEGER NOT NULL,

    PRIMARY KEY (`sub_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `kart_sub` (
    `kard_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `meal_sub_id` INTEGER NOT NULL,
    `cnt` INTEGER NOT NULL,

    PRIMARY KEY (`kard_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `delivery_address` ADD CONSTRAINT `delivery_address_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscribe` ADD CONSTRAINT `subscribe_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `subscribe` ADD CONSTRAINT `subscribe_meal_sub_id_fkey` FOREIGN KEY (`meal_sub_id`) REFERENCES `meal_sub`(`meal_sub_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kart_sub` ADD CONSTRAINT `kart_sub_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `kart_sub` ADD CONSTRAINT `kart_sub_meal_sub_id_fkey` FOREIGN KEY (`meal_sub_id`) REFERENCES `meal_sub`(`meal_sub_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
