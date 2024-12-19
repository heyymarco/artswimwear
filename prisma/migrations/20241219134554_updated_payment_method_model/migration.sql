/*
  Warnings:

  - Added the required column `type` to the `PaymentMethod` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentMethodType" AS ENUM ('CARD');

-- AlterTable
ALTER TABLE "PaymentMethod" ADD COLUMN     "type" "PaymentMethodType" NOT NULL;
