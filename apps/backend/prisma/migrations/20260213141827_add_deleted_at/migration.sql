/*
  Warnings:

  - Added the required column `updatedAt` to the `domain` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "domain" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "deletedAt" TIMESTAMPTZ,
ADD COLUMN     "updatedAt" TIMESTAMPTZ NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "deletedAt" TIMESTAMPTZ;
