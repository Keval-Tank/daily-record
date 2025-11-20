-- CreateEnum
CREATE TYPE "states" AS ENUM ('Pending', 'Cancelled', 'Done');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ledger" (
    "transactionId" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "reciever" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "states" NOT NULL DEFAULT 'Pending',

    CONSTRAINT "ledger_pkey" PRIMARY KEY ("transactionId")
);
