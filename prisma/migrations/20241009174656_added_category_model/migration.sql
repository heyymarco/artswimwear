-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "visibility" "ProductVisibility" NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "excerpt" TEXT,
    "description" JSONB,
    "images" TEXT[],
    "parentId" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Product__Category" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_path_key" ON "Category"("path");

-- CreateIndex
CREATE UNIQUE INDEX "_Product__Category_AB_unique" ON "_Product__Category"("A", "B");

-- CreateIndex
CREATE INDEX "_Product__Category_B_index" ON "_Product__Category"("B");

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Product__Category" ADD CONSTRAINT "_Product__Category_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Product__Category" ADD CONSTRAINT "_Product__Category_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
