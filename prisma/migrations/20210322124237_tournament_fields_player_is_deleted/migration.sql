/*
  Warnings:

  - You are about to drop the column `goalsToWin` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `winningSets` on the `Tournament` table. All the data in the column will be lost.
  - Added the required column `sets` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "isDeleted" BOOLEAN;

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "goalsToWin",
DROP COLUMN "winningSets",
ADD COLUMN     "numberOfTables" INTEGER,
ADD COLUMN     "numberOfGoals" INTEGER,
ADD COLUMN     "sets" INTEGER NOT NULL,
ADD COLUMN     "numberOfLives" INTEGER,
ADD COLUMN     "draw" BOOLEAN,
ADD COLUMN     "pointsForWin" INTEGER,
ADD COLUMN     "pointsForDraw" INTEGER;
