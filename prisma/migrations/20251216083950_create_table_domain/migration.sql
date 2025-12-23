-- AlterTable
ALTER TABLE "campaign" ADD COLUMN     "domainId" UUID;

-- CreateTable
CREATE TABLE "domain" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "indexPageCampaignId" UUID,
    "intercept404" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "domain_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "domain_name_key" ON "domain"("name");

-- CreateIndex
CREATE INDEX "conversion_clickId_idx" ON "conversion"("clickId");

-- AddForeignKey
ALTER TABLE "domain" ADD CONSTRAINT "domain_indexPageCampaignId_fkey" FOREIGN KEY ("indexPageCampaignId") REFERENCES "campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_domainId_fkey" FOREIGN KEY ("domainId") REFERENCES "domain"("id") ON DELETE SET NULL ON UPDATE CASCADE;
