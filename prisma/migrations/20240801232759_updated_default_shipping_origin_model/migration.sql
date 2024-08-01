/*
  Warnings:

  - Added the required column `address` to the `DefaultShippingOrigin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `company` to the `DefaultShippingOrigin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `firstName` to the `DefaultShippingOrigin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `DefaultShippingOrigin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `DefaultShippingOrigin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DefaultShippingOrigin" ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "company" TEXT NOT NULL,
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "zip" TEXT;
