-- CreateTable
CREATE TABLE "addresses"
(
    "id"        SERIAL       NOT NULL,
    "lineOne"   TEXT         NOT NULL,
    "lineTwo"   TEXT,
    "city"      TEXT         NOT NULL,
    "country"   TEXT         NOT NULL,
    "pincode"   INTEGER      NOT NULL,
    "userId"    INTEGER      NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products"
(
    "id"          SERIAL          NOT NULL,
    "name"        TEXT            NOT NULL,
    "description" TEXT            NOT NULL,
    "price"       DECIMAL(65, 30) NOT NULL,
    "tags"        TEXT            NOT NULL,
    "createdAt"   TIMESTAMP(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3)    NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "addresses"
    ADD CONSTRAINT "addresses_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;
