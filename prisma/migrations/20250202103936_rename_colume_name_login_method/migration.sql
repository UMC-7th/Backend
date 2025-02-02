/*
  Warnings:

  - You are about to drop the column `loginMethod` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `loginMethod`,
    ADD COLUMN `login_method` VARCHAR(100) NOT NULL DEFAULT '';
