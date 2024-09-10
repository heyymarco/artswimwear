/*
  Warnings:

  - A unique constraint covering the columns `[parentId,productId]` on the table `Wishlist` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_parentId_productId_key" ON "Wishlist"("parentId", "productId");
