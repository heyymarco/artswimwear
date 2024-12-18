/*
  Warnings:

  - You are about to drop the column `paymentMethod` on the `Checkout` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Checkout" DROP COLUMN "paymentMethod",
ADD COLUMN     "paymentOption" TEXT;
