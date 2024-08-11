-- CreateTable
CREATE TABLE "ShippingTrackingEta" (
    "id" TEXT NOT NULL,
    "min" DOUBLE PRECISION NOT NULL,
    "max" DOUBLE PRECISION NOT NULL,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "ShippingTrackingEta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShippingTrackingEta_parentId_key" ON "ShippingTrackingEta"("parentId");

-- AddForeignKey
ALTER TABLE "ShippingTrackingEta" ADD CONSTRAINT "ShippingTrackingEta_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ShippingTracking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
