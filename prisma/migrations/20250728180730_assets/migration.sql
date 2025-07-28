/*
  Warnings:

  - You are about to drop the `ArticleAsset` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "article" DROP CONSTRAINT "article_assetId_fkey";

-- DropTable
DROP TABLE "ArticleAsset";

-- AddForeignKey
ALTER TABLE "article" ADD CONSTRAINT "article_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE SET NULL ON UPDATE CASCADE;
