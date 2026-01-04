-- AlterTable
ALTER TABLE "UserGame" ADD COLUMN     "played" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "SiteConfig" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "newGameDays" INTEGER NOT NULL DEFAULT 7,
    "topicColors" JSONB,
    "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
    "welcomeMessage" TEXT,
    "featuredGameIds" TEXT[],
    "minPlayStreak" INTEGER NOT NULL DEFAULT 1,
    "enableCommunitySubmissions" BOOLEAN NOT NULL DEFAULT false,
    "defaultSort" TEXT NOT NULL DEFAULT 'title',
    "maxCustomLists" INTEGER NOT NULL DEFAULT 10,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SiteConfig_pkey" PRIMARY KEY ("id")
);
