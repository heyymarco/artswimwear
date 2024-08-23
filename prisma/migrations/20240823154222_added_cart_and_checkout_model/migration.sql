-- CreateEnum
CREATE TYPE "CheckoutStep" AS ENUM ('INFO', 'SHIPPING', 'PAYMENT', 'PENDING', 'PAID');

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "parentId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantIds" TEXT[],

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Checkout" (
    "id" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "checkoutStep" "CheckoutStep" NOT NULL DEFAULT 'INFO',
    "billingAsShipping" BOOLEAN NOT NULL DEFAULT true,
    "paymentMethod" TEXT,
    "parentId" TEXT NOT NULL,
    "shippingProviderId" TEXT,

    CONSTRAINT "Checkout_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckoutShippingAddress" (
    "id" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zip" TEXT,
    "address" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "CheckoutShippingAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckoutBillingAddress" (
    "id" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "zip" TEXT,
    "address" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "CheckoutBillingAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CheckoutPaymentSession" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "refreshAt" TIMESTAMP(3) NOT NULL,
    "paypalSession" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "CheckoutPaymentSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cart_parentId_key" ON "Cart"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "Checkout_parentId_key" ON "Checkout"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "CheckoutShippingAddress_parentId_key" ON "CheckoutShippingAddress"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "CheckoutBillingAddress_parentId_key" ON "CheckoutBillingAddress"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "CheckoutPaymentSession_parentId_key" ON "CheckoutPaymentSession"("parentId");

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkout" ADD CONSTRAINT "Checkout_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Checkout" ADD CONSTRAINT "Checkout_shippingProviderId_fkey" FOREIGN KEY ("shippingProviderId") REFERENCES "ShippingProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckoutShippingAddress" ADD CONSTRAINT "CheckoutShippingAddress_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Checkout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckoutBillingAddress" ADD CONSTRAINT "CheckoutBillingAddress_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Checkout"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CheckoutPaymentSession" ADD CONSTRAINT "CheckoutPaymentSession_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Checkout"("id") ON DELETE CASCADE ON UPDATE CASCADE;
