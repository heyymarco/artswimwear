-- CreateTable
CREATE TABLE "EasypostRateCache" (
    "id" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "EasypostRateCache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EasypostRateCacheItem" (
    "id" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "shippingProviderId" TEXT NOT NULL,

    CONSTRAINT "EasypostRateCacheItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EasypostRateCacheItemEta" (
    "id" TEXT NOT NULL,
    "min" DOUBLE PRECISION NOT NULL,
    "max" DOUBLE PRECISION NOT NULL,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "EasypostRateCacheItemEta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EasypostRateCache_key_key" ON "EasypostRateCache"("key");

-- CreateIndex
CREATE UNIQUE INDEX "EasypostRateCacheItemEta_parentId_key" ON "EasypostRateCacheItemEta"("parentId");

-- AddForeignKey
ALTER TABLE "EasypostRateCacheItem" ADD CONSTRAINT "EasypostRateCacheItem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "EasypostRateCache"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EasypostRateCacheItem" ADD CONSTRAINT "EasypostRateCacheItem_shippingProviderId_fkey" FOREIGN KEY ("shippingProviderId") REFERENCES "ShippingProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EasypostRateCacheItemEta" ADD CONSTRAINT "EasypostRateCacheItemEta_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "EasypostRateCacheItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
