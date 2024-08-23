/*
  Warnings:

  - Changed the type of `expiresAt` on the `CheckoutPaymentSession` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `refreshAt` on the `CheckoutPaymentSession` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "CheckoutPaymentSession" DROP COLUMN "expiresAt",
ADD COLUMN     "expiresAt" INTEGER NOT NULL,
DROP COLUMN "refreshAt",
ADD COLUMN     "refreshAt" INTEGER NOT NULL;
