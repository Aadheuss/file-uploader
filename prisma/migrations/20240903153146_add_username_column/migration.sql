-- AlterTable
ALTER TABLE "User" ADD COLUMN     "username" VARCHAR(70) NOT NULL DEFAULT 'username',
ALTER COLUMN "name" DROP NOT NULL;
