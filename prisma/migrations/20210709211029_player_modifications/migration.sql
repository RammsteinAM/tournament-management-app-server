-- CreateTable
CREATE TABLE "PlayerModification" (
    "id" SERIAL NOT NULL,
    "tournamentId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "initialNumberOfLives" INTEGER,
    "removed" BOOLEAN,

    PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PlayerModification" ADD FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerModification" ADD FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
