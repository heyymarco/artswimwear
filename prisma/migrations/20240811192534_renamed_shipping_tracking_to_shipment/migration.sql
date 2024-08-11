/*
  Warnings:

  - You are about to drop the `ShippingTracking` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShippingTrackingEta` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ShippingTrackingLog` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ShippingTracking" DROP CONSTRAINT "ShippingTracking_orderId_fkey";

-- DropForeignKey
ALTER TABLE "ShippingTrackingEta" DROP CONSTRAINT "ShippingTrackingEta_parentId_fkey";

-- DropForeignKey
ALTER TABLE "ShippingTrackingLog" DROP CONSTRAINT "ShippingTrackingLog_shippingTrackingId_fkey";

-- DropTable
DROP TABLE "ShippingTracking";

-- DropTable
DROP TABLE "ShippingTrackingEta";

-- DropTable
DROP TABLE "ShippingTrackingLog";

-- CreateTable
CREATE TABLE "Shipment" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "trackerId" TEXT,
    "carrier" TEXT,
    "number" TEXT,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "Shipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipmentEta" (
    "id" TEXT NOT NULL,
    "min" DOUBLE PRECISION NOT NULL,
    "max" DOUBLE PRECISION NOT NULL,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "ShipmentEta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipmentLog" (
    "id" TEXT NOT NULL,
    "reportedAt" TIMESTAMP(3),
    "log" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "ShipmentLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_token_key" ON "Shipment"("token");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_trackerId_key" ON "Shipment"("trackerId");

-- CreateIndex
CREATE UNIQUE INDEX "Shipment_parentId_key" ON "Shipment"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "ShipmentEta_parentId_key" ON "ShipmentEta"("parentId");

-- AddForeignKey
ALTER TABLE "Shipment" ADD CONSTRAINT "Shipment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentEta" ADD CONSTRAINT "ShipmentEta_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentLog" ADD CONSTRAINT "ShipmentLog_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Shipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
