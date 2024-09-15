-- AlterTable
ALTER TABLE "users"
    ADD COLUMN "defaultBillingAddressId" INTEGER,
ADD COLUMN     "defaultShippingAddressId" INTEGER;
