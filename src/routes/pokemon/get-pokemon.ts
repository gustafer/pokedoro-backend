import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { z } from "zod";
import { prisma } from "../../lib/prisma";
import { transformPokemonTypelist } from "../../utils/transformPokemonTypelist";

export async function getPokemon(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/pokemon/:id', {
            schema: {
                params: z.object({
                    id: z.string().transform(Number)
                })
            }
        }, async (req, res) => {
            const { id } = req.params

            if (!id) {
                throw new Error("Id not found!")
            }

            const pokemonDetails = await prisma.pokemons.findUnique({
                where: {
                    id
                },
                select : {
                    id: true,
                    name: true,
                    type_list: {
                        select: {
                            type: true
                        }
                    }
                }
            })
            
            if (!pokemonDetails)  {
                throw new Error("Pokemon not found!")
            }
            const typesArray = transformPokemonTypelist(pokemonDetails)
            res.send({ name: pokemonDetails.name, id: pokemonDetails.id, typeList: typesArray })
        })
}