-- CreateTable
CREATE TABLE "Strike" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "entityName" TEXT,
    "city" TEXT NOT NULL,
    "state" VARCHAR(2) NOT NULL,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "demands" TEXT,
    "confidence" TEXT NOT NULL DEFAULT 'unverified',
    "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "approvedBy" TEXT,
    "approvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Strike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StrikeSource" (
    "id" TEXT NOT NULL,
    "strikeId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publisher" TEXT,
    "publishedAt" TIMESTAMP(3),
    "excerpt" TEXT,
    "sourceType" TEXT NOT NULL DEFAULT 'news',
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StrikeSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IngestCandidate" (
    "id" TEXT NOT NULL,
    "rawText" TEXT NOT NULL,
    "rawUrl" TEXT,
    "extracted" JSONB,
    "score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IngestCandidate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Strike_state_city_category_startedAt_idx" ON "Strike"("state", "city", "category", "startedAt");

-- CreateIndex
CREATE INDEX "Strike_status_startedAt_idx" ON "Strike"("status", "startedAt");

-- CreateIndex
CREATE INDEX "Strike_published_status_idx" ON "Strike"("published", "status");

-- CreateIndex
CREATE INDEX "StrikeSource_strikeId_idx" ON "StrikeSource"("strikeId");

-- CreateIndex
CREATE INDEX "IngestCandidate_status_score_idx" ON "IngestCandidate"("status", "score");

-- AddForeignKey
ALTER TABLE "StrikeSource" ADD CONSTRAINT "StrikeSource_strikeId_fkey" FOREIGN KEY ("strikeId") REFERENCES "Strike"("id") ON DELETE CASCADE ON UPDATE CASCADE;
