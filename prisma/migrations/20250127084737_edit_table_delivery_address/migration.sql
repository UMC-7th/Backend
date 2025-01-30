/*
  Warnings:

  - You are about to drop the column `receive_loc` on the `delivery_address` table. All the data in the column will be lost.
  - Added the required column `memo` to the `delivery_address` table without a default value. This is not possible if the table is not empty.
  - Added the required column `post_num` to the `delivery_address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `delivery_address` DROP COLUMN `receive_loc`,
    ADD COLUMN `memo` TEXT NOT NULL,
    ADD COLUMN `post_num` INTEGER NOT NULL;
