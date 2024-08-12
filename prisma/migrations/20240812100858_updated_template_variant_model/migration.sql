/*
  Warnings:

  - You are about to drop the column `templateVariantGroupId` on the `TemplateVariant` table. All the data in the column will be lost.
  - Added the required column `parentId` to the `TemplateVariant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TemplateVariant" DROP CONSTRAINT "TemplateVariant_templateVariantGroupId_fkey";

-- AlterTable
ALTER TABLE "TemplateVariant" DROP COLUMN "templateVariantGroupId",
ADD COLUMN     "parentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "TemplateVariant" ADD CONSTRAINT "TemplateVariant_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "TemplateVariantGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
