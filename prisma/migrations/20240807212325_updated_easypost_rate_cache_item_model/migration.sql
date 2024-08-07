/*
  Warnings:

  - You are about to drop the column `shippingProviderId` on the `EasypostRateCacheItem` table. All the data in the column will be lost.
  - Added the required column `carrier` to the `EasypostRateCacheItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `service` to the `EasypostRateCacheItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "EasypostRateCacheItem" DROP CONSTRAINT "EasypostRateCacheItem_shippingProviderId_fkey";

-- AlterTable
ALTER TABLE "EasypostRateCacheItem" DROP COLUMN "shippingProviderId",
ADD COLUMN     "carrier" TEXT NOT NULL,
ADD COLUMN     "service" TEXT NOT NULL;
