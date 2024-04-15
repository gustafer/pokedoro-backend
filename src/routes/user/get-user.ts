import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../../lib/prisma";
import { z } from "zod";
import { transformPokemonArray } from "../../utils/transformPokemonArray";
import { auth } from "../../middlewares/auth";
import { checkUserId } from "../../utils/auth/check-user-id";

export async function getUser(app: FastifyInstance) {
    app
        .withTypeProvider<ZodTypeProvider>()
        .get('/user/:id', {
            preValidation: auth,
            schema: {
                params: z.object({
                    id: z.string()
                })
            }
        }, async (req, res) => {
            const { id } = req.params
            const user = await prisma.user.findUnique({
                select: {
                    email: true,
                    id: true,
                    name: true,
                    pokemons: {
                        select: {
                            name: true,
                            id: true,
                            type_list: {
                                select: {
                                    type: true
                                }
                            }
                        }
                    },
                    _count: {
                        select: {
                            pokemons: true
                        }
                    }
                },
                where: {
                    id
                }
            })
            if (!user) {
                throw new Error("user not found!")
            }

            checkUserId(req, res, user.id)

            const pokemonsArray = transformPokemonArray(user.pokemons)

            res.send({ user: { name: user.name, email: user.email, id: user.id, pokemons: pokemonsArray, pokemonsCount: user._count.pokemons } })
        })
}