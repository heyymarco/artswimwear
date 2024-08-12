/*
  Warnings:

  - You are about to drop the column `productId` on the `Stock` table. All the data in the column will be lost.
  - Added the required column `parentId` to the `Stock` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Stock" DROP CONSTRAINT "Stock_productId_fkey";

-- AlterTable
ALTER TABLE "Stock" DROP COLUMN "productId",
ADD COLUMN     "parentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
