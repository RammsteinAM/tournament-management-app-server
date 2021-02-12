/*
  Warnings:

  - You are about to drop the column `title` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `Tournament` table. All the data in the column will be lost.
  - You are about to drop the column `authorId` on the `Tournament` table. All the data in the column will be lost.
  - Added the required column `winningSets` to the `Tournament` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tournamentTypeId` to the `Tournament` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tournament" DROP CONSTRAINT "Tournament_authorId_fkey";

-- AlterTable
ALTER TABLE "Tournament" DROP COLUMN "title",
DROP COLUMN "type",
DROP COLUMN "authorId",
ADD COLUMN     "goalsToWin" INTEGER,
ADD COLUMN     "winningSets" INTEGER NOT NULL,
ADD COLUMN     "userId" INTEGER,
ADD COLUMN     "tournamentTypeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "TournamentType" (
"id" SERIAL,
    "name" TEXT NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Player" (
"id" SERIAL,
    "name" TEXT NOT NULL,
    "tournamentId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Game" (
"id" SERIAL,
    "tournamentId" INTEGER NOT NULL,
    "round" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
"id" SERIAL,
    "gameId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "point" INTEGER,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Player" ADD FOREIGN KEY("tournamentId")REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD FOREIGN KEY("tournamentId")REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD FOREIGN KEY("gameId")REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD FOREIGN KEY("playerId")REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournament" ADD FOREIGN KEY("userId")REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tournament" ADD FOREIGN KEY("tournamentTypeId")REFERENCES "TournamentType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
