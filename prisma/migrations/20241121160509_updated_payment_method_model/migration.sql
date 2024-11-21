/*
  Warnings:

  - You are about to drop the column `expiresAt` on the `PaymentMethod` table. All the data in the column will be lost.
  - You are about to drop the `PaymentMethodBillingAddress` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "PaymentMethodBillingAddress" DROP CONSTRAINT "PaymentMethodBillingAddress_parentId_fkey";

-- AlterTable
ALTER TABLE "PaymentMethod" DROP COLUMN "expiresAt";

-- DropTable
DROP TABLE "PaymentMethodBillingAddress";
