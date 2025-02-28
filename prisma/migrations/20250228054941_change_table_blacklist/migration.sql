/*
  Warnings:

  - You are about to drop the `blacklist_refresh_token` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "blacklist_refresh_token";

-- CreateTable
CREATE TABLE "blacklist_token" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "blacklist_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "blacklist_token_token_key" ON "blacklist_token"("token");
