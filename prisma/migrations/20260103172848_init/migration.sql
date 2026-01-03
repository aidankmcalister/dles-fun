-- CreateEnum
CREATE TYPE "Topic" AS ENUM ('words', 'history', 'movies', 'music', 'games', 'math');

-- CreateTable
CREATE TABLE "Game" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "topic" "Topic" NOT NULL DEFAULT 'games',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Game_link_key" ON "Game"("link");

-- CreateIndex
CREATE INDEX "Game_topic_idx" ON "Game"("topic");
