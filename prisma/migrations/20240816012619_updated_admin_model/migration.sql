/*
  Warnings:

  - You are about to drop the column `adminRoleId` on the `Admin` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_adminRoleId_fkey";

-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "adminRoleId",
ADD COLUMN     "roleId" TEXT;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "AdminRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;
