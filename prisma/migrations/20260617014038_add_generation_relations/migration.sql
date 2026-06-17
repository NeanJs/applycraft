-- DropIndex
DROP INDEX "Generation_createdAt_idx";

-- DropIndex
DROP INDEX "Generation_type_idx";

-- CreateIndex
CREATE INDEX "Generation_resumeId_idx" ON "Generation"("resumeId");
