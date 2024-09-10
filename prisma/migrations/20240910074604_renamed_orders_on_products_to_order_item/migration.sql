/*
  Warnings:

  - You are about to drop the `OrdersOnProducts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "OrdersOnProducts" DROP CONSTRAINT "OrdersOnProducts_parentId_fkey";

-- DropForeignKey
ALTER TABLE "OrdersOnProducts" DROP CONSTRAINT "OrdersOnProducts_productId_fkey";

-- DropTable
DROP TABLE "OrdersOnProducts";

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "shippingWeight" DOUBLE PRECISION,
    "quantity" INTEGER NOT NULL,
    "parentId" TEXT NOT NULL,
    "productId" TEXT,
    "variantIds" TEXT[],

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;
