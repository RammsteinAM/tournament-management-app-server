/*
  Warnings:

  - A unique constraint covering the columns `[shareId]` on the table `Tournament` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Tournament" ADD COLUMN     "shareId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Tournament.shareId_unique" ON "Tournament"("shareId");
