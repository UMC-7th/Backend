/*
  Warnings:

  - You are about to drop the `Dummy` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Dummy`;

-- CreateTable
CREATE TABLE `User` (
    `userId` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `birth` DATETIME(3) NULL,
    `name` VARCHAR(191) NULL,
    `phoneNum` VARCHAR(191) NULL,
    `purpose` VARCHAR(191) NULL,
    `isSub` BOOLEAN NULL,
    `address` VARCHAR(191) NULL,
    `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    UNIQUE INDEX `email`(`email`),
    PRIMARY KEY (`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HotMaterial` (
    `hotId` INTEGER NOT NULL AUTO_INCREMENT,
    `text` VARCHAR(191) NULL,
    `material` VARCHAR(191) NULL,

    PRIMARY KEY (`hotId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Meal` (
    `mealId` INTEGER NOT NULL AUTO_INCREMENT,
    `time` VARCHAR(191) NOT NULL,
    `isEate` BOOLEAN NOT NULL,
    `isLike` BOOLEAN NOT NULL,
    `isFix` BOOLEAN NOT NULL,
    `mealDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`mealId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MarkMaterial` (
    `markId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `material` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`markId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Agreement` (
    `agreeId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `agreeMarketing` BOOLEAN NOT NULL,
    `agreePInfo` BOOLEAN NOT NULL,

    PRIMARY KEY (`agreeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ReviewSub` (
    `reviewId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `score` INTEGER NOT NULL,
    `text` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`reviewId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MealSub` (
    `mealSubId` INTEGER NOT NULL AUTO_INCREMENT,
    `mealId` INTEGER NOT NULL,
    `categoryId` INTEGER NOT NULL,
    `isCook` BOOLEAN NOT NULL,

    PRIMARY KEY (`mealSubId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MealDetail` (
    `detailId` INTEGER NOT NULL AUTO_INCREMENT,
    `mealId` INTEGER NOT NULL,
    `food` VARCHAR(191) NOT NULL,
    `calorieTotal` INTEGER NOT NULL,
    `material` VARCHAR(191) NOT NULL,
    `calorieDetail` VARCHAR(191) NOT NULL,
    `price` INTEGER NOT NULL,
    `difficulty` VARCHAR(191) NOT NULL,
    `recipe` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`detailId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `EatMeal` (
    `eatId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `mealId` INTEGER NOT NULL,
    `eatAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`eatId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MarkMeal` (
    `fixId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `mealId` INTEGER NOT NULL,
    `fixAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`fixId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `LikeMeal` (
    `likeId` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `mealId` INTEGER NOT NULL,
    `likeAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`likeId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MealSubCategory` (
    `categoryId` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`categoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MarkMaterial` ADD CONSTRAINT `MarkMaterial_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Agreement` ADD CONSTRAINT `Agreement_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ReviewSub` ADD CONSTRAINT `ReviewSub_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MealSub` ADD CONSTRAINT `MealSub_mealId_fkey` FOREIGN KEY (`mealId`) REFERENCES `Meal`(`mealId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MealSub` ADD CONSTRAINT `MealSub_categoryId_fkey` FOREIGN KEY (`categoryId`) REFERENCES `MealSubCategory`(`categoryId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MealDetail` ADD CONSTRAINT `MealDetail_mealId_fkey` FOREIGN KEY (`mealId`) REFERENCES `Meal`(`mealId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EatMeal` ADD CONSTRAINT `EatMeal_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `EatMeal` ADD CONSTRAINT `EatMeal_mealId_fkey` FOREIGN KEY (`mealId`) REFERENCES `Meal`(`mealId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MarkMeal` ADD CONSTRAINT `MarkMeal_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MarkMeal` ADD CONSTRAINT `MarkMeal_mealId_fkey` FOREIGN KEY (`mealId`) REFERENCES `Meal`(`mealId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LikeMeal` ADD CONSTRAINT `LikeMeal_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `LikeMeal` ADD CONSTRAINT `LikeMeal_mealId_fkey` FOREIGN KEY (`mealId`) REFERENCES `Meal`(`mealId`) ON DELETE RESTRICT ON UPDATE CASCADE;
