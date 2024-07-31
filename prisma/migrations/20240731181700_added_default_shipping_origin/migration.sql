-- CreateTable
CREATE TABLE "DefaultShippingOrigin" (
    "id" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,

    CONSTRAINT "DefaultShippingOrigin_pkey" PRIMARY KEY ("id")
);
