-- DropForeignKey
ALTER TABLE "Checkout" DROP CONSTRAINT "Checkout_parentId_fkey";

-- AddForeignKey
ALTER TABLE "Checkout" ADD CONSTRAINT "Checkout_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;
