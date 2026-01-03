-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Topic" ADD VALUE 'puzzle';
ALTER TYPE "Topic" ADD VALUE 'trivia';
ALTER TYPE "Topic" ADD VALUE 'geography';
ALTER TYPE "Topic" ADD VALUE 'tv';
ALTER TYPE "Topic" ADD VALUE 'food';
ALTER TYPE "Topic" ADD VALUE 'sports';
ALTER TYPE "Topic" ADD VALUE 'animals';
ALTER TYPE "Topic" ADD VALUE 'language';
ALTER TYPE "Topic" ADD VALUE 'science';
ALTER TYPE "Topic" ADD VALUE 'art';
ALTER TYPE "Topic" ADD VALUE 'other';

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "played" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "topic" DROP DEFAULT;
