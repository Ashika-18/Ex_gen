-- CreateTable
CREATE TABLE "Coments" (
    "id" SERIAL NOT NULL,
    "message" TEXT NOT NULL,
    "accountId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Coments" ADD CONSTRAINT "Coments_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
