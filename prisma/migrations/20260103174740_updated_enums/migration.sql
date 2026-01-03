/*
  Warnings:

  - The values [history,movies,music,games,math,tv,animals,language,science,art,other] on the enum `Topic` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Topic_new" AS ENUM ('words', 'puzzle', 'geography', 'trivia', 'entertainment', 'gaming', 'nature', 'food', 'sports');
ALTER TABLE "Game" ALTER COLUMN "topic" TYPE "Topic_new" USING ("topic"::text::"Topic_new");
ALTER TYPE "Topic" RENAME TO "Topic_old";
ALTER TYPE "Topic_new" RENAME TO "Topic";
DROP TYPE "public"."Topic_old";
COMMIT;

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "topic" SET DEFAULT 'puzzle';
