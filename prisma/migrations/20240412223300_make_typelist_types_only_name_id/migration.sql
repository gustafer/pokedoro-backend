/*
  Warnings:

  - The primary key for the `typeList` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `typelist_id` on the `typeList` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PokemonsTotypeList" DROP CONSTRAINT "_PokemonsTotypeList_B_fkey";

-- AlterTable
ALTER TABLE "typeList" DROP CONSTRAINT "typeList_pkey",
DROP COLUMN "typelist_id",
ADD CONSTRAINT "typeList_pkey" PRIMARY KEY ("type");

-- AddForeignKey
ALTER TABLE "_PokemonsTotypeList" ADD CONSTRAINT "_PokemonsTotypeList_B_fkey" FOREIGN KEY ("B") REFERENCES "typeList"("type") ON DELETE CASCADE ON UPDATE CASCADE;
