-- AlterTable
ALTER TABLE "OldClientInfo" ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "credit" DROP NOT NULL,
ALTER COLUMN "accompte" DROP NOT NULL,
ALTER COLUMN "achat" DROP NOT NULL,
ALTER COLUMN "resteAPayer" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN     "currentSoldeCredit" DOUBLE PRECISION;
