/*
  Warnings:

  - You are about to drop the column `url` on the `VideoShort` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[assetId]` on the table `VideoShort` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `assetId` to the `VideoShort` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "VideoShort" DROP COLUMN "url",
ADD COLUMN     "assetId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "type" "AssetType" NOT NULL,
    "url" TEXT NOT NULL,
    "legend" TEXT,
    "altText" TEXT,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VideoShort_assetId_key" ON "VideoShort"("assetId");

-- AddForeignKey
ALTER TABLE "VideoShort" ADD CONSTRAINT "VideoShort_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;
