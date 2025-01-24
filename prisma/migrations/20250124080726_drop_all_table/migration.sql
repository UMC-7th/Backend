/*
  Warnings:

  - You are about to drop the `agreement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `eat_meal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `hot_material` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `image_food` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `like_meal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mark_material` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mark_meal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `meal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `meal_detail` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `meal_sub` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `meal_sub_category` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `review_sub` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `agreement` DROP FOREIGN KEY `agreement_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `eat_meal` DROP FOREIGN KEY `eat_meal_meal_id_fkey`;

-- DropForeignKey
ALTER TABLE `eat_meal` DROP FOREIGN KEY `eat_meal_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `like_meal` DROP FOREIGN KEY `like_meal_meal_id_fkey`;

-- DropForeignKey
ALTER TABLE `like_meal` DROP FOREIGN KEY `like_meal_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `mark_material` DROP FOREIGN KEY `mark_material_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `mark_meal` DROP FOREIGN KEY `mark_meal_meal_id_fkey`;

-- DropForeignKey
ALTER TABLE `mark_meal` DROP FOREIGN KEY `mark_meal_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `meal_detail` DROP FOREIGN KEY `meal_detail_meal_id_fkey`;

-- DropForeignKey
ALTER TABLE `meal_sub` DROP FOREIGN KEY `meal_sub_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `meal_sub` DROP FOREIGN KEY `meal_sub_meal_id_fkey`;

-- DropForeignKey
ALTER TABLE `review_sub` DROP FOREIGN KEY `review_sub_user_id_fkey`;

-- DropTable
DROP TABLE `agreement`;

-- DropTable
DROP TABLE `eat_meal`;

-- DropTable
DROP TABLE `hot_material`;

-- DropTable
DROP TABLE `image_food`;

-- DropTable
DROP TABLE `like_meal`;

-- DropTable
DROP TABLE `mark_material`;

-- DropTable
DROP TABLE `mark_meal`;

-- DropTable
DROP TABLE `meal`;

-- DropTable
DROP TABLE `meal_detail`;

-- DropTable
DROP TABLE `meal_sub`;

-- DropTable
DROP TABLE `meal_sub_category`;

-- DropTable
DROP TABLE `review_sub`;

-- DropTable
DROP TABLE `user`;
