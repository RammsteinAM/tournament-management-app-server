-- AlterTable
ALTER TABLE "User" ADD COLUMN     "passwordResetToken" TEXT,
ALTER COLUMN "email" DROP NOT NULL;
