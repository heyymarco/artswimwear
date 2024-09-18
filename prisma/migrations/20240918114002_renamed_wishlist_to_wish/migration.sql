/*
  Warnings:

  - You are about to drop the `Wishlist` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `WishlistGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_groupId_fkey";

-- DropForeignKey
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Wishlist" DROP CONSTRAINT "Wishlist_productId_fkey";

-- DropForeignKey
ALTER TABLE "WishlistGroup" DROP CONSTRAINT "WishlistGroup_parentId_fkey";

-- DropTable
DROP TABLE "Wishlist";

-- DropTable
DROP TABLE "WishlistGroup";

-- CreateTable
CREATE TABLE "WishGroup" (
    "id" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "WishGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wish" (
    "id" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "groupId" TEXT,

    CONSTRAINT "Wish_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WishGroup_name_key" ON "WishGroup"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Wish_parentId_productId_key" ON "Wish"("parentId", "productId");

-- AddForeignKey
ALTER TABLE "WishGroup" ADD CONSTRAINT "WishGroup_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wish" ADD CONSTRAINT "Wish_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wish" ADD CONSTRAINT "Wish_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wish" ADD CONSTRAINT "Wish_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "WishGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
