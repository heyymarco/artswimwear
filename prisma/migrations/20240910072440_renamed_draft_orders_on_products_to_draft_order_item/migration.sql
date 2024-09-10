/*
  Warnings:

  - You are about to drop the `DraftOrdersOnProducts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DraftOrdersOnProducts" DROP CONSTRAINT "DraftOrdersOnProducts_parentId_fkey";

-- DropForeignKey
ALTER TABLE "DraftOrdersOnProducts" DROP CONSTRAINT "DraftOrdersOnProducts_productId_fkey";

-- DropTable
DROP TABLE "DraftOrdersOnProducts";

-- CreateTable
CREATE TABLE "DraftOrderItem" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "shippingWeight" DOUBLE PRECISION,
    "quantity" INTEGER NOT NULL,
    "parentId" TEXT NOT NULL,
    "productId" TEXT,
    "variantIds" TEXT[],

    CONSTRAINT "DraftOrderItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DraftOrderItem" ADD CONSTRAINT "DraftOrderItem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "DraftOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DraftOrderItem" ADD CONSTRAINT "DraftOrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
