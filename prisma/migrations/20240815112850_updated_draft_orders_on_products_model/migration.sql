/*
  Warnings:

  - You are about to drop the column `draftOrderId` on the `DraftOrdersOnProducts` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `OrdersOnProducts` table. All the data in the column will be lost.
  - Added the required column `parentId` to the `DraftOrdersOnProducts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentId` to the `OrdersOnProducts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "DraftOrdersOnProducts" DROP CONSTRAINT "DraftOrdersOnProducts_draftOrderId_fkey";

-- DropForeignKey
ALTER TABLE "OrdersOnProducts" DROP CONSTRAINT "OrdersOnProducts_orderId_fkey";

-- AlterTable
ALTER TABLE "DraftOrdersOnProducts" DROP COLUMN "draftOrderId",
ADD COLUMN     "parentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrdersOnProducts" DROP COLUMN "orderId",
ADD COLUMN     "parentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "DraftOrdersOnProducts" ADD CONSTRAINT "DraftOrdersOnProducts_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "DraftOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdersOnProducts" ADD CONSTRAINT "OrdersOnProducts_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
