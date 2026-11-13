-- AlterTable
ALTER TABLE "Strike" ADD COLUMN     "scope" TEXT NOT NULL DEFAULT 'municipal',
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "state" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Strike_scope_status_idx" ON "Strike"("scope", "status");
