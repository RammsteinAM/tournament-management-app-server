-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "tournamentId" INTEGER;

-- AddForeignKey
ALTER TABLE "Player" ADD FOREIGN KEY ("tournamentId") REFERENCES "Tournament"("id") ON DELETE SET NULL ON UPDATE CASCADE;
