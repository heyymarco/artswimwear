/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `WishlistGroup` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "WishlistGroup_name_key" ON "WishlistGroup"("name");
