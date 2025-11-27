-- CreateEnum
CREATE TYPE "stream_action_type_enum" AS ENUM ('NOTHING', 'SHOW404', 'SHOW_HTML', 'SHOW_TEXT', 'TO_CAMPAIGN');

-- CreateEnum
CREATE TYPE "stream_redirect_type_enum" AS ENUM ('CURL', 'FORM_SUBMIT', 'HTTP', 'IFRAME', 'JS', 'META', 'META2', 'REMOTE', 'WITHOUT_REFERER');

-- CreateEnum
CREATE TYPE "stream_schema_enum" AS ENUM ('ACTION', 'DIRECT_URL', 'LANDINGS_OFFERS');

-- CreateTable
CREATE TABLE "affiliate_network" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "offer_params" TEXT,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "affiliate_network_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,
    "code" VARCHAR NOT NULL,
    "source_id" UUID,
    "active" BOOLEAN NOT NULL,
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMPTZ(6),

    CONSTRAINT "campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "click" (
    "id" CHAR(12) NOT NULL,
    "visitorId" CHAR(6) NOT NULL,
    "campaignId" UUID NOT NULL,
    "previousCampaignId" UUID,
    "offerId" UUID,
    "affiliateNetworkId" UUID,
    "sourceId" UUID,
    "streamId" UUID,
    "destination" TEXT,
    "isUniqueGlobal" BOOLEAN,
    "isUniqueCampaign" BOOLEAN,
    "isUniqueStream" BOOLEAN,
    "isProxy" BOOLEAN,
    "country" TEXT,
    "region" TEXT,
    "city" TEXT,
    "ip" INET,
    "referer" TEXT,
    "userAgent" TEXT,
    "language" CHAR(2),
    "isBot" BOOLEAN,
    "deviceType" TEXT,
    "os" TEXT,
    "osVersion" TEXT,
    "browser" TEXT,
    "browserVersion" TEXT,
    "deviceModel" TEXT,
    "keyword" TEXT,
    "source" TEXT,
    "cost" DECIMAL(12,2),
    "externalId" TEXT,
    "creativeId" TEXT,
    "adCampaignId" TEXT,
    "subId1" TEXT,
    "subId2" TEXT,
    "extraParam1" TEXT,
    "extraParam2" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "click_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversion" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "original_status" TEXT,
    "click_id" CHAR(12) NOT NULL,
    "params" JSONB,
    "status" TEXT NOT NULL,
    "previous_status" TEXT,
    "revenue" DECIMAL(12,2),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offer" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "affiliateNetworkId" UUID,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "source" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "source_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stream" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,
    "campaignId" UUID NOT NULL,
    "schema" "stream_schema_enum" NOT NULL,
    "redirectType" "stream_redirect_type_enum",
    "redirectUrl" TEXT,
    "actionType" "stream_action_type_enum",
    "actionCampaignId" UUID,
    "actionContent" TEXT,
    "filters" JSONB,

    CONSTRAINT "stream_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stream_offer" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "offer_id" UUID NOT NULL,
    "percent" SMALLINT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "stream_id" UUID NOT NULL,

    CONSTRAINT "stream_offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "affiliate_network_user_id_idx" ON "affiliate_network"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_code_key" ON "campaign"("code");

-- CreateIndex
CREATE INDEX "campaign_user_id_idx" ON "campaign"("user_id");

-- CreateIndex
CREATE INDEX "conversion_click_id_idx" ON "conversion"("click_id");

-- CreateIndex
CREATE INDEX "offer_userId_idx" ON "offer"("userId");

-- CreateIndex
CREATE INDEX "source_userId_idx" ON "source"("userId");

-- CreateIndex
CREATE INDEX "stream_campaignId_idx" ON "stream"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "stream_offer_offer_id_stream_id_key" ON "stream_offer"("offer_id", "stream_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "affiliate_network" ADD CONSTRAINT "affiliate_network_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "source"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "conversion" ADD CONSTRAINT "conversion_click_id_fkey" FOREIGN KEY ("click_id") REFERENCES "click"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "offer" ADD CONSTRAINT "offer_affiliateNetworkId_fkey" FOREIGN KEY ("affiliateNetworkId") REFERENCES "affiliate_network"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "offer" ADD CONSTRAINT "offer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "source" ADD CONSTRAINT "source_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stream" ADD CONSTRAINT "stream_actionCampaignId_fkey" FOREIGN KEY ("actionCampaignId") REFERENCES "campaign"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stream" ADD CONSTRAINT "stream_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaign"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stream_offer" ADD CONSTRAINT "stream_offer_offer_id_fkey" FOREIGN KEY ("offer_id") REFERENCES "offer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stream_offer" ADD CONSTRAINT "stream_offer_stream_id_fkey" FOREIGN KEY ("stream_id") REFERENCES "stream"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

