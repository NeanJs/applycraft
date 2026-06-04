/*
  Warnings:

  - You are about to drop the column `coverLetter` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `missingKeywords` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Resume" ADD COLUMN     "coverLetter" TEXT,
ADD COLUMN     "jobDescription" TEXT,
ADD COLUMN     "missingKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- AlterTable
ALTER TABLE "User" DROP COLUMN "coverLetter",
DROP COLUMN "missingKeywords";
