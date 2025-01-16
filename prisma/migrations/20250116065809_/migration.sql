/*
  Warnings:

  - You are about to drop the `Agreement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `EatMeal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `HotMaterial` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `LikeMeal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MarkMaterial` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MarkMeal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Meal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MealDetail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MealSub` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MealSubCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ReviewSub` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `Agreement` DROP FOREIGN KEY `Agreement_userId_fkey`;

-- DropForeignKey
ALTER TABLE `EatMeal` DROP FOREIGN KEY `EatMeal_mealId_fkey`;

-- DropForeignKey
ALTER TABLE `EatMeal` DROP FOREIGN KEY `EatMeal_userId_fkey`;

-- DropForeignKey
ALTER TABLE `LikeMeal` DROP FOREIGN KEY `LikeMeal_mealId_fkey`;

-- DropForeignKey
ALTER TABLE `LikeMeal` DROP FOREIGN KEY `LikeMeal_userId_fkey`;

-- DropForeignKey
ALTER TABLE `MarkMaterial` DROP FOREIGN KEY `MarkMaterial_userId_fkey`;

-- DropForeignKey
ALTER TABLE `MarkMeal` DROP FOREIGN KEY `MarkMeal_mealId_fkey`;

-- DropForeignKey
ALTER TABLE `MarkMeal` DROP FOREIGN KEY `MarkMeal_userId_fkey`;

-- DropForeignKey
ALTER TABLE `MealDetail` DROP FOREIGN KEY `MealDetail_mealId_fkey`;

-- DropForeignKey
ALTER TABLE `MealSub` DROP FOREIGN KEY `MealSub_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `MealSub` DROP FOREIGN KEY `MealSub_mealId_fkey`;

-- DropForeignKey
ALTER TABLE `ReviewSub` DROP FOREIGN KEY `ReviewSub_userId_fkey`;

-- DropTable
DROP TABLE `Agreement`;

-- DropTable
DROP TABLE `EatMeal`;

-- DropTable
DROP TABLE `HotMaterial`;

-- DropTable
DROP TABLE `LikeMeal`;

-- DropTable
DROP TABLE `MarkMaterial`;

-- DropTable
DROP TABLE `MarkMeal`;

-- DropTable
DROP TABLE `Meal`;

-- DropTable
DROP TABLE `MealDetail`;

-- DropTable
DROP TABLE `MealSub`;

-- DropTable
DROP TABLE `MealSubCategory`;

-- DropTable
DROP TABLE `ReviewSub`;

-- DropTable
DROP TABLE `User`;

-- CreateTable
CREATE TABLE `user` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `birth` DATETIME(6) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `phone_num` VARCHAR(100) NOT NULL,
    `purpose` TEXT NOT NULL,
    `is_sub` BOOLEAN NOT NULL,
    `address` VARCHAR(100) NOT NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hot_material` (
    `hot_id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` TEXT NOT NULL,
    `material` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`hot_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meal` (
    `meal_id` INTEGER NOT NULL AUTO_INCREMENT,
    `time` VARCHAR(100) NOT NULL,
    `is_eat` BOOLEAN NOT NULL,
    `is_like` BOOLEAN NOT NULL,
    `is_fix` BOOLEAN NOT NULL,
    `meal_date` DATETIME(6) NOT NULL,

    PRIMARY KEY (`meal_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mark_material` (
    `mark_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `material` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`mark_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `agreement` (
    `agree_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `agree_marketing` BOOLEAN NOT NULL,
    `agree_p_info` BOOLEAN NOT NULL,

    PRIMARY KEY (`agree_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `review_sub` (
    `review_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `score` INTEGER NOT NULL,
    `text` TEXT NOT NULL,

    PRIMARY KEY (`review_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meal_sub` (
    `meal_sub_id` INTEGER NOT NULL AUTO_INCREMENT,
    `meal_id` INTEGER NOT NULL,
    `category_id` INTEGER NOT NULL,
    `is_cook` BOOLEAN NOT NULL,

    PRIMARY KEY (`meal_sub_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meal_detail` (
    `detail_id` INTEGER NOT NULL AUTO_INCREMENT,
    `meal_id` INTEGER NOT NULL,
    `food` VARCHAR(100) NOT NULL,
    `calorie_total` INTEGER NOT NULL,
    `material` VARCHAR(100) NOT NULL,
    `calorie_detail` VARCHAR(100) NOT NULL,
    `price` INTEGER NOT NULL,
    `difficulty` VARCHAR(100) NOT NULL,
    `recipe` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`detail_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `eat_meal` (
    `eat_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `meal_id` INTEGER NOT NULL,
    `eat_at` DATETIME(6) NOT NULL,

    PRIMARY KEY (`eat_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `mark_meal` (
    `mark_meal` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `meal_id` INTEGER NOT NULL,
    `fix_at` DATETIME(6) NOT NULL,

    PRIMARY KEY (`mark_meal`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `like_meal` (
    `like_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `meal_id` INTEGER NOT NULL,
    `like_at` DATETIME(6) NOT NULL,

    PRIMARY KEY (`like_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meal_sub_category` (
    `category_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `mark_material` ADD CONSTRAINT `mark_material_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agreement` ADD CONSTRAINT `agreement_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `review_sub` ADD CONSTRAINT `review_sub_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_sub` ADD CONSTRAINT `meal_sub_meal_id_fkey` FOREIGN KEY (`meal_id`) REFERENCES `meal`(`meal_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_sub` ADD CONSTRAINT `meal_sub_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `meal_sub_category`(`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_detail` ADD CONSTRAINT `meal_detail_meal_id_fkey` FOREIGN KEY (`meal_id`) REFERENCES `meal`(`meal_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eat_meal` ADD CONSTRAINT `eat_meal_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eat_meal` ADD CONSTRAINT `eat_meal_meal_id_fkey` FOREIGN KEY (`meal_id`) REFERENCES `meal`(`meal_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mark_meal` ADD CONSTRAINT `mark_meal_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mark_meal` ADD CONSTRAINT `mark_meal_meal_id_fkey` FOREIGN KEY (`meal_id`) REFERENCES `meal`(`meal_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `like_meal` ADD CONSTRAINT `like_meal_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `like_meal` ADD CONSTRAINT `like_meal_meal_id_fkey` FOREIGN KEY (`meal_id`) REFERENCES `meal`(`meal_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
