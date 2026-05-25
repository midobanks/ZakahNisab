CREATE TABLE "Donation" (
    "id" TEXT NOT NULL,
    "stripeSessionId" TEXT NOT NULL,
    "stripePaymentId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "customerEmail" TEXT,
    "customerName" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Donation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Donation_stripeSessionId_key" ON "Donation"("stripeSessionId");
CREATE INDEX "Donation_stripeSessionId_idx" ON "Donation"("stripeSessionId");
CREATE INDEX "Donation_status_idx" ON "Donation"("status");
CREATE INDEX "Donation_createdAt_idx" ON "Donation"("createdAt" DESC);
