/*
  Warnings:

  - You are about to drop the column `notifyByEmail` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `notifyBySMS` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `notifyInApp` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "notifyByEmail",
DROP COLUMN "notifyBySMS",
DROP COLUMN "notifyInApp";
