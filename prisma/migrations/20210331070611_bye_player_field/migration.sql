/*
  Warnings:

  - Made the column `userId` on table `Tournament` required. The migration will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "haByePlayer" BOOLEAN;

-- AlterTable
ALTER TABLE "Tournament" ALTER COLUMN "userId" SET NOT NULL;
