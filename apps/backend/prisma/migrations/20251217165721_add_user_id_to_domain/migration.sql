/*
  Warnings:

  - Added the required column `userId` to the `domain` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "domain" ADD COLUMN     "userId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "domain_userId_idx" ON "domain"("userId");

-- AddForeignKey
ALTER TABLE "domain" ADD CONSTRAINT "domain_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
