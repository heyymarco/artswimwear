/*
  Warnings:

  - You are about to drop the `CheckoutPaymentSession` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CheckoutPaymentSession" DROP CONSTRAINT "CheckoutPaymentSession_parentId_fkey";

-- DropTable
DROP TABLE "CheckoutPaymentSession";
