-- CreateEnum
CREATE TYPE "public"."states" AS ENUM ('Pending', 'Cancelled', 'Done');

-- CreateTable
CREATE TABLE "public"."ledger" (
    "transactionId" TEXT NOT NULL,
    "sender" INTEGER NOT NULL,
    "reciever" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."states" NOT NULL,

    CONSTRAINT "ledger_pkey" PRIMARY KEY ("transactionId")
);
