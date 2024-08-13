/*
  Warnings:

  - You are about to drop the column `adminId` on the `AdminAccount` table. All the data in the column will be lost.
  - You are about to drop the column `adminId` on the `AdminCredentials` table. All the data in the column will be lost.
  - You are about to drop the column `adminId` on the `AdminEmailConfirmationToken` table. All the data in the column will be lost.
  - You are about to drop the column `adminId` on the `AdminPasswordResetToken` table. All the data in the column will be lost.
  - You are about to drop the column `adminId` on the `AdminSession` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `CustomerAccount` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `CustomerCredentials` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `CustomerEmailConfirmationToken` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `CustomerPasswordResetToken` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `CustomerSession` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[parentId]` on the table `AdminCredentials` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[parentId]` on the table `AdminEmailConfirmationToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[parentId]` on the table `AdminPasswordResetToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[parentId]` on the table `CustomerCredentials` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[parentId]` on the table `CustomerEmailConfirmationToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[parentId]` on the table `CustomerPasswordResetToken` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `parentId` to the `AdminAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentId` to the `AdminCredentials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentId` to the `AdminEmailConfirmationToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentId` to the `AdminPasswordResetToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentId` to the `AdminSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentId` to the `CustomerAccount` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentId` to the `CustomerCredentials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentId` to the `CustomerEmailConfirmationToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentId` to the `CustomerPasswordResetToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `parentId` to the `CustomerSession` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "AdminAccount" DROP CONSTRAINT "AdminAccount_adminId_fkey";

-- DropForeignKey
ALTER TABLE "AdminCredentials" DROP CONSTRAINT "AdminCredentials_adminId_fkey";

-- DropForeignKey
ALTER TABLE "AdminEmailConfirmationToken" DROP CONSTRAINT "AdminEmailConfirmationToken_adminId_fkey";

-- DropForeignKey
ALTER TABLE "AdminPasswordResetToken" DROP CONSTRAINT "AdminPasswordResetToken_adminId_fkey";

-- DropForeignKey
ALTER TABLE "AdminSession" DROP CONSTRAINT "AdminSession_adminId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerAccount" DROP CONSTRAINT "CustomerAccount_customerId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerCredentials" DROP CONSTRAINT "CustomerCredentials_customerId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerEmailConfirmationToken" DROP CONSTRAINT "CustomerEmailConfirmationToken_customerId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerPasswordResetToken" DROP CONSTRAINT "CustomerPasswordResetToken_customerId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerSession" DROP CONSTRAINT "CustomerSession_customerId_fkey";

-- DropIndex
DROP INDEX "AdminCredentials_adminId_key";

-- DropIndex
DROP INDEX "AdminEmailConfirmationToken_adminId_key";

-- DropIndex
DROP INDEX "AdminPasswordResetToken_adminId_key";

-- DropIndex
DROP INDEX "CustomerCredentials_customerId_key";

-- DropIndex
DROP INDEX "CustomerEmailConfirmationToken_customerId_key";

-- DropIndex
DROP INDEX "CustomerPasswordResetToken_customerId_key";

-- AlterTable
ALTER TABLE "AdminAccount" DROP COLUMN "adminId",
ADD COLUMN     "parentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AdminCredentials" DROP COLUMN "adminId",
ADD COLUMN     "parentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AdminEmailConfirmationToken" DROP COLUMN "adminId",
ADD COLUMN     "parentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AdminPasswordResetToken" DROP COLUMN "adminId",
ADD COLUMN     "parentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "AdminSession" DROP COLUMN "adminId",
ADD COLUMN     "parentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CustomerAccount" DROP COLUMN "customerId",
ADD COLUMN     "parentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CustomerCredentials" DROP COLUMN "customerId",
ADD COLUMN     "parentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CustomerEmailConfirmationToken" DROP COLUMN "customerId",
ADD COLUMN     "parentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CustomerPasswordResetToken" DROP COLUMN "customerId",
ADD COLUMN     "parentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "CustomerSession" DROP COLUMN "customerId",
ADD COLUMN     "parentId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AdminCredentials_parentId_key" ON "AdminCredentials"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminEmailConfirmationToken_parentId_key" ON "AdminEmailConfirmationToken"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminPasswordResetToken_parentId_key" ON "AdminPasswordResetToken"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerCredentials_parentId_key" ON "CustomerCredentials"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerEmailConfirmationToken_parentId_key" ON "CustomerEmailConfirmationToken"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerPasswordResetToken_parentId_key" ON "CustomerPasswordResetToken"("parentId");

-- AddForeignKey
ALTER TABLE "CustomerAccount" ADD CONSTRAINT "CustomerAccount_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSession" ADD CONSTRAINT "CustomerSession_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerCredentials" ADD CONSTRAINT "CustomerCredentials_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerPasswordResetToken" ADD CONSTRAINT "CustomerPasswordResetToken_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerEmailConfirmationToken" ADD CONSTRAINT "CustomerEmailConfirmationToken_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminAccount" ADD CONSTRAINT "AdminAccount_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminSession" ADD CONSTRAINT "AdminSession_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminCredentials" ADD CONSTRAINT "AdminCredentials_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminPasswordResetToken" ADD CONSTRAINT "AdminPasswordResetToken_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminEmailConfirmationToken" ADD CONSTRAINT "AdminEmailConfirmationToken_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
