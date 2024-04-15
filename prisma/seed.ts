import { prisma } from "../src/lib/prisma";
import pokemonsDb from './pokemons.json'
import pMap from "p-map";
async function seed() {
    await prisma.typeList.createMany({
        data:
            [
                {
                    "type": "Bug"
                },
                {
                    "type": "Flying"
                },
                {
                    "type": "Poison"
                },
                {
                    "type": "Normal"
                },
                {
                    "type": "Electric"
                },
                {
                    "type": "Ground"
                },
                {
                    "type": "Fire"
                },
                {
                    "type": "Fairy"
                },
                {
                    "type": "Psychic"
                },
                {
                    "type": "Water"
                },
                {
                    "type": "Fighting"
                },
                {
                    "type": "Grass"
                },
                {
                    "type": "Rock"
                },
                {
                    "type": "Dark"
                },
                {
                    "type": "Steel"
                },
                {
                    "type": "Ghost"
                },
                {
                    "type": "Dragon"
                },
                {
                    "type": "Ice"
                }
            ]
    })

    const data = pokemonsDb.map((pokemon) => (
        {
            name: pokemon.name,
            id: pokemon.id,
        }
    )
    )
    await prisma.pokemons.createMany({
        data
    })
    await pMap(pokemonsDb, async (pokemon) => {
        await prisma.pokemons.update({
            where: { id: pokemon.id },
            data: {
                type_list: {
                    connect: pokemon.typeList.map(type => ({ type }))
                }
            }
        });
    }, { concurrency: 10 }); // Limit the number of concurrent database operations
}


seed().then(() => {
    console.log('db seeded!')
})