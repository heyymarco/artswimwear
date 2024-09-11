/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Wishlist` table. All the data in the column will be lost.
  - Added the required column `parentId` to the `WishlistGroup` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Wishlist" DROP COLUMN "updatedAt",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "WishlistGroup" ADD COLUMN     "parentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "WishlistGroup" ADD CONSTRAINT "WishlistGroup_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
