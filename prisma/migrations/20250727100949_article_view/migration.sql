-- DropIndex
DROP INDEX "ArticleView_visitorId_viewedAt_idx";

-- AlterTable
ALTER TABLE "ArticleView" ADD COLUMN     "userId" TEXT,
ALTER COLUMN "visitorId" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "ArticleView_visitorId_idx" ON "ArticleView"("visitorId");

-- CreateIndex
CREATE INDEX "ArticleView_userId_idx" ON "ArticleView"("userId");

-- CreateIndex
CREATE INDEX "ArticleView_articleId_viewedAt_idx" ON "ArticleView"("articleId", "viewedAt");

-- AddForeignKey
ALTER TABLE "ArticleView" ADD CONSTRAINT "ArticleView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
