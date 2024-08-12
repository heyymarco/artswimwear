/*
  Warnings:

  - You are about to drop the column `productId` on the `VariantGroup` table. All the data in the column will be lost.
  - Added the required column `parentId` to the `VariantGroup` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "VariantGroup" DROP CONSTRAINT "VariantGroup_productId_fkey";

-- AlterTable
ALTER TABLE "VariantGroup" DROP COLUMN "productId",
ADD COLUMN     "parentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "VariantGroup" ADD CONSTRAINT "VariantGroup_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
