/*
  Warnings:

  - A unique constraint covering the columns `[trackerId]` on the table `ShippingTracking` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ShippingTracking" ADD COLUMN     "trackerId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ShippingTracking_trackerId_key" ON "ShippingTracking"("trackerId");
