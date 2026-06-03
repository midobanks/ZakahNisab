-- CreateTable
CREATE TABLE "EmailSubscription" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "confirmedAt" TIMESTAMP(3),
    "unsubscribeToken" TEXT NOT NULL,
    "unsubscribedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PriceCache" (
    "id" TEXT NOT NULL,
    "currency" TEXT NOT NULL,
    "goldPrice" DOUBLE PRECISION NOT NULL,
    "silverPrice" DOUBLE PRECISION NOT NULL,
    "exchangeRate" DOUBLE PRECISION NOT NULL,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PriceCache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MetalPrice" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "baseCurrency" TEXT NOT NULL DEFAULT 'USD',
    "goldPricePerTroyOunce" DOUBLE PRECISION NOT NULL,
    "silverPricePerTroyOunce" DOUBLE PRECISION NOT NULL,
    "goldPricePerGram" DOUBLE PRECISION NOT NULL,
    "silverPricePerGram" DOUBLE PRECISION NOT NULL,
    "sourceTimestamp" TIMESTAMP(3),
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'live',
    "rawResponse" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MetalPrice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExchangeRate" (
    "id" TEXT NOT NULL,
    "baseCurrency" TEXT NOT NULL,
    "targetCurrency" TEXT NOT NULL,
    "rate" DOUBLE PRECISION NOT NULL,
    "provider" TEXT NOT NULL,
    "providerUpdatedAt" TIMESTAMP(3),
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExchangeRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiRefreshLog" (
    "id" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "metadata" JSONB,

    CONSTRAINT "ApiRefreshLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailSubscription_email_key" ON "EmailSubscription"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EmailSubscription_unsubscribeToken_key" ON "EmailSubscription"("unsubscribeToken");

-- CreateIndex
CREATE UNIQUE INDEX "PriceCache_currency_key" ON "PriceCache"("currency");

-- CreateIndex
CREATE INDEX "MetalPrice_fetchedAt_idx" ON "MetalPrice"("fetchedAt" DESC);

-- CreateIndex
CREATE INDEX "MetalPrice_provider_idx" ON "MetalPrice"("provider");

-- CreateIndex
CREATE UNIQUE INDEX "ExchangeRate_baseCurrency_targetCurrency_fetchedAt_key" ON "ExchangeRate"("baseCurrency", "targetCurrency", "fetchedAt");
