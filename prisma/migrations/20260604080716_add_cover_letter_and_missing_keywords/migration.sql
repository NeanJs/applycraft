-- AlterTable
ALTER TABLE "User" ADD COLUMN     "coverLetter" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "missingKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- CreateIndex
CREATE INDEX "Resume_userId_idx" ON "Resume"("userId");
