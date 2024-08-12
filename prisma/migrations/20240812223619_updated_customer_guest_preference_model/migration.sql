/*
  Warnings:

  - You are about to drop the column `customerId` on the `CustomerPreference` table. All the data in the column will be lost.
  - You are about to drop the column `guestId` on the `GuestPreference` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[parentId]` on the table `CustomerPreference` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[parentId]` on the table `GuestPreference` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `parentId` to the `CustomerPreference` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentId` to the `GuestPreference` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CustomerPreference" DROP CONSTRAINT "CustomerPreference_customerId_fkey";

-- DropForeignKey
ALTER TABLE "GuestPreference" DROP CONSTRAINT "GuestPreference_guestId_fkey";

-- DropIndex
DROP INDEX "CustomerPreference_customerId_key";

-- DropIndex
DROP INDEX "GuestPreference_guestId_key";

-- AlterTable
ALTER TABLE "CustomerPreference" DROP COLUMN "customerId",
ADD COLUMN     "parentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "GuestPreference" DROP COLUMN "guestId",
ADD COLUMN     "parentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "CustomerPreference_parentId_key" ON "CustomerPreference"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "GuestPreference_parentId_key" ON "GuestPreference"("parentId");

-- AddForeignKey
ALTER TABLE "CustomerPreference" ADD CONSTRAINT "CustomerPreference_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestPreference" ADD CONSTRAINT "GuestPreference_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;
