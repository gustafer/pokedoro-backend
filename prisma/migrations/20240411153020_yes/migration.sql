/*
  Warnings:

  - The primary key for the `pokemons` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `pokemon_id` on the `pokemons` table. All the data in the column will be lost.
  - Changed the type of `A` on the `_PokemonsToUser` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `A` on the `_PokemonsTotypeList` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "_PokemonsToUser" DROP CONSTRAINT "_PokemonsToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_PokemonsTotypeList" DROP CONSTRAINT "_PokemonsTotypeList_A_fkey";

-- AlterTable
ALTER TABLE "_PokemonsToUser" DROP COLUMN "A",
ADD COLUMN     "A" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "_PokemonsTotypeList" DROP COLUMN "A",
ADD COLUMN     "A" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "pokemons" DROP CONSTRAINT "pokemons_pkey",
DROP COLUMN "pokemon_id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "pokemons_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "_PokemonsToUser_AB_unique" ON "_PokemonsToUser"("A", "B");

-- CreateIndex
CREATE UNIQUE INDEX "_PokemonsTotypeList_AB_unique" ON "_PokemonsTotypeList"("A", "B");

-- AddForeignKey
ALTER TABLE "_PokemonsToUser" ADD CONSTRAINT "_PokemonsToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "pokemons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonsTotypeList" ADD CONSTRAINT "_PokemonsTotypeList_A_fkey" FOREIGN KEY ("A") REFERENCES "pokemons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
