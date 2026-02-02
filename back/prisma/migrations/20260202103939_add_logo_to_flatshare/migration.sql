-- CreateEnum
CREATE TYPE "Role" AS ENUM ('user', 'superadmin');

-- CreateEnum
CREATE TYPE "Ambiance" AS ENUM ('calme', 'studieuse', 'equilibree', 'festive', 'tres_festive');

-- CreateEnum
CREATE TYPE "FlatshareStatus" AS ENUM ('active', 'scheduled_free', 'archived');

-- CreateEnum
CREATE TYPE "FlatshareMemberStatus" AS ENUM ('pending', 'active', 'scheduled_departure', 'former');

-- CreateEnum
CREATE TYPE "FlatshareApplicationStatus" AS ENUM ('pending', 'accepted', 'rejected', 'cancelled');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "class_year" SMALLINT,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "profile_photo_url" VARCHAR(500),
    "role" "Role" NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuthToken" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "token_hash" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flatshare" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "rent_per_person" DECIMAL(8,2) NOT NULL,
    "bedrooms_count" SMALLINT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "street" VARCHAR(255) NOT NULL,
    "postal_code" VARCHAR(10) NOT NULL,
    "city" VARCHAR(100) NOT NULL,
    "latitude" DECIMAL(9,6),
    "longitude" DECIMAL(9,6),
    "ambiance" "Ambiance" NOT NULL DEFAULT 'equilibree',
    "status" "FlatshareStatus" NOT NULL DEFAULT 'active',
    "next_available_at" TIMESTAMP(3),
    "logo_url" VARCHAR(500),
    "created_by_user_id" INTEGER NOT NULL,

    CONSTRAINT "Flatshare_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlatshareMember" (
    "flatshare_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" "FlatshareMemberStatus" NOT NULL DEFAULT 'pending',
    "joined_at" TIMESTAMP(3),
    "left_at" TIMESTAMP(3),
    "departure_planned_at" TIMESTAMP(3),

    CONSTRAINT "FlatshareMember_pkey" PRIMARY KEY ("flatshare_id","user_id")
);

-- CreateTable
CREATE TABLE "FlatsharePhoto" (
    "id" SERIAL NOT NULL,
    "flatshare_id" INTEGER NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "position" SMALLINT NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlatsharePhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Favorite" (
    "user_id" INTEGER NOT NULL,
    "flatshare_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Favorite_pkey" PRIMARY KEY ("user_id","flatshare_id")
);

-- CreateTable
CREATE TABLE "FlatshareApplication" (
    "id" SERIAL NOT NULL,
    "flatshare_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "message" TEXT,
    "status" "FlatshareApplicationStatus" NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FlatshareApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipment" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "icon" VARCHAR(100),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Equipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlatshareEquipment" (
    "flatshare_id" INTEGER NOT NULL,
    "equipment_id" INTEGER NOT NULL,

    CONSTRAINT "FlatshareEquipment_pkey" PRIMARY KEY ("flatshare_id","equipment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "AuthToken_user_id_idx" ON "AuthToken"("user_id");

-- CreateIndex
CREATE INDEX "FlatshareMember_user_id_idx" ON "FlatshareMember"("user_id");

-- CreateIndex
CREATE INDEX "FlatsharePhoto_flatshare_id_idx" ON "FlatsharePhoto"("flatshare_id");

-- CreateIndex
CREATE INDEX "Favorite_flatshare_id_idx" ON "Favorite"("flatshare_id");

-- CreateIndex
CREATE INDEX "FlatshareApplication_flatshare_id_idx" ON "FlatshareApplication"("flatshare_id");

-- CreateIndex
CREATE INDEX "FlatshareApplication_user_id_idx" ON "FlatshareApplication"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Equipment_name_key" ON "Equipment"("name");

-- CreateIndex
CREATE INDEX "FlatshareEquipment_equipment_id_idx" ON "FlatshareEquipment"("equipment_id");

-- AddForeignKey
ALTER TABLE "AuthToken" ADD CONSTRAINT "AuthToken_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flatshare" ADD CONSTRAINT "Flatshare_created_by_user_id_fkey" FOREIGN KEY ("created_by_user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlatshareMember" ADD CONSTRAINT "FlatshareMember_flatshare_id_fkey" FOREIGN KEY ("flatshare_id") REFERENCES "Flatshare"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlatshareMember" ADD CONSTRAINT "FlatshareMember_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlatsharePhoto" ADD CONSTRAINT "FlatsharePhoto_flatshare_id_fkey" FOREIGN KEY ("flatshare_id") REFERENCES "Flatshare"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favorite" ADD CONSTRAINT "Favorite_flatshare_id_fkey" FOREIGN KEY ("flatshare_id") REFERENCES "Flatshare"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlatshareApplication" ADD CONSTRAINT "FlatshareApplication_flatshare_id_fkey" FOREIGN KEY ("flatshare_id") REFERENCES "Flatshare"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlatshareApplication" ADD CONSTRAINT "FlatshareApplication_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlatshareEquipment" ADD CONSTRAINT "FlatshareEquipment_flatshare_id_fkey" FOREIGN KEY ("flatshare_id") REFERENCES "Flatshare"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlatshareEquipment" ADD CONSTRAINT "FlatshareEquipment_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "Equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
