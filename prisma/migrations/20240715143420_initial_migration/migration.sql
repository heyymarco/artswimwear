-- CreateEnum
CREATE TYPE "ProductVisibility" AS ENUM ('PUBLISHED', 'HIDDEN', 'DRAFT');

-- CreateEnum
CREATE TYPE "VariantVisibility" AS ENUM ('PUBLISHED', 'DRAFT');

-- CreateEnum
CREATE TYPE "ShippingVisibility" AS ENUM ('PUBLISHED', 'DRAFT');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('NEW_ORDER', 'CANCELED', 'EXPIRED', 'PROCESSED', 'ON_THE_WAY', 'IN_TROUBLE', 'COMPLETED');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('CARD', 'PAYPAL', 'EWALLET', 'CUSTOM', 'MANUAL', 'MANUAL_PAID');

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "visibility" "ProductVisibility" NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "shippingWeight" DOUBLE PRECISION,
    "stock" INTEGER,
    "path" TEXT NOT NULL,
    "excerpt" TEXT,
    "description" JSONB,
    "images" TEXT[],

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VariantGroup" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sort" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "hasDedicatedStocks" BOOLEAN NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "VariantGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Variant" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "visibility" "VariantVisibility" NOT NULL,
    "sort" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "shippingWeight" DOUBLE PRECISION,
    "images" TEXT[],
    "variantGroupId" TEXT NOT NULL,

    CONSTRAINT "Variant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateVariantGroup" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "hasDedicatedStocks" BOOLEAN NOT NULL,

    CONSTRAINT "TemplateVariantGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TemplateVariant" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "visibility" "VariantVisibility" NOT NULL,
    "sort" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION,
    "shippingWeight" DOUBLE PRECISION,
    "images" TEXT[],
    "templateVariantGroupId" TEXT NOT NULL,

    CONSTRAINT "TemplateVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stock" (
    "id" TEXT NOT NULL,
    "value" INTEGER,
    "productId" TEXT NOT NULL,
    "variantIds" TEXT[],

    CONSTRAINT "Stock_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingProvider" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "visibility" "ShippingVisibility" NOT NULL,
    "autoUpdate" BOOLEAN NOT NULL DEFAULT false,
    "name" TEXT NOT NULL,
    "weightStep" DOUBLE PRECISION NOT NULL,
    "useZones" BOOLEAN NOT NULL,

    CONSTRAINT "ShippingProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoverageCountry" (
    "id" TEXT NOT NULL,
    "sort" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "useZones" BOOLEAN NOT NULL,

    CONSTRAINT "CoverageCountry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoverageState" (
    "id" TEXT NOT NULL,
    "sort" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,
    "useZones" BOOLEAN NOT NULL,

    CONSTRAINT "CoverageState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoverageCity" (
    "id" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "sort" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "CoverageCity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingOrigin" (
    "id" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "ShippingOrigin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingProviderEta" (
    "id" TEXT NOT NULL,
    "min" DOUBLE PRECISION NOT NULL,
    "max" DOUBLE PRECISION NOT NULL,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "ShippingProviderEta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoverageCountryEta" (
    "id" TEXT NOT NULL,
    "min" DOUBLE PRECISION NOT NULL,
    "max" DOUBLE PRECISION NOT NULL,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "CoverageCountryEta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoverageStateEta" (
    "id" TEXT NOT NULL,
    "min" DOUBLE PRECISION NOT NULL,
    "max" DOUBLE PRECISION NOT NULL,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "CoverageStateEta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoverageCityEta" (
    "id" TEXT NOT NULL,
    "min" DOUBLE PRECISION NOT NULL,
    "max" DOUBLE PRECISION NOT NULL,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "CoverageCityEta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingProviderRate" (
    "id" TEXT NOT NULL,
    "sort" INTEGER NOT NULL,
    "start" DOUBLE PRECISION NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "ShippingProviderRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoverageCountryRate" (
    "id" TEXT NOT NULL,
    "sort" INTEGER NOT NULL,
    "start" DOUBLE PRECISION NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "CoverageCountryRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoverageStateRate" (
    "id" TEXT NOT NULL,
    "sort" INTEGER NOT NULL,
    "start" DOUBLE PRECISION NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "CoverageStateRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CoverageCityRate" (
    "id" TEXT NOT NULL,
    "sort" INTEGER NOT NULL,
    "start" DOUBLE PRECISION NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "CoverageCityRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DraftOrder" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "orderId" TEXT NOT NULL,
    "paymentId" TEXT,
    "shippingCost" DOUBLE PRECISION,
    "customerId" TEXT,
    "guestId" TEXT,
    "shippingProviderId" TEXT,

    CONSTRAINT "DraftOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "orderId" TEXT NOT NULL,
    "paymentId" TEXT,
    "shippingCost" DOUBLE PRECISION,
    "orderStatus" "OrderStatus" NOT NULL DEFAULT 'NEW_ORDER',
    "orderTrouble" JSONB,
    "cancelationReason" JSONB,
    "customerId" TEXT,
    "guestId" TEXT,
    "shippingProviderId" TEXT,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DraftOrderCurrency" (
    "id" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "DraftOrderCurrency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderCurrency" (
    "id" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "OrderCurrency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DraftShippingAddress" (
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

    CONSTRAINT "DraftShippingAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingAddress" (
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

    CONSTRAINT "ShippingAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillingAddress" (
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

    CONSTRAINT "BillingAddress_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "type" "PaymentType" NOT NULL,
    "brand" TEXT,
    "identifier" TEXT,
    "expiresAt" TIMESTAMP(3),
    "amount" DOUBLE PRECISION NOT NULL,
    "fee" DOUBLE PRECISION NOT NULL,
    "parentId" TEXT,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DraftOrdersOnProducts" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "shippingWeight" DOUBLE PRECISION,
    "quantity" INTEGER NOT NULL,
    "draftOrderId" TEXT NOT NULL,
    "productId" TEXT,
    "variantIds" TEXT[],

    CONSTRAINT "DraftOrdersOnProducts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrdersOnProducts" (
    "id" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "shippingWeight" DOUBLE PRECISION,
    "quantity" INTEGER NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT,
    "variantIds" TEXT[],

    CONSTRAINT "OrdersOnProducts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentConfirmation" (
    "id" TEXT NOT NULL,
    "reportedAt" TIMESTAMP(3),
    "reviewedAt" TIMESTAMP(3),
    "token" TEXT NOT NULL,
    "amount" DOUBLE PRECISION,
    "payerName" TEXT,
    "paymentDate" TIMESTAMP(3),
    "originatingBank" TEXT,
    "destinationBank" TEXT,
    "rejectionReason" JSONB,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "PaymentConfirmation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingTracking" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "shippingCarrier" TEXT,
    "shippingNumber" TEXT,
    "orderId" TEXT NOT NULL,

    CONSTRAINT "ShippingTracking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingTrackingLog" (
    "id" TEXT NOT NULL,
    "reportedAt" TIMESTAMP(3),
    "log" TEXT NOT NULL,
    "shippingTrackingId" TEXT NOT NULL,

    CONSTRAINT "ShippingTrackingLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Country" (
    "id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "dialCode" TEXT NOT NULL,

    CONSTRAINT "Country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guest" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Guest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuestPreference" (
    "id" TEXT NOT NULL,
    "marketingOpt" BOOLEAN,
    "timezone" DOUBLE PRECISION,
    "guestId" TEXT NOT NULL,

    CONSTRAINT "GuestPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerPreference" (
    "id" TEXT NOT NULL,
    "marketingOpt" BOOLEAN,
    "timezone" DOUBLE PRECISION,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "CustomerPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerAccount" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "CustomerAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerSession" (
    "id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "CustomerSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerCredentials" (
    "id" TEXT NOT NULL,
    "failureAttempts" INTEGER,
    "lockedAt" TIMESTAMP(3),
    "username" TEXT,
    "password" TEXT,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "CustomerCredentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerPasswordResetToken" (
    "id" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "CustomerPasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerEmailConfirmationToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "CustomerEmailConfirmationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Admin" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "adminRoleId" TEXT,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminPreference" (
    "id" TEXT NOT NULL,
    "emailOrderNewPending" BOOLEAN,
    "emailOrderNewPaid" BOOLEAN,
    "emailOrderCanceled" BOOLEAN,
    "emailOrderExpired" BOOLEAN,
    "emailOrderConfirmed" BOOLEAN,
    "emailOrderRejected" BOOLEAN,
    "emailOrderProcessing" BOOLEAN,
    "emailOrderShipping" BOOLEAN,
    "emailOrderCompleted" BOOLEAN,
    "adminId" TEXT NOT NULL,

    CONSTRAINT "AdminPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminAccount" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "adminId" TEXT NOT NULL,

    CONSTRAINT "AdminAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminSession" (
    "id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,

    CONSTRAINT "AdminSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminCredentials" (
    "id" TEXT NOT NULL,
    "failureAttempts" INTEGER,
    "lockedAt" TIMESTAMP(3),
    "username" TEXT,
    "password" TEXT,
    "adminId" TEXT NOT NULL,

    CONSTRAINT "AdminCredentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminPasswordResetToken" (
    "id" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,

    CONSTRAINT "AdminPasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminEmailConfirmationToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,

    CONSTRAINT "AdminEmailConfirmationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminRole" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "product_r" BOOLEAN NOT NULL DEFAULT false,
    "product_c" BOOLEAN NOT NULL DEFAULT false,
    "product_ud" BOOLEAN NOT NULL DEFAULT false,
    "product_ui" BOOLEAN NOT NULL DEFAULT false,
    "product_up" BOOLEAN NOT NULL DEFAULT false,
    "product_us" BOOLEAN NOT NULL DEFAULT false,
    "product_uv" BOOLEAN NOT NULL DEFAULT false,
    "product_d" BOOLEAN NOT NULL DEFAULT false,
    "order_r" BOOLEAN NOT NULL DEFAULT false,
    "order_us" BOOLEAN NOT NULL DEFAULT false,
    "order_usa" BOOLEAN NOT NULL DEFAULT false,
    "order_upmu" BOOLEAN NOT NULL DEFAULT false,
    "order_upmp" BOOLEAN NOT NULL DEFAULT false,
    "shipping_r" BOOLEAN NOT NULL DEFAULT false,
    "shipping_c" BOOLEAN NOT NULL DEFAULT false,
    "shipping_ud" BOOLEAN NOT NULL DEFAULT false,
    "shipping_up" BOOLEAN NOT NULL DEFAULT false,
    "shipping_uv" BOOLEAN NOT NULL DEFAULT false,
    "shipping_d" BOOLEAN NOT NULL DEFAULT false,
    "admin_r" BOOLEAN NOT NULL DEFAULT false,
    "admin_c" BOOLEAN NOT NULL DEFAULT false,
    "admin_un" BOOLEAN NOT NULL DEFAULT false,
    "admin_uu" BOOLEAN NOT NULL DEFAULT false,
    "admin_ue" BOOLEAN NOT NULL DEFAULT false,
    "admin_up" BOOLEAN NOT NULL DEFAULT false,
    "admin_ui" BOOLEAN NOT NULL DEFAULT false,
    "admin_ur" BOOLEAN NOT NULL DEFAULT false,
    "admin_d" BOOLEAN NOT NULL DEFAULT false,
    "role_c" BOOLEAN NOT NULL DEFAULT false,
    "role_u" BOOLEAN NOT NULL DEFAULT false,
    "role_d" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "AdminRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Product_path_key" ON "Product"("path");

-- CreateIndex
CREATE UNIQUE INDEX "ShippingOrigin_parentId_key" ON "ShippingOrigin"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "ShippingProviderEta_parentId_key" ON "ShippingProviderEta"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "CoverageCountryEta_parentId_key" ON "CoverageCountryEta"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "CoverageStateEta_parentId_key" ON "CoverageStateEta"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "CoverageCityEta_parentId_key" ON "CoverageCityEta"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "DraftOrder_orderId_key" ON "DraftOrder"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "DraftOrder_paymentId_key" ON "DraftOrder"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderId_key" ON "Order"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_paymentId_key" ON "Order"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "DraftOrderCurrency_parentId_key" ON "DraftOrderCurrency"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "OrderCurrency_parentId_key" ON "OrderCurrency"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "DraftShippingAddress_parentId_key" ON "DraftShippingAddress"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "ShippingAddress_parentId_key" ON "ShippingAddress"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "BillingAddress_parentId_key" ON "BillingAddress"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_parentId_key" ON "Payment"("parentId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentConfirmation_token_key" ON "PaymentConfirmation"("token");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentConfirmation_orderId_key" ON "PaymentConfirmation"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "ShippingTracking_token_key" ON "ShippingTracking"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ShippingTracking_orderId_key" ON "ShippingTracking"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");

-- CreateIndex
CREATE UNIQUE INDEX "GuestPreference_guestId_key" ON "GuestPreference"("guestId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerPreference_customerId_key" ON "CustomerPreference"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerAccount_provider_providerAccountId_key" ON "CustomerAccount"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerSession_sessionToken_key" ON "CustomerSession"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerCredentials_username_key" ON "CustomerCredentials"("username");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerCredentials_customerId_key" ON "CustomerCredentials"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerPasswordResetToken_token_key" ON "CustomerPasswordResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerPasswordResetToken_customerId_key" ON "CustomerPasswordResetToken"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerEmailConfirmationToken_token_key" ON "CustomerEmailConfirmationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerEmailConfirmationToken_customerId_key" ON "CustomerEmailConfirmationToken"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AdminPreference_adminId_key" ON "AdminPreference"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminAccount_provider_providerAccountId_key" ON "AdminAccount"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminSession_sessionToken_key" ON "AdminSession"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "AdminCredentials_username_key" ON "AdminCredentials"("username");

-- CreateIndex
CREATE UNIQUE INDEX "AdminCredentials_adminId_key" ON "AdminCredentials"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminPasswordResetToken_token_key" ON "AdminPasswordResetToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "AdminPasswordResetToken_adminId_key" ON "AdminPasswordResetToken"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminEmailConfirmationToken_token_key" ON "AdminEmailConfirmationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "AdminEmailConfirmationToken_adminId_key" ON "AdminEmailConfirmationToken"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminRole_name_key" ON "AdminRole"("name");

-- AddForeignKey
ALTER TABLE "VariantGroup" ADD CONSTRAINT "VariantGroup_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Variant" ADD CONSTRAINT "Variant_variantGroupId_fkey" FOREIGN KEY ("variantGroupId") REFERENCES "VariantGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TemplateVariant" ADD CONSTRAINT "TemplateVariant_templateVariantGroupId_fkey" FOREIGN KEY ("templateVariantGroupId") REFERENCES "TemplateVariantGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stock" ADD CONSTRAINT "Stock_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoverageCountry" ADD CONSTRAINT "CoverageCountry_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ShippingProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoverageState" ADD CONSTRAINT "CoverageState_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "CoverageCountry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoverageCity" ADD CONSTRAINT "CoverageCity_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "CoverageState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingOrigin" ADD CONSTRAINT "ShippingOrigin_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ShippingProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingProviderEta" ADD CONSTRAINT "ShippingProviderEta_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ShippingProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoverageCountryEta" ADD CONSTRAINT "CoverageCountryEta_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "CoverageCountry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoverageStateEta" ADD CONSTRAINT "CoverageStateEta_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "CoverageState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoverageCityEta" ADD CONSTRAINT "CoverageCityEta_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "CoverageCity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingProviderRate" ADD CONSTRAINT "ShippingProviderRate_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ShippingProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoverageCountryRate" ADD CONSTRAINT "CoverageCountryRate_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "CoverageCountry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoverageStateRate" ADD CONSTRAINT "CoverageStateRate_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "CoverageState"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CoverageCityRate" ADD CONSTRAINT "CoverageCityRate_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "CoverageCity"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DraftOrder" ADD CONSTRAINT "DraftOrder_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DraftOrder" ADD CONSTRAINT "DraftOrder_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DraftOrder" ADD CONSTRAINT "DraftOrder_shippingProviderId_fkey" FOREIGN KEY ("shippingProviderId") REFERENCES "ShippingProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_shippingProviderId_fkey" FOREIGN KEY ("shippingProviderId") REFERENCES "ShippingProvider"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DraftOrderCurrency" ADD CONSTRAINT "DraftOrderCurrency_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "DraftOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderCurrency" ADD CONSTRAINT "OrderCurrency_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DraftShippingAddress" ADD CONSTRAINT "DraftShippingAddress_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "DraftOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingAddress" ADD CONSTRAINT "ShippingAddress_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingAddress" ADD CONSTRAINT "BillingAddress_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DraftOrdersOnProducts" ADD CONSTRAINT "DraftOrdersOnProducts_draftOrderId_fkey" FOREIGN KEY ("draftOrderId") REFERENCES "DraftOrder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DraftOrdersOnProducts" ADD CONSTRAINT "DraftOrdersOnProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdersOnProducts" ADD CONSTRAINT "OrdersOnProducts_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdersOnProducts" ADD CONSTRAINT "OrdersOnProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentConfirmation" ADD CONSTRAINT "PaymentConfirmation_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingTracking" ADD CONSTRAINT "ShippingTracking_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingTrackingLog" ADD CONSTRAINT "ShippingTrackingLog_shippingTrackingId_fkey" FOREIGN KEY ("shippingTrackingId") REFERENCES "ShippingTracking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GuestPreference" ADD CONSTRAINT "GuestPreference_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "Guest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerPreference" ADD CONSTRAINT "CustomerPreference_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerAccount" ADD CONSTRAINT "CustomerAccount_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerSession" ADD CONSTRAINT "CustomerSession_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerCredentials" ADD CONSTRAINT "CustomerCredentials_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerPasswordResetToken" ADD CONSTRAINT "CustomerPasswordResetToken_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerEmailConfirmationToken" ADD CONSTRAINT "CustomerEmailConfirmationToken_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_adminRoleId_fkey" FOREIGN KEY ("adminRoleId") REFERENCES "AdminRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminPreference" ADD CONSTRAINT "AdminPreference_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminAccount" ADD CONSTRAINT "AdminAccount_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminSession" ADD CONSTRAINT "AdminSession_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminCredentials" ADD CONSTRAINT "AdminCredentials_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminPasswordResetToken" ADD CONSTRAINT "AdminPasswordResetToken_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AdminEmailConfirmationToken" ADD CONSTRAINT "AdminEmailConfirmationToken_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE CASCADE ON UPDATE CASCADE;
