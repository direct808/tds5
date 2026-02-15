-- AlterTable
ALTER TABLE "stream" ADD COLUMN "deletedAt" TIMESTAMPTZ;

CREATE INDEX idx_affiliate_network_not_deleted ON "affiliate_network" ("deletedAt") WHERE "deletedAt" IS NULL;
CREATE INDEX idx_campaign_not_deleted ON "campaign" ("deletedAt") WHERE "deletedAt" IS NULL;
CREATE INDEX idx_domain_not_deleted ON "domain" ("deletedAt") WHERE "deletedAt" IS NULL;
CREATE INDEX idx_offer_not_deleted ON "offer" ("deletedAt") WHERE "deletedAt" IS NULL;
CREATE INDEX idx_source_not_deleted ON "source" ("deletedAt") WHERE "deletedAt" IS NULL;
CREATE INDEX idx_stream_not_deleted ON "stream" ("deletedAt") WHERE "deletedAt" IS NULL;