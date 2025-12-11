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
    "offerParams" TEXT,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "affiliate_network_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,
    "code" VARCHAR NOT NULL,
    "sourceId" UUID,
    "active" BOOLEAN NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

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
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "click_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversion" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "originalStatus" TEXT,
    "clickId" CHAR(12) NOT NULL,
    "params" JSONB,
    "status" TEXT NOT NULL,
    "previousStatus" TEXT,
    "revenue" DECIMAL(12,2),
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "conversion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "offer" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "affiliateNetworkId" UUID,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

    CONSTRAINT "offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "source" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,
    "deletedAt" TIMESTAMPTZ,

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
    "offerId" UUID NOT NULL,
    "percent" SMALLINT NOT NULL,
    "active" BOOLEAN NOT NULL,
    "streamId" UUID NOT NULL,

    CONSTRAINT "stream_offer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "timeZone" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "affiliate_network_userId_idx" ON "affiliate_network"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "campaign_code_key" ON "campaign"("code");

-- CreateIndex
CREATE INDEX "campaign_userId_idx" ON "campaign"("userId");

-- CreateIndex
CREATE INDEX "click_campaignId_idx" ON "click"("campaignId");

-- CreateIndex
CREATE INDEX "click_previousCampaignId_idx" ON "click"("previousCampaignId");

-- CreateIndex
CREATE INDEX "click_offerId_idx" ON "click"("offerId");

-- CreateIndex
CREATE INDEX "click_affiliateNetworkId_idx" ON "click"("affiliateNetworkId");

-- CreateIndex
CREATE INDEX "click_sourceId_idx" ON "click"("sourceId");

-- CreateIndex
CREATE INDEX "click_streamId_idx" ON "click"("streamId");

-- CreateIndex
CREATE INDEX "click_destination_idx" ON "click"("destination");

-- CreateIndex
CREATE INDEX "click_isUniqueGlobal_idx" ON "click"("isUniqueGlobal");

-- CreateIndex
CREATE INDEX "click_isUniqueCampaign_idx" ON "click"("isUniqueCampaign");

-- CreateIndex
CREATE INDEX "click_isUniqueStream_idx" ON "click"("isUniqueStream");

-- CreateIndex
CREATE INDEX "click_isProxy_idx" ON "click"("isProxy");

-- CreateIndex
CREATE INDEX "click_country_idx" ON "click"("country");

-- CreateIndex
CREATE INDEX "click_region_idx" ON "click"("region");

-- CreateIndex
CREATE INDEX "click_city_idx" ON "click"("city");

-- CreateIndex
CREATE INDEX "click_ip_idx" ON "click"("ip");

-- CreateIndex
CREATE INDEX "click_referer_idx" ON "click"("referer");

-- CreateIndex
CREATE INDEX "click_userAgent_idx" ON "click"("userAgent");

-- CreateIndex
CREATE INDEX "click_language_idx" ON "click"("language");

-- CreateIndex
CREATE INDEX "click_isBot_idx" ON "click"("isBot");

-- CreateIndex
CREATE INDEX "click_deviceType_idx" ON "click"("deviceType");

-- CreateIndex
CREATE INDEX "click_os_idx" ON "click"("os");

-- CreateIndex
CREATE INDEX "click_osVersion_idx" ON "click"("osVersion");

-- CreateIndex
CREATE INDEX "click_browser_idx" ON "click"("browser");

-- CreateIndex
CREATE INDEX "click_browserVersion_idx" ON "click"("browserVersion");

-- CreateIndex
CREATE INDEX "click_deviceModel_idx" ON "click"("deviceModel");

-- CreateIndex
CREATE INDEX "click_keyword_idx" ON "click"("keyword");

-- CreateIndex
CREATE INDEX "click_source_idx" ON "click"("source");

-- CreateIndex
CREATE INDEX "click_externalId_idx" ON "click"("externalId");

-- CreateIndex
CREATE INDEX "click_creativeId_idx" ON "click"("creativeId");

-- CreateIndex
CREATE INDEX "click_adCampaignId_idx" ON "click"("adCampaignId");

-- CreateIndex
CREATE INDEX "click_subId1_idx" ON "click"("subId1");

-- CreateIndex
CREATE INDEX "click_subId2_idx" ON "click"("subId2");

-- CreateIndex
CREATE INDEX "click_extraParam1_idx" ON "click"("extraParam1");

-- CreateIndex
CREATE INDEX "click_extraParam2_idx" ON "click"("extraParam2");

-- CreateIndex
CREATE INDEX "conversion_clickId_idx" ON "conversion"("clickId");

-- CreateIndex
CREATE INDEX "offer_userId_idx" ON "offer"("userId");

-- CreateIndex
CREATE INDEX "source_userId_idx" ON "source"("userId");

-- CreateIndex
CREATE INDEX "stream_campaignId_idx" ON "stream"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "stream_offer_offerId_streamId_key" ON "stream_offer"("offerId", "streamId");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "affiliate_network" ADD CONSTRAINT "affiliate_network_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "campaign" ADD CONSTRAINT "campaign_sourceId_fkey" FOREIGN KEY ("sourceId") REFERENCES "source"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "conversion" ADD CONSTRAINT "conversion_clickId_fkey" FOREIGN KEY ("clickId") REFERENCES "click"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

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
ALTER TABLE "stream_offer" ADD CONSTRAINT "stream_offer_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "offer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "stream_offer" ADD CONSTRAINT "stream_offer_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "stream"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

