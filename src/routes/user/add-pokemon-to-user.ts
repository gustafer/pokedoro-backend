import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import { z } from "zod";
import { auth } from "../../middlewares/auth";
import { checkUserId } from "../../utils/auth/check-user-id";

export async function addPokemonToUser(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .put('/user/pokemon', {
            preValidation: auth,
            schema: {
                body: z.object({
                    userId: z.string().cuid(),
                    pokemonId: z.number()
                })
            }
        }, async (req, res) => {
            const { userId, pokemonId } = req.body

            // check if pokemon exists

            const existingPokemon = await prisma.pokemons.findUnique({
                where: {
                    id: pokemonId
                },
            })

            if (!existingPokemon) return res.status(404).send("pokemon not found")

            // check if user exists
            const existingUser = await prisma.user.findUnique({
                where: {
                    id: userId
                },
                select: {
                    id: true,
                    pokemons: true,
                }
            })


            if (!existingUser) return res.status(404).send("user not found")

            checkUserId(req, res, existingUser.id)


            // check if user already has pokemons, this code is a piece of shit
            for (let index = 0; index < existingUser.pokemons.length; index++) {
                if (pokemonId == existingUser.pokemons[index].id) {
                    return res.status(404).send({ message: "user already has pokemon!" })
                }
            }

            // add pokemon to user
            await prisma.user.update({
                where: {
                    id: userId
                },
                data: {
                    pokemons: {
                        connect: {
                            id: pokemonId
                        }
                    }
                }
            })

            const updatedUser = await prisma.user.findUnique({
                where: {
                    id: userId
                },
                select: {
                    id: true,
                    pokemons: true,
                }
            })


            return res.status(201).send({ userId: updatedUser?.id, newPokemon: existingPokemon, pokemons: updatedUser?.pokemons })
        })
}