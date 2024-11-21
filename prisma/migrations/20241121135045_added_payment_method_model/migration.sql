/*
  Warnings:

  - A unique constraint covering the columns `[paypalCustomerId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[stripeCustomerId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[midtransCustomerId]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "PaymentMethodProvider" AS ENUM ('PAYPAL', 'STRIPE', 'MIDTRANS');

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "midtransCustomerId" TEXT,
ADD COLUMN     "paypalCustomerId" TEXT,
ADD COLUMN     "stripeCustomerId" TEXT;

-- CreateTable
CREATE TABLE "PaymentMethod" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "sort" INTEGER NOT NULL,
    "provider" "PaymentMethodProvider" NOT NULL,
    "providerPaymentMethodId" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "PaymentMethod_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentMethodBillingAddress" (
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

    CONSTRAINT "PaymentMethodBillingAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_parentId_key" ON "PaymentMethod"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethod_provider_providerPaymentMethodId_key" ON "PaymentMethod"("provider", "providerPaymentMethodId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentMethodBillingAddress_parentId_key" ON "PaymentMethodBillingAddress"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_paypalCustomerId_key" ON "Customer"("paypalCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_stripeCustomerId_key" ON "Customer"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_midtransCustomerId_key" ON "Customer"("midtransCustomerId");

-- AddForeignKey
ALTER TABLE "PaymentMethod" ADD CONSTRAINT "PaymentMethod_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentMethodBillingAddress" ADD CONSTRAINT "PaymentMethodBillingAddress_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "PaymentMethod"("id") ON DELETE CASCADE ON UPDATE CASCADE;
