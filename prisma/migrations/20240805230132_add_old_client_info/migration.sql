-- CreateTable
CREATE TABLE "OldClientInfo" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "credit" DOUBLE PRECISION NOT NULL,
    "accompte" DOUBLE PRECISION NOT NULL,
    "achat" DOUBLE PRECISION NOT NULL,
    "resteAPayer" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OldClientInfo_pkey" PRIMARY KEY ("id")
);
