-- AlterTable
ALTER TABLE "AdminRole" ADD COLUMN     "category_c" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "category_d" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "category_r" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "category_ud" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "category_ui" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "category_uv" BOOLEAN NOT NULL DEFAULT false;
