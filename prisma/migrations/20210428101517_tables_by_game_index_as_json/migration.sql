/*
  Warnings:

  - The `tablesByGameIndex` column on the `Tournament` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "tablesByGameIndex",
ADD COLUMN     "tablesByGameIndex" JSONB;
