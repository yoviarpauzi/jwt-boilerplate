-- CreateTable
CREATE TABLE "blacklist_refresh_token" (
    "id" SERIAL NOT NULL,
    "refresh_token" TEXT NOT NULL,

    CONSTRAINT "blacklist_refresh_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blacklist_refresh_token_refresh_token_key" ON "blacklist_refresh_token"("refresh_token");
