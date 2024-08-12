/*
  Warnings:

  - You are about to drop the column `variantGroupId` on the `Variant` table. All the data in the column will be lost.
  - Added the required column `parentId` to the `Variant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Variant" DROP CONSTRAINT "Variant_variantGroupId_fkey";

-- AlterTable
ALTER TABLE "Variant" DROP COLUMN "variantGroupId",
ADD COLUMN     "parentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "VariantGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
