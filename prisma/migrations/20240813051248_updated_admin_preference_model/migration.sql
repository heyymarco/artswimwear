/*
  Warnings:

  - You are about to drop the column `adminId` on the `AdminPreference` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[parentId]` on the table `AdminPreference` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `parentId` to the `AdminPreference` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AdminPreference" DROP CONSTRAINT "AdminPreference_adminId_fkey";

-- DropIndex
DROP INDEX "AdminPreference_adminId_key";

-- AlterTable
ALTER TABLE "AdminPreference" DROP COLUMN "adminId",
ADD COLUMN     "parentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AdminPreference_parentId_key" ON "AdminPreference"("parentId");

-- AddForeignKey
ALTER TABLE "AdminPreference" ADD CONSTRAINT "AdminPreference_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
