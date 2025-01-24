-- CreateTable
CREATE TABLE `user` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `birth` DATETIME(6) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `phone_num` VARCHAR(100) NOT NULL,
    `purpose` TEXT NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `DeliveryAddress` (
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
CREATE TABLE `meal_user` (
    `meal_user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `meal_id` INTEGER NOT NULL,
    `time` VARCHAR(100) NOT NULL,
    `meal_date` DATETIME(6) NOT NULL,
    `is_mark` BOOLEAN NOT NULL DEFAULT false,
    `is_like` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`meal_user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meal` (
    `meal_id` INTEGER NOT NULL AUTO_INCREMENT,
    `food` VARCHAR(200) NOT NULL,
    `calorie_total` INTEGER NOT NULL,
    `material` VARCHAR(200) NOT NULL,
    `calorie_detail` VARCHAR(200) NOT NULL,
    `price` INTEGER NOT NULL,
    `difficulty` VARCHAR(100) NOT NULL,
    `recipe` TEXT NOT NULL,

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
CREATE TABLE `Subscribe` (
    `sub_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `meal_sub_id` INTEGER NOT NULL,
    `review` TEXT NOT NULL,
    `score` INTEGER NOT NULL,

    PRIMARY KEY (`sub_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `KartSub` (
    `kard_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `meal_sub_id` INTEGER NOT NULL,
    `cnt` INTEGER NOT NULL,

    PRIMARY KEY (`kard_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `meal_sub` (
    `meal_sub_id` INTEGER NOT NULL AUTO_INCREMENT,
    `meal_id` INTEGER NOT NULL,
    `category_id` INTEGER NOT NULL,
    `time` VARCHAR(100) NOT NULL,
    `meal_date` DATETIME(6) NOT NULL,

    PRIMARY KEY (`meal_sub_id`)
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
CREATE TABLE `meal_sub_category` (
    `category_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `image_food` (
    `image_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(100) NOT NULL,
    `image_url` TEXT NOT NULL,
    `search_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),

    PRIMARY KEY (`image_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `hot_material` (
    `hot_id` INTEGER NOT NULL AUTO_INCREMENT,
    `text` TEXT NOT NULL,
    `material` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`hot_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `DeliveryAddress` ADD CONSTRAINT `DeliveryAddress_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_user` ADD CONSTRAINT `meal_user_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_user` ADD CONSTRAINT `meal_user_meal_id_fkey` FOREIGN KEY (`meal_id`) REFERENCES `meal`(`meal_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `mark_material` ADD CONSTRAINT `mark_material_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `agreement` ADD CONSTRAINT `agreement_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscribe` ADD CONSTRAINT `Subscribe_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Subscribe` ADD CONSTRAINT `Subscribe_meal_sub_id_fkey` FOREIGN KEY (`meal_sub_id`) REFERENCES `meal_sub`(`meal_sub_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KartSub` ADD CONSTRAINT `KartSub_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `KartSub` ADD CONSTRAINT `KartSub_meal_sub_id_fkey` FOREIGN KEY (`meal_sub_id`) REFERENCES `meal_sub`(`meal_sub_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_sub` ADD CONSTRAINT `meal_sub_meal_id_fkey` FOREIGN KEY (`meal_id`) REFERENCES `meal`(`meal_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `meal_sub` ADD CONSTRAINT `meal_sub_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `meal_sub_category`(`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eat_meal` ADD CONSTRAINT `eat_meal_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `eat_meal` ADD CONSTRAINT `eat_meal_meal_id_fkey` FOREIGN KEY (`meal_id`) REFERENCES `meal`(`meal_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
