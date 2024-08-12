/*
  Warnings:

  - You are about to drop the column `orderId` on the `PaymentConfirmation` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[parentId]` on the table `PaymentConfirmation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `parentId` to the `PaymentConfirmation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PaymentConfirmation" DROP CONSTRAINT "PaymentConfirmation_orderId_fkey";

-- DropIndex
DROP INDEX "PaymentConfirmation_orderId_key";

-- AlterTable
ALTER TABLE "PaymentConfirmation" DROP COLUMN "orderId",
ADD COLUMN     "parentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "PaymentConfirmation_parentId_key" ON "PaymentConfirmation"("parentId");

-- AddForeignKey
ALTER TABLE "PaymentConfirmation" ADD CONSTRAINT "PaymentConfirmation_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
