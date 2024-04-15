-- CreateTable
CREATE TABLE "user" (
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "pokemons" (
    "pokemon_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "pokemons_pkey" PRIMARY KEY ("pokemon_id")
);

-- CreateTable
CREATE TABLE "typeList" (
    "typelist_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "typeList_pkey" PRIMARY KEY ("typelist_id")
);

-- CreateTable
CREATE TABLE "_PokemonsToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_PokemonsTotypeList" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "typeList_type_key" ON "typeList"("type");

-- CreateIndex
CREATE UNIQUE INDEX "_PokemonsToUser_AB_unique" ON "_PokemonsToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PokemonsToUser_B_index" ON "_PokemonsToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PokemonsTotypeList_AB_unique" ON "_PokemonsTotypeList"("A", "B");

-- CreateIndex
CREATE INDEX "_PokemonsTotypeList_B_index" ON "_PokemonsTotypeList"("B");

-- AddForeignKey
ALTER TABLE "_PokemonsToUser" ADD CONSTRAINT "_PokemonsToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "pokemons"("pokemon_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonsToUser" ADD CONSTRAINT "_PokemonsToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonsTotypeList" ADD CONSTRAINT "_PokemonsTotypeList_A_fkey" FOREIGN KEY ("A") REFERENCES "pokemons"("pokemon_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PokemonsTotypeList" ADD CONSTRAINT "_PokemonsTotypeList_B_fkey" FOREIGN KEY ("B") REFERENCES "typeList"("typelist_id") ON DELETE CASCADE ON UPDATE CASCADE;
