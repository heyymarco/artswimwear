/*
  Warnings:

  - You are about to drop the `ShippingOrigin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ShippingOrigin" DROP CONSTRAINT "ShippingOrigin_parentId_fkey";

-- DropTable
DROP TABLE "ShippingOrigin";
